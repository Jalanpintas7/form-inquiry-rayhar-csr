import { supabaseAdmin } from '$lib/server/supabase.js';
import { json } from '@sveltejs/kit';

export async function GET() {
	try {
		// Ambil daftar cawangan, musim, dan relasi musim-kategori (aktif saja) via tabel umrah_dates
		const [
			{ data: branches },
			{ data: seasons },
			{ data: umrahDates },
			{ data: packageTypes },
			{ data: destinations },
			{ data: outboundDates },
			{ data: salesConsultants },
			{ data: umrahCategories }
		] = await Promise.all([
			supabaseAdmin.from('branches').select('id, name, whatsapp_number').order('name'),
			supabaseAdmin.from('umrah_seasons').select('id, name').order('name'),
			supabaseAdmin
				.from('umrah_dates')
				.select('umrah_season_id, umrah_category_id'),
			supabaseAdmin.from('package_types').select('id, name').order('name'),
			supabaseAdmin.from('destinations').select('id, name').order('name'),
			supabaseAdmin.from('outbound_dates').select('id, destination_id, start_date, end_date').order('destination_id'),
			supabaseAdmin.from('sales_consultant').select('id, name, sales_consultant_number, whatsapp_number').order('sales_consultant_number'),
			supabaseAdmin.from('umrah_categories').select('id, name').order('name')
		]);

		const categoriesBySeason = new Map();
		for (const row of umrahDates ?? []) {
			const list = categoriesBySeason.get(row.umrah_season_id) ?? [];
			if (row.umrah_category_id) {
				// Cari nama kategori dari data umrahCategories
				const category = umrahCategories?.find(cat => cat.id === row.umrah_category_id);
				if (category) {
					// Cek apakah kategori sudah ada untuk menghindari duplikasi
					const existingCategory = list.find(cat => cat.id === category.id);
					if (!existingCategory) {
						list.push({ id: category.id, name: category.name });
					}
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
			salesConsultantMap.set(sc.id, { name: sc.name, whatsapp_number: sc.whatsapp_number, sales_consultant_number: sc.sales_consultant_number });
		}

		return json({
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
			})),
			salesConsultants: salesConsultants ?? []
		});

	} catch (error) {
		console.error('Error fetching form data:', error);
		return json({ error: 'Failed to fetch form data' }, { status: 500 });
	}
}
