<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	const csgoStats = data.csgoStats;

</script>

<h1 class="text-center p-5">Carleto CSGO Stats</h1>

<div class="w-4/5 grid grid-cols-12 container gap-4 text-center bg-base-300 justify-self place-content-center">

    {#each csgoStats as stat}
	<div class="col-span-4">
        <h3>{stat.name}</h3>
		<p>{stat.value}</p>
	</div>
    {/each}
</div>
