import type { PageServerLoad } from './$types';
import { categoryService } from '$lib/server/services/category-service';

export const load: PageServerLoad = async ({ locals }) => {
	const categories = await categoryService.list(locals.user!.id);
	return { categories };
};
