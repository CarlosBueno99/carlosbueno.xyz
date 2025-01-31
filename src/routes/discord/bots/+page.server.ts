import { tursoClient } from '$lib/server/client';
import { error } from '@sveltejs/kit';
import { createBot, deleteBot } from '$lib/server/discord';
import type { PageServerLoad, Actions } from './$types';

export async function load() {
    try {
        const result = await tursoClient.execute('SELECT * FROM discord_bots');
        return {
            bots: result.rows
        };
    } catch (err) {
        console.error('Error fetching bots:', err);
        throw error(500, 'Failed to fetch bots');
    }
}

export const actions: Actions = {
    createBot: async ({ request }) => {

        const data = await request.formData()
        const name = data.get('name') as string
        const channel = data.get('channel') as string
        const imageUrl = data.get('imageUrl') as string
        const type = data.get('type') as string
        
        await createBot({
            name,
            channel,
            imageUrl,
            type
        })

        return {
            name,
            channel,
            imageUrl,
            type,
            success: true
        };
    },
    deleteBot: async ({request}) => {
        const data = await request.formData()
        const botId = data.get("id") as string

        return await deleteBot(botId)
    }
};