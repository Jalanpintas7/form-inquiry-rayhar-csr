<script>
	import favicon from '$lib/assets/favicon.svg';
	import brandLogo from '$lib/assets/logorayharsvg.svg';
	
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
	<!-- Preload logo untuk mencegah FOUC -->
	<link rel="preload" href={brandLogo} as="image" />
	<script src="https://cdn.tailwindcss.com"></script>
	<script>
		tailwind.config = {
			theme: {
				extend: {
					colors: {
						'rayhar': {
							50: '#f3e8ff',
							100: '#e9d5ff',
							200: '#d8b4fe',
							300: '#c084fc',
							400: '#a855f7',
							500: '#9333ea',
							600: '#942392',
							700: '#942392',
							800: '#942392',
							900: '#942392',
						}
					},
					fontFamily: {
						'poppins': ['Poppins', 'system-ui', 'sans-serif'],
					}
				}
			}
		}
			</script>
			<style>
		:global(html), :global(body) {
			margin: 0;
			padding: 0;
			font-family: 'Poppins', system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
			background: #f7f7fb;
			color: #1f2937;
		}
		
		/* Mencegah FOUC pada logo */
		:global(header img) {
			width: auto !important;
			height: 48px !important;
			max-width: 192px !important;
			object-fit: contain !important;
			display: block !important;
			/* Mencegah layout shift */
			min-height: 48px !important;
			/* Mencegah logo membesar */
			flex-shrink: 0 !important;
		}
		
		@media (min-width: 640px) {
			:global(header img) {
				height: 56px !important;
				min-height: 56px !important;
			}
		}
		
		/* Memastikan logo tidak membesar saat loading */
		:global(header img:not([src])) {
			visibility: hidden;
		}
		
		/* Fallback untuk mencegah logo membesar sebelum Tailwind dimuat */
		:global(header img[src*="logorayharsvg"]) {
			width: auto !important;
			height: 48px !important;
			max-width: 192px !important;
		}
		
		@media (min-width: 640px) {
			:global(header img[src*="logorayharsvg"]) {
				height: 56px !important;
			}
		}
		
		/* Fallback untuk header sebelum Tailwind dimuat */
		:global(header) {
			position: sticky;
			top: 0;
			z-index: 10;
			background-color: #942392;
			box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
		}
		
		:global(.header-container) {
			max-width: 1000px;
			margin: 0 auto;
			padding: 0 16px;
			box-sizing: border-box;
			height: 56px;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		
		@media (min-width: 640px) {
			:global(.header-container) {
				padding: 0 24px;
				height: 64px;
			}
		}
	</style>
</svelte:head>

<header class="sticky top-0 z-10 bg-[#942392] shadow-sm">
	<div class="header-container max-w-[1000px] mx-auto px-4 sm:px-6 box-border h-14 sm:h-16 flex items-center justify-center">
		<img src={brandLogo} alt="Logo" class="h-12 sm:h-14 max-h-14 max-w-48 object-contain" />
	</div>
</header>

<main class="min-h-[calc(100svh-56px)] sm:min-h-[calc(100svh-72px)] flex flex-col">
	<div class="flex-1">
		{@render children?.()}
	</div>
	<footer class="mt-auto text-center text-gray-600">
		<div class="py-3 sm:py-4 bg-gray-50">
			<div class="max-w-[1000px] mx-auto px-4 sm:px-6">
				<small class="text-xs sm:text-sm">Hak Cipta © 2025 Rayhar Hak Cipta Terpelihara.</small>
			</div>
		</div>
	</footer>
</main>
