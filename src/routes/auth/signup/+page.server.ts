import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
    const data = { 
        simple: "data"
    }
    return data
};