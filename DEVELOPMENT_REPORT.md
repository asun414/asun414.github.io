# Development Report

## What was built

A maintainable Astro static site was created at the project root with English and Chinese home/research routes, publications, CV, notes, about, and 404 pages. Shared components provide navigation, theme switching, responsive menus, footer links, research cards, and an inline SVG research constellation. SEO metadata, canonical/hreflang links, JSON-LD Person data, sitemap integration, robots, favicon, CNAME, print rules, and GitHub Pages automation are included.

## Existing material and backup

The pre-existing nested static site and ZIP were preserved under `_backup/20260803-161134/`. No originals were deleted. The supplied English DOCX and Chinese DOC resumes on the Desktop were read-only sources and were not modified or copied into the website.

## Verified content extracted

- Education: Shanghai Jiao Tong University (PhD, 2024.09–present), Anhui University of Technology (M.A., 2021.09–2024.06), Chengdu University (B.A., 2017.09–2021.06).
- Five journal articles with bibliographic details and DOI links.
- Working paper with Jie Chen.
- Conference presentations in 2024–2025 and selected awards.
- Course title and research-interest wording supplied in the brief/resumes.
- Academic email, Google Scholar, ORCID, and ResearchGate links supplied by the user.

## Privacy decisions

The source resumes contain address, telephone, birth date, gender, political status, birthplace, and other private biographical data. They were not published. Download controls remain disabled until redacted public CV files are supplied. Internal policy-brief titles and incomplete details were not reproduced as public claims.

## Technical notes and testing

Astro, TypeScript, Markdown content collections, native CSS, and native JavaScript are used. The interface supports keyboard focus, skip navigation, semantic headings, responsive navigation, reduced-motion preferences, light/dark themes, independent language routes, and print cleanup.

Build and browser-test results:

- Astro type/content check: PASS, 0 errors and 0 warnings (30 non-blocking API compatibility hints from the current Astro/TypeScript toolchain).
- Production build: PASS, 10 static pages generated, including `/404.html`, sitemap, both language routes, and all requested sections.
- Local internal link/path audit: PASS; all generated root-relative links and assets resolve inside `dist`.
- Responsive browser checks: PASS at 1440, 1024, 768, 390, and 360 px; no horizontal overflow was detected.
- Mobile navigation: PASS; menu opens, `aria-expanded` changes to `true`, and controls remain accessible.
- Theme toggle: PASS; theme state changes and persists through local storage.
- Language routes: PASS; English uses `lang="en"`, Chinese uses `lang="zh-CN"`, each with one H1.
- Browser console: PASS; no warnings or errors on the tested pages.
- Screenshots created in `screenshots/`: desktop home, mobile home, desktop research, and mobile Chinese home.

The desktop shell did not expose a system-wide `node`/`npm` command. Verification used the Codex-bundled Node.js 24 runtime. For ordinary local use, install Node.js LTS so the documented `npm` commands are available in PowerShell.

## Next recommendations

Provide redacted public CV PDFs and a rights-cleared portrait, confirm the organizational affiliation and public GitHub URL, add paper PDFs only when authorized, and verify DNS ownership before enabling `hlsun.org` in production.
