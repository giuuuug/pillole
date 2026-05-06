import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { pillService, PillServiceError } from '$lib/server/services/pill-service';

export const load: PageServerLoad = async ({ locals, params }) => {
	try {
		const pill = await pillService.findById(locals.user!.id, params.id);
		return { pill };
	} catch (e) {
		if (e instanceof PillServiceError && e.code === 'NOT_FOUND') {
			throw error(404, 'Pillola non trovata');
		}
		throw e;
	}
};

export const actions: Actions = {
	toggleFavorite: async ({ locals, params }) => {
		await pillService.toggleFavorite(locals.user!.id, params.id!);
		return { ok: true };
	},
	delete: async ({ locals, params }) => {
		try {
			await pillService.remove(locals.user!.id, params.id!);
		} catch (e) {
			return fail(400, { error: e instanceof Error ? e.message : 'Errore' });
		}
		throw redirect(303, '/library');
	}
};
