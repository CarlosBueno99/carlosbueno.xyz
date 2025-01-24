import { createClient } from '@libsql/client';
import { env } from '$env/dynamic/private';

const turso = createClient({
  url: env.TURSO_DATABASE_URL,
  authToken: env.TURSO_AUTH_TOKEN
});

async function getAccessToken() {
  // Get refresh token from Turso
  const result = await turso.execute('SELECT refresh_token FROM spotify_token LIMIT 1');
  const refreshToken = result.rows[0]?.refresh_token as string;

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(
        `${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`
      ).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  const data = await response.json();
  return data.access_token;
}

export async function getTopArtists() {
  const accessToken = await getAccessToken();
  const response = await fetch('https://api.spotify.com/v1/me/top/artists?limit=5&time_range=short_term', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.json();
}

export async function getRecentTracks() {
  const accessToken = await getAccessToken();
  const response = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=5', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.json();
}

export async function getTopGenres() {
  const accessToken = await getAccessToken();
  const response = await fetch('https://api.spotify.com/v1/me/top/artists?limit=20&time_range=medium_term', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  
  // Count genres
  const genreCounts = data.items.reduce((acc: Record<string, number>, artist: any) => {
    artist.genres.forEach((genre: string) => {
      acc[genre] = (acc[genre] || 0) + 1;
    });
    return acc;
  }, {});

  // Sort and get top 5 genres
  return Object.entries(genreCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([genre]) => genre);
} 