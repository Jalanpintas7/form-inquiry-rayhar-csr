<script>
	import { createEventDispatcher } from 'svelte';
	
	export let options = [];
	export let placeholder = 'Pilih opsi';
	export let value = '';
	export let name = '';
	export let required = false;
	export let disabled = false;
	export let searchable = false; // New prop untuk mengaktifkan search
	
	let isOpen = false;
	let selectedOption = null;
	let searchQuery = '';
	let filteredOptions = [];
	
	const dispatch = createEventDispatcher();
	
	$: if (value && options.length) {
		selectedOption = options.find(opt => opt.value === value);
		// Update search query dengan label yang dipilih untuk searchable dropdown
		if (searchable && selectedOption) {
			searchQuery = selectedOption.label;
		}
	}
	
	// Filter options berdasarkan search query
	$: if (searchable && searchQuery) {
		filteredOptions = options.filter(option => 
			option.label.toLowerCase().includes(searchQuery.toLowerCase())
		);
	} else {
		filteredOptions = options;
	}
	
	function toggleDropdown() {
		if (!disabled) {
			isOpen = !isOpen;
			if (isOpen && searchable) {
				// Focus pada search input ketika dropdown dibuka
				setTimeout(() => {
					const searchInput = document.querySelector('.search-input');
					if (searchInput) searchInput.focus();
				}, 100);
			}
		}
	}
	
	function selectOption(option) {
		selectedOption = option;
		value = option.value;
		searchQuery = option.label; // Set search query dengan label yang dipilih
		isOpen = false;
		dispatch('change', { value: option.value, option });
	}
	
	function closeDropdown() {
		isOpen = false;
		// Jangan reset search query jika sudah ada nilai yang dipilih
		if (!selectedOption) {
			searchQuery = '';
		}
	}
	
	function handleSearchInput(event) {
		searchQuery = event.target.value;
		// Buka dropdown otomatis ketika user mulai mengetik
		if (!isOpen) {
			isOpen = true;
		}
		// Clear selection jika user mengubah search query
		if (selectedOption && searchQuery !== selectedOption.label) {
			selectedOption = null;
			value = '';
		}
	}
	
	function handleSearchKeydown(event) {
		if (event.key === 'Escape') {
			closeDropdown();
		} else if (event.key === 'Enter' && filteredOptions.length === 1) {
			// Auto-select jika hanya ada 1 hasil
			selectOption(filteredOptions[0]);
		}
	}
	
	function handleSearchClick(event) {
		// Mencegah dropdown tertutup ketika mengklik input search
		event.stopPropagation();
		if (!isOpen) {
			isOpen = true;
		}
	}
	
	// Close dropdown when clicking outside
	function handleClickOutside(event) {
		if (!event.target.closest('.dropdown-container')) {
			isOpen = false;
			// Jangan reset search query jika sudah ada nilai yang dipilih
			if (!selectedOption) {
				searchQuery = '';
			}
		}
	}
</script>

<svelte:window on:click={handleClickOutside} />

