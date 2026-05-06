import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { categoryService, CategoryServiceError } from '$lib/server/services/category-service';
import { pillService, PillServiceError } from '$lib/server/services/pill-service';
import { DEFAULT_CATEGORY_PALETTE } from '$lib/domain/category';

export const load: PageServerLoad = async ({ locals }) => {
	const categories = await categoryService.ensureSeeded(locals.user!.id);
	return {
		categories,
		palette: [...DEFAULT_CATEGORY_PALETTE]
	};
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

	create: async ({ locals, request }) => {
		const data = await request.formData();
		const title = String(data.get('title') ?? '');
		const body = String(data.get('body') ?? '');
		const categoryId = String(data.get('categoryId') ?? '') || null;
		const source = String(data.get('source') ?? '');
		const sourceUrl = String(data.get('sourceUrl') ?? '');

		try {
			const pill = await pillService.create(locals.user!.id, {
				title,
				body,
				categoryId,
				source: source || null,
				sourceUrl: sourceUrl || null
			});
			throw redirect(303, `/pills/${pill.id}`);
		} catch (e) {
			if (e instanceof PillServiceError) {
				return fail(400, { error: e.message, values: { title, body, categoryId, source, sourceUrl } });
			}
			throw e;
		}
	}
};
