<script lang="ts">
    import { onMount } from 'svelte';
    
    export let exercises: Array<{
        id: number;
        check_in: string;
        check_out: string;
    }> = [];

    $: {
        console.log('Calendar: Received exercises:', exercises);
    }

    let displayDate = new Date();
    let currentDate = new Date();
    $: currentMonth = displayDate.getMonth();
    $: currentYear = displayDate.getFullYear();
    
    $: monthDays = getMonthDays(currentMonth, currentYear);
    $: weekGroups = groupIntoWeeks(monthDays);
    
    function previousMonth() {
        displayDate = new Date(currentYear, currentMonth - 1);
    }

    function nextMonth() {
        displayDate = new Date(currentYear, currentMonth + 1);
    }

    function goToToday() {
        displayDate = new Date();
    }
    
    function isInCurrentWeek(date: Date) {
        const today = new Date();
        const firstDayOfWeek = new Date(today);
        firstDayOfWeek.setDate(today.getDate() - today.getDay());
        firstDayOfWeek.setHours(0, 0, 0, 0);
        
        const lastDayOfWeek = new Date(firstDayOfWeek);
        lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
        lastDayOfWeek.setHours(23, 59, 59, 999);
        
        return date >= firstDayOfWeek && date <= lastDayOfWeek;
    }

    function isCurrentWeek(week: Array<{ date: Date, isPadding: boolean }>) {
        return week.some(({ date }) => isInCurrentWeek(date));
    }
    
    function groupIntoWeeks(days: Array<{ date: Date, isPadding: boolean }>) {
        const weeks = [];
        for (let i = 0; i < days.length; i += 7) {
            weeks.push(days.slice(i, i + 7));
        }
        return weeks;
    }
    
    function getMonthDays(month: number, year: number) {
        const days = [];
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        // Add padding days for the days before the first of the month
        const firstDayOfWeek = firstDay.getDay();
        for (let i = 0; i < firstDayOfWeek; i++) {
            const paddingDay = new Date(firstDay);
            paddingDay.setDate(paddingDay.getDate() - (firstDayOfWeek - i));
            days.push({ isPadding: true, date: paddingDay });
        }
        
        // Add the actual days of the month
        for (let d = 1; d <= lastDay.getDate(); d++) {
            days.push({ isPadding: false, date: new Date(year, month, d) });
        }
        
        // Add padding days for the end of the month if needed
        const lastDayOfWeek = lastDay.getDay();
        if (lastDayOfWeek < 6) {
            for (let i = 1; i <= 6 - lastDayOfWeek; i++) {
                const paddingDay = new Date(lastDay);
                paddingDay.setDate(paddingDay.getDate() + i);
                days.push({ isPadding: true, date: paddingDay });
            }
        }
        
        return days;
    }
    
    function hasExercise(date: Date) {
        console.log('Checking date:', {
            date,
            exercises,
            dateString: date.toISOString(),
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate()
        });
        
        const result = exercises.some(exercise => {
            const [datePart] = exercise.check_in.split('T');
            const [year, month, day] = datePart.split('-').map(Number);
            
            console.log('Comparing with exercise:', {
                exercise,
                datePart,
                parsed: { year, month, day },
                calendar: {
                    year: date.getFullYear(),
                    month: date.getMonth() + 1,
                    day: date.getDate()
                }
            });
            
            const matches = date.getFullYear() === year &&
                   date.getMonth() === month - 1 && // SQL months are 1-based, JS months are 0-based
                   date.getDate() === day;
            
            if (matches) {
                console.log('Found match!');
            }
            
            return matches;
        });
        return result;
    }

    function formatDate(date: Date) {
        return date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        });
    }
</script>

<div class="bg-[#2B2B2B] rounded-lg p-4">
    <div class="flex items-center justify-between mb-4">
        <button 
            class="text-gray-400 hover:text-white px-2 py-1 rounded"
            on:click={previousMonth}
        >
            ←
        </button>
        <div class="flex gap-4 items-center">
            <h3 class="text-xl font-semibold text-white">
                {displayDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            <button 
                class="text-sm text-gray-400 hover:text-white px-2 py-1 rounded"
                on:click={goToToday}
            >
                Today
            </button>
        </div>
        <button 
            class="text-gray-400 hover:text-white px-2 py-1 rounded"
            on:click={nextMonth}
        >
            →
        </button>
    </div>
    <div class="grid grid-cols-7">
        {#each ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as day}
            <div class="text-center text-sm text-gray-400 mb-2">{day}</div>
        {/each}
        
        {#each weekGroups as week}
            <div class="contents">
                <div class="col-span-7 relative">
                    {#if isCurrentWeek(week)}
                        <div class="absolute inset-0 bg-[#404040] rounded-md -mx-2"></div>
                    {/if}
                    <div class="grid grid-cols-7 relative z-10">
                        {#each week as { date, isPadding }}
                            <div class="text-center py-1">
                                <div class="h-10 w-10 mx-auto flex items-center justify-center rounded-full 
                                    {hasExercise(date) ? 'bg-[#44D62C] text-black' : 
                                    isPadding ? 'text-gray-600 bg-[#333333]' : 
                                    'bg-[#333333] text-gray-300'}"
                                >
                                    {date.getDate()}
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>
        {/each}
    </div>
</div>

<style>
    /* Remove the previous style since we're using a different approach */
</style> 