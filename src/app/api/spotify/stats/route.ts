import { getTopArtists, getRecentTracks, getTopGenres } from '@/lib/spotify';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [topArtists, recentTracks, topGenres] = await Promise.all([
      getTopArtists(),
      getRecentTracks(),
      getTopGenres(),
    ]);

    return NextResponse.json({
      topArtists: topArtists.items,
      recentTracks: recentTracks.items,
      topGenres,
    });
  } catch (error) {
    console.error('Error fetching Spotify stats:', error);
    return NextResponse.json({ error: 'Failed to fetch Spotify stats' }, { status: 500 });
  }
} 