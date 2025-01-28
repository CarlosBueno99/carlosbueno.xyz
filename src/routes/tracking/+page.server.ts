import type { PageServerLoad } from './$types';
import { tursoClient } from '$lib/server/client';

function extractCoordinatesFromAppleMapsUrl(url: string) {
    try {
        // Extract coordinates from q parameter or ll parameter
        const match = url.match(/[?&](q|ll)=(-?\d+\.\d+),(-?\d+\.\d+)/);
        if (match) {
            return {
                latitude: parseFloat(match[2]),
                longitude: parseFloat(match[3])
            };
        }
        return null;
    } catch (error) {
        console.error('Error parsing Apple Maps URL:', error);
        return null;
    }
}

// Placeholder location data - this would come from your database in the future
const mockLocation = {
    address: "Rua João de Araújo, 330 - Vila dos Andradas, São Paulo - SP, Brazil",
    latitude: -23.694621,
    longitude: -46.668602,
    timestamp: new Date().toISOString(),
    accuracy: 10,
    appleMapsUrl: "https://maps.apple.com/?q=-23.694621,-46.668602&ll=-23.694621,-46.668602"
};

async function getCoordinatesFromAddress(address: string) {
    try {
        // Check if input is an Apple Maps URL
        if (address.includes('maps.apple.com')) {
            const coords = extractCoordinatesFromAppleMapsUrl(address);
            if (coords) {
                // Get address from coordinates using reverse geocoding
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`);
                const data = await response.json();
                return {
                    ...coords,
                    displayName: data.display_name
                };
            }
        }

        // Regular address search
        const encodedAddress = encodeURIComponent(address);
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`);
        const data = await response.json();
        
        if (data && data.length > 0) {
            return {
                latitude: parseFloat(data[0].lat),
                longitude: parseFloat(data[0].lon),
                displayName: data[0].display_name
            };
        }
        throw new Error('Location not found');
    } catch (error) {
        console.error('Error geocoding address:', error);
        return null;
    }
}

export const load = (async () => {
    try {
        const result = await tursoClient.execute({
            sql: `SELECT * FROM locations ORDER BY inserted_date DESC LIMIT 1`,
            args: []
        });

        if (!result.rows || result.rows.length === 0) {
            return {
                location: {
                    latitude: 0,
                    longitude: 0,
                    displayName: 'No location data available',
                    timestamp: new Date().toISOString()
                }
            };
        }

        const lastLocation = result.rows[0];
        return {
            location: {
                latitude: lastLocation.latitude,
                longitude: lastLocation.longitude,
                displayName: lastLocation.display_name,
                timestamp: lastLocation.inserted_date,
                appleMapsUrl: lastLocation.url
            }
        };
    } catch (error) {
        console.error('Error fetching location:', error);
        return {
            location: {
                latitude: 0,
                longitude: 0,
                displayName: 'Error fetching location data',
                timestamp: new Date().toISOString()
            }
        };
    }
}) satisfies PageServerLoad; 