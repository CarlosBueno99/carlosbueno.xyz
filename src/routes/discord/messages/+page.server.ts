import type { PageServerLoad, Actions } from '../$types';
import { postMessage } from '$lib/server/discord';

export const load = (async () => {
    return {success:true};
}) satisfies PageServerLoad;

export const actions: Actions = {
    postMessage: async ({ request }) => {

        const data = await request.formData();
        const message = data.get('message') as string
        const user = data.get('user') as string

        return await postMessage(message, user);
    }
};