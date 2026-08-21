# Fixed Issues

Documentation of issues found during a project review and the fixes applied. Verified with `npm run lint` and `npm run build` (both pass).

## 1. Unstable React keys causing unnecessary remounts

**File:** `src/Components/Showcase.jsx`

**Problem:** Each card was keyed with `crypto.randomUUID()`, generated fresh on every render. React uses keys to match elements across renders, so a key that changes every render defeats that entirely — every re-render (including every pagination click) unmounted and remounted all `WebsiteCard` components instead of reconciling them, causing unnecessary image reloads and flicker.

**Fix:** Use a stable, unique value from the data itself — `website.title` — as the key.

```diff
- key={crypto.randomUUID()}
+ key={website.title}
```

## 2. Reverse tabnabbing risk on external links

**Files:** `src/Components/Button.jsx`, `src/Components/Footer.jsx`

**Problem:** Links using `target="_blank"` without `rel="noopener noreferrer"` let the opened page access `window.opener`, which can be used to redirect the original tab to a malicious page (reverse tabnabbing). The project-card "Visit Site" button had this gap, and the footer's social links didn't even open in a new tab, so clicking one navigated the visitor away from the portfolio entirely.

**Fix:**
- Added `rel="noopener noreferrer"` to the `Button` component's link.
- Added `target="_blank" rel="noopener noreferrer"` to all four footer social links (LinkedIn, GitHub, X, Instagram) so they behave consistently with the project links and don't carry the same security gap.

## 3. Dead state in Showcase

**File:** `src/Components/Showcase.jsx`

**Problem:** `postsPerPage` was held in `useState(6)`, but `setPostsPerPage` was never called anywhere — it was a constant wearing state's clothing, adding an unnecessary re-render dependency.

**Fix:** Replaced the state with a plain module-level constant:

```diff
- const [postsPerPage, setPostsPerPage] = useState(6);
+ const postsPerPage = 6; // outside the component
```

## 4. Missing accessibility signal for the active page

**File:** `src/Components/Pagination.jsx`

**Problem:** The active page button was only distinguished by color (`bg-blue-500` vs `bg-blue-900`), which conveys nothing to screen readers.

**Fix:** Added `aria-current="page"` to the active page button (`undefined` otherwise, so the attribute is omitted rather than set to `"false"`).

## 5. Misspelled folder name

**File:** `src/Utitlities/` → `src/Utilities/`

**Problem:** The folder holding `Websites.js` was misspelled ("Utitlities"), which propagated into the import path in `Showcase.jsx`.

**Fix:** Renamed the folder via `git mv` and updated the import in `Showcase.jsx` accordingly.

## 6. No 404 page

**Files:** `src/App.jsx`, `src/Pages/NotFound.jsx` (new), `public/_redirects` (new)

**Problem:** The app had no routing at all — a single `<Home />` was always rendered, so any bad or mistyped in-app URL (or a stale/shared link to a removed path) had no dedicated "not found" experience. On Netlify, a direct hit to an unknown path would also fall through to Netlify's own generic 404, since nothing told it to hand control back to the React app.

**Fix:**
- Installed `react-router-dom` (v7) and wrapped the app in `BrowserRouter` / `Routes` in `App.jsx`, with `path="/"` rendering `Home` and `path="*"` rendering the new `NotFound` page.
- Added `src/Pages/NotFound.jsx` — a page consistent with the site's look (`Navbar` + `Footer` + a "Back to Home" link), styled with the existing blue theme.
- Added `public/_redirects` with `/* /index.html 200` — the standard Netlify SPA fallback rule, so any unmatched URL is served `index.html` and React Router (not Netlify) decides whether it's a real route or the 404 page. Without this, direct navigation/refresh on a bad URL would hit Netlify's static 404 instead of the in-app one.

## 7. No fallback for missing/broken project images

**Files:** `src/Components/WebsiteCard.jsx`, `public/default.svg` (new)

