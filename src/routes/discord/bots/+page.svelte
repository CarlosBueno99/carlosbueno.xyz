<script lang="ts">
	import BotTable from '$lib/components/BotTable.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	export const form: any = {};


</script>

<svelte:head>
	<title>Criar bots</title>
</svelte:head>

<div class="">
	<h2 class="text-center text-3xl font-bold tracking-tight text-gray-300">Criar bot</h2>
</div>
<div class="p-4 grid justify-items-center">
	<form method="POST" action="?/createBot" class="w-2/3">
		<div class="form-control grid grid-cols-6 gap-2">
			<label for="name" class="label col-span-2">
				<span class="label-text text-xl">Bot name</span>
			</label>
			<input
				type="text"
				name="name"
				class="input input-primary input-bordered col-span-7"
				value=""
			/>
			<label for="channel" class="label col-span-2">
				<span class="label-text text-xl">Discord channel</span>
			</label>
			<input
				type="text"
				name="channel"
				class="input input-primary input-bordered col-span-7"
				value=""
			/>
			<label for="imageUrl" class="label col-span-2">
				<span class="label-text text-xl">Image URL</span>
			</label>
			<input
				type="text"
				name="imageUrl"
				class="input input-primary input-bordered col-span-7"
				value=""
			/>
			<label for="name" class="label col-span-2">
				<span class="label-text text-xl">Bot type</span>
			</label>
			<select required name="type" class="select select-primary select-bordered col-span-7">
				<option value="" disabled selected>escolha um</option>
				<option value="Clone">Clone</option>
				<option value="Character">Character</option>

			</select>
			<button class="btn btn-primary">submit</button>
		</div>
	</form>

	<BotTable bots={data.bots}/>
</div>
