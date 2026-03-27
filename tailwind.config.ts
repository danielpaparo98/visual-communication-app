import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3f7',
          100: '#ebe7ef',
          200: '#d6cfe0',
          300: '#b8a9c7',
          400: '#9881a7',
          500: '#7d628c',
          600: '#655071',
          700: '#54425d',
          800: '#47384f',
          900: '#3e3144',
          950: '#2a1f2d',
        },
        accent: {
          50: '#fff5f5',
          100: '#ffe0e0',
          200: '#ffc5c5',
          300: '#ff9e9e',
          400: '#ff6666',
          500: '#f53b3b',
          600: '#e62525',
          700: '#c01919',
          800: '#9f1818',
          900: '#831b1b',
          950: '#480909',
        },
      },
      fontFamily: {
        heading: ['Fredoka', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
