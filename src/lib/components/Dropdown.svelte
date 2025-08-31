<script>
	import { createEventDispatcher } from 'svelte';
	
	export let options = [];
	export let placeholder = 'Pilih opsi';
	export let value = '';
	export let name = '';
	export let required = false;
	export let disabled = false;
	export let searchable = false;
	export let showAvailability = false;
	
	let isOpen = false;
	let selectedOption = null;
	let searchQuery = '';
	let filteredOptions = [];
	
	const dispatch = createEventDispatcher();
	
	$: if (value && options.length) {
		selectedOption = options.find(opt => opt.value === value);
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
				setTimeout(() => {
					const searchInput = document.querySelector('.search-input');
					if (searchInput) searchInput.focus();
				}, 100);
			}
		}
	}
	
	function selectOption(option) {
		// Cek apakah opsi tersedia jika showAvailability aktif
		if (showAvailability && option.isAvailable === false) {
			return; // Jangan pilih opsi yang tidak tersedia
		}
		
		selectedOption = option;
		value = option.value;
		searchQuery = option.label;
		isOpen = false;
		dispatch('change', { value: option.value, option });
	}
	
	function closeDropdown() {
		isOpen = false;
		if (!selectedOption) {
			searchQuery = '';
		}
	}
	
	function handleSearchInput(event) {
		searchQuery = event.target.value;
		if (!isOpen) {
			isOpen = true;
		}
		if (selectedOption && searchQuery !== selectedOption.label) {
			selectedOption = null;
			value = '';
		}
	}
	
	function handleSearchKeydown(event) {
		if (event.key === 'Escape') {
			closeDropdown();
		} else if (event.key === 'Enter' && filteredOptions.length === 1) {
			selectOption(filteredOptions[0]);
		}
	}
	
	function handleSearchClick(event) {
		// Buka dropdown jika belum terbuka
		if (!isOpen) {
			isOpen = true;
		}
		// Focus pada input
		setTimeout(() => {
			const searchInput = event.target;
			if (searchInput) searchInput.focus();
		}, 100);
	}
	
	function handleClickOutside(event) {
		if (!event.target.closest('.dropdown-container')) {
			isOpen = false;
			if (!selectedOption) {
				searchQuery = '';
			}
		}
	}
</script>

<svelte:window on:click={handleClickOutside} />

