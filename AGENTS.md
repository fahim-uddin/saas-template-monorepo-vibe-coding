# Code Quality Standards

This project uses **Ultracite** (Biome) for linting and formatting. ESLint and Prettier are NOT used.

## Formatting Rules

- 2-space indentation (no tabs)
- 80-character max line width
- Semicolons at end of statements
- Double quotes for strings
- Trailing commas in multi-line arrays/objects

## Lint Rules to Follow When Writing Code

### TypeScript
- Never use `any` — use `unknown`, generics, or proper types
- Handle `null`/`undefined` explicitly
- Use `===` and `!==`, never `==` or `!=`
- No unused variables or imports
- Use `import type` for type-only imports

### React / JSX
- Always add `type` attribute to `<button>` elements (`type="button"` or `type="submit"`)
- Never use `alert()`, `confirm()`, or `prompt()` — use proper UI components
- Include accessibility attributes: `alt` on images, ARIA labels where needed
- Use semantic HTML elements

### Imports
- Biome auto-organizes imports — do not manually sort
- Prefer named exports over default exports
- Use `import type { X }` for type-only imports, not `import { type X }`

### General
- No `console.log` in production code (use a logger or remove before committing)
- No `eval()` or `dangerouslySetInnerHTML` unless absolutely necessary
- No `var` — use `const` by default, `let` only when reassignment is needed
- Prefer `for...of` over `Array.forEach`

## After Writing Code

After implementing any feature or code change, always run:

```bash
bunx ultracite check
```

If issues are found, fix them with:

```bash
bunx ultracite fix
```

Verify with `check` again to ensure zero errors remain.

## Inline Suppression

If a rule must be bypassed, use an inline comment with justification:

```tsx
// biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized HTML from CMS
<div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
```

## Config Location

- `biome.jsonc` at repository root — extends `ultracite/biome/core` and `ultracite/biome/next`
- No per-app lint configs — Ultracite runs from the monorepo root
