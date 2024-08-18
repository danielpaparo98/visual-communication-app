<template>
  <footer class="text-gray-500 bg-white px-4 py-5 border-t">
    <div class="max-w-lg sm:mx-auto sm:text-center">
      <img src="/public/logo.svg" class="w-20 sm:mx-auto rounded-2xl" />
      <p class=" leading-relaxed mt-2 text-[15px]">
        An open source and free project built to help the community create easy and intuitive visual communication
        charts.
      </p>
    </div>
    <ul class="items-center justify-center mt-8 space-y-5 sm:flex sm:space-x-4 sm:space-y-0">
      <li class="hover:text-gray-800">
        <a href="/app">
          App
        </a>
      </li>
      <li class="hover:text-gray-800">
        <a href="/contact">
          Contact
        </a>
      </li>
    </ul>
    <div class="mt-8 items-center justify-between sm:flex max-w-screen-xl mx-auto">
      <div class="mt-4 sm:mt-0">
        Created with by 💜 by <a href="#" class="text-blue-500 hover:text-blue-400">Daniel
          Paparo</a> &copy; 2024.
      </div>
      <div class="mt-6 sm:mt-0">
        <ul class="flex items-center space-x-4">
          <li class="w-10 h-10 border rounded-full flex items-center justify-center">
            <a href="https://github.com/danielpaparo98/visual-communication-app">

            </a>
          </li>
        </ul>
      </div>
    </div>

  </footer>
</template>

<style scoped>
.svg-icon path,
.svg-icon polygon,
.svg-icon rect {
  fill: currentColor;
}
</style>