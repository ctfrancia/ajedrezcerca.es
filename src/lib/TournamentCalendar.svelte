<script lang="ts">
  import type { Tournament, TournamentSchedule } from './types.js'
  
  interface Props {
    tournaments?: Tournament[]
  }
  
  const { tournaments = [] }: Props = $props()
  
  let currentDate = $state(new Date())
  let selectedDate = $state<Date | null>(null)
  
  // Filter state
  let filters = $state({
    states: ['open', 'closed', 'completed'] as ('open' | 'closed' | 'completed')[],
    minPrizePool: 0,
    maxPrizePool: 1000,
    locations: [] as string[],
    showFilters: false
  })
  
  // Get unique locations from tournaments
  const getUniqueLocations = () => {
    return [...new Set(tournaments.map(t => t.location))]
  }
  
  // Filter tournaments based on current filters
  const getFilteredTournaments = () => {
    return tournaments.filter(tournament => {
      // State filter
      if (!filters.states.includes(tournament.state)) return false
      
      // Prize pool filter
      if (tournament.prize_pool < filters.minPrizePool || tournament.prize_pool > filters.maxPrizePool) return false
      
      // Location filter (if any locations selected)
      if (filters.locations.length > 0 && !filters.locations.includes(tournament.location)) return false
      
      return true
    })
  }
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  const goToPreviousMonth = () => {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
  }
  
  const goToNextMonth = () => {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
  }
  
  const goToToday = () => {
    currentDate = new Date()
    selectedDate = new Date()
  }
  
  const selectDate = (date: Date) => {
    selectedDate = date
  }
  
  const getCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days: Date[] = []
    const current = new Date(startDate)
    
    while (days.length < 42) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    
    return days
  }
  
  const getTournamentsForDate = (date: Date) => {
    return getFilteredTournaments().filter(tournament => {
      const tournamentStart = new Date(tournament.tournament_start_date)
      const tournamentEnd = tournament.tournament_end_date ? new Date(tournament.tournament_end_date) : null
      
      // Check if date is within tournament series date range
      if (date < new Date(tournamentStart.toDateString())) return false
      if (tournamentEnd && date > new Date(tournamentEnd.toDateString())) return false
      
      // Check if date matches any of the tournament's scheduled days
      const dayOfWeek = date.getDay()
      return tournament.schedules.some(schedule => schedule.day_of_week === dayOfWeek)
    })
  }
  
  const getScheduleForTournamentAndDate = (tournament: Tournament, date: Date) => {
    const dayOfWeek = date.getDay()
    return tournament.schedules.find(schedule => schedule.day_of_week === dayOfWeek)
  }
  
  const getScheduleDescription = (schedules: TournamentSchedule[]) => {
    const dayMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    
    if (schedules.length === 1) {
      const schedule = schedules[0]
      return `${dayMap[schedule.day_of_week]}s ${schedule.start_time}-${schedule.end_time}`
    }
    
    return schedules.map(schedule => 
      `${dayMap[schedule.day_of_week]} ${schedule.start_time}-${schedule.end_time}`
    ).join(', ')
  }
  
  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }
  
  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString()
  }
  
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth()
  }
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }
  
  const getSelectedDateTournaments = () => {
    if (!selectedDate) return []
    return getTournamentsForDate(selectedDate)
  }
</script>

