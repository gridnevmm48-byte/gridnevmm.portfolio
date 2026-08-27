/**
 * Turns the raw exports in `raw/` into the optimised assets the app imports.
 *
 * Every source is emitted twice — avif for browsers that take it, jpg as the
 * `<picture>` fallback — because the case modals stack a dozen full-width
 * screenshots and the png originals are ~24 MB together.
 *
 * Idempotent: run `npm run images` after dropping new files into `raw/`.
 */
import sharp from "sharp";
import { mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const raw = path.join(root, "raw");
const out = path.join(root, "src/assets");

/** The hero slider frame. Sources that are not 16:9 are padded to it. */
const HERO = { width: 1440, height: 810 };

/**
 * Fits any mockup into the 16:9 slider frame without cropping it.
 *
 * The slides come in three shapes — 16:9 renders, a 4:3 tablet, a portrait
 * phone — and the slider paints them with object-cover, which would have sliced
 * the top and bottom off the tablet and left only a sliver of the portrait one.
 * Instead the whole mockup is fitted inside the frame and the gap either side is
 * filled with a blurred, darkened copy of the same image, so the seam reads as
 * depth of field rather than as a letterbox. A source that is already 16:9
 * covers the fill completely and comes out untouched.
 */
async function toHeroFrame(file) {
  const background = await sharp(file)
    .resize(HERO.width, HERO.height, { fit: "cover" })
    .blur(40)
    .modulate({ brightness: 0.55 })
    .toBuffer();
  const foreground = await sharp(file)
    .resize(HERO.width, HERO.height, { fit: "inside", withoutEnlargement: false })
    .toBuffer();
  return sharp(background).composite([{ input: foreground, gravity: "center" }]);
}

/** Widths are capped, never upscaled — the sources are already small. */
const JOBS = [
  { from: "hero", to: "hero_slider/optimized", width: HERO.width, frame: true },
  { from: "cases/respawn", to: "cases/respawn", width: 1440 },
  { from: "cases/queen", to: "cases/queen", width: 1440 },
  { from: "cases/queen-mobile", to: "cases/queen-mobile", width: 720 },
  { from: "cases/prowrap", to: "cases/prowrap", width: 1440 },
  { from: "cv", to: "cv", width: 1600, keepName: true },
];

async function convertDir({ from, to, width, keepName, frame }) {
  const srcDir = path.join(raw, from);
  const dstDir = path.join(out, to);
  await rm(dstDir, { recursive: true, force: true });
  await mkdir(dstDir, { recursive: true });

  const files = (await readdir(srcDir)).filter((f) => /\.(png|jpe?g)$/i.test(f)).sort();
  for (const file of files) {
    const name = keepName ? path.parse(file).name : path.parse(file).name;
    const source = path.join(srcDir, file);
    const pipeline = frame
      ? await toHeroFrame(source)
      : sharp(source).resize({ width, withoutEnlargement: true });
    await pipeline.clone().avif({ quality: 50 }).toFile(path.join(dstDir, `${name}.avif`));
    await pipeline.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(dstDir, `${name}.jpg`));
  }
  console.log(`${to.padEnd(26)} ${files.length} images`);
}

/** The two portraits are plain <img> imports, so a single jpg each is enough. */
async function convertPhotos() {
  await mkdir(out, { recursive: true });
  await sharp(path.join(raw, "photo/avatar.jpeg"))
    .resize({ width: 256, height: 256, fit: "cover" })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(path.join(out, "avatar.jpg"));
  await sharp(path.join(raw, "photo/profile.jpeg"))
    .resize({ width: 900, withoutEnlargement: true })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(path.join(out, "profile-photo.jpg"));
  console.log("photos                     2 images");
}

for (const job of JOBS) await convertDir(job);
await convertPhotos();
