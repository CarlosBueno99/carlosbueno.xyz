import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '$env/static/private';
import type { RequestHandler } from './$types';
import { tursoClient } from '$lib/server/client';

export const GET: RequestHandler = async ({ url, request }) => {
    console.log('Callback URL:', url.toString());
    console.log('Search params:', Object.fromEntries(url.searchParams));
    console.log('Request headers:', Object.fromEntries(request.headers));
    
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');
    
    if (error) {
        console.error('Spotify auth error:', error);
        return new Response(`Authentication error: ${error}`, { status: 400 });
    }
    
    if (!code) {
        console.error('No code in params:', url.searchParams.toString());
        return new Response('No code provided', { status: 400 });
    }

    // Ensure we have the correct protocol
    const protocol = url.protocol === 'http:' ? 'http:' : 'https:';
    // Construct base URL without trailing slash
    const baseUrl = `${protocol}//${url.host}`.replace(/\/$/, '');
    const REDIRECT_URI = `${baseUrl}/api/spotify/auth/callback`;
    
    console.log('Using redirect URI:', REDIRECT_URI);

    try {
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
                redirect_uri: REDIRECT_URI,
            }),
        });

        const data = await tokenResponse.json();
        console.log('Token response status:', tokenResponse.status);
        
        if (!tokenResponse.ok) {
            console.error('Token exchange failed:', data);
            return new Response(`Token exchange failed: ${data.error}`, { status: tokenResponse.status });
        }

        if (!data.refresh_token) {
            console.error('No refresh token in response:', data);
            throw new Error('No refresh token received');
        }

        // Store the refresh token in the database
        await tursoClient.execute({
            sql: 'INSERT OR REPLACE INTO spotify_token (id, refresh_token) VALUES (?, ?)',
            args: [1, data.refresh_token]
        });

        // Redirect back to the home page with success parameter
        return new Response(null, {
            status: 302,
            headers: {
                Location: '/?spotify=success'
            }
        });
    } catch (error) {
        console.error('Error in Spotify callback:', error);
        return new Response('Authentication failed', { status: 500 });
    }
}; 