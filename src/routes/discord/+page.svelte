<script lang="ts">
	import type { PageData } from './$types';
	import Alert from '$lib/components/Alert.svelte';
	import BotTable from '$lib/components/BotTable.svelte';

	export let data: PageData;
	export let form: any;

	let message = '';
	let user = '';
</script>

<div class="min-h-screen bg-[#1F1F1F] py-8">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="space-y-6">
			<!-- Message Form -->
			<div class="bg-[#2B2B2B] rounded-lg p-6 border border-[#404040]">
				<h2 class="text-[#999999] text-sm font-medium mb-6">Send Discord Message</h2>
				<form method="POST" action="?/postMessage" class="space-y-4">
					<div>
						<label for="message" class="block text-sm font-medium text-[#999999] mb-2">
							Message
						</label>
						<textarea
							bind:value={message}
							name="message"
							rows="4"
							class="w-full px-3 py-2 bg-[#1F1F1F] border border-[#404040] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#44D62C] focus:border-transparent transition-colors"
						/>
					</div>
					<div>
						<label for="user" class="block text-sm font-medium text-[#999999] mb-2">
							User
						</label>
						<input
							bind:value={user}
							name="user"
							type="text"
							class="w-full px-3 py-2 bg-[#1F1F1F] border border-[#404040] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#44D62C] focus:border-transparent transition-colors"
						/>
					</div>
					<button
						type="submit"
						class="px-4 py-2 bg-[#44D62C] hover:bg-[#3bb925] text-black font-medium rounded-md transition-colors text-sm"
					>
						Send Message
					</button>
				</form>
			</div>

			<!-- Bots Table -->
			<div class="bg-[#2B2B2B] rounded-lg p-6 border border-[#404040]">
				<h2 class="text-[#999999] text-sm font-medium mb-6">Discord Bots</h2>
				<BotTable bots={data.bots} />
			</div>

			<!-- Alert Message -->
			{#if form?.success}
				<Alert message={form.message} status={204} />
			{:else if form?.error}
				<Alert message={form.message} status={400} />
			{/if}
		</div>
	</div>
</div>

<svelte:head>
	<title>Discord tools</title>
</svelte:head>

<main class="min-h-screen bg-neutral-900 text-neutral-200">
  <h2 class="text-2xl font-bold mb-6">Discord Integration</h2>
  <!-- Add your Discord-related components here -->
</main>

<h1 class="text-xl text-center basis-full">Discord tools</h1>

    <div class="flex justify-center p-4">
        <a href="/discord/webhooks" class="btn btn-secondary m-1">Cadastrar webhooks de Discord</a>
        <a href="/discord/bots" class="btn btn-secondary m-1">Criar personagem</a>
        <a href="/discord/messages" class="btn btn-secondary m-1">Enviar mensagem para discord</a>
    </div>
