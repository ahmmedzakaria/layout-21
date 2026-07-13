# Layout Agent Guide

## Scope

This guide applies to the standalone Sentinel KYC Angular layout application under
`frontendApplications/layout/`.

## Project Shape

- Angular 21 standalone application
- TypeScript with strict compiler and strict template checks
- Zoneless change detection
- Signals for local UI state
- RxJS reserved for asynchronous streams such as HTTP
- Angular CDK for behavior primitives such as overlays and positioning
- Custom SCSS design-token system under `src/styles`
- Custom SVG icon registry under `src/app/shared/icon`
- Internationalization through `@jsverse/transloco`
- Vitest for unit tests and Playwright for end-to-end tests
- Application package: `sentinel-kyc`

Useful commands:

```bash
npm install
npm run build
npm test
npm run test:e2e
npm run lint
npm start
```

## Ownership Rules

- Keep this app focused on the Angular conversion of the KYC layout shell and
  dashboard proof of concept.
- Keep authenticated shell behavior under `src/app/layout`.
- Keep layout state, theme state, direction state, menu state, and flyout
  behavior under `src/app/core/services`.
- Keep navigation and theme data models under `src/app/core/models`.
- Keep reusable icon rendering and icon registry code under `src/app/shared/icon`.
- Keep routed product screens under `src/app/features`.
- Do not add backend business rules, real auth policy, or app-specific API
  catalogs unless the task explicitly asks for that integration.

## Angular Rules

- Use standalone components only; do not introduce NgModules.
- Import every Angular directive, pipe, and component used by a standalone
  template in that component's `imports` array.
- Prefer signals for synchronous UI state such as open menus, selected theme,
  active rail item, expanded rail state, and current language.
- Use Angular CDK overlay primitives for dropdowns, flyouts, and positioned
  panels rather than manual document positioning code.
- Keep strict template compatibility in mind; avoid `any` and untyped template
  state when a small interface is clearer.
- Keep built-in Angular pipes explicit in component imports, for example
  `UpperCasePipe` from `@angular/common`.

## Styling And UI

- Preserve the custom SCSS token system and existing theme variables.
- Keep all seven theme variants working when changing tokens or theme selection.
- Do not introduce Angular Material, Bootstrap, or Font Awesome into this app.
- Use the existing `IconComponent` and icon registry for visual symbols.
- Keep layout surfaces dense, operational, and consistent with the KYC console
  style rather than marketing-page composition.
- Check desktop and mobile layouts when changing rail navigation, header
  controls, dropdowns, flyouts, or status bar sizing.

## Internationalization

- Use Transloco for user-facing text in reusable or routed UI where practical.
- Keep translation files under `src/assets/i18n`.
- Keep Arabic RTL behavior aligned with `DirectionService`.
- When adding language-sensitive UI, verify English, Bangla, and Arabic states
  if the change affects layout, direction, or text length.

## Testing And Verification

- Add or update focused tests for services, route behavior, non-trivial signals,
  and component behavior with meaningful branches.
- Use Playwright for browser-level interaction checks such as menus, overlays,
  rail flyouts, and responsive shell behavior.
- Run the narrowest meaningful check before completing work:

```bash
npm run build
```

- Run `npm test` when changing services, state logic, component logic, pipes, or
  guards.
- Run `npm run test:e2e` when changing browser interactions, overlays, routing,
  or responsive shell behavior.
- Run `npm run lint` when changing TypeScript or template structure broadly.
- If local browser, dependency, network, or environment issues prevent a check,
  report the exact command and failure clearly.

## Dependency Rules

- Keep Angular package versions aligned across `@angular/*`, `@angular/build`,
  `@angular/cli`, and `@angular/compiler-cli`.
- Keep Vitest compatible with the installed Angular build package. Angular 21
  build tooling expects Vitest 4 when Vitest is present.
- Commit `package-lock.json` after dependency resolution so patch versions are
  reproducible.
- Do not commit generated output such as `dist/`, `.angular/`, coverage, or
  `node_modules/`.

## Documentation Rules

- Keep `README.md` aligned with actual scripts, dependencies, and project
  structure.
- Document intentionally stubbed behavior, such as auth logout, SSO app launch,
  static notifications, and placeholder routes.
- When adding new shell capabilities, update docs with where the state, models,
  translations, and tests live.
