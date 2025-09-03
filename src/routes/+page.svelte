<script>
	import { onMount } from 'svelte';
	import Dropdown from '$lib/components/Dropdown.svelte';
	
	// State untuk data form
	let branches = $state([]);
	let salesConsultants = $state([]);
	let seasons = $state([]);
	let packageTypes = $state([]);
	let destinations = $state([]);
	let isLoading = $state(true);
	let loadError = $state(null);
	


	let selectedSeason = $state('');
	let selectedCategory = $state('');
	let selectedPackage = $state('');
	let selectedDestination = $state('');
	let selectedDate = $state('');
	let selectedSalesConsultant = $state('');
	let showSuccessMessage = $state(false);
	let showErrorMessage = $state(false);
	let messageText = $state('');
	let isSubmitting = $state(false);

	// Load data saat komponen mount
	onMount(async () => {
		try {
			const response = await fetch('/api/form-data');
			if (!response.ok) {
				throw new Error('Failed to fetch form data');
			}
			const data = await response.json();
			branches = data.branches;
			salesConsultants = data.salesConsultants;
			seasons = data.seasons;
			packageTypes = data.packageTypes;
			destinations = data.destinations;
			isLoading = false;
		} catch (error) {
			console.error('Error loading form data:', error);
			loadError = error.message;
			isLoading = false;
		}
	});

	// Convert data untuk dropdown
	const gelaranOptions = $derived([
		{ value: 'Cik', label: 'Cik' },
		{ value: 'Encik', label: 'Encik' },
		{ value: 'Puan', label: 'Puan' },
		{ value: 'Tuan', label: 'Tuan' },
		{ value: 'Datin', label: 'Datin' },
		{ value: 'Dato', label: 'Dato' }
	]);

	const cawanganOptions = $derived(branches.map(b => ({ value: b.id, label: b.name })));
	const salesConsultantOptions = $derived(salesConsultants.map(sc => ({ 
		value: sc.id, 
		label: `${sc.sales_consultant_number}. ${sc.name}` 
	})));
	const pakejOptions = $derived(packageTypes.map(p => ({ value: p.id, label: p.name })));
	const musimOptions = $derived(seasons.map(s => ({ value: s.id, label: s.name })));
	const destinationOptions = $derived(destinations.map(d => ({ 
		value: d.id, 
		label: d.name,
		isAvailable: d.dates && d.dates.length > 0,
		displayLabel: d.dates && d.dates.length > 0 ? d.name : `${d.name} (tidak tersedia)`
	})));

	$effect(() => {
		const cats = getCategories();
		if (!cats.find((c) => c.id === selectedCategory)) selectedCategory = '';
	});

	function getCategories() {
		const found = seasons.find((s) => s.id === selectedSeason);
		const categories = found?.categories ?? [];
		return categories;
	}

	function getDatesForDestination() {
		const found = destinations.find((d) => d.id === selectedDestination);
		return found?.dates ?? [];
	}

	function formatDateToMalay(dateString) {
		// Mapping nama bulan dalam Bahasa Melayu
		const monthNames = {
			'Jan': 'Januari',
			'Feb': 'Februari',
			'Mac': 'Mac',
			'Apr': 'April',
			'Mei': 'Mei',
			'Jun': 'Jun',
			'Jul': 'Julai',
			'Ogo': 'Ogos',
			'Sep': 'September',
			'Okt': 'Oktober',
			'Nov': 'November',
			'Dis': 'Disember'
		};

		// Array nama bulan singkat
		const monthShort = ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogo', 'Sep', 'Okt', 'Nov', 'Dis'];

		// Format: "2026-06-25 - 2026-02-06" (range tanggal)
		if (dateString.includes(' - ')) {
			const [startDate, endDate] = dateString.split(' - ');
			
			try {
				// Parse start date
				const start = new Date(startDate);
				const startDay = start.getDate();
				const startMonth = start.getMonth();
				const startYear = start.getFullYear();
				
				// Parse end date
				const end = new Date(endDate);
				const endDay = end.getDate();
				const endMonth = end.getMonth();
				const endYear = end.getFullYear();
				
				if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
					const formattedStart = `${startDay} ${monthShort[startMonth]} ${startYear}`;
					const formattedEnd = `${endDay} ${monthShort[endMonth]} ${endYear}`;
					const formattedRange = `${formattedStart} - ${formattedEnd}`;
					return formattedRange;
				}
			} catch (e) {
				// Error handling tanpa console.log
			}
		}

		// Format: "12 Ogo 2025" atau "12 Ogos 2025" (sudah dalam format yang benar)
		if (dateString.includes(' ')) {
			const parts = dateString.split(' ');
			if (parts.length === 3) {
				const day = parts[0];
				const month = parts[1];
				const year = parts[2];
				
				// Cek apakah ini format yang sudah benar
				if (monthNames[month] || Object.values(monthNames).includes(month)) {
					return dateString; // Sudah dalam format yang benar
				}
			}
		}

		// Format: "2025-08-12" atau "2025/08/12" (tanggal tunggal)
		try {
			const date = new Date(dateString);
			if (!isNaN(date.getTime())) {
				const day = date.getDate();
				const month = date.getMonth();
				const year = date.getFullYear();
				
				const formattedDate = `${day} ${monthShort[month]} ${year}`;
				return formattedDate;
			}
		} catch (e) {
			// Error handling tanpa console.log
		}

		// Jika tidak bisa di-parse, return string asli
		return dateString;
	}

	function handlePhoneInput(event) {
		event.target.value = event.target.value.replace(/[^0-9]/g, '');
	}

	function handlePhoneKeyPress(event) {
		if (!/[0-9]/.test(event.key)) {
			event.preventDefault();
		}
	}

	function resetForm() {
		selectedSeason = '';
		selectedCategory = '';
		selectedPackage = '';
		selectedDestination = '';
		selectedDate = '';
		selectedSalesConsultant = '';
		// Reset form elements
		const formElement = document.querySelector('form');
		if (formElement) {
			formElement.reset();
		}
	}

	function closeMessage() {
		showSuccessMessage = false;
		showErrorMessage = false;
		messageText = '';
	}

	async function handleFormSubmit(event) {
		event.preventDefault();
		isSubmitting = true;
		showErrorMessage = false;
		showSuccessMessage = false;

		const formData = new FormData(event.target);
		const data = {
			gelaran: formData.get('gelaran'),
			nama: formData.get('nama'),
			telefon: formData.get('telefon'),
			cawangan: formData.get('cawangan'),
			salesConsultant: formData.get('sales_consultant'),
			pakej: formData.get('pakej'),
			musim: formData.get('musim'),
			kategori: formData.get('kategori'),
			pelancongan: formData.get('pelancongan'),
			tarikh: formData.get('tarikh')
		};

		try {
			const response = await fetch('/api/submit-form', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data)
			});

			const result = await response.json();

			if (result.success) {
				showSuccessMessage = true;
				messageText = result.message;
				resetForm();
			} else {
				showErrorMessage = true;
				messageText = result.error;
			}
		} catch (error) {
			console.error('Error submitting form:', error);
			showErrorMessage = true;
			messageText = 'Ralat sistem. Sila cuba lagi.';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<section class="pt-6 sm:pt-10 px-4 sm:px-0">
	<div class="text-center mb-4 sm:mb-5">
		<h2 class="m-0 text-2xl sm:text-3xl font-bold tracking-wide">ISI MAKLUMAT ANDA</h2>
	</div>

	<!-- Success Message -->
	{#if showSuccessMessage}
		<div class="flex items-center justify-between p-3 sm:p-4 rounded-xl mb-4 sm:mb-6 max-w-[720px] mx-auto bg-green-50 border border-green-500 text-green-800">
			<div class="flex items-center gap-2 sm:gap-3 flex-1">
				<svg class="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
					<polyline points="22,4 12,14.01 9,11.01"></polyline>
				</svg>
				<p class="m-0 text-xs sm:text-sm font-medium">{messageText}</p>
			</div>
			<button class="bg-transparent border-none text-lg sm:text-xl text-inherit cursor-pointer p-1 rounded transition-colors hover:bg-black/10 flex-shrink-0" on:click={closeMessage}>×</button>
		</div>
	{/if}

	<!-- Error Message -->
	{#if showErrorMessage}
		<div class="flex items-center justify-between p-3 sm:p-4 rounded-xl mb-4 sm:mb-6 max-w-[720px] mx-auto bg-red-50 border border-red-500 text-red-800">
			<div class="flex items-center gap-2 sm:gap-3 flex-1">
				<svg class="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<circle cx="12" cy="12" r="10"></circle>
					<line x1="15" y1="9" x2="9" y2="15"></line>
					<line x1="9" y1="9" x2="15" y2="15"></line>
				</svg>
				<p class="m-0 text-xs sm:text-sm font-medium">{messageText}</p>
			</div>
			<button class="bg-transparent border-none text-lg sm:text-xl text-inherit cursor-pointer p-1 rounded transition-colors hover:bg-black/10 flex-shrink-0" on:click={closeMessage}>×</button>
		</div>
	{/if}

	<!-- Loading State -->
	{#if isLoading}
		<div class="bg-white border border-gray-200 rounded-2xl shadow-lg p-4 sm:p-7 max-w-[720px] mx-auto">
			<div class="flex items-center justify-center py-8">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#942392]"></div>
				<span class="ml-3 text-gray-600">Memuatkan data...</span>
			</div>
		</div>
	{:else if loadError}
		<div class="bg-white border border-gray-200 rounded-2xl shadow-lg p-4 sm:p-7 max-w-[720px] mx-auto">
			<div class="text-center py-8">
				<div class="text-red-500 mb-2">⚠️ Ralat memuatkan data</div>
				<p class="text-gray-600 text-sm">{loadError}</p>
				<button 
					on:click={() => window.location.reload()} 
					class="mt-4 px-4 py-2 bg-[#942392] text-white rounded-lg hover:brightness-105 transition-all"
				>
					Cuba Lagi
				</button>
			</div>
		</div>
	{:else}
		<div class="bg-white border border-gray-200 rounded-2xl shadow-lg p-4 sm:p-7 max-w-[720px] mx-auto">
			<form class="grid grid-cols-1 md:grid-cols-2 gap-4 gap-y-4" on:submit={handleFormSubmit}>
			<div class="flex flex-col gap-1.5 sm:gap-2">
				<label for="gelaran" class="text-xs sm:text-sm font-semibold text-gray-700">Gelaran<span class="text-red-500 ml-1">*</span></label>
				<Dropdown 
					options={gelaranOptions}
					placeholder="Pilih Gelaran"
					name="gelaran"
					required={true}
				/>
			</div>

			<div class="flex flex-col gap-1.5 sm:gap-2">
				<label for="nama" class="text-xs sm:text-sm font-semibold text-gray-700">Nama<span class="text-red-500 ml-1">*</span></label>
				<input id="nama" name="nama" type="text" placeholder="Nama Penuh" required class="h-10 sm:h-11 rounded-lg border border-gray-200 px-3 text-sm bg-white outline-none transition-all duration-120 focus:border-[#942392] focus:shadow-[0_0_0_3px_rgba(148,35,146,0.18)]" />
			</div>

			<div class="flex flex-col gap-1.5 sm:gap-2">
				<label for="telefon" class="text-xs sm:text-sm font-semibold text-gray-700">No Telefon<span class="text-red-500 ml-1">*</span></label>
				<input 
					id="telefon" 
					name="telefon" 
					type="tel" 
					placeholder="Contoh: 01922322901" 
					required 
					on:input={handlePhoneInput}
					on:keypress={handlePhoneKeyPress}
					class="h-10 sm:h-11 rounded-lg border border-gray-200 px-3 text-sm bg-white outline-none transition-all duration-120 focus:border-[#942392] focus:shadow-[0_0_0_3px_rgba(148,35,146,0.18)]"
				/>
			</div>

			<div class="flex flex-col gap-1.5 sm:gap-2">
				<label for="cawangan" class="text-xs sm:text-sm font-semibold text-gray-700">Cawangan<span class="text-red-500 ml-1">*</span></label>
				<Dropdown 
					options={cawanganOptions}
					placeholder="Pilih Cawangan Anda"
					name="cawangan"
					required={true}
					searchable={true}
				/>
			</div>

			<div class="flex flex-col gap-1.5 sm:gap-2">
				<label for="sales_consultant" class="text-xs sm:text-sm font-semibold text-gray-700">Sales Consultant<span class="text-red-500 ml-1">*</span></label>
				<Dropdown 
					options={salesConsultantOptions}
					placeholder="Pilih Sales Consultant"
					bind:value={selectedSalesConsultant}
					name="sales_consultant"
					required={true}
				/>
			</div>

			<div class="flex flex-col gap-1.5 sm:gap-2">
				<label for="pakej" class="text-xs sm:text-sm font-semibold text-gray-700">Pakej<span class="text-red-500 ml-1">*</span></label>
				<Dropdown 
					options={pakejOptions}
					placeholder="Pilih Pakej"
					bind:value={selectedPackage}
					name="pakej"
					required={true}
				/>
			</div>

			{#if selectedPackage && packageTypes.find(p => p.id === selectedPackage)?.name?.toLowerCase() === 'umrah'}
			<div class="flex flex-col gap-1.5 sm:gap-2">
				<label for="musim" class="text-xs sm:text-sm font-semibold text-gray-700">Musim Umrah<span class="text-red-500 ml-1">*</span></label>
				<Dropdown 
					options={musimOptions}
					placeholder="Pilih Pakej Umrah"
					bind:value={selectedSeason}
					name="musim"
					required={true}
				/>
			</div>

			{#if selectedSeason}
				{#if getCategories().length}
				<div class="flex flex-col gap-1.5 sm:gap-2">
					<label for="kategori" class="text-xs sm:text-sm font-semibold text-gray-700">Kategori Umrah<span class="text-red-500 ml-1">*</span></label>
					<Dropdown 
						options={getCategories().map(c => ({ value: c.id, label: c.name }))}
						placeholder="Pilih Kategori Umrah"
						bind:value={selectedCategory}
						name="kategori"
						required={true}
					/>
				</div>
				{:else}
				<div class="flex flex-col gap-1.5 sm:gap-2">
					<div class="p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm">
						⚠️ Musim "{seasons.find(s => s.id === selectedSeason)?.name}" tidak memiliki kategori umrah yang tersedia. Sila pilih musim lain.
					</div>
				</div>
				{/if}
			{/if}
			{:else if selectedPackage && packageTypes.find(p => p.id === selectedPackage)?.name?.toLowerCase() === 'pelancongan'}
			<div class="flex flex-col gap-1.5 sm:gap-2">
				<label for="pelancongan" class="text-xs sm:text-sm font-semibold text-gray-700">Pelancongan<span class="text-red-500 ml-1">*</span></label>
				<Dropdown 
					options={destinationOptions}
					placeholder="Pilih Pelancongan"
					bind:value={selectedDestination}
					name="pelancongan"
					required={true}
					searchable={true}
					showAvailability={true}
				/>
			</div>

			{#if selectedDestination && getDatesForDestination().length > 0}
			<div class="flex flex-col gap-1.5 sm:gap-2">
				<label for="tarikh" class="text-xs sm:text-sm font-semibold text-gray-700">Tarikh Pelancongan<span class="text-red-500 ml-1">*</span></label>
				<Dropdown 
					options={getDatesForDestination().map(d => ({ 
						value: d.id, 
						label: formatDateToMalay(d.date_range) 
					}))}
					placeholder="Pilih Tarikh"
					bind:value={selectedDate}
					name="tarikh"
					required={true}
				/>
			</div>
			{:else if selectedDestination && getDatesForDestination().length === 0}
			<div class="flex flex-col gap-1.5 sm:gap-2">
				<div class="p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm">
					⚠️ Destinasi "{destinations.find(d => d.id === selectedDestination)?.name}" tidak memiliki tarikh yang tersedia. Sila pilih destinasi lain.
				</div>
			</div>
			{/if}
			{/if}

			<div class="mt-2 md:col-span-2">
				<button 
					type="submit" 
					disabled={isSubmitting}
					class="w-full h-[42px] sm:h-[46px] border-none rounded-lg text-white font-semibold tracking-wide bg-gradient-to-r from-[#942392] to-[#942392] shadow-lg shadow-purple-900/25 cursor-pointer hover:brightness-105 transition-all text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{#if isSubmitting}
						<span class="flex items-center justify-center">
							<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
							Menghantar...
						</span>
					{:else}
						HANTAR
					{/if}
				</button>
			</div>
		</form>
	</div>
	{/if}
</section>
