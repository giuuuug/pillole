import type { PageServerLoad } from './$types';
import { pillService } from '$lib/server/services/pill-service';

export const load: PageServerLoad = async ({ locals }) => {
	const { items, total, hasMore } = await pillService.listPaginated(locals.user!.id, 1);
	return { pills: items, total, hasMore };
};
