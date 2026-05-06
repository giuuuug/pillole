import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { pillService } from '$lib/server/services/pill-service';

const PILL_PAGES = new Set(['/', '/library', '/search', '/profile']);

export const load: LayoutServerLoad = async ({ locals, url }) => {
	if (!locals.user) throw redirect(303, '/auth/login');

	const pills = PILL_PAGES.has(url.pathname)
		? await pillService.list(locals.user.id)
		: [];

	return {
		user: locals.user,
		pills
	};
};
