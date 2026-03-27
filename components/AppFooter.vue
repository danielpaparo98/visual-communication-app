<template>
  <footer class="relative bg-gradient-to-b from-gray-50 to-white py-12 print:hidden overflow-hidden">
    <!-- Decorative top wave -->
    <div class="absolute top-0 left-0 right-0 transform rotate-180">
      <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto">
        <path d="M0 60L60 52.5C120 45 240 30 360 22.5C480 15 600 15 720 18.75C840 22.5 960 30 1080 33.75C1200 37.5 1320 37.5 1380 37.5L1440 37.5V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z" fill="white"/>
      </svg>
    </div>
    
    <div class="container mx-auto px-4 relative">
      <div class="max-w-4xl mx-auto">
        <!-- Main footer content -->
        <div class="flex flex-col items-center gap-6 text-center">
          <!-- Logo -->
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-md">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <span class="text-lg font-heading font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
              The Talking Chart
            </span>
          </div>
          
          <!-- Tagline -->
          <p class="text-gray-600 flex items-center gap-2">
            Made with
            <svg class="w-5 h-5 text-rose-500 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            to help people communicate
          </p>
          
          <!-- Links -->
          <div class="flex items-center gap-6">
            <a
              href="https://github.com/paparazzi/visual-communication-app"
              target="_blank"
              rel="noopener noreferrer"
              class="group flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
            >
              <svg class="w-5 h-5 transform group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
              </svg>
              <span class="text-sm font-medium">View on GitHub</span>
            </a>
          </div>
          
          <!-- Divider -->
          <div class="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
          
          <!-- Copyright -->
          <p class="text-xs text-gray-400">
            © {{ new Date().getFullYear() }} The Talking Chart. Free & Open Source under MIT License.
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Footer component
</script>
