<script>
	import Dropdown from '$lib/components/Dropdown.svelte';
	
	let selectedValue1 = '';
	let selectedValue2 = '';
	let selectedValue3 = '';
	
	const options1 = [
		{ value: 'option1', label: 'Pilihan Pertama' },
		{ value: 'option2', label: 'Pilihan Kedua' },
		{ value: 'option3', label: 'Pilihan Ketiga' },
		{ value: 'option4', label: 'Pilihan Keempat' },
		{ value: 'option5', label: 'Pilihan Kelima' }
	];
	
	const options2 = [
		{ value: 'red', label: 'Merah' },
		{ value: 'blue', label: 'Biru' },
		{ value: 'green', label: 'Hijau' },
		{ value: 'yellow', label: 'Kuning' },
		{ value: 'purple', label: 'Ungu' }
	];
	
	const options3 = [
		{ value: 'small', label: 'Kecil' },
		{ value: 'medium', label: 'Sedang' },
		{ value: 'large', label: 'Besar' },
		{ value: 'xl', label: 'Sangat Besar' }
	];
</script>

<svelte:head>
	<title>Dropdown Demo</title>
</svelte:head>

<div class="demo-container">
	<h1>Demo Komponen Dropdown</h1>
	<p>Komponen dropdown yang menampilkan ke bawah dengan jarak yang tepat dari border kanan</p>
	
	<div class="demo-section">
		<h2>Dropdown 1 - Pilihan Umum</h2>
		<Dropdown 
			options={options1}
			placeholder="Pilih opsi"
			bind:value={selectedValue1}
			name="demo1"
		/>
		<p>Nilai yang dipilih: <strong>{selectedValue1 || 'Belum ada pilihan'}</strong></p>
	</div>
	
	<div class="demo-section">
		<h2>Dropdown 2 - Pilihan Warna</h2>
		<Dropdown 
			options={options2}
			placeholder="Pilih warna"
			bind:value={selectedValue2}
			name="demo2"
		/>
		<p>Nilai yang dipilih: <strong>{selectedValue2 || 'Belum ada pilihan'}</strong></p>
	</div>
	
	<div class="demo-section">
		<h2>Dropdown 3 - Pilihan Ukuran</h2>
		<Dropdown 
			options={options3}
			placeholder="Pilih ukuran"
			bind:value={selectedValue3}
			name="demo3"
		/>
		<p>Nilai yang dipilih: <strong>{selectedValue3 || 'Belum ada pilihan'}</strong></p>
	</div>
	
	<div class="demo-section">
		<h2>Dropdown Required</h2>
		<Dropdown 
			options={options1}
			placeholder="Pilih opsi (wajib)"
			name="demo4"
			required={true}
		/>
	</div>
	
	<div class="demo-section">
		<h2>Dropdown Disabled</h2>
		<Dropdown 
			options={options1}
			placeholder="Dropdown dinonaktifkan"
			name="demo5"
			disabled={true}
		/>
	</div>
</div>

<style>
	.demo-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 40px 20px;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	}
	
	h1 {
		text-align: center;
		color: #1f2937;
		margin-bottom: 10px;
	}
	
	p {
		text-align: center;
		color: #6b7280;
		margin-bottom: 40px;
	}
	
	.demo-section {
		margin-bottom: 40px;
		padding: 24px;
		border: 1px solid #e5e7eb;
		border-radius: 12px;
		background: #fafafa;
	}
	
	h2 {
		margin: 0 0 16px 0;
		color: #374151;
		font-size: 18px;
	}
	
	p {
		text-align: left;
		margin: 16px 0 0 0;
		color: #6b7280;
		font-size: 14px;
	}
	
	strong {
		color: #059669;
	}
</style> 