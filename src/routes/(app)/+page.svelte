<script lang="ts">
	import Capsule from '$lib/components/Capsule.svelte';
	import GoUp from '$lib/components/GoUp.svelte';
	import { formatPillNumber } from '$lib/domain/pill';
	import { formatDateShort, formatToday } from '$lib/utils/format';

	let { data } = $props();

	let today = $derived(formatToday());
</script>

<section class="home">
	<header class="kicker-row">
		<span class="eyebrow">{today}</span>
		<span class="eyebrow">№ {String(data.totalCount).padStart(3, '0')}</span>
	</header>

	<div class="divider"></div>

	<div class="masthead">
		<div class="title-line headline">Pillole</div>
	</div>

	{#if data.daily}
		<div class="daily-section">
			<div class="daily-eyebrow">
				<span>Pillola del giorno</span>
			</div>

			<a href="/pills/{data.daily.id}" class="daily-card card-paper">
				<div class="num serif">№ {formatPillNumber(data.daily.number)}</div>
				<div class="meta">
					<Capsule color={data.daily.category?.color ?? '#888'} size={18} />
					<span class="cat">{data.daily.category?.name ?? '—'}</span>
				</div>
				<h2 class="daily-title serif">{data.daily.title}</h2>
				<p class="daily-excerpt serif">{data.daily.excerpt}</p>
				<footer class="daily-foot">
					<span>Leggi →</span>
					<span>{formatDateShort(data.daily.createdAt)}</span>
				</footer>
			</a>
		</div>
	{:else}
		<div class="empty">
			<p class="serif-italic">Nessuna pillola archiviata.<br />Inizia toccando il «+».</p>
		</div>
	{/if}
</section>

<GoUp bottomOffset={120} />

<style>
	.home {
		padding: 14px var(--screen-pad, 24px) 60px;
	}

	.kicker-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.divider {
		margin: 10px 0 24px;
	}

	.masthead {
		padding: 0 0 28px;
	}

	.title-line {
		font-size: 56px;
		line-height: 0.92;
		letter-spacing: -0.027em;
	}

	.daily-section {
		padding-bottom: 32px;
	}

	.daily-eyebrow {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 11px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--color-accent);
		font-weight: 600;
		margin-bottom: 14px;
	}

	.daily-card {
		display: flex;
		flex-direction: column;
		padding: 24px 22px;
		text-decoration: none;
		color: inherit;
		position: relative;
		gap: 12px;
	}

	.num {
		position: absolute;
		top: 18px;
		right: 22px;
		font-size: 11px;
		letter-spacing: 0.12em;
		color: var(--color-ink-subtle);
		font-variant-numeric: tabular-nums;
	}

	.meta {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.cat {
		font-size: 11px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-ink-muted);
		font-weight: 600;
	}

	.daily-title {
		font-size: 28px;
		line-height: 1.1;
		font-weight: 500;
		letter-spacing: -0.013em;
		color: var(--color-ink);
		margin: 4px 0 0;
		text-wrap: balance;
	}

	.daily-excerpt {
		font-size: 16px;
		line-height: 1.55;
		color: var(--color-ink);
		opacity: 0.78;
		margin: 0;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.daily-foot {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 6px;
		padding-top: 16px;
		border-top: 1px solid var(--color-ink-border);
		font-size: 12px;
		color: var(--color-ink-muted);
		letter-spacing: 0.02em;
	}

	.empty {
		text-align: center;
		padding: 60px 0;
		color: var(--color-ink-muted);
		font-size: 16px;
	}

	@media (max-width: 380px) {
		.home {
			--screen-pad: 18px;
		}

		.title-line {
			font-size: 44px;
		}

		.daily-title {
			font-size: 24px;
		}

		.daily-card {
			padding: 20px 18px;
		}
	}
</style>
