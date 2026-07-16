<template>
  <header class="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100 no-print">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2.5 group" aria-label="The Talking Chart — Home">
        <div class="w-8 h-8 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" class="w-full h-full">
            <rect x="2" y="2" width="28" height="24" rx="6" fill="currentColor" class="text-primary-500"/>
            <path d="M8 26 L6 32 L14 26" fill="currentColor" class="text-primary-500"/>
            <rect x="8" y="7" width="7" height="6" rx="1.5" fill="white" opacity="0.9"/>
            <rect x="17" y="7" width="7" height="6" rx="1.5" fill="white" opacity="0.9"/>
            <rect x="8" y="15" width="7" height="6" rx="1.5" fill="white" opacity="0.9"/>
            <rect x="17" y="15" width="7" height="6" rx="1.5" fill="white" opacity="0.9"/>
            <circle cx="11.5" cy="10" r="1.5" fill="currentColor" class="text-primary-500"/>
            <circle cx="20.5" cy="10" r="1.5" fill="currentColor" class="text-primary-500"/>
            <circle cx="11.5" cy="18" r="1.5" fill="currentColor" class="text-primary-500"/>
            <circle cx="20.5" cy="18" r="1.5" fill="currentColor" class="text-primary-500"/>
          </svg>
        </div>
        <span class="font-heading font-extrabold text-lg sm:text-xl text-slate-800 group-hover:text-primary-600 transition-colors">
          TheTalkingChart<span class="text-primary-500">.com</span>
        </span>
      </NuxtLink>

      <!-- Nav -->
      <nav class="flex items-center gap-3" aria-label="Main navigation">
        <NuxtLink to="/chart" class="btn-primary !px-4 sm:!px-5 !py-2 !text-sm !rounded-lg">
          Make a Chart
        </NuxtLink>
        <a
          href="https://github.com/papar/visual-communication-app"
          target="_blank"
          rel="noopener noreferrer"
          class="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
          aria-label="View source on GitHub"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
          </svg>
        </a>
      </nav>
    </div>
  </header>
</template>
