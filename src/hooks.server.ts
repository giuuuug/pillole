import { auth } from '$lib/auth';
import { building } from '$app/environment';
import { redirect, type Handle } from '@sveltejs/kit';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { sequence } from '@sveltejs/kit/hooks';

const PUBLIC_ROUTES = ['/auth/login', '/auth/signup'];
const PUBLIC_API_PREFIX = '/api/auth';

const sessionHandle: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({ headers: event.request.headers });
	event.locals.session = session ?? null;
	event.locals.user = session?.user ?? null;

	const path = event.url.pathname;
	const isPublic = PUBLIC_ROUTES.includes(path) || path.startsWith(PUBLIC_API_PREFIX);
	if (!event.locals.user && !isPublic) {
		throw redirect(303, `/auth/login?next=${encodeURIComponent(path)}`);
	}
	if (event.locals.user && (path === '/auth/login' || path === '/auth/signup')) {
		throw redirect(303, '/');
	}
	return resolve(event);
};

const authHandle: Handle = async ({ event, resolve }) => {
	return svelteKitHandler({ event, resolve, auth, building });
};

export const handle = sequence(authHandle, sessionHandle);
