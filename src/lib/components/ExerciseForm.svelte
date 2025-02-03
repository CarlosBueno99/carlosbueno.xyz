<script lang="ts">
    import { enhance } from '$app/forms';
    
    let checkInDate = new Date();
    let checkOutDate = new Date();
    
    $: formattedCheckIn = formatDateTime(checkInDate);
    $: formattedCheckOut = formatDateTime(checkOutDate);
    
    function formatDateTime(date: Date) {
        return date.toISOString().slice(0, 16);
    }
</script>

<div class="bg-[#2B2B2B] rounded-lg p-6">
    <h3 class="text-xl font-semibold text-white mb-4">Log Exercise Session</h3>
    
    <form method="POST" action="?/addExercise" use:enhance class="space-y-4">
        <div>
            <label for="check_in" class="block text-sm font-medium text-gray-300 mb-1">
                Check-in Time
            </label>
            <input
                type="datetime-local"
                id="check_in"
                name="check_in"
                value={formattedCheckIn}
                class="w-full px-3 py-2 bg-[#1F1F1F] border border-[#404040] rounded-md text-white focus:ring-2 focus:ring-[#44D62C] focus:border-transparent"
                required
            />
        </div>
        
        <div>
            <label for="check_out" class="block text-sm font-medium text-gray-300 mb-1">
                Check-out Time
            </label>
            <input
                type="datetime-local"
                id="check_out"
                name="check_out"
                value={formattedCheckOut}
                class="w-full px-3 py-2 bg-[#1F1F1F] border border-[#404040] rounded-md text-white focus:ring-2 focus:ring-[#44D62C] focus:border-transparent"
                required
            />
        </div>
        
        <button
            type="submit"
            class="w-full bg-[#44D62C] text-black font-medium py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors"
        >
            Log Exercise
        </button>
    </form>
</div> 