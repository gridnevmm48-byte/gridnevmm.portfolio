# Maksim Gridnev — portfolio

One page, one column: header, hero, a banner of work screens, the three work
cards, then about and skills. React + Vite + Tailwind, deployed as a static site.

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

## Where the content lives

- **All copy** is in `src/app/i18n/en.ts` and `src/app/i18n/ru.ts`. The Russian
  file is typed against the English one, so a new key has to be added to both.
- **The work cards** come from `WORK` in `src/app/components/HomePage.tsx`. Each
  one has an `href`, empty by default: put a product's own URL in there and the
  card grows an "open the site" button that opens it in a new tab. While it is
  empty the card simply has no button.
- **The banner frames** are `src/assets/desktop_slider/optimized/NN.jpg` plus a
  matching `NN.avif`. They are picked up by their filename order, so adding a
  frame is just dropping in a numbered pair. Every frame is 16:9, and both its
  width and height must be even numbers — `sips` writes an AVIF with an odd
  dimension that the browser cannot decode.
- **The header's jump links** (`WORK`, `ABOUT`) point at the section ids in
  `Root.tsx`. They are hidden below the `md` breakpoint, where the whole page is
  a short scroll anyway.
