# Design system

## Source status

The public Figma prototype and walkthrough video were visually inspected twice: first for product behavior and later frame-by-frame for the authentication, empty dashboard, populated dashboard, and editor compositions. The connected Figma account can open the public prototype but the design-context and variable APIs respond that edit access is required. As a result:

- token **names and roles** below are the stable implementation contract;
- current hex values are **provisional visual estimates**, not claimed Figma exports;
- exact typography and token measurements remain pending edit access or a design-token export;
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
| `--background` | `#f7efdf` | Warm paper canvas. |
| `--foreground` | `#2a2118` | Primary ink and high-contrast outlines. |
| `--card` | `#fff9ed` | Neutral elevated surface. |
| `--primary` | `#6f4e37` | Primary actions and control borders. |
| `--muted` | `#eee4d2` | Subtle surfaces and inactive states. |
| `--muted-foreground` | `#6f645a` | Supporting copy. |
| `--control-surface` | `#fbf2e3` | Quiet fill for compact source-matched controls. |
| `--control-border` | `#ad7841` | Warm outline for the editor category selector. |
| `--control-icon` | `#956326` | Chevron and compact-control icon ink. |
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

- **Body and controls**: Geist Sans through `next/font`.
- **Note titles and display text**: system serif stack exposed as `font-serif`.
- **Metadata**: Geist Mono sparingly for timestamps, counts, and technical status.
- **Card dates**: use `Today` and `Yesterday` first, abbreviated month plus day for the current UTC year, and add the year only for older dates. The Server Component fixes the reference instant so hydration cannot change the label.

The serif family visible in the source cannot be identified reliably without design context. Replace the provisional stack after Figma access, preserving clear body/display roles and local font optimization through `next/font` when applicable.

## Shape, spacing, and elevation

- Category cards use a three-pixel category border and a large radius rather than a generic shadow-only container. These dimensions were visually matched to the public prototype and remain tokenized estimates.
- The product UI uses `--radius: 0.75rem` as its provisional base; note cards and the editor intentionally compose larger semantic radii from it.
- Repeated source-matched geometry and typography use named Tailwind theme tokens: `--layout-app-max-width`, `--note-border-width`, compact-control width/insets/radii, tooltip width, display sizes, and display letter spacing. Arbitrary values remain only for isolated responsive composition or calculated viewport layout.
- Dashboard density uses named tokens for the 15.5-rem minimum grid column and a fluid card height clamped between 13 and 18 rem. The shared `notes-grid` class owns the fluid grid algorithm for animated, sortable, and loading states.
- The editor uses tighter responsive padding and a wider writing measure than its initial implementation so note content, rather than empty inset space, remains dominant.
- The title and writing area compose shadcn `Input` and `Textarea` primitives but remain visually unframed in every state. The visible text caret communicates editing focus without adding a box inside the note surface.
- The writing area owns a thin, rounded scrollbar whose thumb derives from the active category border token; the track stays transparent so it reads as part of the note rather than browser chrome.
- Touch targets must be at least 44 by 44 CSS pixels even when the visual glyph is smaller.
- Use a small spacing vocabulary derived from Tailwind's scale; avoid one-off arbitrary values unless an inspected Figma measurement requires them.
- Keep the note editor visually dominant and quiet. Status text and the category selector are supporting controls.

## Component policy

shadcn/ui is a source-code supplier, not a fixed theme or runtime dependency catalog.

- Add a component only when a current product slice uses it.
- Review generated code and adapt its tokens, radius, focus, size, and interaction states to Figma.
- Keep ownership in `src/components/ui` and product composition outside that folder.
- Product compositions choose explicit component variants such as `auth`, `search`, `editor-title`, `category`, `ordering`, and `long-text`. They must not patch reusable control cosmetics with call-site Tailwind classes; call-site classes are reserved for local layout and non-reusable positioning.
- ESLint rejects raw `button`, `input`, `textarea`, `select`, and `option` elements outside `src/components/ui`, preserving the shadcn ownership boundary automatically.
- The installed source-owned UI components are `Button`, `Input`, `Textarea`, `Select`, `Tooltip`, `AlertDialog`, and `Skeleton`; each was added with the slice that first needed it and adapted to the notebook theme.
- Loading states compose the source-owned `Skeleton` primitive with semantic surface, border, and ink tokens. Dashboard and editor placeholders mirror their final geometry and internal hierarchy to minimize perceived layout shift; the placeholder atoms remain decorative while the route loading container announces its busy state.
- Truncated identity text in the authenticated header uses the shadcn `Tooltip` composition. It reveals the complete email on hover or keyboard focus without changing the compact header layout.
- `AlertDialog` was added for destructive note confirmation. Its content scales without an opacity fade so text meets contrast requirements from the first animation frame, and its destructive action uses the semantic high-contrast token on every category surface.
- Category and ordering controls compose the shadcn `Select` built on Base UI. The category trigger's 194-by-34-pixel visual box, six-pixel radius, inset category dot, warm outline, and wide hand-drawn-style chevron follow the inspected reference; the underlying trigger remains 44 pixels tall for touch input. Their cosmetics live in named variants of the source-owned primitive, while product components provide only data and behavior.
- Prefer Lucide icons only when the glyph faithfully matches Figma; export and commit the exact Figma asset otherwise.

## Original illustration provenance

The Figma integration could not export the decorative source assets because the connected account lacks edit access. Two original, non-source illustrations were therefore generated for this challenge and are clearly treated as replacements rather than Figma exports:

- `apps/web/public/illustrations/auth-friends.png`: transparent colored-pencil/watercolor cactus and sleeping cat composition for authentication.
- `apps/web/public/illustrations/empty-boba.png`: transparent smiling boba illustration for the empty dashboard.

Both were generated with OpenAI image generation from prompts requesting a warm hand-drawn stationery style, rendered against a chroma background, converted to transparent RGBA assets, and visually checked at desktop and mobile sizes. They contain no logos, source screenshots, or copied interface text. If Turbo supplies exportable source assets, replace these files without changing the component layout contract.

## Responsive behavior

The source primarily shows a laptop-width frame. Implementation must add intentional behavior:

- **Compact (below 35 rem)**: one-column note list with cards bounded at a 13-rem minimum, tighter preview clamping, horizontally scrollable categories, and a viewport-filling editor.
- **Intermediate (35 rem and above)**: the grid automatically fills 15.5-rem minimum columns, card height continues growing fluidly with available viewport space, and the toolbar stays stacked until 48 rem so controls do not compete for width around 650 pixels.
- **Wide (80 rem and above)**: cards reach the full 18-rem reference height; the existing large-screen sidebar and available grid width generally produce the three-column source composition.
- Long titles and bodies wrap or clamp safely at every width.
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
