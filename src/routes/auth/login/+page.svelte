<script lang="ts">
	import { page } from '$app/state';
	import { authClient } from '$lib/auth-client';
	import Icon from '$lib/components/Icon.svelte';

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);
	let showPassword = $state(false);

	function getErrorMessage(err: unknown): string {
		if (typeof err === 'string') return err;
		if (
			err &&
			typeof err === 'object' &&
			'message' in err &&
			typeof (err as { message: unknown }).message === 'string'
		) {
			return (err as { message: string }).message;
		}
		return 'Login fallito. Riprova.';
	}

	async function login(e: SubmitEvent) {
		e.preventDefault();
		error = '';
		loading = true;
		try {
			const result = await authClient.signIn.email({ email, password });
			if (result && 'error' in result && result.error) {
				error = getErrorMessage(result.error);
				return;
			}
			const raw = page.url.searchParams.get('next') ?? '/';
			const next = /^\/[^/]/.test(raw) ? raw : '/';
			window.location.href = next;
		} catch (err) {
			error = getErrorMessage(err);
		} finally {
			loading = false;
		}
	}
</script>

<form onsubmit={login} class="form">
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
				autocomplete="current-password"
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
		{loading ? 'Entro…' : 'Entra'}
	</button>
	<p class="alt">
		Non hai un account? <a href="/auth/signup">Registrati</a>
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
