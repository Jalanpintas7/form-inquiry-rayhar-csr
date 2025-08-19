<script>
	let { data, form } = $props();
	const branches = data?.branches ?? [];
	const seasons = data?.seasons ?? [];
	const packageTypes = data?.packageTypes ?? [];
	const destinations = data?.destinations ?? [];

	let selectedSeason = $state('');
	let selectedCategory = $state('');
	let selectedPackage = $state('');
	let selectedDestination = $state('');
	let selectedDate = $state('');
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
</script>

<section class="container page-section">
	<div class="page-title">
		<h2>ISI MAKLUMAT ANDA</h2>
	</div>

	<div class="card">
		<form class="form-grid" method="POST">
			<div class="field">
				<label for="gelaran">Gelaran<span class="req">*</span></label>
				<select id="gelaran" name="gelaran" required>
					<option value="">Pilih Gelaran</option>
					<option>Cik</option>
					<option>Encik</option>
					<option>Puan</option>
					<option>Tuan</option>
					<option>Datin</option>
					<option>Dato</option>
				</select>
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
				<select id="cawangan" name="cawangan" required>
					<option value="">Pilih Cawangan Anda</option>
					{#each branches as b}
						<option value={b.id}>{b.name}</option>
					{/each}
				</select>
			</div>

			<div class="field">
				<label for="pakej">Pakej<span class="req">*</span></label>
				<select id="pakej" name="pakej" bind:value={selectedPackage} required>
					<option value="">Pilih Pakej</option>
					{#each packageTypes as p}
						<option value={p.id}>{p.name}</option>
					{/each}
				</select>
			</div>

			{#if selectedPackage && data.packageTypes.find(p => p.id === selectedPackage)?.name?.toLowerCase() === 'umrah'}
			<div class="field">
				<label for="musim">Musim Umrah<span class="req">*</span></label>
				<select id="musim" name="musim" bind:value={selectedSeason} required>
					<option value="">Pilih Pakej Umrah</option>
					{#each seasons as s}
						<option value={s.id}>{s.name}</option>
					{/each}
				</select>
			</div>

			{#if selectedSeason && getCategories().length}
			<div class="field">
				<label for="kategori">Kategori Umrah<span class="req">*</span></label>
				<select id="kategori" name="kategori" bind:value={selectedCategory} required>
					<option value="">Pilih Kategori Umrah</option>
					{#each getCategories() as c}
						<option value={c.id}>{c.name}</option>
					{/each}
				</select>
			</div>
			{/if}
			{:else if selectedPackage && data.packageTypes.find(p => p.id === selectedPackage)?.name?.toLowerCase() !== 'umrah'}
			<div class="field">
				<label for="pelancongan">Pelancongan<span class="req">*</span></label>
				<select id="pelancongan" name="pelancongan" bind:value={selectedDestination} required>
					<option value="">Pilih Pelancongan</option>
					{#each destinations as d}
						<option value={d.id}>{d.name}</option>
					{/each}
				</select>
			</div>

			{#if selectedDestination}
			<div class="field">
				<label for="tarikh">Tarikh Pelancongan<span class="req">*</span></label>
				<select id="tarikh" name="tarikh" bind:value={selectedDate} required>
					<option value="">Pilih Tarikh</option>
					{#each getDatesForDestination() as d}
						<option value={d.id}>{d.date_range}</option>
					{/each}
				</select>
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
</style>