<div class="dropdown-container relative w-full" class:open={isOpen}>
	{#if searchable}
		<div class="dropdown-trigger searchable flex items-center justify-between h-11 rounded-lg border border-gray-200 px-3 text-sm bg-white cursor-pointer transition-all duration-120 hover:border-[#942392] focus-within:border-[#942392] focus-within:shadow-[0_0_0_3px_rgba(148,35,146,0.18)]">
			<input
				type="text"
				class="search-input flex-1 h-full border-none outline-none text-sm px-0 bg-transparent text-gray-700 placeholder:text-gray-400"
				placeholder={placeholder}
				bind:value={searchQuery}
				on:input={handleSearchInput}
				on:keydown={handleSearchKeydown}
				on:click={handleSearchClick}
			/>
			<svg 
				class="dropdown-icon w-4 h-4 text-gray-500 transition-transform duration-200 flex-shrink-0" 
				class:rotated={isOpen}
				viewBox="0 0 24 24" 
				fill="none" 
				stroke="currentColor" 
				stroke-width="2"
			>
				<polyline points="6,9 12,15 18,9"></polyline>
			</svg>
		</div>
	{:else}
		<div class="dropdown-trigger flex items-center justify-between h-11 rounded-lg border border-gray-200 px-3 text-sm bg-white cursor-pointer transition-all duration-120 hover:border-[#942392] focus-within:border-[#942392] focus-within:shadow-[0_0_0_3px_rgba(148,35,146,0.18)]" on:click={toggleDropdown}>
			<span class="dropdown-value text-gray-700">
				{selectedOption ? selectedOption.label : placeholder}
			</span>
			<svg 
				class="dropdown-icon w-4 h-4 text-gray-500 transition-transform duration-200 flex-shrink-0" 
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
		<div class="dropdown-menu absolute top-[calc(100%+4px)] left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-[1000] max-h-[250px] overflow-y-auto mr-2 right-2">
			{#if filteredOptions.length > 0}
				{#each filteredOptions as option}
					<div 
						class="dropdown-item px-4 py-3 transition-colors duration-150 border-b border-gray-100 last:border-b-0" 
						class:selected={option.value === value}
						class:unavailable={showAvailability && option.isAvailable === false}
						on:click={() => selectOption(option)}
					>
						{#if showAvailability && option.displayLabel}
							{option.displayLabel}
						{:else}
							{option.label}
						{/if}
					</div>
				{/each}
			{:else if searchable && searchQuery}
				<div class="no-results px-4 py-4 text-center text-gray-500 text-sm italic">
					Tiada hasil untuk "{searchQuery}"
				</div>
			{:else if !searchable}
				{#each options as option}
					<div 
						class="dropdown-item px-4 py-3 transition-colors duration-150 border-b border-gray-100 last:border-b-0" 
						class:selected={option.value === value}
						class:unavailable={showAvailability && option.isAvailable === false}
						on:click={() => selectOption(option)}
					>
						{#if showAvailability && option.displayLabel}
							{option.displayLabel}
						{:else}
							{option.label}
						{/if}
					</div>
				{/each}
			{/if}
		</div>
	{/if}
	
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
		height: 40px;
		border-radius: 10px;
		border: 1px solid #d1d5db;
		padding: 0 12px;
		font-size: 14px;
		background: #fff;
		cursor: pointer;
		transition: box-shadow 120ms ease, border-color 120ms ease;
	}
	
	@media (min-width: 640px) {
		.dropdown-trigger {
			height: 44px;
		}
	}
	
	.dropdown-trigger.searchable {
		padding: 0 12px;
		cursor: pointer;
	}
	
	.dropdown-trigger:hover {
		border-color: #942392;
	}
	
	.dropdown-trigger:focus-within {
		border-color: #942392;
		box-shadow: 0 0 0 3px rgba(148, 35, 146, 0.18);
	}
	
	.dropdown-value {
		color: #374151;
		font-size: 13px;
	}
	
	@media (min-width: 640px) {
		.dropdown-value {
			font-size: 14px;
		}
	}
	
	.search-input {
		flex: 1;
		height: 100%;
		border: none;
		outline: none;
		font-size: 13px;
		padding: 0;
		background: transparent;
		color: #374151;
	}
	
	@media (min-width: 640px) {
		.search-input {
			font-size: 14px;
		}
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
		border: 1px solid #d1d5db;
		border-radius: 8px;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
		z-index: 1000;
		max-height: 250px;
		overflow-y: auto;
		margin-right: 8px;
		right: 8px;
	}
	
	.dropdown-item {
		padding: 10px 16px;
		cursor: pointer;
		transition: background-color 0.15s ease;
		border-bottom: 1px solid #f3f4f6;
		font-size: 13px;
	}
	
	@media (min-width: 640px) {
		.dropdown-item {
			padding: 12px 16px;
			font-size: 14px;
		}
	}
	
	.dropdown-item:last-child {
		border-bottom: none;
	}
	
	.dropdown-item:hover {
		background-color: #f9fafb;
	}
	
	.dropdown-item.selected {
		background-color: #f3e8ff;
		color: #942392;
		font-weight: 500;
	}
	
	.dropdown-item.unavailable {
		color: #9ca3af;
		cursor: not-allowed;
		background-color: #f9fafb;
	}
	
	.dropdown-item.unavailable:hover {
		background-color: #f9fafb;
	}
	
	.no-results {
		padding: 14px 16px;
		text-align: center;
		color: #6b7280;
		font-size: 12px;
		font-style: italic;
	}
	
	@media (min-width: 640px) {
		.no-results {
			padding: 16px;
			font-size: 14px;
		}
	}
	
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
	
	@media (max-width: 768px) {
		.dropdown-menu {
			right: 12px;
			left: 8px;
		}
	}
	
	@media (min-width: 769px) {
		.dropdown-menu {
			right: 12px;
			left: 8px;
		}
	}
</style> 