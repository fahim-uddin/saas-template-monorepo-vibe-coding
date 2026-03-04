---
name: ultracite-validation
description: Validates code with Ultracite (Biome) after implementing features or writing code. Use after any code generation, file creation, code modification, feature implementation, refactoring, or when the user asks to lint, format, or check code quality.
---

# Ultracite Validation

Run this workflow after every code implementation or modification.

## Validation Steps

### 1. Check for errors

```bash
bunx ultracite check
```

If exit code is 0, validation passes — you're done.

### 2. Auto-fix what's possible

If errors were found:

```bash
bunx ultracite fix
```

### 3. Handle remaining errors

If `fix` reports unfixable errors, resolve them manually:

| Error | Fix |
|-------|-----|
| `useButtonType` | Add `type="button"` or `type="submit"` to `<button>` |
| `noAlert` | Replace `alert()`/`confirm()`/`prompt()` with UI components |
| `noExplicitAny` | Replace `any` with a proper type |
| `useImportType` | Change `import { X }` to `import type { X }` for type-only imports |
| `noUnusedVariables` | Remove the unused variable or import |
| `noUnusedImports` | Remove the unused import |
| `useSemanticElements` | Use `<nav>`, `<main>`, `<section>` instead of generic `<div>` with ARIA roles |
| `noAutofocus` | Remove `autoFocus` or suppress with `biome-ignore` and justification |

### 4. Re-verify

After manual fixes, run check again:

```bash
bunx ultracite check
```

Repeat until zero errors.

## Turbo Integration

From the monorepo root, you can also use:

```bash
turbo run check
turbo run fix
```

## Diagnostics

If something seems misconfigured, run:

```bash
bunx ultracite doctor
```
