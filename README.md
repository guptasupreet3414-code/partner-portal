# DigiCert ONE Navigation Shell

A reusable React + Vite + TypeScript + Styled Components navigation shell for DigiCert ONE products.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Tech stack

| Tool | Version |
|------|---------|
| React | 18 |
| Vite | 6 |
| TypeScript | 5 |
| styled-components | 6 |
| react-router-dom | 6 |

## Project structure

```
src/
  components/
    TopNav/
      TopNav.tsx            # Fixed top bar with logo, icons, user avatar
      TopNav.styles.ts      # Styled components for TopNav
      SettingsDrawer.tsx    # Slide-in right drawer with focus trap
      SettingsDrawer.styles.ts
    LeftNav/
      LeftNav.tsx           # Composes IconRail + ProductSubNav
      LeftNav.styles.ts
      IconRail.tsx          # 56px fixed icon rail (dark navy)
      IconRail.styles.ts
      ProductSubNav.tsx     # 220px collapsible product sub-nav panel
      ProductSubNav.styles.ts
      NavSection.tsx        # Collapsible section with nav links
  components/
    Icons.tsx               # Inline SVG icon library
  data/
    navConfig.ts            # All nav tree data — source of truth
  hooks/
    useNavState.ts          # Manages active product, panel state, drawer state
  pages/
    StubPage.tsx            # Generic stub page for all routes
  App.tsx                   # App shell, routing, layout
  main.tsx                  # Entry point with ThemeProvider + BrowserRouter
  theme.ts                  # Design tokens (colors, spacing, typography)
  styled.d.ts               # styled-components theme type augmentation
```

## Adding a new product to the nav

All nav data lives in `src/data/navConfig.ts`. To add a new product:

### 1. Add the icon rail entry

In `iconRailGroup1` or `iconRailGroup2`, add an entry:

```ts
{ id: 'my-product', label: 'My Product', route: '/my-product', ariaLabel: 'My Product', iconType: 'shield' }
```

Available `iconType` values: `dashboard`, `settings`, `shield`, `hierarchy`, `cycle`, `code`, `globe`, `document`, `mobile`, `sparkle`, `envelope`.

To add a new icon, export it from `src/components/Icons.tsx` and add a case to the `getProductIcon` switch.

### 2. Add the product sub-nav

In `productNavConfig`, add a new key matching the `id` above:

```ts
'my-product': {
  id: 'my-product',
  label: 'My Product',
  route: '/my-product',
  ariaLabel: 'My Product navigation',
  sections: [
    {
      title: 'OVERVIEW',
      defaultExpanded: true,
      items: [
        { label: 'Dashboard', route: '/my-product/dashboard' },
      ],
    },
    {
      title: 'MANAGE',
      items: [
        { label: 'Items', route: '/my-product/items' },
      ],
    },
  ],
},
```

### 3. Register routes

In `src/App.tsx`, add your routes to the `allRoutes` array:

```ts
'/my-product',
'/my-product/dashboard',
'/my-product/items',
```

For real pages, replace `<StubPage />` with your actual page components.

## Key design decisions

- **Panel open/closed state persists**: clicking a new icon in the rail swaps the sub-nav content but does not re-open a closed panel. Only the chevron button opens/closes the panel.
- **Settings drawer** has a focus trap — keyboard users cannot tab out while it's open. Press Escape or click the backdrop to close.
- **Active nav item** highlighted in blue (#0174C3). Current page detected via `react-router-dom`'s `NavLink`.
- **Skip-to-main link** is visually hidden but focusable — keyboard users press Tab on load to jump past navigation.
- **All icon buttons** have `aria-label` attributes. All landmark regions use `<nav>` with descriptive `aria-label`.
