# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Backend (Express + SQLite)

A minimal backend is included under `server/` to serve products and categories from a SQLite database.

- Tech: Express, better-sqlite3 (no ORM), CORS enabled
- DB file: `server/data.sqlite`
- Seed data: `server/seed-data.json`

### Quickstart (Windows)

1) Install dependencies

```bat
npm install
```

2) Seed the database

```bat
npm run server:seed
```

3) Start the API server (default http://localhost:3000)

```bat
npm run server:start
```

Alternative port:

```bat
npm run server:start:3001
```

4) Smoke test the API

```bat
curl.exe -s http://localhost:3000/api/health
curl.exe -s http://localhost:3000/api/categories
curl.exe -s "http://localhost:3000/api/products?perPage=12&page=1"
```

Dev proxy: the Vite dev server proxies `/api` to `http://localhost:3000`. Start both servers during development and call `/api/...` from the frontend without CORS issues.

### API Endpoints

- GET `/api/health` → `{ ok: true, now: ISOString }`
- GET `/api/categories` → `string[]`
- GET `/api/products` → Paged results
  - Query params:
    - `q` (string): full-text search on name, sku, category, descriptions
    - `category` (string | `ALL`)
    - `sort` one of: `ALPHA_ASC` | `ALPHA_DESC` | `DATE_NEW` | `DATE_OLD` | `PRICE_ASC` | `PRICE_DESC`
    - `page` (number, 1+), `perPage` (1-100)
  - Response: `{ total, page, perPage, items: Product[] }`
- GET `/api/products/:id` → `Product` or 404

Product shape aligns with the frontend TypeScript `Product` interface (images/packaging/pouches/specs serialized into JSON in the DB layer).

### Troubleshooting

- Port in use (EADDRINUSE): another server is running on port 3000. Either stop it or use `npm run server:start:3001`.
- Re-seeding: run `npm run server:seed` to reload `seed-data.json` into `data.sqlite`.
- SQLite file location: `server/data.sqlite`. You can delete it and re-run seed to reset.

### Admin

Set an admin password so protected endpoints work:

1) Copy `.env.example` to `.env` and set `ADMIN_PASSWORD`.
2) Restart the server.

Admin UI: open `/admin` in the app. Enter the password to:
- View messages (All/Unread/Read)
- Mark messages read/unread or delete
- Create a new product (minimal fields)

The server protects admin endpoints by checking the `x-admin-password` header against `ADMIN_PASSWORD`.
