# Design system

## Source status

The public Figma prototype and walkthrough video were visually inspected repeatedly: first for product behavior and later frame-by-frame for the authentication, empty dashboard, populated dashboard, and editor compositions. The connected Figma account can open the public design and expose layer properties and export previews, while the structured design-context and variable APIs still respond that edit access is required. As a result:

- token **names and roles** below are the stable implementation contract;
- inspected authentication values and measurements are recorded as exact frame values;
- values that could only be compared visually remain explicitly provisional;
- components must use semantic tokens so replacing estimates does not require rewriting JSX.

Figma source: [Notes-Taking App Challenge](https://www.figma.com/design/nIqpRyEWKPYqYsW7RMfi3S/Notes-Taking-App-Challenge)

## Visual direction

The product feels like a quiet physical notebook: warm paper canvas, serif note headings, restrained sans-serif controls, and category-colored cards with visible outlines. The memorable element is the category system itself; unrelated gradients, glass effects, and decorative dashboard chrome would dilute that identity.

Product screens now follow the inspected source hierarchy: flat cream canvas, quiet account utilities, category list without a heavy selected pill, thin outlined controls, rounded cards with three-pixel category borders, and one large rounded editor surface. Decorative dividers, generic dashboard panels, hard black shadows, and oversized dashboard titles are intentionally absent.

The public product landing reuses real dashboard materials—category color, note edges, serif titles, and the actual interaction vocabulary—rather than introducing generic SaaS gradients, metric cards, or unrelated product claims.

## Tailwind CSS v4 token contract

Tokens live in `apps/web/src/app/globals.css` and are exposed to Tailwind through `@theme inline`.

| Semantic token | Current estimate | Intended role |
| --- | --- | --- |
| `--background` | `#faf1e3` | Exact warm paper canvas from the authentication frames. |
| `--foreground` | `#2a2118` | Primary ink and high-contrast outlines. |
| `--card` | `#fff9ed` | Neutral elevated surface. |
| `--primary` | `#6f4e37` | Primary actions and control borders. |
| `--muted` | `#eee4d2` | Subtle surfaces and inactive states. |
| `--muted-foreground` | `#6f645a` | Supporting copy. |
| `--control-surface` | `#fbf2e3` | Quiet fill for compact source-matched controls. |
| `--control-border` | `#ad7841` | Warm outline for the editor category selector. |
| `--control-icon` | `#956326` | Chevron and compact-control icon ink. |
| `--scrollbar-thumb` | derived from `--control-border` and `--background` | Standard scrollbar thumb for vertical and horizontal overflow. |
| `--scrollbar-thumb-hover` | derived from `--control-border` and `--foreground` | Higher-contrast scrollbar hover state. |
| `--scrollbar-track` | transparent | Keeps scroll tracks integrated with paper and component surfaces. |
| `--auth-ink` | `#88642a` | Exact authentication display-heading ink. |
| `--auth-border` | `#957139` | Exact authentication input and action outline/ink. |
| `--auth-link` | `#88642a` | Accessible authentication link ink (4.8:1); keeps the source border color separate from 12-pixel text. |
| `--note-random` | `#f3b88f` | Random Thoughts surface. |
| `--note-random-border` | `#e88e54` | Random Thoughts emphasis. |
| `--note-school` | `#f6dda7` | School surface. |
| `--note-school-border` | `#e8bd58` | School emphasis. |
| `--note-personal` | `#a9c6bf` | Personal surface. |
| `--note-personal-border` | `#6caaa2` | Personal emphasis. |
| `--note-drama` | `#c9b8d9` | Drama surface. |
| `--note-drama-border` | `#9779b3` | Drama emphasis. |
| `--destructive` | `#7f2926` | Destructive actions and errors. |
| `--destructive-hover` | derived from `--destructive` and `--foreground` | Higher-contrast destructive hover state. |
| `--ring` | `#8e5d36` | Visible keyboard focus. |

Do not use raw color values in React components. A category returned by the API maps to an approved semantic token key; it must not inject arbitrary CSS from stored user data.

## Typography

Current foundation:

- **Product body and controls**: Geist Sans through `next/font`, preserving the dashboard and editor geometry validated at all five responsive widths.
- **Authentication body and controls**: Inter through `next/font`, matching the inspected frame metadata and supporting copy without changing product-screen metrics.
- **Note titles and display text**: Inria Serif through `next/font`; the authentication headings use the exact inspected 48-pixel, 700-weight, 100%-line-height treatment at the source viewport.
- **Metadata**: Geist Mono sparingly for timestamps, counts, and technical status.
- **Card dates**: use `Today` and `Yesterday` first, abbreviated month plus day for the current UTC year, and add the year only for older dates. The Server Component fixes the reference instant so hydration cannot change the label.

Authentication geometry is tokenized from the 1280-by-832 source frames: a 384-pixel form width, 39-pixel inputs, 43-pixel action, 13-pixel field gap, five-pixel input radius, 46-pixel action radius, a 58-pixel display line box, and the original artwork dimensions. Compact screens retain the same relationships while reducing only the top breathing room and heading size needed to avoid overflow.

## Shape, spacing, and elevation

- Category cards use a three-pixel category border and a large radius rather than a generic shadow-only container. These dimensions were visually matched to the public prototype and remain tokenized estimates.
- The product UI uses `--radius: 0.75rem` as its provisional base; note cards and the editor intentionally compose larger semantic radii from it.
- Repeated source-matched geometry and typography use named Tailwind theme tokens: `--layout-app-max-width`, `--note-border-width`, compact-control width/insets/radii, tooltip width, display sizes, and display letter spacing. Arbitrary values remain only for isolated responsive composition or calculated viewport layout.
- Dashboard density uses named tokens for the 15.5-rem minimum grid column and an explicit fluid card height clamped between 13 and 18 rem. The fixed tokenized height prevents long copy or font metrics from stretching a grid row; line clamping and anywhere wrapping contain the preview. The shared `notes-grid` class owns the fluid grid algorithm for animated, sortable, and loading states.
- The editor uses tighter responsive padding and a wider writing measure than its initial implementation so note content, rather than empty inset space, remains dominant.
- The title and writing area compose shadcn `Input` and `Textarea` primitives but remain visually unframed in every state. The visible text caret communicates editing focus without adding a box inside the note surface.
- Every scroll surface uses `app-scrollbar`: a 10-pixel interaction channel with a thin rounded thumb, transparent track, matching horizontal and vertical geometry, and Firefox/WebKit support. The page and editor reserve a stable vertical gutter where it prevents layout shift. Note surfaces override only the inherited thumb colors with their category border tokens; dropdowns, dialogs, horizontal category navigation, and the document use the neutral warm control treatment. Forced-colors mode returns color choice to the operating system.
- Touch targets must be at least 44 by 44 CSS pixels even when the visual glyph is smaller.
- Use a small spacing vocabulary derived from Tailwind's scale; avoid one-off arbitrary values unless an inspected Figma measurement requires them.
- Keep the note editor visually dominant and quiet. Status text and the category selector are supporting controls.

## Component policy

shadcn/ui is a source-code supplier, not a fixed theme or runtime dependency catalog.

- Add a component only when a current product slice uses it.
- Review generated code and adapt its tokens, radius, focus, size, and interaction states to Figma.
- Keep ownership in `src/components/ui` and product composition outside that folder.
- Product compositions choose explicit component variants such as `auth`, `search`, `editor-title`, `notebook`, and `long-text`. They must not patch reusable control cosmetics with call-site Tailwind classes; call-site classes are reserved for local layout and non-reusable positioning.
- ESLint rejects raw `button`, `input`, `textarea`, `select`, and `option` elements outside `src/components/ui`, preserving the shadcn ownership boundary automatically.
- The installed source-owned UI components are `Button`, `Input`, `InputGroup`, `Textarea`, `Select`, `Tooltip`, `AlertDialog`, and `Skeleton`; each was added with the slice that first needed it and adapted to the notebook theme.
- Loading states compose the source-owned `Skeleton` primitive with semantic surface, border, and ink tokens. Dashboard and editor placeholders mirror their final geometry and internal hierarchy to minimize perceived layout shift; the placeholder atoms remain decorative while the route loading container announces its busy state.
- Truncated identity text in the authenticated header uses the shadcn `Tooltip` composition. It reveals the complete email on hover or keyboard focus without changing the compact header layout.
- `AlertDialog` was added for destructive note confirmation. Its content scales without an opacity fade so text meets contrast requirements from the first animation frame, and its destructive action uses the semantic high-contrast token on every category surface.
- New-note actions, search, and both category and ordering selects share a 44-pixel control height, warm `control-border`, cream `control-surface`, `control-hover`, and the same focus-ring family. Search uses a source-owned shadcn-style `InputGroup`, so its icon, field, and clear action form one control without overlapping hit targets. Category and ordering controls share one `NotebookSelect` product composition over the shadcn `Select` built on Base UI; category options add only semantic color dots. Reusable cosmetics live in primitive variants and design tokens; call sites provide layout, data, behavior, and context-sensitive popup alignment only.
- On populated dashboards, the filtered total sits below the complete search/sort row rather than between controls. Loading skeletons preserve this hierarchy and control geometry.
- Prefer Lucide icons only when the glyph faithfully matches Figma; export and commit the exact Figma asset otherwise.

## Asset provenance

The public Figma editor's layer preview allowed the two original authentication source images to be exported without modifying the design:

- `apps/web/public/illustrations/auth-cat.png`: source layer `Screenshot_2024-07-22_at_11.29.27_AM-removebg-preview 1`, used only by registration.
- `apps/web/public/illustrations/auth-cactus.png`: source layer `Group 1 1`, used only by login.

The public preview encoded its transparency grid into the downloaded pixels. A deterministic alpha pass removed only the two exact checkerboard colors; the original subject pixels, canvas dimensions, proportions, and artwork were preserved. Both cutouts were composited over `--background` and inspected in the rendered authentication pages. They bypass Next.js image optimization because the source-scale illustrations are already delivery-sized and should not reuse a stale transformed preview during local visual review.

The following assets remain original, non-source replacements created specifically for the challenge:

- `apps/web/public/illustrations/empty-boba.png`: transparent smiling boba illustration for the empty dashboard.
- `apps/web/src/app/icon.png`: flat hand-drawn paper-and-pencil favicon source, with derived ICO, Apple Touch Icon, and 192/512-pixel web-app variants.

The replacement illustration was generated with OpenAI image generation from a prompt requesting the warm hand-drawn stationery style, rendered against a chroma background, converted to transparent RGBA, and visually checked at desktop and mobile sizes. The favicon was generated as a high-contrast flat icon and downsampled to its delivery sizes to verify its silhouette. Neither replacement contains logos, source screenshots, or copied interface text.

## Responsive behavior

The source primarily shows a laptop-width frame. Implementation must add intentional behavior:

- **Compact (below 35 rem)**: one-column note list with cards bounded at a 13-rem minimum, body previews fitted to the remaining card height, horizontally scrollable categories, and a viewport-filling editor.
- **Intermediate (35 rem and above)**: the grid automatically fills 15.5-rem minimum columns, card height continues growing fluidly with available viewport space, and the toolbar stays stacked until 48 rem so controls do not compete for width around 650 pixels.
- **Wide (80 rem and above)**: cards reach the full 18-rem reference height; the existing large-screen sidebar and available grid width generally produce the three-column source composition.
- Long titles and category labels wrap or clamp safely at every width, including unbroken URLs and identifier-like strings. Card titles keep a conventional two-line ellipsis, while body previews consume only the remaining card height and fade softly at the lower edge so an overflowing line never appears abruptly sliced.
- Filter state, note counts, editor status, and primary actions remain visible without horizontal page overflow.
- Responsive browser coverage exercises 1440, 820, 650, 480, and 390-pixel viewports, asserting grid columns, card height, and document overflow in addition to the full user journey and Axe scans.

## Accessibility and motion

- Category cannot be communicated by color alone; always include its label.
- Selected filters expose `aria-current` or equivalent state.
- Form errors are associated with their fields and announced.
- A keyboard-only skip link targets the single main landmark on every product, loading, error, and authentication screen.
- Authentication moves focus to the first invalid field after an API validation response; general failures remain in a polite live region.
- Focus rings use the semantic ring token and must remain visible on category colors.
- Autosave status uses text and an appropriate live region, not animation alone.
- Any card entrance or editor transition is removed for `prefers-reduced-motion`.

## Motion system

Motion has one job: make the note's physical metaphor and system state easier to understand. It is not a layer of ambient decoration.

- **Signature moment**: note cards settle into their new positions after a filter or sort change; the editor surface enters by six pixels without delaying focus or input.
- **State feedback**: new, restored, and reordered notes may settle into position; autosave still communicates primarily through live text and uses only a two-pixel status movement.
- **Duration vocabulary**: 160 ms for save-state feedback, 220–280 ms for cards/editor, and up to 380 ms for the first landing composition.
- **Easing**: one standard ease-out curve (`[0.22, 1, 0.36, 1]`); avoid unrelated springs on every component.
- **Library**: CSS remains responsible for isolated hover/focus states. Motion 12.43.0 owns only layout and entrance transitions behind one product-level configuration boundary.
- **Reduced motion**: `MotionConfig` uses `reducedMotion="user"`; spatial and layout movement becomes an immediate final state. Playwright verifies this behavior with emulated device preference.
- **Contrast**: do not fade text-bearing containers. Live Axe validation rejected opacity entrances because intermediate compositing lowered contrast even though the final tokens passed.
- **Performance**: animate transform and layout position only; never animate autosizing text input on every keystroke or promote static elements with `will-change`.

Manual reordering must remain understandable without animation. Drag handles are explicit controls, the lifted card keeps its category label, drop targets retain contrast, and screen-reader announcements describe positions rather than visual coordinates.

## Token replacement workflow

When Figma edit access or an exported token file becomes available:

1. Read the target frame's design context and variables.
2. Record exact source names and values in this document.
3. Map source tokens to the existing semantic roles.
4. Update `globals.css`, avoiding component-level color changes.
5. Compare dashboard, empty state, authentication, and editor at source viewport sizes.
6. Re-run accessibility contrast and responsive checks before committing.