<div class="max-w-6xl mx-auto p-4">
  <!-- Filter Section -->
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-6 overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Showing {getFilteredTournaments().length} of {tournaments.length} tournaments
          </p>
        </div>
        <button 
          class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          onclick={() => filters.showFilters = !filters.showFilters}
        >
          {filters.showFilters ? 'Hide' : 'Show'} Filters
        </button>
      </div>
    </div>
    
    {#if filters.showFilters}
      <div class="p-6 space-y-6">
        <!-- Tournament State Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tournament Status
          </label>
          <div class="flex gap-4">
            {#each ['open', 'closed', 'completed'] as state}
              <label class="flex items-center">
                <input 
                  type="checkbox" 
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={filters.states.includes(state)}
                  onchange={(e) => {
                    const target = e.target as HTMLInputElement
                    if (target.checked) {
                      filters.states = [...filters.states, state as any]
                    } else {
                      filters.states = filters.states.filter(s => s !== state)
                    }
                  }}
                />
                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">
                  {state}
                </span>
              </label>
            {/each}
          </div>
        </div>

        <!-- Prize Pool Filter -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Min Prize Pool (€)
            </label>
            <input 
              type="number" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              bind:value={filters.minPrizePool}
              min="0"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Max Prize Pool (€)
            </label>
            <input 
              type="number" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              bind:value={filters.maxPrizePool}
              min="0"
            />
          </div>
        </div>

        <!-- Location Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Locations
          </label>
          <div class="space-y-2 max-h-32 overflow-y-auto">
            {#each getUniqueLocations() as location}
              <label class="flex items-start">
                <input 
                  type="checkbox" 
                  class="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={filters.locations.includes(location)}
                  onchange={(e) => {
                    const target = e.target as HTMLInputElement
                    if (target.checked) {
                      filters.locations = [...filters.locations, location]
                    } else {
                      filters.locations = filters.locations.filter(l => l !== location)
                    }
                  }}
                />
                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {location}
                </span>
              </label>
            {/each}
          </div>
        </div>

        <!-- Clear Filters Button -->
        <div class="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-600">
          <button 
            class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            onclick={() => {
              filters.states = ['open', 'closed', 'completed']
              filters.minPrizePool = 0
              filters.maxPrizePool = 1000
              filters.locations = []
            }}
          >
            Clear All Filters
          </button>
        </div>
      </div>
    {/if}
  </div>

  <!-- Calendar -->
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
    <!-- Calendar Header -->
    <div class="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
      </h2>
      <div class="flex items-center gap-2">
        <button 
          class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          onclick={goToToday}
        >
          Today
        </button>
        <button 
          class="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
          onclick={goToPreviousMonth}
          aria-label="Previous month"
        >
          <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        <button 
          class="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
          onclick={goToNextMonth}
          aria-label="Next month"
        >
          <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="p-6">
      <!-- Day Headers -->
      <div class="grid grid-cols-7 gap-2 mb-2">
        {#each dayNames as day}
          <div class="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2">
            {day}
          </div>
        {/each}
      </div>
      
      <!-- Calendar Days -->
      <div class="grid grid-cols-7 gap-2">
        {#each getCalendarDays() as date}
          {@const dayTournaments = getTournamentsForDate(date)}
          <button
            class="relative min-h-[80px] p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
            class:bg-blue-50={isSelected(date)}
            class:dark:bg-blue-900={isSelected(date)}
            class:border-blue-500={isSelected(date)}
            class:text-gray-400={!isCurrentMonth(date)}
            class:dark:text-gray-500={!isCurrentMonth(date)}
            onclick={() => selectDate(date)}
          >
            <div class="flex items-start justify-between">
              <span 
                class="text-sm font-medium"
                class:bg-blue-600={isToday(date)}
                class:text-white={isToday(date)}
                class:rounded-full={isToday(date)}
                class:w-6={isToday(date)}
                class:h-6={isToday(date)}
                class:flex={isToday(date)}
                class:items-center={isToday(date)}
                class:justify-center={isToday(date)}
              >
                {date.getDate()}
              </span>
              {#if dayTournaments.length > 0}
                <span class="text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                  {dayTournaments.length}
                </span>
              {/if}
            </div>
            
            {#if dayTournaments.length > 0}
              <div class="mt-1 space-y-1">
                {#each dayTournaments.slice(0, 2) as tournament}
                  <div class="text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded truncate">
                    {tournament.name}
                  </div>
                {/each}
                {#if dayTournaments.length > 2}
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    +{dayTournaments.length - 2} more
                  </div>
                {/if}
              </div>
            {/if}
          </button>
        {/each}
      </div>
    </div>
  </div>

  <!-- Selected Date Details -->
  {#if selectedDate}
    <div class="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
        {formatDate(selectedDate)}
      </h3>
      
      {#if getSelectedDateTournaments().length > 0}
        {@const selectedTournaments = getSelectedDateTournaments()}
        <div class="space-y-4">
          {#each selectedTournaments as tournament}
            {@const todaySchedule = getScheduleForTournamentAndDate(tournament, selectedDate)}
            <div class="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h4 class="text-lg font-semibold text-gray-900 dark:text-white">
                    {tournament.name}
                  </h4>
                  <p class="text-gray-600 dark:text-gray-300 mt-1">
                    {tournament.description}
                  </p>
                  <div class="mt-2 space-y-1 text-sm text-gray-500 dark:text-gray-400">
                    
                    {#if todaySchedule}
                      <div class="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Today: {todaySchedule.start_time} - {todaySchedule.end_time}
                      </div>
                    {/if}
                    
                    <div class="flex items-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <div>
                        <div>Schedule: {getScheduleDescription(tournament.schedules)}</div>
                        <div class="text-xs text-gray-400">
                          {new Date(tournament.tournament_start_date).toLocaleDateString()} - 
                          {tournament.tournament_end_date ? new Date(tournament.tournament_end_date).toLocaleDateString() : 'Ongoing'}
                        </div>
                      </div>
                    </div>
                    
                    <div class="flex items-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      {tournament.location}
                    </div>
                    <div class="flex items-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                      </svg>
                      Prize Pool: €{tournament.prize_pool}
                    </div>
                    <div class="flex items-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                      {tournament.player_count}/{tournament.player_count_limit_enabled ? tournament.player_count_limit : '∞'} players
                    </div>
                  </div>
                </div>
                <div class="ml-4 flex flex-col items-end gap-2">
                  <span class="px-2 py-1 text-xs font-semibold rounded-full"
                        class:bg-green-100={tournament.state === 'open'}
                        class:text-green-800={tournament.state === 'open'}
                        class:dark:bg-green-800={tournament.state === 'open'}
                        class:dark:text-green-200={tournament.state === 'open'}
                        class:bg-red-100={tournament.state === 'closed'}
                        class:text-red-800={tournament.state === 'closed'}
                        class:dark:bg-red-800={tournament.state === 'closed'}
                        class:dark:text-red-200={tournament.state === 'closed'}
                        class:bg-blue-100={tournament.state === 'completed'}
                        class:text-blue-800={tournament.state === 'completed'}
                        class:dark:bg-blue-800={tournament.state === 'completed'}
                        class:dark:text-blue-200={tournament.state === 'completed'}
                  >
                    {tournament.state.toUpperCase()}
                  </span>
                  {#if tournament.enable_registration && tournament.state === 'open'}
                    <button class="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                      Register
                    </button>
                  {/if}
                </div>
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <p class="text-gray-500 dark:text-gray-400">No tournaments scheduled for this date.</p>
      {/if}
    </div>
  {/if}
</div>