<script lang="ts">
    import { onMount } from 'svelte';
    import type { PageData } from './$types';
    import { browser } from '$app/environment';
    import { invalidateAll } from '$app/navigation';

    export let data: PageData;
    let mapElement: HTMLDivElement;
    let map: any;
    let marker: any;
    let searchAddress = '';
    let searchError = '';
    let currentLocation = data.location;

    function extractCoordinatesFromAppleMapsUrl(url: string) {
        try {
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

    async function searchLocation() {
        try {
            if (searchAddress.includes('maps.apple.com')) {
                const coords = extractCoordinatesFromAppleMapsUrl(searchAddress);
                if (coords) {
                    // Get address from coordinates using reverse geocoding
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`);
                    const data = await response.json();
                    
                    const location = {
                        ...coords,
                        displayName: data.display_name,
                        appleMapsUrl: searchAddress
                    };
                    
                    updateMap(location);
                    return;
                }
            }

            const encodedAddress = encodeURIComponent(searchAddress);
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`);
            const searchData = await response.json();
            
            if (searchData && searchData.length > 0) {
                const location = {
                    latitude: parseFloat(searchData[0].lat),
                    longitude: parseFloat(searchData[0].lon),
                    displayName: searchData[0].display_name,
                    appleMapsUrl: `https://maps.apple.com/?q=${searchData[0].lat},${searchData[0].lon}&ll=${searchData[0].lat},${searchData[0].lon}`
                };
                
                updateMap(location);
            } else {
                searchError = 'Location not found';
            }
        } catch (error) {
            console.error('Error searching location:', error);
            searchError = 'Error searching location';
        }
    }

    function updateMap(location: any) {
        currentLocation = location;
        // Update map view and marker
        map.setView([location.latitude, location.longitude], 16);
        marker.setLatLng([location.latitude, location.longitude])
            .bindPopup(`Location: ${location.displayName}`)
            .openPopup();
        
        searchError = '';
    }

    async function copyAppleMapsUrl() {
        try {
            await navigator.clipboard.writeText(currentLocation.appleMapsUrl);
            // You could add a toast notification here
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }

    function getGoogleMapsUrl() {
        return `https://www.google.com/maps?q=${currentLocation.latitude},${currentLocation.longitude}`;
    }

    function getWazeUrl() {
        return `https://waze.com/ul?ll=${currentLocation.latitude},${currentLocation.longitude}&navigate=yes`;
    }

    async function refreshLocation() {
        await invalidateAll();
        if (currentLocation.latitude !== 0 && currentLocation.longitude !== 0) {
            updateMap(data.location);
        }
    }

    onMount(async () => {
        if (browser) {
            const L = await import('leaflet');
            
            // Initialize map
            map = L.map(mapElement).setView([currentLocation.latitude, currentLocation.longitude], 16);
            
            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);
            
            // Add marker for current location
            marker = L.marker([currentLocation.latitude, currentLocation.longitude])
                .bindPopup(`Location: ${currentLocation.displayName}`)
                .addTo(map);
        }
    });
</script>

<svelte:head>
    <title>Location Tracking</title>
    <link 
        rel="stylesheet" 
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossorigin=""
    />
</svelte:head>

<div class="min-h-screen bg-[#1F1F1F] py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="space-y-6">
            <div class="bg-[#2B2B2B] rounded-lg p-6 border border-[#404040]">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-[#999999] text-xl font-medium">Location Tracking</h2>
                    <button
                        on:click={refreshLocation}
                        class="px-4 py-2 bg-[#44D62C] hover:bg-[#3bb925] text-black font-medium rounded-md transition-colors text-sm flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
                        </svg>
                        Refresh
                    </button>
                </div>
                
                <!-- Map Links -->
                <div class="flex gap-2 mb-6">
                    <button
                        on:click={copyAppleMapsUrl}
                        class="px-4 py-2 bg-[#404040] hover:bg-[#505050] text-white rounded-md transition-colors text-sm flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                        </svg>
                        Copy Apple Maps Link
                    </button>
                    <a
                        href={getGoogleMapsUrl()}
                        target="_blank"
                        class="px-4 py-2 bg-[#404040] hover:bg-[#505050] text-white rounded-md transition-colors text-sm flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z" />
                        </svg>
                        Open in Google Maps
                    </a>
                    <a
                        href={getWazeUrl()}
                        target="_blank"
                        class="px-4 py-2 bg-[#404040] hover:bg-[#505050] text-white rounded-md transition-colors text-sm flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z" />
                        </svg>
                        Open in Waze
                    </a>
                </div>

                <!-- Search Form -->
                <div class="mb-6">
                    <form 
                        on:submit|preventDefault={searchLocation}
                        class="flex gap-4 items-end"
                    >
                        <div class="flex-1">
                            <label for="address" class="block text-sm font-medium text-[#999999] mb-2">
                                Search Location or Paste Apple Maps Link
                            </label>
                            <input
                                bind:value={searchAddress}
                                type="text"
                                id="address"
                                placeholder="Enter an address, place name, or Apple Maps link"
                                class="w-full px-3 py-2 bg-[#1F1F1F] border border-[#404040] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#44D62C] focus:border-transparent transition-colors"
                            />
                        </div>
                        <button
                            type="submit"
                            class="px-4 py-2 bg-[#44D62C] hover:bg-[#3bb925] text-black font-medium rounded-md transition-colors text-sm"
                        >
                            Search
                        </button>
                    </form>
                    {#if searchError}
                        <p class="mt-2 text-red-500 text-sm">{searchError}</p>
                    {/if}
                </div>

                <!-- Location Information -->
                <div class="mb-6 text-white">
                    <div class="flex items-center justify-between mb-4">
                        <div>
                            <p class="mb-2">Current Location: {currentLocation.displayName}</p>
                            <p>Last Updated: {new Date(currentLocation.timestamp).toLocaleString()}</p>
                            <p>Coordinates: {currentLocation.latitude}, {currentLocation.longitude}</p>
                        </div>
                    </div>
                </div>

                <!-- Map Container -->
                <div 
                    bind:this={mapElement} 
                    class="w-full h-[500px] rounded-lg overflow-hidden"
                ></div>
            </div>
        </div>
    </div>
</div>

<style>
    :global(.leaflet-container) {
        background-color: #2B2B2B;
    }
</style> 