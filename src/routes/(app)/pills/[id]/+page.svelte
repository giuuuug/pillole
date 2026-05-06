<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Capsule from '$lib/components/Capsule.svelte';
	import GoUp from '$lib/components/GoUp.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import MathText from '$lib/components/MathText.svelte';
	import { formatPillNumber } from '$lib/domain/pill';
	import { formatDateLong } from '$lib/utils/format';
	import { paragraphsWithMath } from '$lib/utils/math';

	let { data } = $props();

	let paragraphs = $derived(paragraphsWithMath(data.pill.body));
	let firstParaIndex = $derived(paragraphs.findIndex((p) => p.display === null));

	let menuOpen = $state(false);
	let shareFeedback = $state('');

	function back() {
		if (typeof history !== 'undefined' && history.length > 1) history.back();
		else goto('/');
	}

	async function share() {
		if (typeof navigator === 'undefined') return;
		const title = data.pill.title;
		const text = `${title}\n\n${data.pill.body}`;
		const nav = navigator as Navigator & {
			share?: (data: { title?: string; text?: string; url?: string }) => Promise<void>;
			clipboard?: { writeText: (s: string) => Promise<void> };
		};
		try {
			if (typeof nav.share === 'function') {
				await nav.share({ title, text });
				return;
			}
			if (nav.clipboard) {
				await nav.clipboard.writeText(text);
				shareFeedback = 'Copiato negli appunti';
				setTimeout(() => (shareFeedback = ''), 1800);
			}
		} catch (err) {
			if ((err as DOMException)?.name === 'AbortError') return;
			shareFeedback = 'Impossibile condividere';
			setTimeout(() => (shareFeedback = ''), 1800);
		}
	}

	function toggleMenu() {
		menuOpen = !menuOpen;
	}

	function onDocClick(e: MouseEvent) {
		const t = e.target as HTMLElement | null;
		if (!t?.closest('.menu-wrap')) menuOpen = false;
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === 'Escape') menuOpen = false;
	}

	function edit() {
		menuOpen = false;
		goto(`/pills/${data.pill.id}/edit`);
	}

	function confirmDelete(e: SubmitEvent) {
		if (!confirm('Eliminare questa pillola? L’azione è irreversibile.')) {
			e.preventDefault();
		}
	}
</script>

<svelte:window onclick={onDocClick} onkeydown={onKey} />

