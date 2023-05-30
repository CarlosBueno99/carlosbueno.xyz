import { getCounterStrikeStats } from '$lib/server/steam';
import type { PageServerLoad } from './$types';


export const load: PageServerLoad = async ({setHeaders}) => {
    const csgoStats = await getCounterStrikeStats()
    
    setHeaders({
        'Cache-Control': 'max-age=3600'
    })

    return {
        csgoStats,
        success: true
    };

};