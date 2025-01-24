<script lang="ts">
	export let message:string;
	export let status: number
</script>

{#if status == 204}
<div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative w-full mt-4 shadow-lg">
	<div>
		<span class="text-black">{message}</span>
	</div>
</div>

{:else}
<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-xs mt-4 shadow-lg">
	<div class="flex items-center">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="stroke-current flex-shrink-0 h-6 w-6 mr-2"
			fill="none"
			viewBox="0 0 24 24"
			><path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
			/></svg
		>
		<span>{message}</span>
	</div>
</div>

{/if}
