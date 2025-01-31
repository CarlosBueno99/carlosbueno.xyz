import { tursoClient } from '$lib/server/client';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async () => {
    try {
        const result = await tursoClient.execute('SELECT * FROM discord_webhooks');
        return { webhooks: result.rows };
    } catch (err) {
        console.error('Error fetching webhooks:', err);
        throw error(500, 'Failed to fetch webhooks');
    }
}) satisfies PageServerLoad;