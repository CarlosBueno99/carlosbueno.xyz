<script lang="ts">
	export const focus: string = '';
	import { page } from '$app/stores';
	
</script>

<div class="navbar bg-base-500">
	<div class="navbar-start">
		<div class="dropdown dropdown-hover">
			<button tabindex="-1" class="btn btn-ghost btn-primary m-2">Menu</button>
			<ul tabindex="-1" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
				<li>
					<a href="/discord"
						>Discord service <span class="bg-green-400 text-black badge">New</span>
					</a>
				</li>
			</ul>
		</div>
	</div>
	<div class="navbar-center">
		<a class="btn btn-ghost btn-primary btn-wide" href="/">What's Carlos doing?</a>
	</div>
	<div class="navbar-end">
		<div class="flex-none gap-2">
			<div class="dropdown dropdown-end">
				<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
				<div tabindex="0" class="btn btn-ghost btn-circle avatar">
					<div class="w-10 rounded-full">
						{#if $page.data?.session?.user?.image}
							<img src={$page.data?.session?.user?.image} alt="profile_pic" />
						{:else}
							<img src="/asdf.jpeg" alt="profile_pic" />
						{/if}
					</div>
				</div>
				<ul
					tabindex="-1"
					class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
				>
					<li>
						<a class="justify-between" href="/profile">
							Profile
							<span class="badge">Todo</span>
						</a>
					</li>
					<li><a href="/about">About</a></li>
					<li><a href="/auth">Auth</a></li>
				</ul>
			</div>
		</div>
	</div>
</div>
