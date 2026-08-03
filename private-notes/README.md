# H. L. Sun Private Notes

Private Cloudflare Worker application for `notes.hlsun.org`. Authentication is enforced by Cloudflare Access, while note content is stored in the `hlsun-private-notes` D1 database. Private content must never be copied into the public Astro content collection.

## Commands

```powershell
Set-Location "E:\Projects\个人网站\private-notes"
corepack pnpm install
corepack pnpm run db:local
corepack pnpm run dev
corepack pnpm run db:remote
corepack pnpm run deploy
```

Production must remain protected by a Cloudflare Access application allowing only the owner's Cloudflare account/email. The Worker also rejects requests without the `Cf-Access-Authenticated-User-Email` header.
