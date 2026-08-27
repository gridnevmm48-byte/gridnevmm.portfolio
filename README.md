# Maksim Gridnev — portfolio

One page, one column: header, hero, a slider of work mockups, three project
cards, then about and skills. Each project opens a case study in a modal over
the page, and the résumé opens the same way from the header. React + Vite +
Tailwind, bilingual EN/RU, deployed as a static site.

## Running the code

```bash
npm install
npm run dev
```

`npm run build` writes the static site to `dist/`.

## Where the content lives

- **All copy** is in `src/app/i18n/en.ts` and `src/app/i18n/ru.ts`. The Russian
  file is typed against the English one, so a new key has to be added to both or
  the build fails.
- **The project cards** read from `src/app/data/cases.ts`, which pairs each case
  with its logo, its live URL and the order of its screenshots. An empty `href`
  hides the "go to web" button rather than rendering a dead one.
- **Case screenshots** are `shot`, `phones` and `note` blocks in that same file.
  A `note` is a caption between two groups of screens; its `id` keys into
  `cases.<id>.notes` in the dictionaries, so the caption text stays translated.
- **The hero slider** reads every frame in `src/assets/hero_slider/optimized/`
  in filename order. Desktop and phone mockups alternate on purpose.
- **The header's jump links** (`WORK`, `ABOUT`) point at the section ids in
  `Root.tsx`. They are hidden below the `md` breakpoint, where the whole page is
  a short scroll anyway.

## Images

Masters live in `raw/`, numbered in the order they appear on the page. The
converter turns them into the AVIF + JPEG pairs the app imports:

```bash
npm run images
```

It writes `src/assets/`, so adding a screenshot means dropping a numbered file
into the right `raw/` folder and running it again. Hero frames that are not 16:9
are fitted into the slider rather than cropped, with the gap either side filled
by a blurred copy of the same image.

## Design tokens

Spacing is a 4px base on an 8px rhythm, and every `transition-*` shares one
duration and curve. Both live in `@theme` in `src/styles/index.css`, so the
numeric Tailwind utilities land on the scale and nothing needs an arbitrary
pixel value.

## Deployment

`vercel.json` builds with Vite and rewrites every path to `index.html`.
