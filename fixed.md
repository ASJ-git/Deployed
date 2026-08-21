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

## Not changed

- Netlify Image CDN usage in `WebsiteCard.jsx` (`/.netlify/images?...`) — intentional per recent "webp"/"encode" commits; only works when deployed on Netlify (or via `netlify dev` locally), which is expected for this project's hosting setup. Now bypassed entirely for the default placeholder image.
