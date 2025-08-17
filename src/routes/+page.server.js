import { supabaseAdmin } from '$lib/server/supabase.js';
import { redirect } from '@sveltejs/kit';

export async function load() {
	// Ambil daftar cawangan, musim, dan relasi musim-kategori (aktif saja) via tabel penghubung N:M
	const [
		{ data: branches },
		{ data: seasons },
		{ data: seasonCategories },
		{ data: packageTypes },
		{ data: destinations },
		{ data: outboundDates }
	] = await Promise.all([
		supabaseAdmin.from('branches').select('id, name, whatsapp_number').eq('is_active', true).order('name'),
		supabaseAdmin.from('umrah_seasons').select('id, name').eq('is_active', true).order('name'),
		supabaseAdmin
			.from('umrah_season_categories')
			.select('season_id, category:umrah_categories!inner(id, name, is_active)')
			.eq('is_active', true)
			.eq('umrah_categories.is_active', true),
		supabaseAdmin.from('package_types').select('id, name').order('name'),
		supabaseAdmin.from('destinations').select('id, name').order('name'),
		supabaseAdmin.from('outbound_dates').select('id, destination, date_range').order('destination')
	]);

	const categoriesBySeason = new Map();
	for (const row of seasonCategories ?? []) {
		const list = categoriesBySeason.get(row.season_id) ?? [];
		if (row.category) list.push({ id: row.category.id, name: row.category.name });
		categoriesBySeason.set(row.season_id, list);
	}

	// Mapping destinasi -> senarai tarikh
	const dateRangesByDestination = new Map();
	for (const od of outboundDates ?? []) {
		const list = dateRangesByDestination.get(od.destination) ?? [];
		if (od.date_range) list.push({ id: od.id, date_range: od.date_range });
		dateRangesByDestination.set(od.destination, list);
	}

	return {
		branches: branches ?? [],
		seasons: (seasons ?? []).map((s) => ({
			id: s.id,
			name: s.name,
			categories: categoriesBySeason.get(s.id) ?? []
		})),
		packageTypes: (packageTypes ?? []).map((p) => ({ id: p.id, name: p.name })),
		destinations: (destinations ?? []).map((d) => ({
			id: d.id,
			name: d.name,
			dates: dateRangesByDestination.get(d.id) ?? []
		}))
	};
}

export const actions = {
	default: async ({ request }) => {
		try {
			const form = await request.formData();
			const gelaran = form.get('gelaran')?.toString().trim();
			const nama = form.get('nama')?.toString().trim();
			const telefon = form.get('telefon')?.toString().trim();
			const cawangan = form.get('cawangan')?.toString().trim();
			const pakej = form.get('pakej')?.toString().trim();
			const musim = form.get('musim')?.toString().trim();
			const kategori = form.get('kategori')?.toString().trim();
			const pelancongan = form.get('pelancongan')?.toString().trim();
			const tarikh = form.get('tarikh')?.toString().trim();

		// Cari package_type berdasarkan ID paket
		const { data: packageTypeData } = await supabaseAdmin.from('package_types').select('id, name').eq('id', pakej).maybeSingle();
		if (!packageTypeData) {
			return { success: false, error: 'Pakej tidak sah.' };
		}

		const isUmrah = (packageTypeData.name || '').toLowerCase() === 'umrah';
		if (!gelaran || !nama || !telefon || !cawangan) {
			return { success: false, error: 'Sila lengkapkan medan wajib.' };
		}
		if (isUmrah) {
			if (!musim) return { success: false, error: 'Sila pilih Musim Umrah.' };
		} else {
			if (!pelancongan) return { success: false, error: 'Sila pilih Pelancongan.' };
			if (!tarikh) return { success: false, error: 'Sila pilih Tarikh Pelancongan.' };
		}

		const { data: branch } = await supabaseAdmin.from('branches').select('whatsapp_number').eq('id', cawangan).maybeSingle();
		const adminWa = branch?.whatsapp_number ?? '';

		await supabaseAdmin.from('leads').insert({
			title: gelaran,
			full_name: nama,
			phone: telefon,
			branch_id: cawangan,
			package_type_id: packageTypeData.id,
			season_id: isUmrah ? musim : null,
			category_id: isUmrah ? (kategori || null) : null,
			destination_id: !isUmrah ? pelancongan : null,
			outbound_date_id: !isUmrah ? tarikh : null
		});

		// Ambil nama destinasi dan tarikh untuk pesan WhatsApp
		let destinationName = '';
		let tourDateRange = '';
		if (!isUmrah) {
			const { data: destData } = await supabaseAdmin.from('destinations').select('name').eq('id', pelancongan).maybeSingle();
			const { data: dateData } = await supabaseAdmin.from('outbound_dates').select('date_range').eq('id', tarikh).maybeSingle();
			destinationName = destData?.name || '';
			tourDateRange = dateData?.date_range || '';
		}

		const extra = isUmrah
			? (musim ? `Musim: ${musim}${kategori ? `, Kategori: ${kategori}` : ''}` : '')
			: `Destinasi: ${destinationName}${tourDateRange ? `, Tarikh: ${tourDateRange}` : ''}`;
		const msg = encodeURIComponent(`Assalamualaikum, saya ${gelaran} ${nama}. Ingin daftar ${packageTypeData.name}. No: ${telefon}. ${extra}`);
		const phone = (adminWa || '').replace(/[^0-9]/g, '');
		const waUrl = phone ? `https://wa.me/${phone}?text=${msg}` : `https://wa.me/?text=${msg}`;

		throw redirect(303, waUrl);
		} catch (error) {
			// Redirect bukan error, jangan log
			if (error?.status === 303) {
				throw error; // Re-throw redirect
			}
			console.error('Error in form submission:', error);
			return { success: false, error: 'Ralat sistem. Sila cuba lagi.' };
		}
	}
};


