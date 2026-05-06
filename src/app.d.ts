// See https://svelte.dev/docs/kit/types#app.d.ts
import type { auth } from '$lib/auth';

type AuthSession = Awaited<ReturnType<typeof auth.api.getSession>>;

declare global {
	namespace App {
		interface Locals {
			session: AuthSession extends infer S | null ? S | null : null;
			user:
				| (NonNullable<AuthSession> extends { user: infer U } ? U : never)
				| null;
		}
		interface PageData {
			user: App.Locals['user'];
		}
	}
}

export {};
