<script lang="ts">
  let count = $state(0)
  const increment = () => count++
</script>

<button 
  onclick={increment}
  class="font-semibold text-gray-900 dark:text-white bg-transparent border border-blue-500 rounded-lg px-4 py-2 cursor-pointer transition-all duration-200 hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
>
  count is {count}
</button>