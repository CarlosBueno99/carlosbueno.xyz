<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	export let form: any;
	const user = {
		name: "Carlos",
		id: "clho03ze40000un7au16cvy54"
	}

	console.log('form');
	console.log(form);
	console.log('data');
	console.log(data);

</script>

<svelte:head>
	<title>Cadastro de webhooks</title>
</svelte:head>

<div class="">
	<h2 class="text-center text-3xl font-bold tracking-tight text-gray-300">Cadastre seu webhook do discord</h2>
</div>
<div class="p-4 grid justify-items-center">
	<form method="POST" action="?/createBot" class="w-2/3">
		<div class="form-control grid grid-cols-6 gap-2">
			<label for="name" class="label col-span-2">
				<span class="label-text text-xl">Name of the discord Channel</span>
			</label>
			<input
				type="text"
				name="name"
				class="input input-primary input-bordered col-span-7"
				value=""
			/>
			<label for="webhookUrl" class="label col-span-2">
				<span class="label-text text-xl">Webhook URL</span>
			</label>
			<input
				type="text"
				name="webhookUrl"
				class="input input-primary input-bordered col-span-7"
				value=""
			/>
			<input class="hidden" type="text" name="ownerId" value={user.id}>
			<button class="btn btn-primary">submit</button>
		</div>
	</form>
	<p class="text-sm text-zinc-600 p-4">Upon adding a new webhook a test message will be sent to the discord channel where the webhook was created</p>
</div>
