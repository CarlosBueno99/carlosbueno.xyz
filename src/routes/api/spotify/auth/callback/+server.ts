import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '$env/static/private';
import { tursoClient } from '$lib/server/client';
import { error } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

const REDIRECT_URI = 'http://localhost:5173/api/spotify/auth/callback';

interface SpotifyTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
}

interface SpotifyErrorResponse {
    error: string;
    error_description: string;
}

export async function GET({ url }: RequestEvent) {
    try {
        const code = url.searchParams.get('code');
        if (!code) {
            throw error(400, 'No code provided');
        }

        // Exchange code for tokens
        const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${Buffer.from(
                    `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
                ).toString('base64')}`,
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri: REDIRECT_URI
            }).toString()
        });

        const data = await tokenResponse.json();
        
        if (!tokenResponse.ok) {
            console.error('Spotify token error:', data);
            throw error(500, `Failed to exchange code for tokens: ${data.error_description || data.error}`);
        }

        // Store refresh token in database
        try {
            // Clear existing tokens
            await tursoClient.execute('DELETE FROM spotify_token');
            
            // Store new refresh token
            await tursoClient.execute({
                sql: 'INSERT INTO spotify_token (refresh_token) VALUES (?)',
                args: [data.refresh_token]
            });

            // Set a cookie with success message
            return new Response(null, {
                status: 302,
                headers: {
                    'Location': '/',
                    'Set-Cookie': `spotify_auth_success=true; Path=/; HttpOnly; SameSite=Lax; Max-Age=30`
                }
            });
        } catch (err) {
            console.error('Database error:', err);
            throw error(500, 'Failed to store refresh token in database');
        }
    } catch (err) {
        console.error('Authentication error:', err);
        return new Response(null, {
            status: 302,
            headers: {
                'Location': '/?error=spotify_auth_failed',
                'Set-Cookie': `spotify_auth_error=true; Path=/; HttpOnly; SameSite=Lax; Max-Age=30`
            }
        });
    }
} 