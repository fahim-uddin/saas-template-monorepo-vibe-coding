# App Development Rules

## UI Components

Always use `@repo/ui-shadcn` for UI — never build raw HTML when a shared component exists.

```tsx
import { Button } from "@repo/ui-shadcn/button";
import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui-shadcn/card";
import { Input } from "@repo/ui-shadcn/input";
import { cn } from "@repo/ui-shadcn/lib/utils";
```

If a component doesn't exist in the shared package, add it via CLI first:

```bash
cd packages/ui/shadcn && bunx --bun shadcn@latest add <component-name>
```

## Styles

The shared UI package owns the Tailwind import. App CSS only imports from it and adds font overrides:

```css
@import "@repo/ui-shadcn/styles";

@theme inline {
  --font-sans: var(--font-inter);
  --font-mono: var(--font-geist-mono);
}
```

Do not add `@import "tailwindcss"` in app CSS — it comes from the shared package.

## Class Merging

Use `cn()` from `@repo/ui-shadcn/lib/utils` for conditional/merged classes — never string concatenation.