<article class="detail">
	<header class="topbar">
		<button type="button" class="back" onclick={back}>
			<Icon name="back" size={20} />
			<span class="serif-italic">indietro</span>
		</button>
		<div class="actions">
			<form method="POST" action="?/toggleFavorite" use:enhance>
				<button
					type="submit"
					class="icon-btn"
					class:on={data.pill.favorite}
					aria-label={data.pill.favorite ? 'Togli dai preferiti' : 'Aggiungi ai preferiti'}
				>
					<Icon name="heart" size={18} filled={data.pill.favorite} />
				</button>
			</form>
			<button type="button" class="icon-btn" aria-label="Condividi" onclick={share}>
				<Icon name="share" size={18} />
			</button>
			<div class="menu-wrap">
				<button
					type="button"
					class="icon-btn"
					aria-label="Altro"
					aria-expanded={menuOpen}
					aria-haspopup="menu"
					onclick={toggleMenu}
				>
					<Icon name="more" size={18} />
				</button>
				{#if menuOpen}
					<div class="menu card-paper" role="menu">
						<button type="button" class="menu-item" role="menuitem" onclick={edit}>
							Modifica
						</button>
						<form
							method="POST"
							action="?/delete"
							use:enhance
							onsubmit={confirmDelete}
							class="menu-form"
						>
							<button type="submit" class="menu-item danger" role="menuitem"> Elimina </button>
						</form>
					</div>
				{/if}
			</div>
		</div>
		{#if shareFeedback}
			<div class="share-toast" role="status">{shareFeedback}</div>
		{/if}
	</header>

	<div class="article">
		<div class="meta">
			<div class="meta-left">
				<Capsule color={data.pill.category?.color ?? '#888'} size={16} />
				<span>{data.pill.category?.name ?? '—'}</span>
			</div>
			<span class="num serif-italic">№ {formatPillNumber(data.pill.number)}</span>
		</div>

		<h1 class="title serif">{data.pill.title}</h1>

		<p class="excerpt serif-italic">
			<MathText inline text={data.pill.excerpt} />
		</p>

		<div class="rule"></div>

		{#each paragraphs as para, i (i)}
			{#if para.display !== null}
				<MathText class="block-math" text={'$$' + para.display + '$$'} />
			{:else if para.text.trim().length > 0}
				<p class="para serif">
					{#if i === firstParaIndex && para.text.length > 0}
						<span class="dropcap serif">{para.text[0]}</span>
						<MathText inline text={para.text.slice(1)} />
					{:else}
						<MathText inline text={para.text} />
					{/if}
				</p>
			{/if}
		{/each}

		{#if data.pill.source}
			<aside class="source card-paper">
				<div class="eyebrow-strong">Fonte</div>
				<div class="source-text serif-italic">{data.pill.source}</div>
				{#if data.pill.sourceUrl}
					<a href={data.pill.sourceUrl} target="_blank" rel="noopener" class="source-link">
						<Icon name="link" size={12} />
						<span>vai alla fonte</span>
					</a>
				{/if}
			</aside>
		{/if}

		<footer class="foot">
			<Icon name="calendar" size={12} />
			<span>Salvata il {formatDateLong(data.pill.createdAt)}</span>
		</footer>
	</div>
</article>

<GoUp />

<style>
	.detail {
		min-height: 100dvh;
	}

	.topbar {
		position: sticky;
		top: 0;
		z-index: 10;
		background: var(--color-paper);
		padding: 14px 20px 12px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid var(--color-ink-border);
	}

	.back {
		background: none;
		border: none;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		color: var(--color-ink);
		padding: 8px 12px 8px 8px;
		margin-left: -8px;
		border-radius: 9999px;
		font-size: 14px;
		transition: background 0.15s ease;
	}

	.back:hover {
		background: var(--color-ink-border);
	}

	.actions {
		display: flex;
		gap: 6px;
	}

	.actions form {
		display: contents;
	}

	.icon-btn {
		background: transparent;
		border: 1px solid var(--color-ink-border);
		border-radius: 9999px;
		padding: 8px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-ink);
	}

	.icon-btn.on {
		background: color-mix(in srgb, var(--color-accent) 12%, transparent);
		border-color: var(--color-accent);
		color: var(--color-accent);
	}

	.article {
		padding: 28px 28px 60px;
	}

	.meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 11px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--color-ink-muted);
		font-weight: 600;
		margin-bottom: 22px;
	}

	.meta-left {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.num {
		text-transform: none;
		letter-spacing: 0.02em;
	}

	.title {
		font-size: 38px;
		line-height: 1.05;
		font-weight: 500;
		color: var(--color-ink);
		margin: 0 0 18px;
		letter-spacing: -0.022em;
		text-wrap: balance;
	}

	.excerpt {
		font-size: 19px;
		line-height: 1.5;
		color: var(--color-ink);
		opacity: 0.85;
		margin: 0 0 28px;
		letter-spacing: 0.005em;
		text-wrap: pretty;
	}

	.rule {
		width: 40px;
		height: 1px;
		background: var(--color-accent);
		margin: 0 0 28px;
	}

	.para {
		font-family: var(--font-serif);
		font-size: 17px;
		line-height: 1.65;
		color: var(--color-ink);
		margin: 0 0 18px;
		letter-spacing: 0.003em;
		text-wrap: pretty;
	}

	.dropcap {
		float: left;
		font-size: 56px;
		line-height: 0.85;
		font-weight: 500;
		color: var(--color-accent);
		padding-right: 8px;
		padding-top: 4px;
	}

	.article :global(.block-math) {
		margin: 0 0 18px;
	}

	.source {
		margin-top: 28px;
		padding: 14px 16px;
	}

	.source-text {
		font-size: 14px;
		line-height: 1.4;
		color: var(--color-ink);
		margin-top: 6px;
	}

	.source-link {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		margin-top: 8px;
		font-size: 12px;
		color: var(--color-accent);
		text-decoration: none;
		letter-spacing: 0.02em;
	}

	.source-link span {
		border-bottom: 1px solid color-mix(in srgb, var(--color-accent) 30%, transparent);
	}

	.foot {
		margin-top: 32px;
		padding-top: 18px;
		border-top: 1px solid var(--color-ink-border);
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 12px;
		color: var(--color-ink-subtle);
		letter-spacing: 0.02em;
	}

	.menu-wrap {
		position: relative;
		display: inline-flex;
	}

	.menu {
		position: absolute;
		top: calc(100% + 8px);
		right: 0;
		min-width: 160px;
		padding: 4px;
		display: flex;
		flex-direction: column;
		z-index: 20;
		animation: menu-in 0.12s ease-out;
	}

	@keyframes menu-in {
		from {
			opacity: 0;
			transform: translateY(-4px) scale(0.97);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	.menu-form {
		display: contents;
	}

	.menu-item {
		display: block;
		width: 100%;
		text-align: left;
		background: transparent;
		border: none;
		padding: 10px 14px;
		border-radius: 3px;
		font-size: 14px;
		color: var(--color-ink);
		cursor: pointer;
		font-family: var(--font-serif);
		font-style: italic;
		letter-spacing: 0.01em;
		transition: background 0.1s ease;
	}

	.menu-item:hover {
		background: color-mix(in srgb, var(--color-ink) 6%, transparent);
	}

	.menu-item.danger {
		color: #b85c5c;
		border-top: 1px solid var(--color-ink-border);
		margin-top: 2px;
	}

	.share-toast {
		position: absolute;
		bottom: -36px;
		right: 20px;
		background: var(--color-ink);
		color: var(--color-paper);
		padding: 6px 12px;
		border-radius: 9999px;
		font-size: 12px;
		letter-spacing: 0.02em;
		box-shadow: 0 8px 24px rgba(26, 31, 46, 0.18);
	}
</style>
