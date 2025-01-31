import { json } from '@sveltejs/kit';
import { LOCATION_API_PASSWORD } from '$env/static/private';
import { tursoClient } from '$lib/server/client';

export const POST = async ({ request }) => {
    console.log('Saving location', request);
    console.log('Request body:', await request.json());
    try {
        const { url, password } = await request.json();

        if (password !== LOCATION_API_PASSWORD) {
            return json({ error: 'Unauthorized' }, { status: 401 });
        }

        const metadata = await extractMetadataFromUrl(url);
        const insertedDate = new Date().toISOString();

        const result = await tursoClient.execute({
            sql: `INSERT INTO locations (url, inserted_date, latitude, longitude, display_name) 
                  VALUES (?, ?, ?, ?, ?) RETURNING id`,
            args: [url, insertedDate, metadata.latitude, metadata.longitude, metadata.displayName]
        });

        return json({ 
            success: true,
            id: result.rows[0].id
        });
    } catch (error) {
        console.error('Error saving location:', error);
        if (error instanceof Error) {
            return json({ error: 'Failed to save location', details: error.message }, { status: 500 });
        }
        return json({ error: 'Failed to save location' }, { status: 500 });
    }
};

async function extractMetadataFromUrl(url: string) {
    const coords = extractCoordinatesFromAppleMapsUrl(url);
    if (!coords) {
        throw new Error('Invalid URL');
    }
    // Reverse geocode to get display name
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`);
    const data = await response.json();
    return {
        latitude: coords.latitude,
        longitude: coords.longitude,
        displayName: data.display_name
    };
}

function extractCoordinatesFromAppleMapsUrl(url: string) {
    const match = url.match(/[?&](q|ll)=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match) {
        return {
            latitude: parseFloat(match[2]),
            longitude: parseFloat(match[3])
        };
    }
    return null;
} 