import type { PageServerLoad, Actions } from './$types';
import { postMessage } from '$lib/server/discord/postMessage';

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
    postMessage: async ({ request }) => {

        const data = await request.formData();
        const message = data.get('message')
        const user = data.get('user')



        return await postMessage(message, user);
    }
};