<div class="dropdown-container" class:open={isOpen}>
	{#if searchable}
		<!-- Searchable dropdown dengan input search di trigger -->
		<div class="dropdown-trigger searchable" on:click={handleSearchClick}>
			<input
				type="text"
				class="search-input"
				placeholder={placeholder}
				bind:value={searchQuery}
				on:input={handleSearchInput}
				on:keydown={handleSearchKeydown}
				on:click={handleSearchClick}
			/>
			<svg 
				class="dropdown-icon" 
				class:rotated={isOpen}
				viewBox="0 0 24 24" 
				fill="none" 
				stroke="currentColor" 
				stroke-width="2"
				on:click={toggleDropdown}
			>
				<polyline points="6,9 12,15 18,9"></polyline>
			</svg>
		</div>
	{:else}
		<!-- Regular dropdown tanpa search -->
		<div class="dropdown-trigger" on:click={toggleDropdown}>
			<span class="dropdown-value">
				{selectedOption ? selectedOption.label : placeholder}
			</span>
			<svg 
				class="dropdown-icon" 
				class:rotated={isOpen}
				viewBox="0 0 24 24" 
				fill="none" 
				stroke="currentColor" 
				stroke-width="2"
			>
				<polyline points="6,9 12,15 18,9"></polyline>
			</svg>
		</div>
	{/if}
	
	{#if isOpen}
		<div class="dropdown-menu">
			{#if filteredOptions.length > 0}
				{#each filteredOptions as option}
					<div 
						class="dropdown-item" 
						class:selected={option.value === value}
						on:click={() => selectOption(option)}
					>
						{option.label}
					</div>
				{/each}
			{:else if searchable && searchQuery}
				<div class="no-results">
					Tiada hasil untuk "{searchQuery}"
				</div>
			{:else if !searchable}
				{#each options as option}
					<div 
						class="dropdown-item" 
						class:selected={option.value === value}
						on:click={() => selectOption(option)}
					>
						{option.label}
					</div>
				{/each}
			{/if}
		</div>
	{/if}
	
	<!-- Hidden input for form submission -->
	<input 
		type="hidden" 
		{name} 
		{value} 
		{required} 
		{disabled}
	/>
</div>

<style>
	.dropdown-container {
		position: relative;
		width: 100%;
	}
	
	.dropdown-trigger {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 44px;
		border-radius: 10px;
		border: 1px solid var(--border, #d1d5db);
		padding: 0 12px;
		font-size: 14px;
		background: #fff;
		cursor: pointer;
		transition: box-shadow 120ms ease, border-color 120ms ease;
	}
	
	.dropdown-trigger.searchable {
		padding: 0;
		cursor: default;
	}
	
	.dropdown-trigger:hover {
		border-color: var(--primary-600, #9333ea);
	}
	
	.dropdown-trigger:focus-within {
		border-color: var(--primary-600, #9333ea);
		box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
	}
	
	.dropdown-value {
		color: #374151;
	}
	
	.search-input {
		flex: 1;
		height: 100%;
		border: none;
		outline: none;
		font-size: 14px;
		padding: 0 12px;
		background: transparent;
		color: #374151;
	}
	
	.search-input::placeholder {
		color: #9ca3af;
	}
	
	.dropdown-icon {
		width: 16px;
		height: 16px;
		color: #6b7280;
		transition: transform 0.2s ease;
		flex-shrink: 0;
		cursor: pointer;
	}
	
	.dropdown-icon.rotated {
		transform: rotate(180deg);
	}
	
	.dropdown-menu {
		position: absolute;
		top: calc(100% + 4px);
		left: 0;
		right: 0;
		background: #fff;
		border: 1px solid var(--border, #d1d5db);
		border-radius: 8px;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
		z-index: 1000;
		max-height: 250px;
		overflow-y: auto;
		/* Memberikan jarak dari border kanan */
		margin-right: 8px;
		right: 8px;
	}
	
	.dropdown-item {
		padding: 12px 16px;
		cursor: pointer;
		transition: background-color 0.15s ease;
		border-bottom: 1px solid #f3f4f6;
	}
	
	.dropdown-item:last-child {
		border-bottom: none;
	}
	
	.dropdown-item:hover {
		background-color: #f9fafb;
	}
	
	.dropdown-item.selected {
		background-color: var(--primary-50, #f3e8ff);
		color: var(--primary-700, #7c3aed);
		font-weight: 500;
	}
	
	.no-results {
		padding: 16px;
		text-align: center;
		color: #6b7280;
		font-size: 14px;
		font-style: italic;
	}
	
	/* Custom scrollbar untuk dropdown */
	.dropdown-menu::-webkit-scrollbar {
		width: 6px;
	}
	
	.dropdown-menu::-webkit-scrollbar-track {
		background: #f1f1f1;
		border-radius: 3px;
	}
	
	.dropdown-menu::-webkit-scrollbar-thumb {
		background: #c1c1c1;
		border-radius: 3px;
	}
	
	.dropdown-menu::-webkit-scrollbar-thumb:hover {
		background: #a8a8a8;
	}
	
	/* Responsive adjustments */
	@media (max-width: 768px) {
		.dropdown-menu {
			right: 12px; /* Memberikan jarak dari border kanan pada mobile */
			left: 8px; /* Memberikan jarak dari border kiri pada mobile */
		}
	}
	
	/* Memastikan dropdown tidak terlalu dekat dengan border kanan pada semua ukuran */
	@media (min-width: 769px) {
		.dropdown-menu {
			right: 12px;
			left: 8px;
		}
	}
</style> 