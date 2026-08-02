# Design system

## Source status

The public Figma prototype and walkthrough video were visually inspected. The connected Figma account can open the public prototype but the design-context and variable APIs respond that edit access is required. As a result:

- token **names and roles** below are the stable implementation contract;
- current hex values are **provisional visual estimates**, not claimed Figma exports;
- exact typography, spacing, border, shadow, and illustration assets remain pending edit access or a design-token export;
- components must use semantic tokens so replacing estimates does not require rewriting JSX.

Figma source: [Notes-Taking App Challenge](https://www.figma.com/design/nIqpRyEWKPYqYsW7RMfi3S/Notes-Taking-App-Challenge)

## Visual direction

The product feels like a quiet physical notebook: warm paper canvas, serif note headings, restrained sans-serif controls, and category-colored cards with visible outlines. The memorable element is the category system itself; unrelated gradients, glass effects, and decorative dashboard chrome would dilute that identity.

The initial developer landing page uses slightly rotated note cards as a temporary signature. Product screens should follow the actual Figma layout rather than copy the checkpoint page.

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
| `--note-random` | `#f3b88f` | Random Thoughts surface. |
| `--note-random-border` | `#e88e54` | Random Thoughts emphasis. |
| `--note-school` | `#f6dda7` | School surface. |
| `--note-school-border` | `#e8bd58` | School emphasis. |
| `--note-personal` | `#a9c6bf` | Personal surface. |
| `--note-personal-border` | `#6caaa2` | Personal emphasis. |
| `--destructive` | `#b7443e` | Destructive actions and errors. |
| `--ring` | `#8e5d36` | Visible keyboard focus. |

Do not use raw color values in React components. A category returned by the API maps to an approved semantic token key; it must not inject arbitrary CSS from stored user data.

## Typography

Current foundation:

- **Body and controls**: Geist Sans through `next/font`.
- **Note titles and display text**: system serif stack exposed as `font-serif`.
- **Metadata**: Geist Mono sparingly for timestamps, counts, and technical status.

The serif family visible in the source cannot be identified reliably without design context. Replace the provisional stack after Figma access, preserving clear body/display roles and local font optimization through `next/font` when applicable.

## Shape, spacing, and elevation

- Category cards use a category border rather than a generic shadow-only container.
- The product UI should follow Figma radii; the current foundation uses `--radius: 0.75rem` provisionally.
- Touch targets must be at least 44 by 44 CSS pixels even when the visual glyph is smaller.
- Use a small spacing vocabulary derived from Tailwind's scale; avoid one-off arbitrary values unless an inspected Figma measurement requires them.
- Keep the note editor visually dominant and quiet. Status text and the category selector are supporting controls.

## Component policy

shadcn/ui is a source-code supplier, not a fixed theme or runtime dependency catalog.

- Add a component only when a current product slice uses it.
- Review generated code and adapt its tokens, radius, focus, size, and interaction states to Figma.
- Keep ownership in `src/components/ui` and product composition outside that folder.
- The only installed UI component in this milestone is `Button`.
- Likely future additions are `Input`, `Select`, and an accessible dialog/sheet primitive, but they must be added with the feature that needs them.
- Prefer Lucide icons only when the glyph faithfully matches Figma; export and commit the exact Figma asset otherwise.

## Responsive behavior

The source primarily shows a laptop-width frame. Implementation must add intentional behavior:

- **Small**: one-column note list; categories become a horizontally scrollable filter or compact sheet; editor fills the viewport.
- **Medium**: two-column grid with persistent or collapsible category navigation.
- **Large**: sidebar plus three-column grid matching the reference composition.
- Long titles and bodies wrap or clamp safely at every width.
- Filter state, note counts, editor status, and primary actions remain visible without horizontal page overflow.

## Accessibility and motion

- Category cannot be communicated by color alone; always include its label.
- Selected filters expose `aria-current` or equivalent state.
- Form errors are associated with their fields and announced.
- Focus rings use the semantic ring token and must remain visible on category colors.
- Autosave status uses text and an appropriate live region, not animation alone.
- Any card entrance or editor transition is removed or shortened for `prefers-reduced-motion`.

## Token replacement workflow

When Figma edit access or an exported token file becomes available:

1. Read the target frame's design context and variables.
2. Record exact source names and values in this document.
3. Map source tokens to the existing semantic roles.
4. Update `globals.css`, avoiding component-level color changes.
5. Compare dashboard, empty state, authentication, and editor at source viewport sizes.
6. Re-run accessibility contrast and responsive checks before committing.
