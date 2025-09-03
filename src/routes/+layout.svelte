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
			
			/* Pastikan logo tidak membesar saat loading */
			header img {
				max-width: 125px !important;
				height: auto !important;
				object-fit: contain;
			}
			
			/* Fix form shifting issue - CSS fallback sebelum Tailwind load */
			:global(.form-container) {
				max-width: 720px !important;
				margin-left: auto !important;
				margin-right: auto !important;
			}
			
			:global(.loading-container) {
				display: flex !important;
				align-items: center !important;
				justify-content: center !important;
				padding: 2rem !important;
			}
			
			:global(.loading-spinner) {
				text-align: center !important;
			}
			
			:global(.loading-spinner .spinner) {
				animation: spin 1s linear infinite !important;
				border-radius: 50% !important;
				height: 2rem !important;
				width: 2rem !important;
				border-bottom: 2px solid #942392 !important;
				margin: 0 auto 1rem auto !important;
			}
			
			@keyframes spin {
				to { transform: rotate(360deg); }
			}
		</style>
</svelte:head>

<header class="sticky top-0 z-10 bg-[#942392] shadow-sm">
	<div class="max-w-[1000px] mx-auto px-4 sm:px-6 box-border h-14 sm:h-16 flex items-center justify-center">
		<img src={brandLogo} alt="Logo" class="h-8 sm:h-10 w-auto max-w-[200px]" />
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
