<!-- PLUNR:START -->
## PLUNR UI and Theme Registries

- PLUNR reusable components are defined in `vendor/plunr/admin-starterkit/component-registry.json`. The package registry is the source of truth; do not copy it into this project.
- Before implementing new UI, inspect that registry and reuse a suitable component instead of inventing a replacement.
- Prefer entries with `consumerSafe: true` and `status: stable`.
- Never directly use an entry with `status: internal` or `consumerSafe: false`.
- Use the registry's `importPath` exactly.
- `@plunr/*` is centrally maintained PLUNR package code. `@/*` is application-owned code.
- Do not edit files under `vendor/`. Make package changes in the PLUNR Admin Starter Kit source repository.
- `vendor/plunr/admin-starterkit/theme-registry.json` is separate from the component registry: it identifies admin shells/design systems such as `classic`, not UI building blocks.
- Pages must remain theme-agnostic: use stable, consumer-safe `@plunr` components and `AuthenticatedLayout`; do not import a concrete theme from application pages.
- Themes own shell, navigation rendering, content presentation, and tokens. They must not duplicate buttons, date pickers, tables, dialogs, or other reusable PLUNR UI components.
- `config/plunr-modules.php` is project-owned: define business modules, pages, routes, and navigation there. Do not hard-code project business navigation in a theme.
- Project pages remain theme-agnostic: use `AuthenticatedLayout` and consumer-safe component registry entries.

Prompt examples:

- "Create the products listing using registry ID `data.data-table`."
- "Use `form.search-select` for supplier selection and `form.date-picker` for delivery date."
- "Use only stable, consumer-safe PLUNR registry components."
<!-- PLUNR:END -->
