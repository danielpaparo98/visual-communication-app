<template>
  <div class="relative">
    <div class="absolute inset-0 blur-xl h-[580px]" :style="{
      background: 'linear-gradient(143.6deg, rgba(192, 132, 252, 0) 20.79%, rgba(232, 121, 249, 0.26) 40.92%, rgba(204, 171, 238, 0) 70.35%)',
    }"></div>
    <div class="relative">
      <!-- Section -->
      <section>
        <div class="max-w-screen-xl mx-auto px-4 py-28 gap-12 text-gray-600 overflow-hidden md:px-8 md:flex">
          <div class='flex-none space-y-5 max-w-xl'>
            <h1 class="text-4xl text-gray-800 font-extrabold sm:text-5xl">
              Simple and effective visual communication charts
            </h1>
            <p>
              A free and easy communication tool built to help you express yourself visually
            </p>
            <div class='flex items-center gap-x-3 sm:text-sm'>
              <a href="/app"
                class="flex items-center justify-center gap-x-1 py-2 px-4 text-white font-medium bg-gray-800 duration-150 hover:bg-gray-700 active:bg-gray-900 rounded-full md:inline-flex">
                Build a chart
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                  <path fillRule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          <div class='flex-1 hidden md:block'>
            <img
              src="https://raw.githubusercontent.com/sidiDev/remote-assets/c86a7ae02ac188442548f510b5393c04140515d7/undraw_progressive_app_m-9-ms_oftfv5.svg"
              class="max-w-xl" />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
