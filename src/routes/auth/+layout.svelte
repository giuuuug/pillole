<script lang="ts">
	let { children } = $props();
</script>

<div class="auth-shell">
	<div class="auth-card">
		<div class="brand">
			<div class="kicker eyebrow">Pillole</div>
			<div class="title serif-italic">di conoscienza</div>
		</div>
		{@render children()}
	</div>
</div>

<style>
	.auth-shell {
		min-height: 100dvh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 24px;
		background:
			radial-gradient(ellipse at top, #ebe5d3 0%, #d8cfb7 70%);
	}

	.auth-card {
		width: 100%;
		max-width: 420px;
		background: var(--color-paper-card);
		border: 1px solid var(--color-ink-border);
		border-radius: 12px;
		padding: 32px 28px;
		box-shadow:
			0 1px 0 rgba(26, 31, 46, 0.04),
			0 12px 32px rgba(26, 31, 46, 0.08);
	}

	.brand {
		text-align: center;
		margin-bottom: 28px;
	}

	.kicker {
		margin-bottom: 6px;
	}

	.title {
		font-size: 32px;
		line-height: 1;
		letter-spacing: -0.02em;
		color: var(--color-ink);
	}
</style>
