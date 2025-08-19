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
		{ data: outboundDates },
		{ data: salesConsultants }
	] = await Promise.all([
		supabaseAdmin.from('branches').select('id, name, whatsapp_number').eq('is_active', true).order('name'),
		supabaseAdmin.from('umrah_seasons').select('id, name').eq('is_active', true).order('name'),
		supabaseAdmin
			.from('umrah_season_categories')
			.select('season_id, category:umrah_categories!inner(id, name, is_active)')
			.eq('is_active', true)
			.eq('umrah_categories.is_active', true),
		supabaseAdmin.from('package_types').select('id, name').order('name'),
		supabaseAdmin.from('destinations').select('id, name, sales_consultant_id').order('name'),
		supabaseAdmin.from('outbound_dates').select('id, destination_id, start_date, end_date').order('destination_id'),
		supabaseAdmin.from('sales_consultant').select('id, name, whatsapp_number')
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
		const list = dateRangesByDestination.get(od.destination_id) ?? [];
		if (od.start_date && od.end_date) {
			const dateRange = `${od.start_date} - ${od.end_date}`;
			list.push({ id: od.id, date_range: dateRange });
		}
		dateRangesByDestination.set(od.destination_id, list);
	}

	// Mapping sales consultant
	const salesConsultantMap = new Map();
	for (const sc of salesConsultants ?? []) {
		salesConsultantMap.set(sc.id, { name: sc.name, whatsapp_number: sc.whatsapp_number });
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
			dates: dateRangesByDestination.get(d.id) ?? [],
			sales_consultant: salesConsultantMap.get(d.sales_consultant_id)
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

		let adminWa = '';
		
		if (isUmrah) {
			// Untuk paket Umrah, gunakan nomor WhatsApp branch
			const { data: branch } = await supabaseAdmin.from('branches').select('whatsapp_number').eq('id', cawangan).maybeSingle();
			adminWa = branch?.whatsapp_number ?? '';
		} else {
			// Untuk paket outbound, gunakan nomor WhatsApp sales consultant destinasi
			const { data: destData } = await supabaseAdmin.from('destinations').select('sales_consultant_id').eq('id', pelancongan).maybeSingle();
			if (destData?.sales_consultant_id) {
				const { data: consultantData } = await supabaseAdmin.from('sales_consultant').select('whatsapp_number').eq('id', destData.sales_consultant_id).maybeSingle();
				adminWa = consultantData?.whatsapp_number ?? '';
			}
		}

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
		let seasonName = '';
		let categoryName = '';
		
		if (!isUmrah) {
			const { data: destData } = await supabaseAdmin.from('destinations').select('name').eq('id', pelancongan).maybeSingle();
			const { data: dateData } = await supabaseAdmin.from('outbound_dates').select('start_date, end_date').eq('id', tarikh).maybeSingle();
			destinationName = destData?.name || '';
			if (dateData?.start_date && dateData?.end_date) {
				tourDateRange = `${dateData.start_date} - ${dateData.end_date}`;
			}
		} else {
			// Ambil nama season dan kategori untuk pesan WhatsApp
			if (musim) {
				const { data: seasonData } = await supabaseAdmin.from('umrah_seasons').select('name').eq('id', musim).maybeSingle();
				seasonName = seasonData?.name || '';
			}
			if (kategori) {
				const { data: categoryData } = await supabaseAdmin.from('umrah_categories').select('name').eq('id', kategori).maybeSingle();
				categoryName = categoryData?.name || '';
			}
		}

		const extra = isUmrah
			? (seasonName ? `Musim: ${seasonName}${categoryName ? `, Kategori: ${categoryName}` : ''}` : '')
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


