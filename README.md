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
