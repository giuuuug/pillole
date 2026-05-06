<script lang="ts">
	import { deserialize } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import GoUp from '$lib/components/GoUp.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import PillEditor from '$lib/components/PillEditor.svelte';
	import type { Category } from '$lib/domain/category';

	let { data } = $props();

	let title = $state('');
	let body = $state('');
	let categoryId = $state<string | null>(null);
	let source = $state('');
	let sourceUrl = $state('');

	let showNewCat = $state(false);
	let newCatName = $state('');
	let newCatColor = $state<string>('#7B6FA8');
	let creatingCat = $state(false);
	let catError = $state('');

	let categories = $state<Category[]>([]);
	let initialized = $state(false);
	$effect(() => {
		if (initialized) return;
		title = data.pill.title;
		body = data.pill.body;
		categoryId = data.pill.category?.id ?? null;
		source = data.pill.source ?? '';
		sourceUrl = data.pill.sourceUrl ?? '';
		newCatColor = data.palette[0] ?? '#7B6FA8';
		categories = [...data.categories];
		initialized = true;
	});

	let saving = $state(false);
	let saveError = $state('');

	let canSave = $derived(title.trim().length > 0 && body.trim().length > 0 && !!categoryId);

	async function createCategory() {
		const name = newCatName.trim();
		if (!name) return;
		creatingCat = true;
		catError = '';
		try {
			const fd = new FormData();
			fd.set('name', name);
			fd.set('color', newCatColor);
			const res = await fetch('?/createCategory', {
				method: 'POST',
				body: fd,
				headers: { 'x-sveltekit-action': 'true' }
			});
			const result = deserialize(await res.text());
			if (result.type === 'success') {
				const cat = (result.data as { category?: Category } | undefined)?.category;
				if (cat) {
					if (!categories.find((c) => c.id === cat.id)) categories = [...categories, cat];
					categoryId = cat.id;
				}
				showNewCat = false;
				newCatName = '';
			} else if (result.type === 'failure') {
				catError = (result.data as { error?: string } | undefined)?.error ?? 'Errore.';
			}
		} catch {
			catError = 'Errore di rete.';
		} finally {
			creatingCat = false;
		}
	}

	async function save(e: SubmitEvent) {
		e.preventDefault();
		saveError = '';
		saving = true;
		try {
			const fd = new FormData();
			fd.set('title', title.trim());
			fd.set('body', body.trim());
			fd.set('categoryId', categoryId ?? '');
			fd.set('source', source.trim());
			fd.set('sourceUrl', sourceUrl.trim());
			const res = await fetch('?/update', {
				method: 'POST',
				body: fd,
				headers: { 'x-sveltekit-action': 'true' }
			});
			const result = deserialize(await res.text());
			if (result.type === 'redirect') {
				await invalidateAll();
				await goto(result.location);
				return;
			}
			if (result.type === 'failure') {
				saveError = (result.data as { error?: string } | undefined)?.error ?? 'Errore.';
				return;
			}
			if (result.type === 'success') {
				await invalidateAll();
				await goto(`/pills/${data.pill.id}`);
			}
		} catch {
			saveError = 'Errore di rete.';
		} finally {
			saving = false;
		}
	}

	async function close() {
		if (window.history.length > 1) {
			window.history.back();
			return;
		}
		await goto(`/pills/${data.pill.id}`);
	}
</script>

