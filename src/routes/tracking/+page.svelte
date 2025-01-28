<!-- Leaflet CSS -->
<svelte:head>
	<link
		rel="stylesheet"
		href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
		integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
		crossorigin=""
	/>
	<!-- Leaflet JS -->
	<script
		src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
		integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
		crossorigin=""
	></script>
</svelte:head>

<script context="module" lang="ts">
	// Declare L to avoid TypeScript errors
	declare const L: any;
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	let mapElement: HTMLElement;
	let map: any;
	let marker: any;

	onMount(() => {
		// Initialize map
		map = L.map(mapElement).setView([data.location.latitude, data.location.longitude], 13);

		// Add OpenStreetMap tiles
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution: '© OpenStreetMap contributors'
		}).addTo(map);

		// Add marker
		marker = L.marker([data.location.latitude, data.location.longitude])
			.addTo(map)
			.bindPopup('Last known location<br>Updated: ' + new Date(data.location.timestamp).toLocaleString());

		return () => {
			map.remove();
		};
	});
</script>

<div class="container mx-auto p-4">
	<h1 class="text-2xl font-bold mb-4">Location Tracking</h1>
	<div bind:this={mapElement} class="h-[600px] w-full rounded-lg shadow-lg"></div>
</div>

<style>
	:global(.leaflet-container) {
		z-index: 1;
	}
</style>
