import type { PageServerLoad } from "../$types";

export const load = (async ({locals, parent}) => {
    await parent()
    return { success: true  } 
}) satisfies PageServerLoad;