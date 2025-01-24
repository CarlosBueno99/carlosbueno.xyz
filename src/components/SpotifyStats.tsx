'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface SpotifyStats {
  topArtists: any[];
  recentTracks: any[];
  topGenres: string[];
}

export default function SpotifyStats() {
  const [stats, setStats] = useState<SpotifyStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/spotify/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return <div>Loading Spotify stats...</div>;
  }

  if (!stats) {
    return <div>Failed to load Spotify stats</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      <div className="bg-zinc-900 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Top Artists</h3>
        <ul className="space-y-4">
          {stats.topArtists.map((artist) => (
            <li key={artist.id} className="flex items-center space-x-3">
              <Image
                src={artist.images[2].url}
                alt={artist.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <span>{artist.name}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-zinc-900 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Recent Tracks</h3>
        <ul className="space-y-4">
          {stats.recentTracks.map((track) => (
            <li key={track.played_at} className="flex items-center space-x-3">
              <Image
                src={track.track.album.images[2].url}
                alt={track.track.name}
                width={40}
                height={40}
                className="rounded"
              />
              <div>
                <div className="font-medium">{track.track.name}</div>
                <div className="text-sm text-zinc-400">
                  {track.track.artists[0].name}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-zinc-900 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Top Genres</h3>
        <ul className="space-y-2">
          {stats.topGenres.map((genre) => (
            <li
              key={genre}
              className="px-3 py-2 bg-zinc-800 rounded-full text-center"
            >
              {genre}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 