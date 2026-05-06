import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { categoryService, CategoryServiceError } from '$lib/server/services/category-service';
import { pillService, PillServiceError } from '$lib/server/services/pill-service';
import { DEFAULT_CATEGORY_PALETTE } from '$lib/domain/category';

export const load: PageServerLoad = async ({ locals, params }) => {
	try {
		const [pill, categories] = await Promise.all([
			pillService.findById(locals.user!.id, params.id),
			categoryService.ensureSeeded(locals.user!.id)
		]);
		return { pill, categories, palette: [...DEFAULT_CATEGORY_PALETTE] };
	} catch (e) {
		if (e instanceof PillServiceError && e.code === 'NOT_FOUND') {
			throw error(404, 'Pillola non trovata');
		}
		throw e;
	}
};

export const actions: Actions = {
	createCategory: async ({ locals, request }) => {
		const data = await request.formData();
		const name = String(data.get('name') ?? '').trim();
		const color = String(data.get('color') ?? '');
		try {
			const cat = await categoryService.findOrCreate(locals.user!.id, { name, color });
			return { ok: true, category: cat };
		} catch (e) {
			if (e instanceof CategoryServiceError) {
				return fail(400, { error: e.message });
			}
			throw e;
		}
	},

	update: async ({ locals, request, params }) => {
		const data = await request.formData();
		const title = String(data.get('title') ?? '');
		const body = String(data.get('body') ?? '');
		const categoryId = String(data.get('categoryId') ?? '') || null;
		const source = String(data.get('source') ?? '');
		const sourceUrl = String(data.get('sourceUrl') ?? '');

		try {
			await pillService.update(locals.user!.id, params.id!, {
				title,
				body,
				categoryId,
				source: source || null,
				sourceUrl: sourceUrl || null
			});
		} catch (e) {
			if (e instanceof PillServiceError) {
				return fail(400, { error: e.message });
			}
			throw e;
		}
		throw redirect(303, `/pills/${params.id}`);
	}
};
