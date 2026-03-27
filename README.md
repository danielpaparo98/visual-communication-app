# The Talking Chart

A visual communication chart builder for individuals with communication difficulties. Built with Nuxt 3, Vue 3, and Tailwind CSS.

## Setup

Make sure to install dependencies:

```bash
bun install
```

## Development Server

Start the development server at `http://localhost:3000`:

```bash
bun run dev
```

## Production

Build the application for production:

```bash
bun run build
```

Locally preview production build:

```bash
bun run preview
```

For deployment to GitHub Pages:

```bash
bun run generate
```

This will generate static files in the `.output/public` directory.

## Tech Stack

- [Nuxt 3](https://nuxt.com/) - Vue.js framework
- [Vue 3](https://vuejs.org/) - Progressive JavaScript framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Pinia](https://pinia.vuejs.org/) - State management
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## Project Structure

```
├── components/          # Vue components
│   ├── chart/          # Chart-related components
│   ├── icons/          # Icon picker components
│   ├── layout/         # Layout components
│   ├── ui/             # Base UI components
│   └── home/           # Home page components
├── composables/        # Vue composables
├── layouts/            # Nuxt layouts
├── pages/              # Nuxt pages
├── public/icons/       # SVG icon assets
├── stores/             # Pinia stores
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## License

MIT
