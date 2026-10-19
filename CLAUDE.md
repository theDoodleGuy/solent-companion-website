# Solent Companion website: notes for Claude

The promotional site for the Solent Companion Android app (repo `theDoodleGuy/solent-companion-`).
Plain static HTML/CSS for GitHub Pages; keep it that way unless the owner asks otherwise.

- Plan: `design/website-design.md` (brief, sitemap, copy rules, visual tokens, launch checklist).
- Copy rules come from the app: never "safe"; alerts are "Advisory"; "an aid, not a navigator";
  use the app's terms (Moving Prohibited Zone (MPZ), height of tide, charted depth, clearance,
  margin, draft, Underway). Every claim must match the shipped app.
- No cookies, analytics, web fonts or third-party scripts: the privacy page says so.
- Colours are CSS custom properties in `assets/css/site.css`, matching the app's design tokens.
- Owner to-dos are listed in `README.md` ("Before it goes live"); placeholders are marked `OWNER`
  or in `[square brackets]`.
- The owner is not a software engineer: explain in plain English and keep instructions click-by-click.
