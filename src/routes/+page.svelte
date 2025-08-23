<script>
	import { enhance } from '$app/forms';
	import Dropdown from '$lib/components/Dropdown.svelte';
	
	let { data, form } = $props();
	const branches = data?.branches ?? [];
	const seasons = data?.seasons ?? [];
	const packageTypes = data?.packageTypes ?? [];
	const destinations = data?.destinations ?? [];
	const salesConsultants = data?.salesConsultants ?? [];

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
	const pakejOptions = $derived(packageTypes.map(p => ({ value: p.id, label: p.name })));
	const salesConsultantOptions = $derived(salesConsultants.map(sc => ({ value: sc.id, label: sc.name })));
	const musimOptions = $derived(seasons.map(s => ({ value: s.id, label: s.name })));
	const destinationOptions = $derived(destinations.map(d => ({ value: d.id, label: d.name })));

	$effect(() => {
		if (!selectedSeason && form?.musim) selectedSeason = form.musim;
	});
	$effect(() => {
		if (!selectedCategory && form?.kategori) selectedCategory = form.kategori;
	});
	$effect(() => {
		if (!selectedPackage && form?.pakej) selectedPackage = form.pakej;
	});
	$effect(() => {
		const cats = getCategories();
		if (!cats.find((c) => c.id === selectedCategory)) selectedCategory = '';
	});

	// Handle form submission result
	$effect(() => {
		if (form?.success === true) {
			showSuccessMessage = true;
			messageText = form.message || 'Terima kasih! Maklumat anda telah berjaya dihantar.';
			// Reset form
			resetForm();
		} else if (form?.success === false) {
			showErrorMessage = true;
			messageText = form.error || 'Ralat sistem. Sila cuba lagi.';
		}
	});

	function getCategories() {
		const found = seasons.find((s) => s.id === selectedSeason);
		return found?.categories ?? [];
	}

	function getDatesForDestination() {
		const found = destinations.find((d) => d.id === selectedDestination);
		return found?.dates ?? [];
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
</script>

<section class="container page-section">
	<div class="page-title">
		<h2>ISI MAKLUMAT ANDA</h2>
	</div>

	<!-- Success Message -->
	{#if showSuccessMessage}
		<div class="message success-message">
			<div class="message-content">
				<svg class="success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
					<polyline points="22,4 12,14.01 9,11.01"></polyline>
				</svg>
				<p>{messageText}</p>
			</div>
			<button class="close-btn" on:click={closeMessage}>×</button>
		</div>
	{/if}

	<!-- Error Message -->
	{#if showErrorMessage}
		<div class="message error-message">
			<div class="message-content">
				<svg class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<circle cx="12" cy="12" r="10"></circle>
					<line x1="15" y1="9" x2="9" y2="15"></line>
					<line x1="9" y1="9" x2="15" y2="15"></line>
				</svg>
				<p>{messageText}</p>
			</div>
			<button class="close-btn" on:click={closeMessage}>×</button>
		</div>
	{/if}

	<div class="card">
		<form class="form-grid" method="POST" use:enhance={() => {
			return async ({ result }) => {
				if (result.type === 'success') {
					showSuccessMessage = true;
					messageText = result.data?.message || 'Terima kasih! Maklumat anda telah berjaya dihantar.';
					resetForm();
				} else if (result.type === 'failure') {
					showErrorMessage = true;
					messageText = result.data?.error || 'Ralat sistem. Sila cuba lagi.';
				}
			};
		}}>
			<div class="field">
				<label for="gelaran">Gelaran<span class="req">*</span></label>
				<Dropdown 
					options={gelaranOptions}
					placeholder="Pilih Gelaran"
					name="gelaran"
					required={true}
				/>
			</div>

			<div class="field">
				<label for="nama">Nama<span class="req">*</span></label>
				<input id="nama" name="nama" type="text" placeholder="Nama Penuh" required />
			</div>

			<div class="field">
				<label for="telefon">No Telefon<span class="req">*</span></label>
				<input 
					id="telefon" 
					name="telefon" 
					type="tel" 
					placeholder="Contoh: 01922322901" 
					required 
					on:input={handlePhoneInput}
					on:keypress={handlePhoneKeyPress}
				/>
			</div>

			<div class="field">
				<label for="cawangan">Cawangan<span class="req">*</span></label>
				<Dropdown 
					options={cawanganOptions}
					placeholder="Pilih Cawangan Anda"
					name="cawangan"
					required={true}
					searchable={true}
				/>
			</div>

			<div class="field">
				<label for="pakej">Pakej<span class="req">*</span></label>
				<Dropdown 
					options={pakejOptions}
					placeholder="Pilih Pakej"
					bind:value={selectedPackage}
					name="pakej"
					required={true}
				/>
			</div>

			{#if selectedPackage && data.packageTypes.find(p => p.id === selectedPackage)?.name?.toLowerCase() !== 'umrah'}
			<div class="field">
				<label for="sales_consultant">Sales Consultant</label>
				<Dropdown 
					options={salesConsultantOptions}
					placeholder="Pilih Sales Consultant"
					bind:value={selectedSalesConsultant}
					name="sales_consultant"
				/>
			</div>
			{/if}

			{#if selectedPackage && data.packageTypes.find(p => p.id === selectedPackage)?.name?.toLowerCase() === 'umrah'}
			<div class="field">
				<label for="musim">Musim Umrah<span class="req">*</span></label>
				<Dropdown 
					options={musimOptions}
					placeholder="Pilih Pakej Umrah"
					bind:value={selectedSeason}
					name="musim"
					required={true}
				/>
			</div>

			{#if selectedSeason && getCategories().length}
			<div class="field">
				<label for="kategori">Kategori Umrah<span class="req">*</span></label>
				<Dropdown 
					options={getCategories().map(c => ({ value: c.id, label: c.name }))}
					placeholder="Pilih Kategori Umrah"
					bind:value={selectedCategory}
					name="kategori"
					required={true}
				/>
			</div>
			{/if}
			{:else if selectedPackage && data.packageTypes.find(p => p.id === selectedPackage)?.name?.toLowerCase() !== 'umrah'}
			<div class="field">
				<label for="pelancongan">Pelancongan<span class="req">*</span></label>
				<Dropdown 
					options={destinationOptions}
					placeholder="Pilih Pelancongan"
					bind:value={selectedDestination}
					name="pelancongan"
					required={true}
					searchable={true}
				/>
			</div>

			{#if selectedDestination}
			<div class="field">
				<label for="tarikh">Tarikh Pelancongan<span class="req">*</span></label>
				<Dropdown 
					options={getDatesForDestination().map(d => ({ value: d.id, label: d.date_range }))}
					placeholder="Pilih Tarikh"
					bind:value={selectedDate}
					name="tarikh"
					required={true}
				/>
			</div>
			{/if}
			{/if}

			<div class="actions">
				<button type="submit" class="btn-primary">HANTAR</button>
			</div>
		</form>
	</div>
</section>

<style>
	.page-section {
		padding: 40px 0 0;
	}

	.page-title {
		text-align: center;
		margin-bottom: 20px;
	}

	.page-title h2 {
		margin: 0;
		font-size: 28px;
		font-weight: 700;
		letter-spacing: 0.4px;
	}

	.card {
		background: var(--card-bg);
		border: 1px solid var(--border);
		border-radius: 14px;
		box-shadow: 0 10px 24px rgba(17, 24, 39, 0.06);
		padding: 28px;
		max-width: 720px;
		margin: 0 auto;
	}

	.form-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px 20px;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	label {
		font-size: 13px;
		font-weight: 600;
		color: #374151;
	}

	.req { color: #ef4444; margin-left: 4px; }

	input, select {
		height: 44px;
		border-radius: 10px;
		border: 1px solid var(--border);
		padding: 0 12px;
		font-size: 14px;
		background: #fff;
		outline: none;
		transition: box-shadow 120ms ease, border-color 120ms ease;
	}

	input:focus, select:focus {
		border-color: var(--primary-600);
		box-shadow: var(--ring);
	}

	.actions {
		grid-column: 1 / -1;
		margin-top: 8px;
	}

	.btn-primary {
		width: 100%;
		height: 46px;
		border: none;
		border-radius: 10px;
		color: #fff;
		font-weight: 600;
		letter-spacing: 0.6px;
		background: linear-gradient(90deg, var(--primary-800), var(--primary-600));
		box-shadow: 0 6px 14px rgba(123, 31, 162, 0.25);
		cursor: pointer;
	}

	.btn-primary:hover { filter: brightness(1.02); }

	@media (max-width: 720px) {
		.form-grid { grid-template-columns: 1fr; }
	}

	/* Message Styles */
	.message {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 16px 20px;
		border-radius: 12px;
		margin-bottom: 24px;
		max-width: 720px;
		margin-left: auto;
		margin-right: auto;
	}

	.success-message {
		background: #ecfdf5;
		border: 1px solid #10b981;
		color: #065f46;
	}

	.error-message {
		background: #fef2f2;
		border: 1px solid #ef4444;
		color: #991b1b;
	}

	.message-content {
		display: flex;
		align-items: center;
		gap: 12px;
		flex: 1;
	}

	.message-content p {
		margin: 0;
		font-size: 14px;
		font-weight: 500;
	}

	.success-icon {
		width: 20px;
		height: 20px;
		color: #10b981;
		flex-shrink: 0;
	}

	.error-icon {
		width: 20px;
		height: 20px;
		color: #ef4444;
		flex-shrink: 0;
	}

	.close-btn {
		background: none;
		border: none;
		font-size: 20px;
		color: inherit;
		cursor: pointer;
		padding: 4px;
		border-radius: 4px;
		transition: background-color 0.2s;
		flex-shrink: 0;
	}

	.close-btn:hover {
		background: rgba(0, 0, 0, 0.1);
	}
</style>
