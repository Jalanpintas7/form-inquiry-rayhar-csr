import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Better error handling for missing environment variables
if (!supabaseUrl) {
	console.error('❌ VITE_SUPABASE_URL is not set. Please check your environment variables.');
	console.error('📝 For local development: Copy env.example to .env and fill in your values');
	console.error('🌐 For Netlify: Go to Site Settings > Environment Variables and add VITE_SUPABASE_URL');
	throw new Error('Missing VITE_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
	console.error('❌ VITE_SUPABASE_ANON_KEY is not set. Please check your environment variables.');
	console.error('📝 For local development: Copy env.example to .env and fill in your values');
	console.error('🌐 For Netlify: Go to Site Settings > Environment Variables and add VITE_SUPABASE_ANON_KEY');
	throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Debug info untuk environment variables
console.log('🔧 Environment check:', {
	supabaseUrl: supabaseUrl ? '✅ Set' : '❌ Missing',
	supabaseAnonKey: supabaseAnonKey ? '✅ Set (length: ' + supabaseAnonKey.length + ')' : '❌ Missing'
});

// Fungsi untuk mengambil data awal
export async function loadInitialData() {
	try {
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
			supabase.from('branches').select('id, name, whatsapp_number').order('name'),
			supabase.from('umrah_seasons').select('id, name').order('name'),
			supabase
				.from('umrah_dates')
				.select('umrah_season_id, umrah_category_id'),
			supabase.from('package_types').select('id, name').order('name'),
			supabase.from('destinations').select('id, name').order('name'),
			supabase.from('outbound_dates').select('id, destination_id, start_date, end_date').order('destination_id'),
			supabase.from('sales_consultant').select('id, name, sales_consultant_number, whatsapp_number').order('sales_consultant_number'),
			supabase.from('umrah_categories').select('id, name').order('name')
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
			})),
			salesConsultants: salesConsultants ?? []
		};
	} catch (error) {
		console.error('Error loading initial data:', error);
		throw error;
	}
}

