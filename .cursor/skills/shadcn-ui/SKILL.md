---
name: shadcn-ui
description: Adds, manages, and creates shadcn/ui components in the shared UI package. Use when the user asks to add a shadcn component, create a custom UI component, build UI elements, or work with the @repo/ui package. Also use when building any UI in apps/ projects — always prefer shadcn components from @repo/ui over raw HTML or custom implementations.
---

# shadcn/ui in Monorepo

Package `@repo/ui` at `packages/ui/`. Style: `base-mira`, icons: Hugeicons.

## Adding Components

Run the CLI **from the app directory** — it auto-routes UI primitives to `packages/ui/src/components/` and app-level blocks to `apps/<app>/components/`:

```bash
cd apps/app && bunx --bun shadcn@latest add <component-name>
```

The CLI reads both `components.json` files and handles imports automatically.

Then lint: `bunx ultracite fix && bunx ultracite check`

## Importing Components in Apps

```tsx
import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";
```

```css
@import "@repo/ui/styles/globals.css";
```

## Creating Custom Components

When a component doesn't exist in the shadcn registry, create it in `packages/ui/src/components/`:

```tsx
"use client"; // only if interactive

import type * as React from "react";
import { cn } from "@repo/ui/lib/utils";

function ComponentName({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("base-tailwind-classes", className)}
      data-slot="component-name"
      {...props}
    />
  );
}

export { ComponentName };
```

Rules:
- `data-slot="component-name"` on every root element
- `cn` from `"@repo/ui/lib/utils"`
- Sibling imports: `"./button"` (relative, never `@/components/`)
- `React.ComponentProps<"element">` for prop types
- CVA (`class-variance-authority`) for variants
- Hugeicons only: `import { IconName } from "@hugeicons/core-free-icons"`
- `"use client"` only when interactive
- Named exports, not default exports

## Forms

See `.docs/shadcn/react-hook-form-ui.md` for Field component patterns with React Hook Form + Zod.
