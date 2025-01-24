<script lang="ts">
  import { onMount } from 'svelte';

  interface SpotifyStats {
    topArtists: any[];
    recentTracks: any[];
    topGenres: string[];
  }

  let stats: SpotifyStats | null = null;
  let loading = true;

  onMount(async () => {
    try {
      const response = await fetch('/api/spotify/stats');
      stats = await response.json();
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      loading = false;
    }
  });
</script>

{#if loading}
  <div>Loading Spotify stats...</div>
{:else if !stats}
  <div>Failed to load Spotify stats</div>
{:else}
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    <div class="bg-[#2B2B2B] rounded-lg p-6 border border-[#404040]">
      <h2 class="text-[#999999] text-sm font-medium mb-4">Top Artists</h2>
      <ul class="space-y-4">
        {#each stats.topArtists as artist}
          <li class="flex items-center space-x-3">
            <img
              src={artist.images[2].url}
              alt={artist.name}
              class="w-10 h-10 rounded-full"
            />
            <span class="text-white">{artist.name}</span>
          </li>
        {/each}
      </ul>
    </div>

    <div class="bg-[#2B2B2B] rounded-lg p-6 border border-[#404040]">
      <h2 class="text-[#999999] text-sm font-medium mb-4">Recent Tracks</h2>
      <ul class="space-y-4">
        {#each stats.recentTracks as track}
          <li class="flex items-center space-x-3">
            <img
              src={track.track.album.images[2].url}
              alt={track.track.name}
              class="w-10 h-10 rounded"
            />
            <div>
              <div class="font-medium text-white">{track.track.name}</div>
              <div class="text-sm text-[#999999]">
                {track.track.artists[0].name}
              </div>
            </div>
          </li>
        {/each}
      </ul>
    </div>

    <div class="bg-[#2B2B2B] rounded-lg p-6 border border-[#404040]">
      <h2 class="text-[#999999] text-sm font-medium mb-4">Top Genres</h2>
      <ul class="space-y-2">
        {#each stats.topGenres as genre}
          <li class="px-3 py-2 bg-[#1F1F1F] rounded-full text-center text-white">
            {genre}
          </li>
        {/each}
      </ul>
    </div>
  </div>
{/if} 