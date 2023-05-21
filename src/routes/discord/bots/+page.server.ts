import { createBot, deleteBot } from '$lib/server/discord';
import { prisma } from '$lib/server/prisma';
import type { PageServerLoad, Actions } from './$types';

export const load = (async () => {
    try {
        await prisma.discordBot.findMany()
        return {bots: await prisma.discordBot.findMany()};
    } catch (error) {
        return {error: "failed query, look at the server logs"}
    }
}) satisfies PageServerLoad;

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