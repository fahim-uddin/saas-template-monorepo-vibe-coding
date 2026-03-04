---
name: shadcn-ui
description: Adds, manages, and creates shadcn/ui components in the shared UI package. Use when the user asks to add a shadcn component, create a custom UI component, build UI elements, or work with the @repo/ui-shadcn package. Also use when building any UI in apps/ projects — always prefer shadcn components from @repo/ui-shadcn over raw HTML or custom implementations.
---

# shadcn/ui Component Management

## Package Location

- **Shared UI package**: `packages/ui/shadcn/` (name: `@repo/ui-shadcn`)
- **Components dir**: `packages/ui/shadcn/src/components/ui/`
- **Config**: `packages/ui/shadcn/components.json`
- **Style**: `base-mira` with Base UI primitives, Hugeicons, Neutral/Cyan theme

## Adding a shadcn Component via CLI

Always use the CLI from the package directory:

```bash
cd packages/ui/shadcn && bunx --bun shadcn@latest add <component-name>
```

Examples:

```bash
cd packages/ui/shadcn && bunx --bun shadcn@latest add dialog
cd packages/ui/shadcn && bunx --bun shadcn@latest add tooltip checkbox radio-group
```

### Post-CLI: Fix Imports

The CLI generates components with `@/` path aliases which break in monorepo bundling. After adding any component, replace all `@/` imports with relative paths:

| Generated import | Replace with |
|-----------------|--------------|
| `"@/lib/utils"` | `"../../lib/utils"` |
| `"@/components/ui/button"` | `"./button"` |
| `"@/components/ui/<name>"` | `"./<name>"` |

Verify no `@/` imports remain:

```bash
grep -r '"@/' packages/ui/shadcn/src/components/ui/
```

### Post-CLI: Lint

```bash
bunx ultracite fix && bunx ultracite check
```

## Creating Custom Micro Components

When a needed component doesn't exist in shadcn's registry, create it in `packages/ui/shadcn/src/components/ui/` following these patterns:

### File Template

```tsx
"use client"; // only if interactive (uses hooks, event handlers, Base UI primitives)

import type * as React from "react";
import { cn } from "../../lib/utils";

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

### With Variants (CVA)

```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const componentVariants = cva("base-classes", {
  variants: {
    variant: { default: "...", secondary: "..." },
    size: { default: "...", sm: "...", lg: "..." },
  },
  defaultVariants: { variant: "default", size: "default" },
});

function Component({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof componentVariants>) {
  return (
    <div
      className={cn(componentVariants({ variant, size }), className)}
      data-slot="component"
      {...props}
    />
  );
}

export { Component, componentVariants };
```

### With Base UI Primitive

```tsx
"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { cn } from "../../lib/utils";

function DialogContent({ className, ...props }: DialogPrimitive.Popup.Props) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop className="fixed inset-0 bg-black/50" />
      <DialogPrimitive.Popup
        className={cn("fixed ...", className)}
        data-slot="dialog-content"
        {...props}
      />
    </DialogPrimitive.Portal>
  );
}

export { DialogContent };
```

### Rules for Custom Components

- Use `data-slot="component-name"` on every component root
- Import `cn` from `"../../lib/utils"` (relative, not `@/`)
- Import sibling components with `"./button"` (relative, not `@/components/ui/`)
- Use `React.ComponentProps<"element">` for props typing
- Use Hugeicons for icons: `import { IconName } from "@hugeicons/core-free-icons"`
- Add `"use client"` only when the component is interactive
- Use named exports, not default exports
- Use Tailwind theme colors (`bg-primary`, `text-muted-foreground`, etc.)

## Using shadcn Components in Apps

### Setup (one-time per app)

1. Add dependency in `apps/<app>/package.json`:

```json
"dependencies": {
  "@repo/ui-shadcn": "workspace:*"
}
```

2. Import shared styles in `apps/<app>/src/app/globals.css`:

```css
@import "@repo/ui-shadcn/styles";

@theme inline {
  --font-sans: var(--font-inter);
  --font-mono: var(--font-geist-mono);
}
```

### Importing Components

```tsx
import { Button } from "@repo/ui-shadcn/button";
import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui-shadcn/card";
import { Input } from "@repo/ui-shadcn/input";
import { Label } from "@repo/ui-shadcn/label";
import { cn } from "@repo/ui-shadcn/lib/utils";
```

### Building App-Level UI

When building UI in any app, always compose with shadcn components rather than raw HTML:

```tsx
// GOOD: Use shadcn components
<Card>
  <CardHeader>
    <CardTitle>Settings</CardTitle>
  </CardHeader>
  <CardContent>
    <Label htmlFor="name">Name</Label>
    <Input id="name" placeholder="Enter name" />
    <Button type="submit">Save</Button>
  </CardContent>
</Card>

// BAD: Raw HTML with custom classes
<div className="rounded-lg border p-4">
  <h2>Settings</h2>
  <label>Name</label>
  <input placeholder="Enter name" />
  <button>Save</button>
</div>
```

## Available Components Reference

Check current components:

```bash
ls packages/ui/shadcn/src/components/ui/
```

## Forms

Use React Hook Form + Zod with the Field components. See `.docs/shadcn/react-hook-form-ui.md` for detailed patterns.
