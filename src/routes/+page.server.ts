import { getCounterStrikeStats } from '$lib/server/steam';


export const load = async ({setHeaders}) => {
    const csgoStats = await getCounterStrikeStats()
    
    setHeaders({
        'Cache-Control': 'public, s-max-age=3600'
    })

    return {
        csgoStats,
        success: true
    };

};