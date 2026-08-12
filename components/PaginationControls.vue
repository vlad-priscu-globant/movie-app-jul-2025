<script setup lang="ts">
const props = defineProps<{
  currentPage: number
  totalPages: number
}>()

const emit = defineEmits<{
  (e: 'pageChange', page: number): void
}>()

/**
 * Builds a sliding window of page numbers with ellipsis placeholders.
 * Always shows first page, last page, and up to 5 pages around current.
 */
const visiblePages = computed<Array<number | '...'>>(() => {
  const total = props.totalPages
  const current = props.currentPage

  // Show all pages if total is small
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: Array<number | '...'> = []

  // Always show page 1
  pages.push(1)

  // Left ellipsis
  if (current > 4) {
    pages.push('...')
  }

  // Window around current page
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  // Right ellipsis
  if (current < total - 3) {
    pages.push('...')
  }

  // Always show last page
  pages.push(total)

  return pages
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('pageChange', page)
  }
}
</script>

<template>
  <nav
    v-if="totalPages > 1"
    aria-label="Pagination"
    class="flex items-center justify-center gap-1.5 sm:gap-2 mt-10 mb-4 select-none"
  >
    <!-- Previous Button -->
    <button
      id="pagination-prev"
      :disabled="currentPage <= 1"
      @click="goToPage(currentPage - 1)"
      class="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
             bg-gray-800 border border-gray-700 cursor-pointer
             hover:bg-gray-700 hover:border-red-600 hover:text-red-400
             disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-gray-800 disabled:hover:border-gray-700 disabled:hover:text-gray-400"
      :class="currentPage <= 1 ? 'text-gray-500' : 'text-gray-300'"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      <span class="hidden sm:inline">Înapoi</span>
    </button>

    <!-- Page Numbers -->
    <template v-for="(page, index) in visiblePages" :key="`page-${index}`">
      <!-- Ellipsis -->
      <span
        v-if="page === '...'"
        class="px-2 py-2 text-gray-500 text-sm select-none"
      >
        …
      </span>

      <!-- Page Number Button -->
      <button
        v-else
        :id="`pagination-page-${page}`"
        @click="goToPage(page as number)"
        class="min-w-[40px] h-[40px] flex items-center justify-center rounded-lg text-sm font-semibold transition-all duration-200 border cursor-pointer"
        :class="page === currentPage
          ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/25 scale-110'
          : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-red-600 hover:text-red-400'"
      >
        {{ page }}
      </button>
    </template>

    <!-- Next Button -->
    <button
      id="pagination-next"
      :disabled="currentPage >= totalPages"
      @click="goToPage(currentPage + 1)"
      class="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
             bg-gray-800 border border-gray-700 cursor-pointer
             hover:bg-gray-700 hover:border-red-600 hover:text-red-400
             disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-gray-800 disabled:hover:border-gray-700 disabled:hover:text-gray-400"
      :class="currentPage >= totalPages ? 'text-gray-500' : 'text-gray-300'"
    >
      <span class="hidden sm:inline">Următoarea</span>
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </nav>
</template>
