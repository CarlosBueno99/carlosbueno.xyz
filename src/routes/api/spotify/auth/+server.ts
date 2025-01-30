import { SPOTIFY_CLIENT_ID } from '$env/static/private';

const REDIRECT_URI = 'http://localhost:5173/api/spotify/auth/callback';
const SCOPES = [
    'user-read-private',
    'user-read-email',
    'user-top-read',
    'user-read-recently-played'
];

export function GET() {
    const authUrl = new URL('https://accounts.spotify.com/authorize');
    authUrl.searchParams.set('client_id', SPOTIFY_CLIENT_ID);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
    authUrl.searchParams.set('scope', SCOPES.join(' '));
    authUrl.searchParams.set('show_dialog', 'true'); // Force showing the auth dialog

    return new Response(null, {
        status: 302,
        headers: {
            Location: authUrl.toString()
        }
    });
} 