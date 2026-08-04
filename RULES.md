# Inmortal Gaming — Project Rules

## Mandatory skill to design
- **Impeccable**: All visual design work must be done using impeccable.

## Component Conventions

- **One file per component.** No file exports more than one component.
- **CamelCase filenames** matching the default export (e.g., `Navbar.tsx` → `Navbar`).
- **Types/interfaces** live in `src/types/`, imported as `@/types`.
- **Icons** live in `shared/src/icons/` — one file per icon, exported via barrel `index.ts`.
- **Icon components** default to `aria-hidden="true"` and accept an optional `title` prop. When `title` is provided, set `role="img"` and render `<title>` inside the SVG.
- **Relative imports** for sibling components (`./NodeBackground`). **Absolute `@/` imports** for cross-directory references (`@/components/icons`, `@/types`).
- **No missing htmlFor attributes** on form labels. Always use `htmlFor` to associate labels with inputs.
- **No missing alt attributes** on images. Always provide meaningful `alt` text for `<Image>` components.
- **No recreate of components** that already exist. Reuse existing components instead of creating duplicates.
- **Use sileo toasts** for notifications instead of `alert()` or `console.log()`.
- **No accent for text**. All text should be in neutral Spanish, avoiding regionalisms or slang.
- **Use Yup for form validation**. All forms should use Yup for validation schemas.
- **Use Formik for forms**. All forms should be built using Formik for state management and validation.
- **Always use Link**. All anchor tags should be replaced by Link component from NextJS.

## Naming

| Artifact | Convention | Example |
|---|---|---|
| React components | PascalCase | `Navbar`, `HeroSection` |
| Component files | PascalCase.tsx | `Navbar.tsx` |
| Icon files | PascalCase.tsx | `CartIcon.tsx` |
| Types/interfaces | PascalCase | `NavLink`, `CartItem` |
| Functions/variables | camelCase | `mobileOpen`, `setMobileOpen` |
| CSS classes | kebab-case | `.text-glow`, `.btn-neon` |
| CSS custom props | kebab-case with `--` | `--neon-primary` |
| Git branches | kebab-case prefixed by type | `feat/landing-navbar-hero` |
| Commits | conventional commits | `feat(landing): add Navbar` |

## Git & PRs

- **Conventional commits**: `feat:`, `chore:`, `fix:`, `refactor:`, `docs:`, `test:`.
- **Work-unit commits**: tests and documentation stay in the same commit as the code they belong to. No separate "add tests" commits.
- **Chained PRs**: when a changeset exceeds ~400 lines, split into stacked PRs targeting `main`. Each PR must be independently reviewable.
- **No AI attribution** in commits. No "Co-Authored-By" lines.

## Project Structure

```
src/
├── app/
│   ├── globals.css       # CSS variables, utilities, animations
│   ├── layout.tsx        # Root layout (fonts, metadata, scanlines)
│   └── page.tsx          # Pages
├── components/
│   ├── icons/
│   │   ├── CartIcon.tsx
│   │   ├── ChevronDownIcon.tsx
│   │   ├── CloseIcon.tsx
│   │   ├── MenuIcon.tsx
│   │   └── index.ts     # Barrel exports
│   ├── HeroSection.tsx
│   ├── Navbar.tsx
│   └── NodeBackground.tsx
└── types/
    └── index.ts          # Shared interfaces and type aliases
```

## Design System

- **Dark mode only** — `--bg-primary: #0a0b10`.
- **Neon primary**: `#00f0ff` — CTAs, links, accents.
- **All tokens** defined as CSS custom properties in `globals.css`.
- **No Tailwind arbitrary values** where a design token exists (use `text-neon-primary`, not `text-[#00f0ff]`).
- **Typography**: Space Grotesk (display/headings), Inter (body), JetBrains Mono (data/prices).
- **Glitch effect**: `.glitch` class applies a perpetual subtle offset animation (100ms burst every 4s). On hover, the glow intensifies.
- **Reduced motion**: `prefers-reduced-motion: reduce` disables all animations, glitch offsets, and hover glow changes.

## Accessibility

- **Icons**: always include `aria-hidden` or `title`. Interactive elements with icon-only labels need `aria-label`.
- **Interactive elements**: `button` elements must have a `type` attribute.
- **Animations**: respect `prefers-reduced-motion`.

## SDD Workflow

Substantial changes follow Spec-Driven Development:

1. **Session Preflight** — choose pace, artifact store, PR strategy, review budget.
2. **Proposal** — explore and define scope.
3. **Spec** — detailed requirements and scenarios.
4. **Design** — architecture and technical approach.
5. **Tasks** — break into implementation units.
6. **Apply** — implement tasks in batches.
7. **Verify** — validate against specs.
8. **Archive** — close and persist.

## Stitch Design

- Stitch project ID: `5537657823889216673`.
- Screens are uploaded via `stitch_upload_design_md` (markdown specs).
- Generative tools (`generate_screen_from_text`, `edit_screens`, `update_design_system`) require OAuth 2.0 — not available with API key alone.
- DESIGN.md is the source of truth for visual design specs.

<!-- CODEGRAPH_START -->
## CodeGraph

In repositories indexed by CodeGraph (a `.codegraph/` directory exists at the repo root), reach for it BEFORE grep/find or reading files when you need to understand or locate code:

- **MCP tool** (when available): `codegraph_explore` answers most code questions in one call — the relevant symbols' verbatim source plus the call paths between them, including dynamic-dispatch hops grep can't follow. Name a file or symbol in the query to read its current line-numbered source. If it's listed but deferred, load it by name via tool search.
- **Shell** (always works): `codegraph explore "<symbol names or question>"` prints the same output.

If there is no `.codegraph/` directory, skip CodeGraph entirely — indexing is the user's decision.
<!-- CODEGRAPH_END -->


## Check code
To check code always use: 
- pnpm format && pnpm build
