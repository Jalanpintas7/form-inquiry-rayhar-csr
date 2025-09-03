import { supabaseAdmin } from '$lib/server/supabase.js';
import { json } from '@sveltejs/kit';

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
		supabaseAdmin.from('branches').select('name').eq('id', cawangan).maybeSingle(),
		supabaseAdmin.from('sales_consultant').select('name, sales_consultant_number, session_id').eq('id', salesConsultant).maybeSingle(),
		isUmrah && musim ? supabaseAdmin.from('umrah_seasons').select('name').eq('id', musim).maybeSingle() : Promise.resolve({ data: null }),
		isUmrah && kategori ? supabaseAdmin.from('umrah_categories').select('name, brochure').eq('id', kategori).maybeSingle() : Promise.resolve({ data: null }),
		!isUmrah && !isHaji && pelancongan ? supabaseAdmin.from('destinations').select('name, brochure').eq('id', pelancongan).maybeSingle() : Promise.resolve({ data: null })
	]);

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
		brochure: isUmrah ? (categoryData?.brochure || '') : (destinationData?.brochure || '')
	};

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

export async function POST({ request }) {
	try {
		const formData = await request.json();
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
		const { data: packageTypeData } = await supabaseAdmin.from('package_types').select('id, name').eq('id', pakej).maybeSingle();
		if (!packageTypeData) {
			return json({ success: false, error: 'Pakej tidak sah.' }, { status: 400 });
		}

		const isUmrah = (packageTypeData.name || '').toLowerCase() === 'umrah';
		const isHaji = (packageTypeData.name || '').toLowerCase() === 'haji';
		
		// Validasi field wajib
		if (!gelaran || !nama || !telefon || !cawangan || !salesConsultant) {
			return json({ success: false, error: 'Sila lengkapkan medan wajib.' }, { status: 400 });
		}
		
		if (isUmrah) {
			if (!musim) return json({ success: false, error: 'Sila pilih Musim Umrah.' }, { status: 400 });
		} else if (isHaji) {
			// Untuk pakej Haji, tidak perlu field tambahan
		} else {
			// Untuk pakej Pelancongan (outbound)
			if (!pelancongan) return json({ success: false, error: 'Sila pilih Pelancongan.' }, { status: 400 });
			if (!tarikh) return json({ success: false, error: 'Sila pilih Tarikh Pelancongan.' }, { status: 400 });
		}

		// Simpan data ke database
		const { data: leadData, error: leadError } = await supabaseAdmin.from('leads').insert({
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
			return json({ success: false, error: 'Ralat semasa menyimpan data. Sila cuba lagi.' }, { status: 500 });
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
		return json({ 
			success: true, 
			message: 'Terima kasih! Maklumat anda telah berjaya dihantar. Pasukan kami akan menghubungi anda tidak lama lagi.',
			leadId: leadData.id
		});

	} catch (error) {
		console.error('Error in form submission:', error);
		return json({ success: false, error: 'Ralat sistem. Sila cuba lagi.' }, { status: 500 });
	}
}
