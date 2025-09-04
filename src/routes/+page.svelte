<script>
	import { onMount } from 'svelte';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import { loadInitialData, submitForm } from '$lib/services/api.js';
	
	let data = $state(null);
	let loading = $state(true);
	let error = $state(null);
	let formResult = $state(null);
	let isSubmitting = $state(false);
	
	const branches = $derived(data?.branches ?? []);
	const salesConsultants = $derived(data?.salesConsultants ?? []);
	const seasons = $derived(data?.seasons ?? []);
	const packageTypes = $derived(data?.packageTypes ?? []);
	const destinations = $derived(data?.destinations ?? []);
	
	onMount(async () => {
		try {
			data = await loadInitialData();
		} catch (err) {
			error = err.message;
			console.error('Error loading data:', err);
		} finally {
			loading = false;
		}
	});
	


	let selectedSeason = $state('');
	let selectedCategory = $state('');
	let selectedPackage = $state('');
	let selectedDestination = $state('');
	let selectedDate = $state('');
	let selectedSalesConsultant = $state('');
	let showSuccessMessage = $state(false);
	let showErrorMessage = $state(false);
	let messageText = $state('');

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

	// Removed form effects since we're using CSR now
	$effect(() => {
		const cats = getCategories();
		if (!cats.find((c) => c.id === selectedCategory)) selectedCategory = '';
	});

	// Handle form submission result
	$effect(() => {
		if (formResult?.success === true) {
			showSuccessMessage = true;
			messageText = formResult.message || 'Terima kasih! Maklumat anda telah berjaya dihantar.';
			// Reset form
			resetForm();
		} else if (formResult?.success === false) {
			showErrorMessage = true;
			messageText = formResult.error || 'Ralat sistem. Sila cuba lagi.';
		}
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
		formResult = null;
	}

	// Handle form submission
	async function handleSubmit(event) {
		event.preventDefault();
		
		// Set loading state
		isSubmitting = true;
		
		const formData = new FormData(event.target);
		const formObject = {
			gelaran: formData.get('gelaran')?.toString().trim(),
			nama: formData.get('nama')?.toString().trim(),
			telefon: formData.get('telefon')?.toString().trim(),
			cawangan: formData.get('cawangan')?.toString().trim(),
			salesConsultant: formData.get('sales_consultant')?.toString().trim(),
			pakej: formData.get('pakej')?.toString().trim(),
			musim: formData.get('musim')?.toString().trim(),
			kategori: formData.get('kategori')?.toString().trim(),
			pelancongan: formData.get('pelancongan')?.toString().trim(),
			tarikh: formData.get('tarikh')?.toString().trim()
		};

		try {
			formResult = await submitForm(formObject);
		} catch (err) {
			formResult = { success: false, error: 'Ralat sistem. Sila cuba lagi.' };
			console.error('Form submission error:', err);
		} finally {
			// Reset loading state
			isSubmitting = false;
		}
	}
</script>

<section class="pt-6 sm:pt-10 px-4 sm:px-0">
	<!-- Title - hide during loading -->
	{#if !loading}
		<div class="text-center mb-4 sm:mb-5 animate-in fade-in-0 slide-in-from-top-4 duration-500" style="animation-delay: 200ms;">
			<h2 class="m-0 text-2xl sm:text-3xl font-bold tracking-wide">ISI MAKLUMAT ANDA</h2>
		</div>
	{/if}

	<!-- Loading State -->
	{#if loading}
		<div class="text-center mb-4 sm:mb-5">
			<h2 class="m-0 text-2xl sm:text-3xl font-bold tracking-wide text-gray-400">ISI MAKLUMAT ANDA</h2>
		</div>
		<div class="bg-white border border-gray-200 rounded-2xl shadow-lg p-4 sm:p-7 max-w-[720px] mx-auto w-full">
			<div class="flex flex-col items-center justify-center min-h-[400px] py-12">
				<!-- Circular Loading Indicator -->
				<div class="relative mb-6">
					<div class="smooth-spin rounded-full h-16 w-16 border-4 border-[#942392]/20 border-t-[#942392]"></div>
					<div class="absolute inset-0 rounded-full border-4 border-transparent border-t-[#942392] smooth-spin" style="animation-duration: 1.5s;"></div>
				</div>

				<!-- Loading Text -->
				<h3 class="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Memuatkan Data</h3>
				<p class="text-gray-600 text-center max-w-sm">Sila tunggu sebentar, kami sedang menyediakan maklumat terkini untuk anda.</p>

				<!-- Progress dots animation -->
				<div class="flex space-x-1 mt-4">
					<div class="w-2 h-2 bg-[#942392] rounded-full gentle-bounce" style="animation-delay: 0s;"></div>
					<div class="w-2 h-2 bg-[#942392] rounded-full gentle-bounce" style="animation-delay: 0.2s;"></div>
					<div class="w-2 h-2 bg-[#942392] rounded-full gentle-bounce" style="animation-delay: 0.4s;"></div>
				</div>
			</div>
		</div>
	{/if}

	<!-- Error State -->
	{#if error}
		<div class="flex items-center justify-between p-3 sm:p-4 rounded-xl mb-4 sm:mb-6 max-w-[720px] mx-auto bg-red-50 border border-red-500 text-red-800">
			<div class="flex items-center gap-2 sm:gap-3 flex-1">
				<svg class="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<circle cx="12" cy="12" r="10"></circle>
					<line x1="15" y1="9" x2="9" y2="15"></line>
					<line x1="9" y1="9" x2="15" y2="15"></line>
				</svg>
				<p class="m-0 text-xs sm:text-sm font-medium">Ralat memuatkan data: {error}</p>
			</div>
		</div>
	{/if}

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
			<button class="bg-transparent border-none text-lg sm:text-xl text-inherit cursor-pointer p-1 rounded transition-colors hover:bg-black/10 flex-shrink-0" onclick={closeMessage}>×</button>
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
			<button class="bg-transparent border-none text-lg sm:text-xl text-inherit cursor-pointer p-1 rounded transition-colors hover:bg-black/10 flex-shrink-0" onclick={closeMessage}>×</button>
		</div>
	{/if}

	{#if !loading && !error}
	<div class="bg-white border border-gray-200 rounded-2xl shadow-lg p-4 sm:p-7 max-w-[720px] mx-auto w-full animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
		<form class="grid grid-cols-1 md:grid-cols-2 gap-4 gap-y-4" onsubmit={handleSubmit}>
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
					oninput={handlePhoneInput}
					onkeypress={handlePhoneKeyPress}
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
				<button type="submit" disabled={isSubmitting} class="w-full h-[42px] sm:h-[46px] border-none rounded-lg text-white font-semibold tracking-wide bg-gradient-to-r from-[#942392] to-[#942392] shadow-lg shadow-purple-900/25 cursor-pointer hover:brightness-105 transition-all text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
					{#if isSubmitting}
						<!-- Circular Progress Indicator -->
						<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
						<span>MENGHANTAR...</span>
					{:else}
						<span>HANTAR</span>
					{/if}
				</button>
			</div>
		</form>
	</div>
	{/if}
</section>
