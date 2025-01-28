import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { RequestEvent } from '@sveltejs/kit';

export const load = async ({ locals }: RequestEvent) => {
	const session = await locals.getSession();
	if (!session?.user) {
		throw redirect(303, '/auth');
	}

	// Placeholder data - this would come from a database in production
	const locationData = {
		latitude: -23.5505,
		longitude: -46.6333,
		timestamp: new Date().toISOString()
	};

	return {
		location: locationData
	};
};
