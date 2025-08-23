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

<div class="max-w-[800px] mx-auto p-10 font-sans">
	<h1 class="text-center text-gray-800 mb-2">Demo Komponen Dropdown</h1>
	<p class="text-center text-gray-600 mb-10">Komponen dropdown yang menampilkan ke bawah dengan jarak yang tepat dari border kanan</p>
	
	<div class="mb-10 p-6 border border-gray-200 rounded-xl bg-gray-50">
		<h2 class="m-0 mb-4 text-gray-700 text-lg">Dropdown 1 - Pilihan Umum</h2>
		<Dropdown 
			options={options1}
			placeholder="Pilih opsi"
			bind:value={selectedValue1}
			name="demo1"
		/>
		<p class="mt-4 mb-0 text-gray-600 text-sm">Nilai yang dipilih: <strong class="text-green-600">{selectedValue1 || 'Belum ada pilihan'}</strong></p>
	</div>
	
	<div class="mb-10 p-6 border border-gray-200 rounded-xl bg-gray-50">
		<h2 class="m-0 mb-4 text-gray-700 text-lg">Dropdown 2 - Pilihan Warna</h2>
		<Dropdown 
			options={options2}
			placeholder="Pilih warna"
			bind:value={selectedValue2}
			name="demo2"
		/>
		<p class="mt-4 mb-0 text-gray-600 text-sm">Nilai yang dipilih: <strong class="text-green-600">{selectedValue2 || 'Belum ada pilihan'}</strong></p>
	</div>
	
	<div class="mb-10 p-6 border border-gray-200 rounded-xl bg-gray-50">
		<h2 class="m-0 mb-4 text-gray-700 text-lg">Dropdown 3 - Pilihan Ukuran</h2>
		<Dropdown 
			options={options3}
			placeholder="Pilih ukuran"
			bind:value={selectedValue3}
			name="demo3"
		/>
		<p class="mt-4 mb-0 text-gray-600 text-sm">Nilai yang dipilih: <strong class="text-green-600">{selectedValue3 || 'Belum ada pilihan'}</strong></p>
	</div>
	
	<div class="mb-10 p-6 border border-gray-200 rounded-xl bg-gray-50">
		<h2 class="m-0 mb-4 text-gray-700 text-lg">Dropdown Required</h2>
		<Dropdown 
			options={options1}
			placeholder="Pilih opsi (wajib)"
			name="demo4"
			required={true}
		/>
	</div>
	
	<div class="mb-10 p-6 border border-gray-200 rounded-xl bg-gray-50">
		<h2 class="m-0 mb-4 text-gray-700 text-lg">Dropdown Disabled</h2>
		<Dropdown 
			options={options1}
			placeholder="Dropdown dinonaktifkan"
			name="demo5"
			disabled={true}
		/>
	</div>
</div> 