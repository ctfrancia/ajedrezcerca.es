<script lang="ts">
  let isOpen = $state(false)
  
  const toggleMenu = () => {
    isOpen = !isOpen
  }
  
  const closeMenu = () => {
    isOpen = false
  }
  
  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Tournaments', href: '/tournaments' },
    { name: 'Login/Signup', href: '/auth' },
    { name: 'Support', href: '/support' }
  ]
</script>

<nav class="fixed top-5 left-5 z-[1000] md:top-8 md:left-8">
  <button 
    class="flex flex-col justify-around w-8 h-8 md:w-9 md:h-9 bg-transparent border-none cursor-pointer p-0 relative z-[1001] transition-opacity duration-300" 
    class:opacity-0={isOpen}
    class:pointer-events-none={isOpen}
    onclick={toggleMenu}
    aria-label="Toggle navigation menu"
  >
    <span class="w-6 h-0.5 md:w-8 md:h-1 bg-gray-800 dark:bg-white rounded-full"></span>
    <span class="w-6 h-0.5 md:w-8 md:h-1 bg-gray-800 dark:bg-white rounded-full"></span>
    <span class="w-6 h-0.5 md:w-8 md:h-1 bg-gray-800 dark:bg-white rounded-full"></span>
  </button>
  
  {#if isOpen}
    <button 
      class="fixed inset-0 bg-black/50 z-[999] transition-opacity duration-300 border-none cursor-pointer" 
      onclick={closeMenu}
      onkeydown={(e) => e.key === 'Escape' && closeMenu()}
      aria-label="Close menu"
    ></button>
  {/if}
  
  <div class="fixed top-0 left-0 h-screen w-72 md:w-80 bg-white dark:bg-gray-900 shadow-2xl z-[1000] overflow-y-auto transition-transform duration-300" class:translate-x-0={isOpen} class:-translate-x-full={!isOpen}>
    <div class="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <h2 class="m-0 text-lg md:text-xl text-gray-800 dark:text-white font-semibold">AjedrezCerca.es</h2>
      <button 
        class="bg-transparent border-none text-2xl cursor-pointer text-gray-500 dark:text-gray-400 p-0 w-8 h-8 flex items-center justify-center hover:text-gray-800 dark:hover:text-white transition-colors" 
        onclick={closeMenu} 
        aria-label="Close menu"
      >
        ×
      </button>
    </div>
    
    <ul class="list-none p-0 m-0">
      {#each navItems as item}
        <li class="border-b border-gray-200 dark:border-gray-700">
          <a 
            href={item.href} 
            onclick={closeMenu}
            class="block px-5 py-4 md:px-6 md:py-5 no-underline text-gray-800 dark:text-white font-medium text-base md:text-lg transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-blue-600"
          >
            {item.name}
          </a>
        </li>
      {/each}
    </ul>
  </div>
</nav>