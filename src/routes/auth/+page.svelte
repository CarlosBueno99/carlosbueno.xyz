<script>
	import { signIn, signOut } from '@auth/sveltekit/client';
	import { page } from '$app/stores';
</script>


	<h1 class="text-center p-4">Authentication</h1>
	<p class="text-center p-2">
		{#if $page.data.session}
			{#if $page.data.session.user?.image}
				<span style="background-image: url('{$page.data.session.user.image}')" class="avatar" />
			{/if}
			<span class="">
				<small class="text-primary">Signed in as</small>
				<strong>{$page.data.session.user?.name ?? 'User'}</strong>
			</span>
            <br />
			<button class="btn btn-error" on:click={() => signOut()}>Sign out</button>
		{:else}
			<span class="text-primary">You are not signed in</span>
			<br />
			<button class="btn btn-primary" on:click={() => signIn('google')}>Sign In with Google</button>
            <button class="btn btn-error" on:click={() => signOut()}>Sign out</button>
			<br />
			<button class="btn btn-primary" on:click={() => signIn('github')}>Sign In with Google</button>
            <button class="btn btn-error" on:click={() => signOut()}>Sign out</button>

            
		{/if}
	</p>

