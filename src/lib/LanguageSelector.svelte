<script lang="ts">
  let isOpen = $state(false)
  let selectedLanguage = $state('esp')
  
  const toggleDropdown = () => {
    isOpen = !isOpen
  }
  
  const closeDropdown = () => {
    isOpen = false
  }
  
  const selectLanguage = (langCode: string) => {
    selectedLanguage = langCode
    closeDropdown()
  }
  
  const languages = [
    { code: 'cat', name: 'Català', flag: '🟡🔴' },
    { code: 'esp', name: 'Español', flag: '🇪🇸' },
    { code: 'eng', name: 'English', flag: '🇺🇸' },
    { code: 'fra', name: 'Français', flag: '🇫🇷' }
  ]
  
  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === selectedLanguage) || languages[1]
  }
</script>

<div class="fixed top-5 right-5 z-[1000] md:top-8 md:right-8">
  <div class="relative">
    <button 
      class="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer text-sm md:text-base"
      onclick={toggleDropdown}
      aria-label="Select language"
      aria-expanded={isOpen}
    >
      <span class="text-lg">{getCurrentLanguage().flag}</span>
      <span class="text-gray-700 dark:text-gray-200 font-medium uppercase">{getCurrentLanguage().code}</span>
      <svg class="w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200" class:rotate-180={isOpen} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </button>
    
    {#if isOpen}
      <button 
        class="fixed inset-0 z-[998] bg-transparent border-none cursor-pointer" 
        onclick={closeDropdown}
        onkeydown={(e) => e.key === 'Escape' && closeDropdown()}
        aria-label="Close language selector"
      ></button>
      
      <div class="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-[999] overflow-hidden">
        {#each languages as language}
          <button
            class="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-none bg-transparent cursor-pointer text-sm md:text-base"
            class:bg-gray-100={selectedLanguage === language.code}
            class:dark:bg-gray-700={selectedLanguage === language.code}
            onclick={() => selectLanguage(language.code)}
          >
            <span class="text-lg">{language.flag}</span>
            <div class="flex flex-col">
              <span class="text-gray-900 dark:text-white font-medium">{language.name}</span>
              <span class="text-gray-500 dark:text-gray-400 text-xs uppercase">{language.code}</span>
            </div>
            {#if selectedLanguage === language.code}
              <svg class="w-4 h-4 text-blue-600 dark:text-blue-400 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
            {/if}
          </button>
        {/each}
      </div>
    {/if}
  </div>
</div>