// Fungsi untuk mengirim data ke n8n webhook
async function sendToN8nWebhook(formData) {
	const {
		gelaran,
		nama,
		telefon,
		cawangan,
		salesConsultant,
		packageTypeData,
		isUmrah,
		isHaji,
		musim,
		kategori,
		pelancongan,
		tarikh
	} = formData;

	// Ambil data tambahan yang diperlukan dari database
	const [
		{ data: branchData },
		{ data: salesConsultantData },
		{ data: seasonData },
		{ data: categoryData },
		{ data: destinationData }
	] = await Promise.all([
		supabase.from('branches').select('name').eq('id', cawangan).maybeSingle(),
		supabase.from('sales_consultant').select('name, sales_consultant_number, session_id').eq('id', salesConsultant).maybeSingle(),
		isUmrah && musim ? supabase.from('umrah_seasons').select('name, brochure').eq('id', musim).maybeSingle() : Promise.resolve({ data: null }),
		isUmrah && kategori ? supabase.from('umrah_categories').select('name').eq('id', kategori).maybeSingle() : Promise.resolve({ data: null }),
		!isUmrah && !isHaji && pelancongan ? supabase.from('destinations').select('name, brochure').eq('id', pelancongan).maybeSingle() : Promise.resolve({ data: null })
	]);

	// Helper function untuk memastikan brochure berupa array
	const parseBrochure = (brochureData) => {
		if (!brochureData) return [];
		if (Array.isArray(brochureData)) return brochureData;
		if (typeof brochureData === 'string') {
			try {
				return JSON.parse(brochureData);
			} catch (e) {
				// Jika gagal parse, return sebagai array dengan satu elemen
				return [brochureData];
			}
		}
		return [];
	};

	// Format data sesuai dengan struktur yang diminta
	const webhookData = {
		name: `${gelaran} ${nama}`.trim(),
		telefon: telefon,
		cawangan: branchData?.name || '',
		sales_consultant_name: salesConsultantData?.name || '',
		sales_consultant_number: salesConsultantData?.sales_consultant_number || '',
		sales_consultant_sesion_id: salesConsultantData?.session_id || '',
		pakej_type: packageTypeData?.name || '',
		kategori: isUmrah ? (categoryData?.name || '') : (destinationData?.name || ''),
		brochure: isUmrah ? parseBrochure(seasonData?.brochure) : parseBrochure(destinationData?.brochure)
	};

	// Tampilkan data yang akan dikirim ke webhook di console
	console.log('=== DATA WEBHOOK ===');
	console.log('Webhook URL:', 'https://n8n-wb9pbdns.runner.web.id/webhook/rayhar-inquiry');
	console.log('Webhook Data:', JSON.stringify(webhookData, null, 2));
	console.log('==================');

	// Kirim ke n8n webhook
	const response = await fetch('https://n8n-wb9pbdns.runner.web.id/webhook/rayhar-inquiry', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(webhookData)
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return response;
}

// Fungsi untuk submit form
export async function submitForm(formData) {
	try {
		const {
			gelaran,
			nama,
			telefon,
			cawangan,
			salesConsultant,
			pakej,
			musim,
			kategori,
			pelancongan,
			tarikh
		} = formData;

		// Cari package_type berdasarkan ID paket
		const { data: packageTypeData } = await supabase.from('package_types').select('id, name').eq('id', pakej).maybeSingle();
		if (!packageTypeData) {
			return { success: false, error: 'Pakej tidak sah.' };
		}

		const isUmrah = (packageTypeData.name || '').toLowerCase() === 'umrah';
		const isHaji = (packageTypeData.name || '').toLowerCase() === 'haji';
		
		// Validasi field wajib
		if (!gelaran || !nama || !telefon || !cawangan || !salesConsultant) {
			return { success: false, error: 'Sila lengkapkan medan wajib.' };
		}
		
		if (isUmrah) {
			if (!musim) return { success: false, error: 'Sila pilih Musim Umrah.' };
		} else if (isHaji) {
			// Untuk pakej Haji, tidak perlu field tambahan
		} else {
			// Untuk pakej Pelancongan (outbound)
			if (!pelancongan) return { success: false, error: 'Sila pilih Pelancongan.' };
			if (!tarikh) return { success: false, error: 'Sila pilih Tarikh Pelancongan.' };
		}

		// Simpan data ke database
		const { data: leadData, error: leadError } = await supabase.from('leads').insert({
			title: gelaran,
			full_name: nama,
			phone: telefon,
			branch_id: cawangan,
			sales_consultant_id: salesConsultant,
			package_type_id: packageTypeData.id,
			season_id: isUmrah ? musim : null,
			category_id: isUmrah ? (kategori || null) : null,
			destination_id: (!isUmrah && !isHaji) ? pelancongan : null,
			outbound_date_id: (!isUmrah && !isHaji) ? tarikh : null
		}).select().single();

		if (leadError) {
			console.error('Error inserting lead:', leadError);
			return { success: false, error: 'Ralat semasa menyimpan data. Sila cuba lagi.' };
		}

		// Kirim data ke n8n webhook
		try {
			await sendToN8nWebhook({
				gelaran,
				nama,
				telefon,
				cawangan,
				salesConsultant,
				packageTypeData,
				isUmrah,
				isHaji,
				musim,
				kategori,
				pelancongan,
				tarikh
			});
		} catch (webhookError) {
			console.error('Error sending to n8n webhook:', webhookError);
			// Tidak mengembalikan error karena data sudah tersimpan di database
		}

		// Kembalikan pesan sukses
		return { 
			success: true, 
			message: 'Terima kasih! Maklumat anda telah berjaya dihantar. Pasukan kami akan menghubungi anda tidak lama lagi.',
			leadId: leadData.id
		};

	} catch (error) {
		console.error('Error in form submission:', error);
		return { success: false, error: 'Ralat sistem. Sila cuba lagi.' };
	}
}
