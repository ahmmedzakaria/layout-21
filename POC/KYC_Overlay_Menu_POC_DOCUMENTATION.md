# NexaCore Enterprise Navigation POC Documentation

## File

`KYC_Overlay_Menu_POC.html`

This file is a standalone HTML/CSS/JavaScript proof of concept for an enterprise navigation shell. It demonstrates a fixed header, a fixed left rail, hierarchical module navigation, floating mega panels, theme switching, global search, app switching, notifications, and a status bar.

## Purpose

The POC validates a scalable navigation pattern for a modular enterprise application. It is designed for systems where users move across many module groups, modules, feature categories, feature groups, and final feature pages without shrinking the main content area.

The navigation hierarchy is:

```text
Module Group
  -> Module
    -> Feature Category
      -> Feature Group
        -> Feature
```

## Product Identity

The visible product name is:

```text
NexaCore Enterprise
```

The subtitle is:

```text
Navigation Workspace
```

The header includes a custom inline SVG logo using the active theme accent color. The mark combines an `N`-style path with connected nodes to represent enterprise navigation and workflow connectivity.

## Layout Regions

### Header

The header is fixed-height at `58px` and contains:

- Brand/logo area.
- Global search.
- App launcher.
- Notifications.
- Tasks.
- Language selector.
- Theme selector.
- Tenant selector.
- Profile menu.
- Logout action.

Important CSS:

```css
header { height: 58px; }
.brand-logo { width: 32px; height: 32px; }
.global-search { max-width: 560px; }
.hdr-right { display: flex; }
```

### Left Rail

The rail is fixed on the left side inside the app layout.

Modes:

- Detail mode: `286px` wide.
- Icon mode: `64px` wide.

Important CSS:

```css
.rail { width: 64px; }
.rail.detail { width: 286px; }
.rail-scroll { overflow-y: auto; }
```

The rail supports independent vertical scrolling when expanded content exceeds the viewport.

### Main Content

The main content area uses all remaining width and is never reduced by navigation overlay panels.

Important CSS:

```css
.main {
  flex: 1;
  min-width: 0;
  overflow: auto;
}
```

### Status Bar

The status bar is fixed-height at `28px` and displays operational status, sync state, audit logging, session time, clock, and version.

## Navigation Controls

### Icon / Detail Toggle

The top rail control toggles the rail between icon and detail mode.

Text behavior:

- Shows `Icon` while in detail mode.
- Shows `Detail` while in icon mode.

JavaScript:

```js
function tg() {
  detailView = !detailView;
  if (!detailView) closeNav();
  renderRail();
  document.querySelector('header').classList.toggle('icon-view', !detailView);
  positionPanels();
}
```

### Expand / Collapse Toggle

Beside the Icon/Detail toggle, there is an inline `Expand` / `Collapse` control.

Behavior:

- `Expand`: expands all module groups and modules so level 3 categories are visible.
- `Collapse`: collapses navigation back to level 1.

JavaScript:

```js
function toggleEnterpriseNavigation() {
  detailView = true;
  document.querySelector('header').classList.remove('icon-view');
  if (isExpandedToLevel3()) {
    expandedPaths.clear();
  } else {
    expandToLevel3();
  }
  activePath = [];
  closePanelsOnly();
  renderRail();
}
```

The text and icon are updated by:

```js
function updateNavToggleButton() {
  // Updates the expand/collapse icon, label, and aria-label.
}
```

## Navigation Data Model

The hierarchy is stored in JavaScript inside `navigationTree`.

Each node follows this structure:

```js
const moduleGroupNode = {
  label: 'Banking',
  type: 'Module Group',
  icon: '🏦',
  children: []
};
```

Feature groups are generated with:

```js
function group(label, features) {
  return {
    label,
    type: 'Feature Group',
    children: features.map(f => ({ label: f, type: 'Feature' }))
  };
}
```

Feature categories are generated with:

```js
const categories = (operationGroups, setupGroups, reportGroups) => [
  { label: 'Operation', type: 'Feature Category', children: operationGroups },
  { label: 'Report', type: 'Feature Category', children: reportGroups },
  { label: 'Setup', type: 'Feature Category', children: setupGroups }
];
```

Current level 3 order is:

```text
Operation
Report
Setup
```

## Current Module Groups

The POC includes these module groups:

- Banking
- Survey
- POS
- Health & Medical
- Education
- E-Commerce
- Administration
- Security
- Reporting

## Rail Rendering

The rail is rendered dynamically by:

```js
function renderRail() {
  // Rebuilds the rail rows and restores the previous scroll position.
}
```

