<script lang="ts">
    import ExerciseCalendar from '$lib/components/ExerciseCalendar.svelte';
    import ExerciseForm from '$lib/components/ExerciseForm.svelte';
    import { enhance } from '$app/forms';
    
    export let data;
</script>

<div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-white mb-8">Exercise Tracking</h1>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
            <ExerciseCalendar exercises={data.exercises} />
        </div>
        
        <div class="lg:col-span-1">
            <ExerciseForm />
        </div>
    </div>
</div> 