<script lang="ts">
	export const focus: string = '';
	import { page } from '$app/stores';
	let isMenuOpen = false;
	let isProfileMenuOpen = false;

	$: if ($page?.data?.session) {
		console.log('Session data:', $page.data.session);
		console.log('User image:', $page.data.session?.user?.image);
	}

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	function toggleProfileMenu() {
		isProfileMenuOpen = !isProfileMenuOpen;
	}

	// Close menu when clicking outside
	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.menu-container')) {
			isMenuOpen = false;
		}
		if (!target.closest('.profile-menu-container')) {
			isProfileMenuOpen = false;
		}
	}
</script>

<svelte:window on:click={handleClickOutside} />

<nav class="bg-[#2B2B2B] border-b border-[#404040] px-6 py-3">
	<div class="max-w-7xl mx-auto flex justify-between items-center">
		<div class="flex-1 flex items-center">
			<div class="relative menu-container">
				<button 
					class="px-4 py-2 text-[#999999] hover:text-white hover:bg-[#404040] rounded-md transition-colors"
					on:click|stopPropagation={toggleMenu}
				>
					Menu
				</button>
				<ul 
					class="absolute left-0 mt-2 w-52 bg-[#1F1F1F] border border-[#404040] rounded-md shadow-lg py-1 z-50 transition-all"
					class:hidden={!isMenuOpen}
				>
					<li>
						<a href="/discord" class="block px-4 py-2 text-sm text-[#999999] hover:bg-[#404040] hover:text-white transition-colors">
							Discord service 
							<span class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#44D62C] text-black">
								New
							</span>
						</a>
					</li>
					<li>
						<a href="/tracking" class="block px-4 py-2 text-sm text-[#999999] hover:bg-[#404040] hover:text-white transition-colors">
							Location Tracking
							<span class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#44D62C] text-black">
								New
							</span>
						</a>
					</li>
					<li>
						<a href="/exercise" class="block px-4 py-2 text-sm text-[#999999] hover:bg-[#404040] hover:text-white transition-colors">
							Exercise Tracking
							<span class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#44D62C] text-black">
								New
							</span>
						</a>
					</li>
				</ul>
			</div>
		</div>

		<div class="flex-1 flex justify-center px-4">
			<a class="px-6 py-2 text-white hover:text-[#44D62C] text-xl font-medium transition-colors" href="/">
				What's Carlos doing?
			</a>
		</div>

		<div class="flex-1 flex items-center justify-end">
			<div class="ml-4 relative profile-menu-container">
				<button 
					class="flex items-center p-1 rounded-full hover:ring-2 hover:ring-[#404040] transition-all"
					on:click|stopPropagation={toggleProfileMenu}
				>
					<div class="h-10 w-10 rounded-full overflow-hidden bg-[#404040]">
						{#if $page?.data?.session?.user?.image && $page.data.session.user.image !== ''}
							<img 
								src={$page.data.session.user.image} 
								alt="Profile" 
								class="w-full h-full object-cover"
								referrerpolicy="no-referrer"
								crossorigin="anonymous"
								on:error={(e) => {
									const img = e.currentTarget;
									if (img instanceof HTMLImageElement) {
										img.src = '/asdf.jpeg';
									}
								}}
							/>
						{:else}
							<img 
								src="/asdf.jpeg" 
								alt="Default Profile" 
								class="w-full h-full object-cover"
							/>
						{/if}
					</div>
				</button>
				<ul 
					class="absolute right-0 mt-2 w-52 bg-[#1F1F1F] border border-[#404040] rounded-md shadow-lg py-1 z-50 transition-all"
					class:hidden={!isProfileMenuOpen}
				>
					<li>
						<a class="block px-4 py-2 text-sm text-[#999999] hover:bg-[#404040] hover:text-white transition-colors flex justify-between items-center" href="/profile">
							Profile
							<span class="px-2 py-1 text-xs font-medium bg-[#404040] text-[#999999] rounded-full">
								Todo
							</span>
						</a>
					</li>
					<li><a href="/about" class="block px-4 py-2 text-sm text-[#999999] hover:bg-[#404040] hover:text-white transition-colors">About</a></li>
					<li><a href="/auth" class="block px-4 py-2 text-sm text-[#999999] hover:bg-[#404040] hover:text-white transition-colors">Auth</a></li>
				</ul>
			</div>
		</div>
	</div>
</nav>
