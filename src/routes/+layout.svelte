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

		<!-- Critical CSS for logo to prevent flash -->
		<style>
			.brand-logo {
				width: 192px;
				height: 48px;
				max-width: 192px;
				max-height: 56px;
				object-fit: contain;
			}
			@media (min-width: 640px) {
				.brand-logo {
					height: 56px;
				}
			}
		</style>

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

			/* Prevent SVG intrinsic sizing - more targeted approach */
			:global(.brand-logo svg) {
				width: 100%;
				height: 100%;
				max-width: 100%;
				max-height: 100%;
			}

			/* Custom animations for smooth loading experience */
			@keyframes smooth-spin {
				from { transform: rotate(0deg); }
				to { transform: rotate(360deg); }
			}

			@keyframes gentle-bounce {
				0%, 20%, 53%, 80%, 100% { transform: translate3d(0, 0, 0); }
				40%, 43% { transform: translate3d(0, -8px, 0); }
				70% { transform: translate3d(0, -4px, 0); }
				90% { transform: translate3d(0, -2px, 0); }
			}

			:global(.smooth-spin) {
				animation: smooth-spin 1s linear infinite;
			}

			:global(.gentle-bounce) {
				animation: gentle-bounce 2s ease-in-out infinite;
			}

			/* Smooth transitions for form appearance */
			:global(.animate-in) {
				animation-fill-mode: both;
			}

			:global(.fade-in-0) {
				animation-name: fade-in;
			}

			:global(.slide-in-from-bottom-4) {
				animation-name: slide-in-from-bottom;
			}

			:global(.slide-in-from-top-4) {
				animation-name: slide-in-from-top;
			}

			:global(.duration-500) {
				animation-duration: 500ms;
			}

			@keyframes fade-in {
				from { opacity: 0; }
				to { opacity: 1; }
			}

			@keyframes slide-in-from-bottom {
				from { transform: translateY(1rem); opacity: 0; }
				to { transform: translateY(0); opacity: 1; }
			}

			@keyframes slide-in-from-top {
				from { transform: translateY(-1rem); opacity: 0; }
				to { transform: translateY(0); opacity: 1; }
			}

			/* Ensure main content is properly centered */
			:global(main) {
				display: flex;
				flex-direction: column;
				min-height: calc(100svh - 56px);
			}

			@media (min-width: 640px) {
				:global(main) {
					min-height: calc(100svh - 64px);
				}
			}

			/* Ensure proper centering of page content */
			:global(main > div) {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				padding: 1rem;
			}
		</style>
</svelte:head>

<header class="sticky top-0 z-10 bg-[#942392] shadow-sm">
	<div class="max-w-[1000px] mx-auto px-4 sm:px-6 box-border h-14 sm:h-16 flex items-center justify-center">
		<img
			src={brandLogo}
			alt="Logo"
			width="192"
			height="56"
			class="brand-logo h-12 sm:h-14 max-h-14 max-w-48 object-contain"
		/>
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
