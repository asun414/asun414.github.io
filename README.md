# Hongliang Sun Academic Website

Personal academic website for Hongliang Sun / 孙红亮, designed as a lightweight urban research notebook rather than a commercial portfolio. The current canonical site is `https://hongliangsun.github.io`; `hlsun.org` can be activated later after domain ownership is purchased or confirmed.

## Stack

Astro, TypeScript, native CSS, Markdown content collections, and a small amount of native JavaScript. No database or server runtime is required after build.

## Structure

- `src/components/`: shared navigation, footer, research cards and constellation.
- `src/content/`: research, publication and note entries.
- `src/data/`: profile, navigation and verified external links.
- `src/layouts/`: SEO-aware base and content layouts.
- `src/pages/`: English and Chinese routes.
- `src/styles/`: design tokens, global responsive rules and print styles.
- `public/`: favicon, robots and CNAME. Add public-safe CVs to `public/files/`.
- `.github/workflows/deploy.yml`: GitHub Pages build and deployment.

## Local development

Install Node.js LTS, then run:

```powershell
Set-Location "E:\BaiduSyncdisk\个人网站"
npm install
npm run dev
npm run check
npm run build
npm run preview
```

## Updating content

- Personal profile and links: edit `src/data/profile.ts`.
- Research project: add a Markdown file to `src/content/research/` using the existing frontmatter fields.
- Publication: add a verified record to `src/content/publications/`.
- Notes: add Markdown to `src/content/notes/`; use `draft: true` until ready.
- Portrait: add a rights-cleared image as `public/images/portrait.webp`, then connect it in the hero with accurate alt text.
- CV: provide redacted public versions named `hongliang-sun-cv-en.pdf` and `sun-hongliang-cv-zh.pdf` in `public/files/`, then replace the disabled controls in `src/pages/cv/index.astro` with links carrying the `download` attribute.

## GitHub Pages

Create an empty repository, then:

```powershell
git init
git add .
git commit -m "Initial academic website"
git branch -M main
git remote add origin <repository-url>
git push -u origin main
```

In GitHub repository settings, set Pages source to **GitHub Actions**. Pushes to `main` and manual workflow dispatch build Astro and deploy `dist/`. This project assumes a root custom domain and therefore has no extra Astro `base` path.

## hlsun.org

`public/CNAME` reserves `hlsun.org`. If the domain has not been purchased, CNAME may be kept for preparation or removed before a temporary GitHub Pages deployment. Before publishing, confirm ownership and configure the apex and `www` DNS records at the registrar according to GitHub Pages documentation. Do not assume the domain is currently available. Local development is unaffected.

## Common issues and update routine

- A missing Node/npm command means Node.js LTS must be installed or added to PATH.
- A 404 on a project-site repository usually means `site`/`base` need project-path configuration; this preset targets the custom-domain root.
- Never link a local PDF or CV before the file exists in `public/`.
- After any content change, run `npm run check` and `npm run build`, inspect both languages, then commit and push.

See `CONTENT_TODO.md` for missing public material and `DEVELOPMENT_REPORT.md` for the implementation record.
