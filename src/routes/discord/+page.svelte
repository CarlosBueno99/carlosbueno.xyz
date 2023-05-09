<script lang="ts">
	import type { PageData } from './$types';
	import Alert from '$lib/components/Alert.svelte';

	export let data: PageData;
	export let form: any;

	console.log(`form data ${form}`);
	
	console.log(data);
</script>

<svelte:head>
	<title>Title</title>
</svelte:head>

{#if form == 204}
	<Alert message="sua mensagem foi enviada com sucesso para os cotocos" status={form}/>
{/if}

<div class="">
	<h2 class="text-center text-3xl font-bold tracking-tight text-gray-300">Enviar mensagem</h2>
</div>
	<div class="p-4">
		<form method="POST" action="?/postMessage" class="w-full">
			<div class="form-control grid grid-cols-12 gap-2">
				<label for="message" class="label col-span-2">
					<span class="label-text text-xl">Mensagem do usuário: </span>
				</label>
				<select name="user" class="select select-primary select-bordered col-span-2">
					<option disabled selected>escolha um</option>
					<option value="Ifood do PUBG">Ifood do PUBG</option>
					<option value="Deuses do CS">Deuses do CS</option>
					<option value="Fiscal de pinada">Fiscal de pinada</option>

				</select>
		
				<input
					type="text"
					name="message"
					class="input input-primary input-bordered col-span-7"
					value=""
				/>
		
				<button class="btn btn-primary">submit</button>
			</div>
		</form>
	</div>
