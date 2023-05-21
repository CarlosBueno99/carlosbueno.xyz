import { createWebhook } from '$lib/server/discord';
// import { prisma } from '$lib/server/prisma';
import type { PageServerLoad, Actions } from './$types';

export const load = (async () => {
    return {info: "nothing"}
}) satisfies PageServerLoad;

export const actions: Actions = {
    createBot: async ({ request }) => {

        // const data = await request.formData()
        // const name = data.get('name') as string
        // const webhookUrl = data.get('webhookUrl') as string
        // const ownerId = data.get('ownerId') as string

        console.log(request);
        

        
        await createWebhook()

        return {
            success: true
        };
    }
};