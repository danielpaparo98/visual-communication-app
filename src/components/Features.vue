<template>
    <section class="py-14">
      <div class="max-w-screen-xl mx-auto px-4 text-gray-600 md:px-8">
        <div class="max-w-xl mx-auto space-y-3 sm:text-center">
          <h3 class="text-indigo-600 font-semibold">
            Features
          </h3>
          <p class="text-gray-800 text-3xl font-semibold sm:text-4xl">
            Do more with less complexity
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec congue, nisl eget molestie varius, enim ex faucibus purus
          </p>
        </div>
        <div class="mt-12">
          <ul class="grid gap-y-8 gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
            <li v-for="(item, idx) in features" :key="idx" class="flex gap-x-4">
              <div class="flex-none w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                <svg v-html="item.icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"></svg>
              </div>
              <div>
                <h4 class="text-lg text-gray-800 font-semibold">
                  {{ item.title }}
                </h4>
                <p class="mt-3">
                  {{ item.desc }}
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  export default {
    name: 'FeaturesSection',
    data() {
      return {
        features: [
          {
            icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />`,
            title: "Fast Refresh",
            desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec congue, nisl eget molestie varius, enim ex faucibus purus."
          },
          {
            icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />`,
            title: "Analytics",
            desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec congue, nisl eget molestie varius, enim ex faucibus purus."
          },
          {
            icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />`,
            title: "Datacenter security",
            desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec congue, nisl eget molestie varius, enim ex faucibus purus."
          },
          {
            icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />`,
            title: "Build on your terms",
            desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec congue, nisl eget molestie varius, enim ex faucibus purus."
          },
          {
            icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />`,
            title: "Safe to use",
            desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec congue, nisl eget molestie varius, enim ex faucibus purus."
          },
          {
            icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904
  
  l1.687-1.687a1.688 1.688 0 012.381-2.382l1.687-1.687M6.75 9l-.938.938m10.125 10.125L9 12m3.938-3.938L6.75 9m0 0L9 6.75M9 12l-2.25 2.25m13.5-4.5V6.75a4.5 4.5 0 00-4.5-4.5h-9A4.5 4.5 0 003 6.75v13.5a4.5 4.5 0 004.5 4.5h9a4.5 4.5 0 004.5-4.5V12.75z" />`,
            title: "24/7 Support",
            desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec congue, nisl eget molestie varius, enim ex faucibus purus."
          }
        ]
      }
    }
  }
  </script>