<script lang="ts">
  import { onMount } from 'svelte'
  import BurgerMenu from './lib/BurgerMenu.svelte'
  import LanguageSelector from './lib/LanguageSelector.svelte'
  import TournamentCalendar from './lib/TournamentCalendar.svelte'
  import type { Tournament } from './lib/types.js'
  import { fetchTournaments, ApiError } from './lib/api.js'

  let title = 'AjedrezCerca.es'
  let tournaments = $state<Tournament[]>([])
  let loading = $state(true)
  let error = $state<string | null>(null)
  
  onMount(async () => {
    try {
      loading = true
      error = null
      tournaments = await fetchTournaments()
    } catch (err) {
      if (err instanceof ApiError) {
        error = err.message
      } else {
        error = 'An unexpected error occurred while loading tournaments.'
      }
      console.error('Error fetching tournaments:', err)
    } finally {
      loading = false
    }
  })
  
</script>

<BurgerMenu />
<LanguageSelector />

<main class="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-8">
  <div class="container mx-auto px-4">
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">{title}</h1>
      <p class="text-lg text-gray-600 dark:text-gray-300">Chess tournaments and events in Spain</p>
    </div>
    
    {#if loading}
      <!-- Loading State -->
      <div class="flex flex-col items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p class="text-gray-600 dark:text-gray-300">Loading tournaments...</p>
      </div>
    {:else if error}
      <!-- Error State -->
      <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-2xl mx-auto">
        <div class="flex items-center mb-4">
          <svg class="w-6 h-6 text-red-600 dark:text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="text-lg font-semibold text-red-800 dark:text-red-200">Error Loading Tournaments</h3>
        </div>
        <p class="text-red-700 dark:text-red-300 mb-4">{error}</p>
        <button 
          class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          onclick={async () => {
            try {
              loading = true
              error = null
              tournaments = await fetchTournaments()
            } catch (err) {
              if (err instanceof ApiError) {
                error = err.message
              } else {
                error = 'An unexpected error occurred while loading tournaments.'
              }
            } finally {
              loading = false
            }
          }}
        >
          Retry
        </button>
      </div>
    {:else}
      <!-- Success State -->
      <TournamentCalendar tournaments={tournaments} />
    {/if}
  </div>
</main>
