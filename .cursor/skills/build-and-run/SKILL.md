---
name: build-and-run
description: Build the app, start the local dev server, and open it in the Cursor browser. Use when the user types `/build-and-run` or `/build-and-run appname`.
disable-model-invocation: true
---

# Build and run

Use this skill to handle local feature review or testing after Build.

## Inputs

- Optional app name, as in **`/build-and-run exampleapp`**.

## Steps

1. Determine the target app:
   - If an app name was provided, use the matching app directory.
   - If no app name was provided and the repo has exactly one app, use that app.
   - If multiple apps exist and no app name was provided, ask which app to run.
2. Use the repo’s package manager for that app. In this repo, default to **`npm`**.
3. Install dependencies if needed.
4. Run **`npm run build`** for the target app.
5. Start **`npm run dev`** for the target app.
6. Open the local app URL in the Cursor browser once the dev server is ready.
7. Report the chosen app and local URL back to the user.

## Notes

- Prefer reusing an already healthy matching dev server instead of starting a duplicate one.
- In this repository today, there is one Vite app at the repo root, so plain **`/build-and-run`** should target the root app.
