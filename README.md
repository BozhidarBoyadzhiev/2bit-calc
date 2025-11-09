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
    # 2-bit Calculator (React + TypeScript + Vite)

    A small React + TypeScript project built with Vite. Includes TailwindCSS and a GitHub Pages deployment workflow.

    ## Development

    Install dependencies and start the dev server:

    ```bash
    npm install
    npm run dev
    ```

    ## Build

    ```bash
    npm run build
    npm run preview   # Preview the production build locally
    ```

    ## Deployment (GitHub Pages)

    This project auto-deploys to GitHub Pages using the workflow in `.github/workflows/deploy.yml`.

    Deployment URL (after first run):
    https://bozhidarboyadzhiev.github.io/2bit-calc/

    ### How it works

    1. A push to `main` triggers the workflow.
    2. Node dependencies are installed with `npm ci`.
    3. The app is built (`npm run build`), producing `dist/`.
    4. The `dist/` folder is published to GitHub Pages.

    ### One-time setup

    1. Ensure the remote repository exists at `BozhidarBoyadzhiev/2bit-calc`.
    2. Push the code (including the workflow file) to the `main` branch.
    3. In GitHub: Settings → Pages → Ensure Source is set to "GitHub Actions" (usually automatic now).
    4. After the first successful workflow run, the site becomes available.

    ### Updating the site

    1. Commit and push changes to `main`.
    2. Monitor the Actions tab; when "Deploy to GitHub Pages" succeeds, the site is updated.

    ### Vite base path

    `vite.config.ts` sets:

    ```ts
    base: process.env.NODE_ENV === 'production' ? '/2bit-calc/' : '/'
    ```

    This ensures assets resolve under the repository subpath. If you rename the repository, update this to `'/new-repo-name/'`.

    ### Troubleshooting

    | Problem | Likely Cause | Fix |
    |---------|--------------|-----|
    | CSS/JS 404s | Wrong `base` path | Update `base` in `vite.config.ts` |
    | Workflow not running | Branch mismatch | Adjust `on.push.branches` in workflow |
    | Stale build | Cached artifact | Re-run workflow manually (Actions → Run workflow) |
    | Needs custom domain | Not configured | Add `CNAME` file to `dist` via a predeploy step |

    ### Local testing of production build

    ```bash
    npm run build
    npm run preview
    ```

    Visit the printed localhost URL to verify before pushing.

    ## License

    MIT (add a LICENSE file if needed).

    ---

    Generated and maintained with Vite + React + TypeScript.
