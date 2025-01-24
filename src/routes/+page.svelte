<script lang="ts">
	import type { PageData } from './$types';
	import SpotifyStats from '$lib/components/SpotifyStats.svelte';

	export let data: PageData;
	const { kd, winRate, hsPercentage, adr, stats } = data.stats;
</script>

<div class="min-h-screen bg-[#1F1F1F] text-white p-4">
	<div class="max-w-7xl mx-auto">
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
			<!-- K/D -->
			<div class="bg-[#2B2B2B] rounded-lg p-6 border border-[#404040]">
				<h2 class="text-[#999999] text-sm font-medium mb-2">K/D</h2>
				<div class="flex items-baseline">
					<span class="text-4xl font-bold text-[#FF5500]">{kd.value}</span>
					{#if kd.trend !== 0}
						<span class="ml-2 text-sm {kd.trend > 0 ? 'text-[#44D62C]' : 'text-red-500'}">
							{kd.trend > 0 ? '↑' : '↓'}{Math.abs(kd.trend)}
						</span>
					{/if}
				</div>
			</div>

			<!-- Win Rate -->
			<div class="bg-[#2B2B2B] rounded-lg p-6 border border-[#404040]">
				<h2 class="text-[#999999] text-sm font-medium mb-2">WIN RATE</h2>
				<div class="flex items-baseline">
					<span class="text-4xl font-bold text-[#FF5500]">{winRate.value}%</span>
					{#if winRate.trend !== 0}
						<span class="ml-2 text-sm {winRate.trend > 0 ? 'text-[#44D62C]' : 'text-red-500'}">
							{winRate.trend > 0 ? '↑' : '↓'}{Math.abs(winRate.trend)}
						</span>
					{/if}
				</div>
			</div>

			<!-- HS% -->
			<div class="bg-[#2B2B2B] rounded-lg p-6 border border-[#404040]">
				<h2 class="text-[#999999] text-sm font-medium mb-2">HS%</h2>
				<div class="flex items-baseline">
					<span class="text-4xl font-bold text-[#FF5500]">{hsPercentage.value}%</span>
					{#if hsPercentage.trend !== 0}
						<span class="ml-2 text-sm {hsPercentage.trend > 0 ? 'text-[#44D62C]' : 'text-red-500'}">
							{hsPercentage.trend > 0 ? '↑' : '↓'}{Math.abs(hsPercentage.trend)}
						</span>
					{/if}
				</div>
			</div>

			<!-- ADR -->
			<div class="bg-[#2B2B2B] rounded-lg p-6 border border-[#404040]">
				<h2 class="text-[#999999] text-sm font-medium mb-2">ADR</h2>
				<div class="flex items-baseline">
					<span class="text-4xl font-bold text-[#FF5500]">{adr.value}</span>
					{#if adr.trend !== 0}
						<span class="ml-2 text-sm {adr.trend > 0 ? 'text-[#44D62C]' : 'text-red-500'}">
							{adr.trend > 0 ? '↑' : '↓'}{Math.abs(adr.trend)}
						</span>
					{/if}
				</div>
			</div>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
			<!-- Match Stats -->
			<div class="bg-[#2B2B2B] rounded-lg p-6 border border-[#404040]">
				<h2 class="text-[#999999] text-sm font-medium mb-4">Match Stats</h2>
				<div class="grid grid-cols-2 gap-4">
					<div>
						<p class="text-[#999999]">Matches Played</p>
						<p class="text-2xl font-bold text-white">{stats.matches.played}</p>
					</div>
					<div>
						<p class="text-[#999999]">Matches Won</p>
						<p class="text-2xl font-bold text-[#44D62C]">{stats.matches.won}</p>
					</div>
					<div>
						<p class="text-[#999999]">Matches Lost</p>
						<p class="text-2xl font-bold text-red-500">{stats.matches.lost}</p>
					</div>
					<div>
						<p class="text-[#999999]">Matches Tied</p>
						<p class="text-2xl font-bold text-yellow-500">{stats.matches.tied}</p>
					</div>
				</div>
			</div>

			<!-- Combat Stats -->
			<div class="bg-[#2B2B2B] rounded-lg p-6 border border-[#404040]">
				<h2 class="text-[#999999] text-sm font-medium mb-4">Combat Stats</h2>
				<div class="grid grid-cols-2 gap-4">
					<div>
						<p class="text-[#999999]">Kills</p>
						<p class="text-2xl font-bold text-[#FF5500]">{stats.combat.kills}</p>
					</div>
					<div>
						<p class="text-[#999999]">Deaths</p>
						<p class="text-2xl font-bold text-red-500">{stats.combat.deaths}</p>
					</div>
					<div>
						<p class="text-[#999999]">Assists</p>
						<p class="text-2xl font-bold text-[#44D62C]">{stats.combat.assists}</p>
					</div>
					<div>
						<p class="text-[#999999]">Headshots</p>
						<p class="text-2xl font-bold text-[#FF5500]">{stats.combat.headshots}</p>
					</div>
				</div>
			</div>

			<!-- Most Played Maps -->
			<div class="bg-[#2B2B2B] rounded-lg p-6 border border-[#404040]">
				<h2 class="text-[#999999] text-sm font-medium mb-4">Most Played Maps</h2>
				<div class="space-y-4">
					{#each stats.maps.slice(0, 5) as map}
						<div class="flex justify-between items-center">
							<span class="text-white">{map.name.replace('de_', '')}</span>
							<div class="flex items-center gap-4">
								<span class="text-[#999999]">{map.rounds} rounds</span>
								<span class="text-[#44D62C]">{Math.round((map.wins / map.rounds) * 100)}% winrate</span>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Weapon Stats -->
			<div class="bg-[#2B2B2B] rounded-lg p-6 border border-[#404040]">
				<h2 class="text-[#999999] text-sm font-medium mb-4">Weapon Stats</h2>
				<div class="space-y-4">
					{#each stats.weapons as weapon}
						<div class="flex justify-between items-center">
							<span class="text-white">{weapon.name}</span>
							<div class="flex items-center gap-4">
								<span class="text-[#FF5500]">{weapon.kills} kills</span>
								<span class="text-[#44D62C]">{weapon.accuracy}% accuracy</span>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<div class="mt-6">
			<h2 class="text-[#999999] text-xl font-medium mb-4">Spotify Stats</h2>
			<SpotifyStats />
		</div>
	</div>
</div>
