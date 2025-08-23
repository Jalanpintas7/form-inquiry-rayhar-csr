import { supabaseAdmin } from '$lib/server/supabase.js';
import { redirect } from '@sveltejs/kit';

export async function load() {
	// Ambil daftar cawangan, musim, dan relasi musim-kategori (aktif saja) via tabel umrah_dates
	const [
		{ data: branches },
		{ data: seasons },
		{ data: umrahDates },
		{ data: packageTypes },
		{ data: destinations },
		{ data: outboundDates },
		{ data: salesConsultants }
	] = await Promise.all([
		supabaseAdmin.from('branches').select('id, name, whatsapp_number').eq('is_active', true).order('name'),
		supabaseAdmin.from('umrah_seasons').select('id, name').eq('is_active', true).order('name'),
		supabaseAdmin
			.from('umrah_dates')
			.select('umrah_season_id, umrah_category_id, umrah_categories!inner(id, name, is_active)')
			.eq('is_active', true)
			.eq('umrah_categories.is_active', true),
		supabaseAdmin.from('package_types').select('id, name').order('name'),
		supabaseAdmin.from('destinations').select('id, name, sales_consultant_id').order('name'),
		supabaseAdmin.from('outbound_dates').select('id, destination_id, start_date, end_date').order('destination_id'),
		supabaseAdmin.from('sales_consultant').select('id, name, whatsapp_number').order('name')
	]);

	const categoriesBySeason = new Map();
	for (const row of umrahDates ?? []) {
		const list = categoriesBySeason.get(row.umrah_season_id) ?? [];
		if (row.umrah_categories) {
			// Cek apakah kategori sudah ada untuk menghindari duplikasi
			const existingCategory = list.find(cat => cat.id === row.umrah_categories.id);
			if (!existingCategory) {
				list.push({ id: row.umrah_categories.id, name: row.umrah_categories.name });
			}
		}
		categoriesBySeason.set(row.umrah_season_id, list);
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
		})),
		salesConsultants: salesConsultants ?? []
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
			const salesConsultant = form.get('sales_consultant')?.toString().trim();
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

		// Simpan data ke database
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

		// Kembalikan pesan sukses
		return { 
			success: true, 
			message: 'Terima kasih! Maklumat anda telah berjaya dihantar. Pasukan kami akan menghubungi anda tidak lama lagi.' 
		};

		} catch (error) {
			console.error('Error in form submission:', error);
			return { success: false, error: 'Ralat sistem. Sila cuba lagi.' };
		}
	}
};