**Problem:** `WebsiteCard` always rendered whatever `src` it was given. If a future entry in `Websites.js` had no image, or an existing image 404'd/failed to load, the card would show a broken image icon instead of degrading gracefully.

**Fix:**
- Added `public/default.svg`, a simple placeholder graphic ("No Preview Available") matching the site's blue theme.
- `WebsiteCard` now tracks the image source in state, seeded with `src || DEFAULT_IMAGE` (so a missing `src` falls back immediately), and adds an `onError` handler on the `<img>` that swaps to `DEFAULT_IMAGE` if the real image fails to load at runtime. The default image is served directly (bypassing the Netlify Image CDN transform, since it's a local SVG placeholder, not a project screenshot).

## 8. `process.env.NODE_ENV` used in browser code (pre-existing, caught while verifying the above)

**File:** `src/Components/WebsiteCard.jsx`

**Problem:** `WebsiteCard` computed `isDev` from `process.env.NODE_ENV === 'development'`. `process` isn't a real browser global — Vite happens to statically replace this exact expression at build time for compatibility with libraries that expect it, so it wasn't actually broken in production, but it's not idiomatic Vite and ESLint correctly flags it (`no-undef`) since nothing declares `process` as a global.

**Fix:** Replaced it with Vite's own `import.meta.env.DEV`, which is the supported way to detect dev vs. build mode and needs no special-casing.

```diff
- const isDev = process.env.NODE_ENV === 'development';
+ const isDev = import.meta.env.DEV;
```

## 9. No full preview of a project card

**Files:** `src/Components/WebsiteCard.jsx`, `src/Components/CardPreview.jsx` (new), `src/Components/Button.jsx`

**Problem:** Card descriptions are truncated with `line-clamp-3` on the grid, and there was no way to read the full description or see a larger image without leaving the page via "Visit Site".

**Fix:**
- Added `src/Components/CardPreview.jsx` — a modal rendered on top of the page: `position: fixed` full-screen backdrop (`bg-black/60 backdrop-blur-sm`), with the popup itself capped at `max-w-[80vw] max-h-[80vh]` (scrolls internally if content is taller), showing the image, title, the **full** (non-clamped) description, and the "Visit Site" button. Closes via the X button (top-right), clicking the backdrop, or the `Escape` key. Background scroll is locked (`document.body.style.overflow`) while it's open, restored on close/unmount.
- `WebsiteCard` now opens the preview `onClick` on the card itself, tracking `isPreviewOpen` in state.
- `Button.jsx`'s link got `onClick={(e) => e.stopPropagation()}` so clicking "Visit Site" (which is nested inside the now-clickable card) opens the external link only, without also popping the preview open underneath it.

## 10. Footer social links now icons instead of text

**File:** `src/Components/Footer.jsx`

**Change (not a bug fix, a requested change):** The four footer links (LinkedIn, GitHub, X, Instagram) were plain text. Replaced with inline SVG brand icons, each still wrapping the same `href`/`target="_blank"`/`rel="noopener noreferrer"` link.

**Notes:**
- Used inline SVGs (no icon library added) to keep the dependency footprint the same — the project has no other UI/icon library, and four icons don't justify one.
- Icons use `fill="currentColor"` so the existing `.links-hover > li a:hover { color: dodgerblue }` rule in `App.css` still drives the hover effect, unchanged.
- Each link keeps an `aria-label` (and `title`) with the platform name, since the visible text that used to provide that is gone — needed for screen readers and hover tooltips.

## 11. Logo/brand name didn't navigate anywhere, and didn't reset pagination

**Files:** `src/Components/Navbar.jsx`, `src/Pages/Home.jsx`, `src/Components/Showcase.jsx`

**Problem:** The navbar logo + "DEPLOYED / By ASJ" block had `cursor-pointer` styling but no actual link or click behavior — clicking it did nothing. A first pass wrapped it in a React Router `Link to="/"`, but since the app is a single route, clicking it while already on `/` doesn't remount `Showcase`, so if a visitor was on pagination page 2 or 3, the click wouldn't actually take them back to the first page of projects, and wouldn't scroll them back up.

**Fix:**
- Lifted `currentPage` state out of `Showcase` and into `Home`, passed down as `currentPage`/`setCurrentPage` props (`Showcase` is now a controlled component for pagination).
- `Navbar` takes an `onLogoClick` prop; `Home` wires it to `setCurrentPage(1)`.
- Clicking the logo/name now: navigates to `/` (via `Link`), resets pagination to page 1, and smooth-scrolls the window back to the top — verified in a real browser (paginated to page 2, confirmed a different first card, clicked the logo, confirmed the page-1 card returned and `window.scrollY` went back to `0`).

## 12. Card preview modal scrollbar

**Files:** `src/App.css`, `src/Components/CardPreview.jsx`

**Change (requested):** The preview modal's `overflow-y-auto` container showed a visible scrollbar when content exceeded `max-h-[80vh]`. Requested: hide the scrollbar visually without disabling scrolling.

**Fix:** Added a `.no-scrollbar` utility to `App.css` (`scrollbar-width: none` for Firefox, `-ms-overflow-style: none` for legacy Edge/IE, `::-webkit-scrollbar { display: none }` for Chromium/Safari) and applied it to the dialog container in `CardPreview.jsx`. `overflow-y: auto` is untouched — verified by forcing overflow (short viewport height) and programmatically setting `scrollTop`, which moved as expected even with the scrollbar hidden.

## 13. Preview close button styling

**File:** `src/Components/CardPreview.jsx`

**Change (requested):** The X button sat flush inside the card's top-right corner, overlapping the image with no visual separation. Requested: make it float on the popup with a ring border.

**Fix:** Restructured the modal so the scrollable card (`role="dialog"`, `overflow-y-auto`) sits inside a non-scrolling `relative` wrapper, and moved the close button to be a sibling of that scrollable card instead of a child positioned inside it. This matters because the button now uses negative offsets (`-top-3 -right-3`) to hang outside the card's corner — if it stayed inside the `overflow-y-auto` container, that overflow would either clip it or introduce an unwanted horizontal scrollbar (the CSS overflow spec forces the other axis to `auto` once one axis is set). Also added `ring-2 ring-white` and `shadow-lg` so it reads as a distinct floating element regardless of what's behind it (image or white card background).

### 13a. Regression: this restructuring silently broke the scroll cap

**File:** `src/Components/CardPreview.jsx`

**Problem:** In the restructuring above, `max-h-[80vh]` moved to the *outer* (non-scrolling) wrapper, and the scrollable `role="dialog"` div was given `h-full` to fill it. That doesn't work: the outer wrapper has no explicit `height`, only `max-height`, so its height is `auto` — determined by its content. A percentage height (`h-full` = `height: 100%`) on a child of an `auto`-height parent resolves to `auto` too, per the CSS spec (percentage heights only resolve against a *definite* parent height). So the scrollable div's height silently became "however tall the content is," `max-h-[80vh]` on the outer box stopped constraining anything meaningful, and the card just grew past 80% of the viewport instead of capping and scrolling internally.

**Fix:** Moved `max-h-[80vh]` directly onto the scrollable `role="dialog"` div (where `overflow-y-auto` actually lives) and dropped `h-full`/`max-h-[80vh]` from the outer wrapper — it now sizes itself from its (now properly capped) child, which also keeps the floating close button correctly pinned to the visible corner instead of the corner of an oversized, uncapped box.

---

## 14. Hero section redesign

**Files:** `src/Components/Hero.jsx`, `src/App.css`, `public/circuit-pattern.svg` (new)

**Change (requested, from a design mockup):** Replaced the flat `bg-blue-400` hero with a navy gradient background, a subtle repeating circuit-trace texture, thin gold top/bottom borders, and split the sub-headline into two serif lines separated by a short teal-to-gold gradient divider.

**Fix:**
- Added `public/circuit-pattern.svg`, a small tileable circuit-trace graphic (thin light-blue lines + node dots at low opacity).
- Added `.hero-bg` to `App.css`: layers the SVG tile (repeating, 240×240) under a radial glow and a navy linear gradient (`#1e3a8a` → `#172554`), and `.hero-divider`, a 1px gradient bar (`#2dd4bf` → `#d97706`). Implemented as plain CSS rather than Tailwind's gradient utilities, since those utility names changed between Tailwind v3 and v4 (this project is on v4) — writing the gradients directly avoids silently shipping a no-op class.
- `Hero.jsx` now uses `hero-bg` plus `border-y border-amber-700/50` for the gold edges, and renders the sub-copy as two `font-serif` paragraphs (Tailwind's system serif stack — no new font dependency) with a `hero-divider` bar between them.

**Not done:** the mockup's logo (a distinct metallic circular "ASJ" badge) differs from the current `public/nav-brand.jpg`. That's a specific image asset this session doesn't have access to generate — left the navbar logo unchanged; flagged to the user.

---

## Verification

- `npm run lint` — passes.
- `npm run build` — passes.
- `npm run preview` — confirmed the SPA fallback serves `index.html` (and therefore the in-app `NotFound` route) for an unmatched path, and that `/default.svg` is served correctly.
- Netlify Image CDN endpoint (`/.netlify/images?...`) manually verified against the live production URL — all 19 project images return `200 image/webp`, individually and under concurrent load, ruling out a server-side cause for any previously reported "images not showing" issue.
- Card preview modal driven end-to-end with a headless Playwright browser against the dev server: opened via card click, full untruncated description confirmed present, closed via the X button, backdrop click, and `Escape` — all three worked; "Visit Site" retained `target="_blank" rel="noopener noreferrer"` and didn't trigger the modal; zero console errors throughout.
- Footer icons verified the same way: screenshotted in a headless browser (renders as four recognizable brand marks on the dark footer), and confirmed all four `href`/`target`/`rel` attributes are intact after the text→icon swap, with zero console errors.
- Logo click and preview scrollbar behavior both driven end-to-end with Playwright: confirmed pagination actually resets and the page scrolls to top on logo click, and confirmed the preview dialog remains scrollable (`scrollTop` moves) with the scrollbar hidden.
- Close button restyle: screenshotted, confirmed it visually floats outside the card's top-right corner with the white ring visible, and confirmed clicking it still closes the modal.
- Caught the `h-full`-on-`auto`-parent regression above by actually re-testing scroll behavior (not just re-reading the diff): forced overflow with a short viewport, confirmed `scrollHeight` (508px) now exceeds `clientHeight` (320px, matching the 80vh cap), and that `scrollTop` moves — where the buggy version had `clientHeight === scrollHeight` (i.e., nothing to scroll, cap silently doing nothing).
- Hero redesign screenshotted in a headless browser to confirm the gradient, circuit texture, both gold borders, and serif divider actually render (not just that the classes exist) — this also caught the need to avoid Tailwind's version-specific gradient utility names.
- Video hero verified in a real browser: confirmed the `<video>` element is actually playing (`paused: false`, `currentTime` advancing, `readyState: 4`), not just present in the DOM, and two screenshots taken 1.5s apart show different video frames. Confirmed the navbar's background renders and text stays legible in both light-navy and dark-navy regions of the moving video underneath.
- Navbar revert + footer background swap screenshotted: confirmed the navbar is back to white/blue, and the footer shows the gradient/circuit texture with the gold top border, with the icons and copyright text still clearly legible.
- Pagination restyle screenshotted on page 1 and after clicking page 2: confirmed the active-page box/underline correctly follows the click (not stuck on page 1), and the projects grid actually changes (`Movie App` → `Web Presence`).
- Dodgerblue recolor verified with computed styles in a real browser: active button's border color resolved to `rgb(30, 144, 255)` (exact dodgerblue RGB), background to the same blue used elsewhere on the site.

## 15. Swapped hero/navbar backgrounds; hero now uses a video wallpaper

**Files:** `src/Components/Navbar.jsx`, `src/Components/Hero.jsx`

**Change (requested):** Move the `.hero-bg` navy/circuit-texture background (from #14) onto the navbar, and replace the hero's background with the video at `public/video/livewallpaper.mp4`.

**Fix:**
- `Navbar.jsx` restructured to match `Hero.jsx`'s pattern: an outer full-width element carries `hero-bg border-y border-amber-700/50`, with `container mx-auto` moved to the inner `<nav>` for content centering (previously the outer wrapper itself was the constrained container, which wouldn't have let a full-bleed background span the viewport). Text color switched from `text-blue-900` to `text-white` since it now sits on a dark background instead of white.
- `Hero.jsx`: replaced `hero-bg` with an absolutely-positioned `<video>` (`autoPlay loop muted playsInline`, `object-cover`) plus a `bg-blue-950/60` scrim on top for text contrast, and the content (`<main>`) promoted to `relative z-10` so it's unambiguously stacked above both the video and the scrim.

**Note:** the video file is 28MB (3840×2160 source). That's heavy for a hero background on first load — worth revisiting later (e.g. a compressed/lower-res encode, or `preload="none"` with a poster image) if load time on the live site becomes a concern. Not addressed here since it's the asset you provided and wasn't part of the ask.

## 16. Navbar reverted, background moved to footer instead

**Files:** `src/Components/Navbar.jsx`, `src/Components/Footer.jsx`

**Change (requested):** Undo #15's navbar styling — Navbar goes back to its original white background / `text-blue-900`, and the `hero-bg` navy/circuit-texture treatment moves to the footer instead.

**Fix:**
- `Navbar.jsx` reverted to its pre-#15 structure: outer `container mx-auto my-5` div, no background class, `text-blue-900` on the brand text.
- `Footer.jsx`: added `hero-bg` and `border-t border-amber-700/50` to the existing `<footer>` element (kept its own `text-white`, already correct for a dark background — the social icons use `fill="currentColor"` so they stayed white automatically). Only a top border, since the footer is the last element on the page.

## 17. Pagination restyled to match a numbered-tab mockup

**File:** `src/Components/Pagination.jsx`

**Change (requested, from a design mockup showing 5 pagination styles):** Replaced the boxed-blue-button pagination (every page number sat in a solid `bg-blue-900`/`bg-blue-500` block) with the mockup's "Numerical Active" style: plain numbers, and only the active page gets a light gray box with an underline accent.

**Fix:** Inactive pages are now plain `text-blue-900` numbers (hover: `text-teal-600`); the active page gets `bg-gray-200`, bold text, and a `border-b-2 border-teal-400` underline. Reused `teal-400` for the underline to match the accent already introduced by the hero's gradient divider (#14), rather than inventing a new accent color. Also dropped the unused `import React from 'react'` (not needed under Vite's JSX runtime) and switched the `key` from array `index` to the `page` number itself, since pages are a stable, unique set.

### 17a. Recolored to dodgerblue + the site's original blue

**File:** `src/Components/Pagination.jsx`

**Change (requested):** Swap the teal/gray accent from #17 for `dodgerblue` and the site's established `blue-900`, instead of introducing a new accent color.

**Fix:** Active page is now `bg-blue-900 text-white` (the same blue used for the navbar's original brand text, buttons, and footer) with a `border-b-2 border-[dodgerblue]` underline; inactive pages hover to `text-[dodgerblue]` instead of teal. `dodgerblue` is passed as a Tailwind arbitrary value (`[dodgerblue]`) since it's not a named Tailwind color — verified in a real browser that it computes to `rgb(30, 144, 255)`, dodgerblue's actual RGB value, and that this also matches the `dodgerblue` already used for link hovers elsewhere on the site (`.links-hover` in `App.css`).

---

## Not changed

- Netlify Image CDN usage in `WebsiteCard.jsx` (`/.netlify/images?...`) — intentional per recent "webp"/"encode" commits; only works when deployed on Netlify (or via `netlify dev` locally), which is expected for this project's hosting setup. Now bypassed entirely for the default placeholder image.
