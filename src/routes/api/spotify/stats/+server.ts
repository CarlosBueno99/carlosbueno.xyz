import { json } from '@sveltejs/kit';
import { getTopArtists, getRecentTracks, getTopGenres } from '$lib/server/spotify';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  try {
    const [topArtists, recentTracks, topGenres] = await Promise.all([
      getTopArtists(),
      getRecentTracks(),
      getTopGenres(),
    ]);

    return json({
      topArtists: topArtists.items,
      recentTracks: recentTracks.items,
      topGenres,
    });
  } catch (error) {
    console.error('Error fetching Spotify stats:', error);
    return json({ error: 'Failed to fetch Spotify stats' }, { status: 500 });
  }
}; 