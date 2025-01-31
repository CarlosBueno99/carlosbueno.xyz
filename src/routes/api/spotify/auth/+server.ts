import { SPOTIFY_CLIENT_ID } from '$env/static/private';
import type { RequestHandler } from './$types';

const SCOPES = [
    'user-read-private',
    'user-read-email',
    'user-top-read',
    'user-read-recently-played'
];

export const GET: RequestHandler = ({ url }) => {
    // Ensure we have the correct protocol
    const protocol = url.protocol === 'http:' ? 'http:' : 'https:';
    // Construct base URL without trailing slash
    const baseUrl = `${protocol}//${url.host}`.replace(/\/$/, '');
    const REDIRECT_URI = `${baseUrl}/api/spotify/auth/callback`;
    
    console.log('Initial auth - Using redirect URI:', REDIRECT_URI);
    console.log('Current URL:', url.toString());
    
    try {
        const authUrl = new URL('https://accounts.spotify.com/authorize');
        authUrl.searchParams.set('client_id', SPOTIFY_CLIENT_ID);
        authUrl.searchParams.set('response_type', 'code');
        authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
        authUrl.searchParams.set('scope', SCOPES.join(' '));
        authUrl.searchParams.set('show_dialog', 'true');

        console.log('Redirecting to Spotify auth URL:', authUrl.toString());
        
        return new Response(null, {
            status: 302,
            headers: {
                Location: authUrl.toString()
            }
        });
    } catch (error) {
        console.error('Error constructing auth URL:', error);
        return new Response('Failed to construct auth URL', { status: 500 });
    }
} 