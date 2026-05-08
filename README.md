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
