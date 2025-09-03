<script>
	import favicon from '$lib/assets/favicon.svg';
	import brandLogo from '$lib/assets/logorayharsvg.svg';
	
	let { children } = $props();
</script>

<svelte:head>
		<link rel="icon" href={favicon} />
		<link rel="preconnect" href="https://fonts.googleapis.com" />
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
		<link rel="preconnect" href="https://cdn.tailwindcss.com" />
		<link rel="preload" href={brandLogo} as="image" type="image/svg+xml" />
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

			/* Fix logo flash issue - ensure proper sizing before Tailwind loads */
			:global(.brand-logo) {
				height: 48px !important; /* h-12 = 48px */
				max-height: 56px !important; /* max-h-14 = 56px */
				max-width: 192px !important; /* max-w-48 = 192px */
				width: auto !important;
				object-fit: contain !important;
			}

			/* Responsive sizing for larger screens */
			@media (min-width: 640px) {
				:global(.brand-logo) {
					height: 56px !important; /* sm:h-14 = 56px */
				}
			}

			/* Reset SVG sizing to prevent intrinsic dimensions */
			:global(.brand-logo svg) {
				width: 100% !important;
				height: 100% !important;
				max-width: 100% !important;
				max-height: 100% !important;
			}

			/* Additional SVG reset for all images to prevent FOUC */
			:global(img) {
				max-width: 100%;
				height: auto;
			}

			/* Ensure header is properly sized from the start */
			:global(header) {
				position: sticky;
				top: 0;
				z-index: 10;
				background-color: #942392;
				box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
			}

			:global(header div) {
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
				:global(header div) {
					padding: 0 24px;
					height: 64px;
				}
			}
		</style>
</svelte:head>

<header class="sticky top-0 z-10 bg-[#942392] shadow-sm">
	<div class="max-w-[1000px] mx-auto px-4 sm:px-6 box-border h-14 sm:h-16 flex items-center justify-center">
		<img src={brandLogo} alt="Logo" class="brand-logo h-12 sm:h-14 max-h-14 max-w-48 object-contain" />
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
