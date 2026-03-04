# shadcn/ui Package Rules

Package `@repo/ui-shadcn` — shared design system using Base UI primitives, Tailwind CSS v4, Hugeicons.

## Adding Components

Always use the CLI from this directory:

```bash
cd packages/ui/shadcn && bunx --bun shadcn@latest add <component-name>
```

After adding, fix generated `@/` imports to relative paths:

- `"@/lib/utils"` → `"../../lib/utils"`
- `"@/components/ui/<name>"` → `"./<name>"`

Then run `bunx ultracite fix && bunx ultracite check`.

## Component Conventions

- Use `data-slot="component-name"` on every component root
- Import `cn` from `"../../lib/utils"` (relative, never `@/`)
- Import sibling components with `"./<name>"` (relative, never `@/components/ui/`)
- Use `React.ComponentProps<"element">` for prop types
- Use CVA (`class-variance-authority`) for variant-based styling
- Use named exports, not default exports
- Add `"use client"` only for interactive components
- Use Tailwind theme tokens (`bg-primary`, `text-muted-foreground`) — never hardcode colors

## Icons

Hugeicons only — not Lucide:

```tsx
import { IconName } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
```

## Forms

Use Field components with React Hook Form + Zod. See `.docs/shadcn/react-hook-form-ui.md`.