<form onsubmit={save} class="composer">
	<header class="topbar">
		<button type="button" class="close" onclick={close} aria-label="Chiudi">
			<Icon name="close" size={22} />
		</button>
		<div class="step-label eyebrow-strong">Modifica pillola</div>
		<button type="submit" class="next btn-accent" disabled={!canSave || saving}>
			{saving ? 'Salvo…' : 'Salva'}
		</button>
	</header>

	<div class="body">
		<input
			type="text"
			bind:value={title}
			placeholder="Titolo della pillola"
			class="title-input serif"
		/>

		<div class="editor-wrap">
			<PillEditor
				bind:value={body}
				onChange={(t) => (body = t)}
				placeholder="Scrivi il corpo della pillola..."
			/>
		</div>

		<div class="field">
			<div class="eyebrow-strong">Categoria *</div>
			<div class="cat-chips">
				{#each categories as c (c.id)}
					<button
						type="button"
						class="cat-chip"
						class:active={categoryId === c.id}
						style:--cat-color={c.color}
						onclick={() => {
							categoryId = c.id;
							showNewCat = false;
						}}
					>
						<span class="cat-dot" style:background={c.color}></span>
						{c.name}
					</button>
				{/each}
				<button
					type="button"
					class="cat-chip dashed"
					class:active={showNewCat}
					onclick={() => (showNewCat = !showNewCat)}
				>
					+ nuova
				</button>
			</div>

			{#if showNewCat}
				<div class="new-cat card-paper">
					<div class="eyebrow-strong">Nome nuova categoria</div>
					<input
						bind:value={newCatName}
						type="text"
						placeholder="es. Astronomia"
						class="cat-name serif-italic"
					/>
					<div class="eyebrow-strong">Colore</div>
					<div class="palette">
						{#each data.palette as col (col)}
							<button
								type="button"
								class="swatch"
								class:on={newCatColor === col}
								style:background={col}
								onclick={() => (newCatColor = col)}
								aria-label={col}
							></button>
						{/each}
					</div>
					{#if catError}
						<p class="error">{catError}</p>
					{/if}
					<button
						type="button"
						class="btn-accent create-cat"
						disabled={!newCatName.trim() || creatingCat}
						onclick={createCategory}
					>
						{creatingCat ? 'Creo…' : 'Crea categoria'}
					</button>
				</div>
			{/if}
		</div>

		<div class="field">
			<div class="eyebrow-strong">Fonte</div>
			<input
				bind:value={source}
				type="text"
				placeholder="Libro, articolo, autore…"
				class="meta-input card-paper serif-italic"
			/>
			<input
				bind:value={sourceUrl}
				type="url"
				placeholder="URL (opzionale)"
				class="meta-input card-paper"
			/>
		</div>

		{#if saveError}
			<p class="error">{saveError}</p>
		{/if}
	</div>
</form>

<GoUp />

<style>
	.composer {
		display: flex;
		flex-direction: column;
		min-height: 100dvh;
		background: var(--color-paper);
	}

	.topbar {
		padding: 14px 20px 12px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid var(--color-ink-border);
		gap: 12px;
		position: sticky;
		top: 0;
		z-index: 10;
		background: var(--color-paper);
	}

	.close {
		background: none;
		border: none;
		cursor: pointer;
		color: var(--color-ink);
		padding: 0;
		display: flex;
		align-items: center;
	}

	.step-label {
		flex: 1;
		text-align: center;
	}

	.next {
		padding: 6px 14px;
		font-size: 13px;
	}

	.body {
		flex: 1;
		padding: 24px 24px 40px;
	}

	.title-input {
		width: 100%;
		box-sizing: border-box;
		border: none;
		border-bottom: 1px solid var(--color-ink-border);
		outline: none;
		background: transparent;
		padding: 12px 14px;
		font-size: 24px;
		font-weight: 500;
		color: var(--color-ink);
		letter-spacing: -0.012em;
	}

	.title-input:focus,
	.title-input:focus-visible {
		outline: none;
		box-shadow: none;
	}

	.editor-wrap {
		margin-top: 20px;
	}

	.field {
		margin-top: 24px;
	}

	.field .eyebrow-strong {
		margin-bottom: 10px;
	}

	.cat-chips {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}

	.cat-chip {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 12px;
		padding: 6px 12px;
		border-radius: 9999px;
		border: 1px solid var(--color-ink-border);
		background: transparent;
		color: var(--color-ink);
		cursor: pointer;
		font-weight: 500;
		letter-spacing: 0.02em;
	}

	.cat-chip.active {
		border-color: var(--cat-color, var(--color-accent));
		background: color-mix(in srgb, var(--cat-color, var(--color-accent)) 12%, transparent);
		color: var(--cat-color, var(--color-accent));
	}

	.cat-chip.dashed {
		border-style: dashed;
		font-style: italic;
		color: var(--color-ink-muted);
	}

	.cat-chip.dashed.active {
		color: var(--color-accent);
		border-color: var(--color-accent);
	}

	.cat-dot {
		width: 8px;
		height: 8px;
		border-radius: 9999px;
	}

	.new-cat {
		margin-top: 12px;
		padding: 14px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.cat-name,
	.meta-input {
		width: 100%;
		box-sizing: border-box;
		padding: 10px 14px;
		border-radius: 4px;
		border: 1px solid var(--color-ink-border);
		background: transparent;
		color: var(--color-ink);
		outline: none;
		font-size: 14px;
		font-family: var(--font-serif);
	}

	.cat-name:focus,
	.cat-name:focus-visible,
	.meta-input:focus,
	.meta-input:focus-visible {
		outline: none;
		box-shadow: none;
		border-color: var(--color-ink-border);
	}

	.meta-input {
		margin-bottom: 8px;
	}

	.palette {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.swatch {
		width: 26px;
		height: 26px;
		border-radius: 9999px;
		cursor: pointer;
		border: 2px solid transparent;
		padding: 0;
	}

	.swatch.on {
		border-color: var(--color-ink);
	}

	.create-cat {
		width: 100%;
	}

	.error {
		color: #b85c5c;
		font-size: 13px;
		margin: 8px 0 0;
	}
</style>
