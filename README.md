# The Talking Chart

**Free, printable PECs communication charts for everyone.**

Pick from 400+ icons across 9 categories, arrange them on a 20-card grid, add labels, and print. That's it. No sign-up, no cost, no complexity.

## Features

- **416 SVG icons** across 9 categories (disability, family, health, hygiene, and more)
- **20-card PECs grid** — the standard format for picture exchange communication
- **Editable labels** — give each icon a short, clear label
- **Print-ready** — A4 landscape layout, clean borders, ready to use
- **100% free** — open source (MIT), no ads, no tracking, no sign-up
- **No dependencies** — runs entirely in your browser, works offline

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Nuxt 4 (SPA mode) |
| Styling | Tailwind CSS v4 |
| Fonts | Outfit (headings) + Inter (body) |
| Icons | Inline SVGs from public/icons/ |
| State | useState + localStorage |
| Deployment | GitHub Pages (via Nuxt generate) |

## Development

```bash
# Install dependencies
bun install

# Start dev server
bun run dev

# Generate static site
bun run generate

# Preview production build
bun run preview
```

## Deployment

The app deploys to GitHub Pages automatically via GitHub Actions when pushing to the `main` branch.

The live site is at: **https://papar.github.io/visual-communication-app/**

### Manual deploy

```bash
bun run generate
# The output goes to .output/public/ — deploy that folder anywhere static
```

To deploy to your own domain:
1. Buy a domain (e.g., thetalkingchart.com)
2. Update `baseURL` in `nuxt.config.ts` to `'/'`
3. Set up a CNAME record pointing to your GitHub Pages
4. Push to `main`

## License

MIT — see [LICENSE](LICENSE).

Built by Daniel Paparo to help individuals with communication difficulties.
