import { STEAM_API_KEY, CARLOS_STEAM_ID } from '$env/static/private';

// get steamid from a vanity id from the steamwebapi
export async function getSteamId(vanityId: string) {
    const url = `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${STEAM_API_KEY}&vanityurl=${vanityId}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.response.steamid;
}

// get counterstrike stats and parse them into a an object that shows the stats name and value
export async function getCounterStrikeStats() {
    const url = `https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=730&key=${STEAM_API_KEY}&steamid=${CARLOS_STEAM_ID}`;
    const response = await fetch(url);
    console.log('response cache control');
    
    console.log(response.headers.get('Cache-Control'));

    const data = await response.json();
    const stats = data.playerstats.stats;


    return stats;
}

export async function getVisitorCounterStrikeStats(steamId: string) {
    const url = `https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=730&key=${STEAM_API_KEY}&steamid=${steamId}`;
    const response = await fetch(url);


    const data = await response.json();
    const stats = data.playerstats.stats;

    console.log(stats);

    return stats
}