<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client';
	import Icon from '$lib/components/Icon.svelte';

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);
	let showPassword = $state(false);

	function getErrorMessage(err: unknown): string {
		if (typeof err === 'string') return err;
		if (err && typeof err === 'object') {
			const m = 'message' in err ? (err as { message?: unknown }).message : undefined;
			if (typeof m === 'string') return m;
		}
		return 'Registrazione fallita. Riprova.';
	}

	async function signup(e: SubmitEvent) {
		e.preventDefault();
		error = '';
		loading = true;
		try {
			const result = await authClient.signUp.email({ email, password, name });
			if (result && 'error' in result && result.error) {
				error = getErrorMessage(result.error);
				return;
			}
			await goto('/');
		} catch (err) {
			error = getErrorMessage(err);
		} finally {
			loading = false;
		}
	}
</script>

<form onsubmit={signup} class="form">
	<label class="field">
		<span class="eyebrow-strong">Nome</span>
		<input type="text" bind:value={name} required autocomplete="name" />
	</label>
	<label class="field">
		<span class="eyebrow-strong">Email</span>
		<input type="email" bind:value={email} required autocomplete="email" />
	</label>
	<label class="field">
		<span class="eyebrow-strong">Password</span>
		<div class="input-wrap">
			<input
				type={showPassword ? 'text' : 'password'}
				bind:value={password}
				required
				minlength="8"
				autocomplete="new-password"
			/>
			<button
				type="button"
				class="toggle"
				aria-label={showPassword ? 'Nascondi password' : 'Mostra password'}
				onclick={() => (showPassword = !showPassword)}
			>
				<Icon name={showPassword ? 'eye-off' : 'eye'} size={18} />
			</button>
		</div>
	</label>
	{#if error}
		<p class="error">{error}</p>
	{/if}
	<button type="submit" class="btn-accent" disabled={loading}>
		{loading ? 'Creazione…' : 'Crea account'}
	</button>
	<p class="alt">
		Hai già un account? <a href="/auth/login">Entra</a>
	</p>
</form>

<style>
	.form {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.field input {
		padding: 12px 14px;
		border-radius: 6px;
		border: 1px solid var(--color-ink-border);
		background: transparent;
		font-size: 15px;
		color: var(--color-ink);
		font-family: var(--font-serif);
		font-style: italic;
		outline: none;
	}

	.field input:focus {
		border-color: var(--color-accent);
	}

	.input-wrap {
		display: flex;
		align-items: center;
		gap: 8px;
		position: relative;
	}

	.input-wrap input {
		flex: 1;
		padding-right: 40px;
	}

	.toggle {
		position: absolute;
		right: 10px;
		top: 50%;
		transform: translateY(-50%);
		background: none;
		border: none;
		cursor: pointer;
		color: var(--color-ink-muted);
		padding: 4px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.toggle:focus-visible {
		outline: none;
		box-shadow: none;
	}

	.error {
		margin: 0;
		font-size: 13px;
		color: #b85c5c;
	}

	.alt {
		text-align: center;
		font-size: 13px;
		color: var(--color-ink-muted);
		margin: 4px 0 0;
		font-family: var(--font-serif);
		font-style: italic;
	}

	.alt a {
		color: var(--color-accent);
		text-decoration: none;
		border-bottom: 1px solid color-mix(in srgb, var(--color-accent) 30%, transparent);
	}
</style>