Responsibilities:

- Preserve rail scroll position before rebuilding.
- Set rail detail/icon class.
- Update toggle labels.
- Render dashboard and navigation tree rows.
- Add event listeners to rail rows.
- Restore scroll position after rebuilding.

Scroll preservation is handled with:

```js
const previousRailScroll = icons.querySelector('.rail-scroll');
const previousScrollTop = previousRailScroll ? previousRailScroll.scrollTop : 0;
// Rail markup is rebuilt here.
nextRailScroll.scrollTop = Math.min(previousScrollTop, maxScrollTop);
```

This prevents the rail from jumping to the top when users click items near the bottom.

## Rail Levels

### Level 1: Module Group

Examples:

- Banking
- Survey
- POS
- Security
- Reporting

Level 1 rows may use emoji icons from the data model.

### Level 2: Module

Examples:

- Core Banking
- Land Survey
- Retail POS
- Access Control
- Analytics

Level 2 rows use context-aware SVG icons based on module name keywords.

Function:

```js
function moduleIcon(label) {
  // Returns a context-aware SVG string for a module label.
}
```

Keyword examples:

- `banking` -> bank icon
- `survey` -> map icon
- `pos` -> terminal/register icon
- `clinic` / `pharmacy` -> medical icon
- `student` / `fee` -> education icon
- `marketplace` / `delivery` -> cart icon
- `administration` -> gear icon
- `security` / `control` -> shield icon
- `report` / `analytics` -> chart icon

### Level 3: Feature Category

Current categories:

- Operation
- Report
- Setup

Level 3 rows use category-specific SVG icons.

Function:

```js
function categoryIcon(label) {
  // Returns an SVG string for Operation, Report, or Setup.
}
```

## Mega Panel Behavior

Level 4 and level 5 are displayed in a single floating mega panel.

Trigger:

- Hover or click a level 3 category row.

Level 4:

- Rendered as column/list titles.
- Example: `Customer Management`, `Account Management`, `Loan Management`.

Level 5:

- Rendered as list items under each level 4 title.
- Example: `Customer Registration`, `Customer Search`, `Customer Update`.

Key renderer:

```js
function megaPanelHtml(categoryPath) {
  // Builds the level 4 and level 5 mega panel for the selected category.
}
```

Feature selection:

```js
function selectFeature(path) {
  // Updates breadcrumb and page title for the selected feature.
}
```

Selecting a feature updates:

- Breadcrumb
- Page title
- Open overlay state

## Mega Panel Layout

The mega panel floats over the main content and does not reduce content width.

Important CSS:

```css
.nav-panel.mega {
  width: min(790px, calc(100vw - 330px));
  max-height: 92vh;
  overflow-y: auto;
}

.mega-layout {
  display: grid;
  grid-template-columns: 290px minmax(0, 1fr);
}

.mega-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(165px, 1fr));
}
```

Content behavior:

- The left side contains a contextual SVG and note.
- The right side contains responsive feature-group columns.
- Large content wraps into available columns and scrolls vertically when needed.
- Horizontal overflow is hidden to avoid layout breakage.

## Left Context Panel

The mega panel includes a left-side contextual block:

- Large SVG illustration.
- Context title.
- Short note relevant to the selected module group/category.

Functions:

```js
function megaContext(categoryPath) {
  // Returns the contextual title, note, and SVG for the selected category.
}

function contextSvg(key) {
  // Returns the contextual SVG illustration string.
}
```

Example notes:

- Banking: customer, account, loan, transaction, cheque, and remittance workflows.
- Survey: field information, boundary verification, GIS-backed workflows.
- Security: access, sessions, privileges, devices, and audit activity.
- Reporting: operational, management, compliance, and analytics reports.

## Panel Positioning

The mega panel opens based on the cursor/row position instead of always using a fixed top.

Key state:

```js
let panelTopByLevel = {};
```

When a level 3 category opens:

```js
panelTopByLevel = {
  4: anchorEl ? anchorEl.getBoundingClientRect().top : undefined
};
```

Positioning:

```js
function positionPanels() {
  // Positions open overlay panels and clamps them inside the viewport.
}
```

The panel top is clamped inside the viewport so it does not render off-screen.

## Scroll Behavior

The POC has multiple scroll boundaries:

- Body: hidden overflow.
- Main content: scrolls independently.
- Rail: scrolls when expanded menu exceeds height.
- Mega panel: scrolls when content exceeds `92vh`.

Important CSS:

