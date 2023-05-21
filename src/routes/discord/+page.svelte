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
	<title>Discord tools</title>
</svelte:head>


<h1 class="text-xl text-center basis-full">Discord tools</h1>

    <div class="flex justify-center p-4">
        <a href="/discord/webhooks" class="btn btn-secondary m-1">Cadastrar webhooks de Discord</a>
        <a href="/discord/bots" class="btn btn-secondary m-1">Criar personagem</a>
        <a href="/discord/messages" class="btn btn-secondary m-1">Enviar mensagem para discord</a>
    </div>
