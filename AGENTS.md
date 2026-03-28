## Cursor Cloud specific instructions

This is a simple React + Vite single-page application ("Playground") with no backend, database, or external services.

### Running the dev server

```
npm run dev -- --host 0.0.0.0
```

The app runs on `http://localhost:5173` by default. Use `--host 0.0.0.0` to allow access from outside the container.

### Available npm scripts

See `package.json` for the full list: `dev`, `build`, `preview`.

### Notes

- No linter or test framework is configured in the repository. There are no `lint` or `test` npm scripts.
- No environment variables or `.env` files are needed.
- To add a new page: create a component in `src/pages/` and register the route in `src/routes.jsx`.
