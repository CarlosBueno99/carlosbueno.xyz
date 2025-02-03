import { STEAM_API_KEY, CARLOS_STEAM_ID } from '$env/static/private';
import { error } from '@sveltejs/kit';
import { tursoClient } from '$lib/server/client';
import type { PageServerLoad } from './$types';

async function fetchSteamStats() {
    const baseUrl = 'https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v2/';
    const appId = '730'; // CS:GO App ID

    try {
        const response = await fetch(
            `${baseUrl}?key=${STEAM_API_KEY}&steamid=${CARLOS_STEAM_ID}&appid=${appId}`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch Steam stats');
        }

        const data = await response.json();
        const stats = data.playerstats.stats;

        // Helper function to find stat value
        const getStat = (name: string) => stats.find((stat: any) => stat.name === name)?.value || 0;

        // Process the raw stats into our desired format
        const processedStats = {
            kd: {
                value: (getStat('total_kills') / Math.max(getStat('total_deaths'), 1)).toFixed(1),
                trend: 0
            },
            winRate: {
                value: Math.round((getStat('total_matches_won') / Math.max(getStat('total_matches_played'), 1)) * 100),
                trend: 0
            },
            hsPercentage: {
                value: Math.round((getStat('total_kills_headshot') / Math.max(getStat('total_kills'), 1)) * 100),
                trend: 0
            },
            adr: {
                value: Math.round(getStat('total_damage_done') / Math.max(getStat('total_rounds_played'), 1)),
                trend: 0
            },
            stats: {
                matches: {
                    played: getStat('total_matches_played'),
                    won: getStat('total_matches_won'),
                    lost: getStat('total_matches_played') - getStat('total_matches_won'),
                    tied: 0
                },
                combat: {
                    kills: getStat('total_kills'),
                    deaths: getStat('total_deaths'),
                    assists: getStat('total_kills_assist'),
                    headshots: getStat('total_kills_headshot')
                },
                maps: [
                    {
                        name: 'de_dust2',
                        rounds: getStat('total_rounds_map_de_dust2'),
                        wins: getStat('total_wins_map_de_dust2')
                    },
                    {
                        name: 'de_mirage',
                        rounds: getStat('total_rounds_map_de_mirage'),
                        wins: getStat('total_wins_map_de_mirage')
                    },
                    {
                        name: 'de_inferno',
                        rounds: getStat('total_rounds_map_de_inferno'),
                        wins: getStat('total_wins_map_de_inferno')
                    },
                    {
                        name: 'de_nuke',
                        rounds: getStat('total_rounds_map_de_nuke'),
                        wins: getStat('total_wins_map_de_nuke')
                    },
                    {
                        name: 'de_overpass',
                        rounds: getStat('total_rounds_map_de_overpass'),
                        wins: getStat('total_wins_map_de_overpass')
                    }
                ].sort((a, b) => b.rounds - a.rounds),
                weapons: [
                    {
                        name: 'AK-47',
                        kills: getStat('total_kills_ak47'),
                        accuracy: Math.round((getStat('total_hits_ak47') / Math.max(getStat('total_shots_ak47'), 1)) * 100)
                    },
                    {
                        name: 'M4A4',
                        kills: getStat('total_kills_m4a1'),
                        accuracy: Math.round((getStat('total_hits_m4a1') / Math.max(getStat('total_shots_m4a1'), 1)) * 100)
                    },
                    {
                        name: 'AWP',
                        kills: getStat('total_kills_awp'),
                        accuracy: Math.round((getStat('total_hits_awp') / Math.max(getStat('total_shots_awp'), 1)) * 100)
                    },
                    {
                        name: 'Desert Eagle',
                        kills: getStat('total_kills_deagle'),
                        accuracy: Math.round((getStat('total_hits_deagle') / Math.max(getStat('total_shots_deagle'), 1)) * 100)
                    }
                ].sort((a, b) => b.kills - a.kills)
            }
        };

        return processedStats;
    } catch (err) {
        console.error('Error fetching Steam stats:', err);
        throw error(500, 'Failed to fetch Steam stats');
    }
}

export const load: PageServerLoad = async ({ locals }) => {
    const stats = await fetchSteamStats();

    // Load exercise data for the current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { rows: exercises } = await tursoClient.execute({
        sql: 'SELECT id, check_in, check_out FROM exercises WHERE check_in >= ? ORDER BY check_in DESC',
        args: [startOfMonth.toISOString()]
    });

    return {
        stats,
        exercises
    };
};