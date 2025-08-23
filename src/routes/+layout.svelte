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
</svelte:head>

<header class="app-header">
	<div class="container header-inner">
		<img src={brandLogo} alt="Logo" class="logo" />
	</div>
	<div class="header-gradient"></div>
</header>

<main class="app-main">
	<div class="content">
		{@render children?.()}
	</div>
	<footer class="app-footer">
		<div class="footer-inner">
			<div class="container">
				<small>Hak Cipta © 2025 Rayhar Hak Cipta Terpelihara.</small>
			</div>
		</div>
	</footer>
	<div class="footer-bar"></div>
</main>

<style>
	:global(html), :global(body) {
		margin: 0;
		padding: 0;
		font-family: 'Poppins', system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
		color: #1f2937;
		background: #f7f7fb;
	}

	:root {
		--primary-600: #942392;
		--primary-700: #942392;
		--primary-800: #942392;
		--ring: 0 0 0 4px rgba(148, 35, 146, 0.18);
		--card-bg: #ffffff;
		--border: #e5e7eb;
		--header-total-height: 72px;
	}

	.container {
		max-width: 1000px;
		margin: 0 auto;
		padding: 0 24px;
		box-sizing: border-box;
	}

	.app-header {
		position: sticky;
		top: 0;
		z-index: 10;
		background: var(--primary-800);
		box-shadow: 0 1px 0 rgba(17, 24, 39, 0.05);
	}

	.header-inner {
		height: 64px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 56px;
		width: auto;
	}

	.header-gradient {
		height: 8px;
		background: linear-gradient(90deg, var(--primary-800), var(--primary-600));
		box-shadow: inset 0 -1px 0 rgba(255,255,255,0.2);
	}

	.app-main {
		min-height: calc(100svh - var(--header-total-height));
		display: flex;
		flex-direction: column;
	}

	.content {
		flex: 1 0 auto;
	}

	.app-footer { 
		color: #6b7280; 
		margin-top: auto; 
		text-align: center;
	}

	.footer-inner {
		padding: 16px 0;
		border-top: 1px solid var(--border);
		background: #fafafa;
	}

	.footer-bar {
		height: 8px;
		background: #e5e7eb;
	}


</style>