```css
body { overflow: hidden; }
.main { overflow: auto; }
.rail-scroll { overflow-y: auto; }
.nav-panel { overflow-y: auto; }
```

## Theme System

Themes are driven by CSS variables and body classes/data attributes.

Theme options:

- Light
- Dark
- Blue Enterprise
- Navy Banking
- Green Compliance
- Purple Corporate
- Gray Professional

Theme function:

```js
function selectTheme(id) {
  // Applies the selected theme variables and dark-mode class.
}
```

Dark themes use:

```js
document.body.classList.toggle('dark', t.dark);
```

The selected theme changes the accent color, chrome colors, panel colors, and search field styling.

## Header Dropdowns

Header dropdowns use `.hdr-item.open`.

Functions:

```js
function toggleDD(id) {
  // Opens or closes a header dropdown.
}

function closeAllDD() {
  // Closes all header dropdowns.
}
```

Dropdown examples:

- Apps panel
- Notifications
- Tasks
- Language selector
- Theme selector
- Tenant selector
- Profile menu

## Search Behavior

The search type selector changes placeholder text through:

```js
searchType.addEventListener('change', () => {
  searchInput.placeholder = typePlaceholders[searchType.value];
});
```

Running search:

```js
function runSearch() {
  // Runs the global search and updates the page title.
}
```

If the rail is currently in icon mode, search first switches back to detail mode and focuses the input.

## Breadcrumb and Page Title

Initial state:

```text
Home
Dashboard
```

Feature selection updates the breadcrumb to the full path:

```text
Home / Module Group / Module / Feature Category / Feature Group / Feature
```

Implemented by:

```js
function selectFeature(path) {
  // Converts a feature path into breadcrumb text and page title.
}
```

## Adding a New Module Group

Add a new object to `navigationTree`:

```js
const moduleGroupExample = {
  label: 'New Module Group',
  type: 'Module Group',
  icon: '🧩',
  children: [
    {
      label: 'New Module',
      type: 'Module',
      children: categories([
        group('New Feature Group', [
          'New Feature',
          'Search Feature',
          'Update Feature'
        ])
      ])
    }
  ]
};
```

## Adding a New Module

Add a module under a module group's `children`:

```js
const moduleExample = {
  label: 'Treasury',
  type: 'Module',
  children: categories([
    group('Liquidity Management', [
      'Cash Forecast',
      'Position Review',
      'Limit Utilization'
    ])
  ])
};
```

## Adding Feature Groups

Feature groups are level 4 items. Add them to the relevant category list:

```js
group('Customer Management', [
  'Customer Registration',
  'Customer Search',
  'Customer Update'
]);
```

## Adding Features

Features are level 5 items. Add string entries inside a `group` feature array:

```js
group('Document Service', [
  'Document Upload',
  'Document Checklist',
  'Document Verification',
  'Document Expiry'
]);
```

## Accessibility Notes

Implemented:

- Keyboard activation with `Enter` for rail rows.
- `role="button"` for the inline expand/collapse control.
- `aria-label` on navigation expand/collapse control.
- `aria-hidden="true"` on decorative brand logo.
- Visible focus outlines through `:focus-visible`.

Areas to improve before production:

- Add full arrow-key navigation for hierarchical menus.
- Add `Escape` handling to close overlays.
- Add ARIA menu roles if this becomes a production menu component.
- Announce dynamic panel changes to screen readers.

## Known POC Constraints

This file is intentionally standalone and uses inline CSS/JavaScript.

Current constraints:

- No module bundler.
- No framework components.
- No server-side route loading.
- Feature clicks update the page title and breadcrumb only.
- Theme settings are not persisted.
- Navigation data is hard-coded in JavaScript.

## Productionization Recommendations

For production, split this POC into:

- Layout component.
- Header component.
- Rail navigation component.
- Mega panel component.
- Navigation data model or API DTO.
- Theme service.
- Route integration.
- Permission-aware menu filtering.

Recommended production behaviors:

- Load navigation from backend privilege/catalog APIs.
- Filter menu nodes by user role, tenant, business, and branch scope.
- Persist theme and rail preference.
- Replace inline event handlers with framework event bindings.
- Add keyboard navigation and screen-reader semantics.
- Write component tests for expand/collapse, panel positioning, and overflow behavior.

## Verification

For this standalone POC, a lightweight syntax check can be run by extracting the inline script:

```bash
perl -ne 'print if /<script>/../<\/script>/' KYC_Overlay_Menu_POC.html | sed '1d;$d' | node --check
```

Expected result:

```text
no output, exit code 0
```
