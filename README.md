# Rifaq / Dclean White-Label Smart Hospitality App

Production monorepo foundation for a white-labeled cleaning, laundry, and smart-locker platform. The architecture is built around one source of truth: `BrandConfig`. Every future app surface must read names, logos, colors, fonts, currency, service catalog, pricing, areas, contact details, and feature toggles from this object rather than hardcoding brand values.

## Monorepo layout

```text
apps/
  admin/   # Next.js admin panel starts in deliverable #6
  mobile/  # Expo React Native app starts in deliverable #4
packages/
  shared/  # BrandConfig types, runtime validators, and Rifaq/Dclean seed data
```

## Deliverable #1 contents

- Turborepo-ready pnpm workspace skeleton.
- Shared TypeScript package: `@rifaq/shared`.
- `BrandConfig`, `Service`, and `ServiceOption` TypeScript contracts with runtime schema validation.
- Rifaq / Dclean seed brand configuration using the deep teal blue + turquoise palette.
- Environment variable examples for root, admin, and mobile workspaces.
- GitHub Actions workflow for install, lint, typecheck, test, and build.

## Getting started

```bash
pnpm install
pnpm typecheck
pnpm build
pnpm test
```


## Direct Brand Settings Hub

To open the runnable mock Brand Settings Hub on Windows, double-click `run-hub.cmd` from the project folder, or run:

```powershell
cd "C:\Users\Ibrah\OneDrive\سطح المكتب\IBRAHIM-codex-build-brand-settings-page"
.\run-hub.cmd
```

The hub opens at `http://localhost:3000` and includes a live white-label preview with local mock saving. No `corepack enable` or Administrator permissions are required.

For macOS/Linux or any terminal with pnpm available, run:

```bash
pnpm dev
```

## Windows quick start

If this project is on your desktop at a path like `C:\Users\Ibrah\OneDrive\سطح المكتب\IBRAHIM-codex-build-brand-settings-page`, open PowerShell and run:

```powershell
cd "C:\Users\Ibrah\OneDrive\سطح المكتب\IBRAHIM-codex-build-brand-settings-page"
.\run-windows.ps1
```

If PowerShell blocks scripts, use the command prompt script instead:

```powershell
cd "C:\Users\Ibrah\OneDrive\سطح المكتب\IBRAHIM-codex-build-brand-settings-page"
.\run-windows.cmd
```

You can also run the underlying commands manually:

```powershell
npx --yes pnpm@10.28.1 install
npx --yes pnpm@10.28.1 typecheck
npx --yes pnpm@10.28.1 build
npx --yes pnpm@10.28.1 test
npx --yes pnpm@10.28.1 lint
```

Do not run `corepack enable` from a normal PowerShell window if Windows reports `EPERM` under `C:\Program Files\nodejs`; that command needs Administrator permissions. The scripts and `npx --yes pnpm@10.28.1 ...` commands above avoid that permission issue.

If `tsc` is not installed globally, the shared package scripts automatically fall back to `npx --yes --package typescript@5.9.3 tsc`.


## GitHub PR conflict resolution

If GitHub says `This branch has conflicts that must be resolved`, keep the current branch versions for these files:

- `.github/workflows/ci.yml`: use `actions/checkout@v5`, `actions/setup-node@v5`, Node `24`, keep `Check for unresolved conflicts`, and allow `Test` before `Build` because `packages/shared` now compiles in `pretest`.
- `packages/shared/package.json`: keep `pretest` compiling TypeScript output, and keep `test` as `node --test test/*.test.mjs`.
- `package.json`: keep the `dev` and `hub` scripts so the Brand Settings Hub opens directly.
- `apps/admin/package.json`: keep `dev`, `start`, `build`, `typecheck`, `lint`, and `test` pointing at `dev-server.mjs`.
- `README.md`: keep the Direct Brand Settings Hub and Windows quick start sections.

After resolving conflicts, run:

```bash
pnpm check:conflicts
pnpm lint
pnpm typecheck
pnpm build
pnpm test
```

## How white-label switching will work

1. The admin Brand Settings page edits a persisted `BrandConfig` JSON document.
2. The backend exposes `GET /brand-config` as a cached public endpoint.
3. Mobile and admin clients validate the response with `brandConfigSchema` from `@rifaq/shared`.
4. UI components consume the validated config through a `useBrandConfig()` hook.
5. Brand changes are published without app-store releases because the UI never hardcodes brand-specific values.

## Deployment targets

- Mobile: Expo Application Services (EAS) for iOS and Android builds.
- Admin: Vercel hosting for the Next.js admin panel.
- Database: PostgreSQL, with Supabase recommended for fast deployment.
- Storage: Supabase Storage or S3-compatible object storage for logos, photos, and documents.
