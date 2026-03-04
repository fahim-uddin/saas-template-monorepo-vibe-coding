# Shadcn UI Best Practices

Overview
A cohesive guide for building UI with Shadcn UI in React/Next.js projects. Emphasizes composition, accessibility, theming, performance, testing, and maintainable code structure. The guide covers project structure, patterns, security, testing, and practical implementation details to ensure scalable and accessible UI.

Table of contents
- Code organization
- Patterns and anti-patterns
- Performance
- Security
- Testing
- Accessibility and theming
- Tooling and environment
- Implementation notes
- Practical guidance

Code organization
- Directory structure
  - Organize components by domain or functionality (e.g., components/ui, components/forms, components/layout).
  - Place form-related components under components/forms and layout-related components under components/layout.
  - Use index.ts files to re-export from each directory for convenient imports.
- File naming and modules
  - Component files use PascalCase (e.g., Button.tsx).
  - Descriptive names for components and utilities.
  - Separate presentational UI components from container/logic components.
  - Create a utils directory for shared helpers and constants.
- Component architecture
  - Favor composition over inheritance.
  - Maintain clear separation of concerns: presentational UI vs. container logic.
  - Implement as functional components with React hooks for state and effects.
- Code organization within components
  - Break complex components into smaller, reusable pieces.
  - Extend core Shadcn UI components via wrappers or composition rather than editing core files.
- Code splitting and performance
  - Lazy-load non-critical components with React.lazy and Suspense.
  - Consider route-based code splitting for large apps and leverage bundler features (tree-shaking, code-splitting).

Patterns and anti-patterns
- Shadcn UI patterns
  - Use Shadcn UI components where possible; customize with Tailwind utility classes or CSS variables.
  - Build compound components by composing existing Shadcn UI primitives.
- Common tasks
  - Use form components (Input, Select, etc.) for consistency.
  - Ensure accessibility with ARIA attributes, semantic markup, and keyboard navigation.
  - Use the cn utility (classNames) from Shadcn UI for class merging.
- Anti-patterns
  - Do not modify core library component code directly.
  - Avoid excessive custom CSS that bypasses Tailwind/Shadcn conventions.
  - Do not neglect accessibility or create overly complex components.
- State management
  - Local state with useState for simple cases; for complex state, consider Zustand, Redux, or Recoil.
  - Never mutate state directly; always use setters or updater functions.
- Error handling
  - Implement error boundaries where appropriate.
  - Use try/catch around async operations; surface informative messages and log for debugging.

Performance
- Rendering and re-renders
  - Memoize components with React.memo when props are stable.
  - Use useCallback for stable function references, especially for props passed to children.
- Large data rendering
  - Use virtualization for long lists/grids; minimize DOM operations and reflows.
- Bundle size
  - Remove dead code (tree-shaking); minify assets.
  - Lazy-load heavy components and assets; leverage IntersectionObserver for on-demand loading.
- Server Components
  - In Next.js, leverage React Server Components where appropriate to reduce client payloads.

Security
- Data handling
  - Sanitize and validate user input on client and server sides.
  - Avoid storing sensitive data on the client; use secure patterns.
- API security
  - Use HTTPS; implement rate limiting; validate responses.
  - Prefer robust authentication (OAuth 2.0, OpenID Connect) and RBAC for authorization.
- Form protection
  - Use input validation libraries (Zod, Yup) and implement CSRF protections.

Testing
- Unit testing
  - Test components and utilities in isolation with Jest or similar.
- Integration testing
  - Verify component-API interactions and integration points.
- End-to-end testing
  - Use Cypress or Playwright to simulate user flows.
- Test organization
  - Co-locate tests with components; use descriptive test names.
- Mocking
  - Mock external dependencies to ensure deterministic tests.

Accessibility and theming
- Accessibility
  - Ensure WCAG-aligned semantics, proper labeling, focus management, and keyboard navigation.
  - Use ARIA attributes where appropriate and test with assistive technologies.
- Theming
  - Utilize Shadcn UI theming via globals.css with CSS variables for easy customization.
  - Support light/dark modes and color schemes following Shadcn conventions.
  - Use Tailwind utilities and the cn utility for class composition.
  - Extend themes via wrappers or composable components, not by editing core files.

Tooling and environment
- Development tooling
  - Use VS Code with React/TypeScript and Tailwind CSS extensions; leverage browser devtools.
- Build and linting
  - Use a bundler with tree-shaking; apply production optimizations.
  - Enforce code quality with ESLint and Prettier; format on save.
- Deployment and CI/CD
  - Set up CI/CD pipelines for build, test, and deployment.
  - Serve assets via a CDN and enable compression on the server.

Implementation notes
- Client directive and interactivity
  - Apply the client-side directive for components requiring interactivity.
- Form handling and validation
  - Integrate react-hook-form for form state with Zod schemas for validation.
  - Provide accessible labeling, error messages, and summaries.
- Component interfaces and typing
  - Define explicit TypeScript interfaces for props; avoid any.
  - Document props with JSDoc for maintainability.
- Composition and slots
  - Build compound components via composition and the slot pattern for flexible layouts.
  - Use cva (class-variance-authority) to create reusable styling variants.
- State and UX
  - Use controlled states for dialogs/menus where appropriate.
  - Provide loading indicators and toast notifications during async actions.
- Naming conventions
  - Use descriptive names; prefix boolean states with is/has (e.g., isLoading, hasError).
- Accessibility and testing by design
  - Prioritize accessibility from the start; test with assistive tech as part of development.

Practical implementation guidance
- Extensibility
  - Extend components rather than modifying core library files; keep customizations under components/ui.
- Theming
  - Centralize tokens and expose easy customization points for colors, typography, and elevation.
- Performance-minded patterns
  - Memoize heavy UI paths; lazy-load complex dialogs or dashboards; memoize expensive computations with useMemo when needed.
- Documentation
  - Document component props, usage examples, and accessibility notes in README or embedded docs.

Sample folder layout (illustrative)
- components/
  - ui/
    - Button.tsx
    - Input.tsx
    - Modal.tsx
    - index.ts
  - forms/
    - LoginForm.tsx
    - RegistrationForm.tsx
    - index.ts
  - layout/
    - Header.tsx
    - Sidebar.tsx
    - index.ts
- hooks/
- utils/
- styles/
  - globals.css