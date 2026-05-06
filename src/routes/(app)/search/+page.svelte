<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import GoUp from '$lib/components/GoUp.svelte';
	import { formatPillNumber } from '$lib/domain/pill';

	let { data } = $props();

	type Period = 'any' | 'week' | 'month';

	let query = $state('');
	let activeCat = $state<string | null>(null);
	let period = $state<Period>('any');

	let allCats = $derived([
		...new Set(data.pills.map((p) => p.category?.name).filter(Boolean) as string[])
	]);

	let results = $derived.by(() => {
		let r = data.pills;
		if (query) {
			const q = query.toLowerCase();
			r = r.filter(
				(p) =>
					p.title.toLowerCase().includes(q) ||
					p.excerpt.toLowerCase().includes(q) ||
					p.body.toLowerCase().includes(q)
			);
		}
		if (activeCat) r = r.filter((p) => p.category?.name === activeCat);
		if (period !== 'any') {
			const cutoff = new Date();
			if (period === 'week') cutoff.setDate(cutoff.getDate() - 7);
			if (period === 'month') cutoff.setMonth(cutoff.getMonth() - 1);
			r = r.filter((p) => new Date(p.createdAt) >= cutoff);
		}
		return r;
	});

	let hasFilters = $derived(query.length > 0 || activeCat !== null || period !== 'any');

	function reset() {
		query = '';
		activeCat = null;
		period = 'any';
	}
</script>

<section class="search">
	<div class="masthead">
		<div class="title-line headline">Cerca</div>
	</div>

	<div class="search-input card-paper">
		<input bind:value={query} type="text" placeholder="Parola, concetto, autore…" />
	</div>

	<div class="filters">
		<div class="filter-row">
			<div class="filter-label eyebrow-strong">Categoria</div>
			<div class="chips">
				{#each allCats as c (c)}
					<button
						type="button"
						class="chip"
						aria-pressed={activeCat === c}
						onclick={() => (activeCat = activeCat === c ? null : c)}
					>
						{c}
					</button>
				{/each}
			</div>
		</div>

		<div class="filter-row">
			<div class="filter-label eyebrow-strong">Periodo</div>
			<div class="chips">
				{#each [{ id: 'any' as Period, l: 'Sempre' }, { id: 'week' as Period, l: 'Settimana' }, { id: 'month' as Period, l: 'Mese' }] as d (d.id)}
					<button
						type="button"
						class="chip"
						aria-pressed={period === d.id}
						onclick={() => (period = d.id)}
					>
						{d.l}
					</button>
				{/each}
			</div>
		</div>
	</div>

	<div class="divider"></div>

	<div class="result-bar">
		<div class="eyebrow-strong">{results.length} risultat{results.length === 1 ? 'o' : 'i'}</div>
		{#if hasFilters}
			<button type="button" class="reset" onclick={reset}>Azzera</button>
		{/if}
	</div>

	<div class="body">
		{#if results.length === 0}
			<div class="empty serif-italic">Niente da cercare.</div>
		{:else}
			{#each results as p, i (p.id)}
				<a href="/pills/{p.id}" class="row" class:first={i === 0}>
					<div class="num serif">№ {formatPillNumber(p.number)}</div>
					<div class="content">
						<div class="meta">
							<span class="dot" style:background={p.category?.color ?? '#888'}></span>
							<span class="cat">{p.category?.name ?? '—'}</span>
						</div>
						<div class="title serif">{p.title}</div>
					</div>
				</a>
			{/each}
		{/if}
	</div>
</section>

<GoUp bottomOffset={120} />

<style>
	.search {
		padding: 22px var(--screen-pad, 24px) 60px;
	}

	.masthead {
		margin: 0 0 10px;
	}

	.body {
		padding: 0 var(--screen-pad, 24px);
	}

	@media (max-width: 380px) {
		.search {
			--screen-pad: 18px;
		}
	}

	.search-input {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 10px 4px;
		color: var(--color-ink);
		min-height: 44px;
		border-radius: 25px;
	}

	.search-input :global(svg) {
		display: block;
	}

	.search-input input {
		flex: 1;
		border: none;
		outline: none;
		background: transparent;
		font-family: var(--font-serif);
		font-size: 16px;
		color: var(--color-ink);
		font-style: italic;
		min-height: 24px;
		line-height: 1.2;
	}

	.search-input input:focus-visible {
		outline: none;
		box-shadow: none;
	}

	.filters {
		margin-top: 18px;
	}

	.filter-row {
		margin-bottom: 12px;
	}

	.filter-label {
		font-size: 10px;
		margin-bottom: 8px;
	}

	.chips {
		display: flex;
		flex-wrap: nowrap;
		gap: 6px;
		overflow-x: auto;
		margin: 4px 0 10px;
		padding: 4px 0 10px;
		-webkit-overflow-scrolling: touch;
	}
	.chip {
		font-size: 11px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		font-weight: 600;
		flex-shrink: 0;
		border-color: var(--color-ink-border);
		background: var(--color-paper-card);
		color: var(--color-ink-muted);
	}

	.chip[aria-pressed='true'] {
		border-color: var(--color-accent);
		background: color-mix(in srgb, var(--color-accent) 8%, var(--color-paper));
		color: var(--color-accent);
	}

	.divider {
		margin: 20px 0 16px;
	}

	.result-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 16px;
		margin-bottom: 12px;
		min-height: 32px;
	}

	.reset {
		background: none;
		border: none;
		cursor: pointer;
		font-size: 12px;
		color: var(--color-accent);
		padding: 6px 10px;
		margin-right: -10px;
		border-radius: 6px;
		font-weight: 600;
		letter-spacing: 0.04em;
		flex-shrink: 0;
	}

	.reset:hover {
		background: color-mix(in srgb, var(--color-accent) 8%, transparent);
	}

	.empty {
		padding: 40px 0;
		text-align: center;
		color: var(--color-ink-muted);
		font-size: 16px;
	}

	.row {
		display: flex;
		gap: 14px;
		padding: 14px 0;
		border-bottom: 1px solid var(--color-ink-border);
		text-decoration: none;
		color: inherit;
	}

	.row.first {
		border-top: 1px solid var(--color-ink-border);
	}

	.num {
		font-size: 12px;
		color: var(--color-ink-subtle);
		padding-top: 3px;
		font-variant-numeric: tabular-nums;
		min-width: 38px;
	}

	.content {
		flex: 1;
	}

	.meta {
		display: flex;
		align-items: center;
		gap: 6px;
		margin-bottom: 4px;
	}

	.dot {
		width: 6px;
		height: 6px;
		border-radius: 9999px;
	}

	.cat {
		font-size: 10px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-ink-muted);
		font-weight: 600;
	}

	.title {
		font-size: 17px;
		line-height: 1.2;
		font-weight: 500;
		letter-spacing: -0.01em;
		color: var(--color-ink);
		text-wrap: balance;
	}

	.title-line {
		font-size: 56px;
		line-height: 0.92;
		letter-spacing: -0.027em;
	}

	@media (max-width: 380px) {
		.title-line {
			font-size: 44px;
		}
	}
</style>
