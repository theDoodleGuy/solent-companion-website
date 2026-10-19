# Solent Companion website

The promotional site for [Solent Companion](https://github.com/theDoodleGuy/solent-companion-),
an Android companion app for sailing the Solent. Plain HTML and CSS: no build step, no framework,
no cookies, no analytics.

- `index.html`: the home page (what it does, what it isn't, join the closed test, questions).
- `privacy.html`: the privacy policy and disclaimer. The app's Settings and the Google Play
  listing link here.
- `assets/`: stylesheet, one small script for the mobile menu, and SVG illustrations drawn in
  the app's own map symbols.
- `design/website-design.md`: the plan behind it, from the marketing and UX agents.

## Look at it on your computer

Open `index.html` in a browser, or for a closer match to the live site:

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Before it goes live (owner)

1. **Sign-up route.** In `index.html`, search for `OWNER` and replace `OWNER-EMAIL@example.com`
   with the address testers should write to, or swap the whole link for a Google Form.
2. **Privacy page.** In `privacy.html`, fill in the date, contact email, backend domain and how
   long server logs are kept (search for `[`). Have it reviewed; the wording started from
   `documents/privacy-policy-draft.md` in the app repo, which is not legal advice.
3. **Publish.** Merge into `main`, then in GitHub: Settings > Pages > Build and deployment >
   Source: **GitHub Actions**. The workflow in `.github/workflows/pages.yml` publishes the site on
   every push to `main`. The address will be `https://thedoodleguy.github.io/solent-companion-website/`.
4. **Link the app.** Set `privacy_policy_url` in the app
   (`feature/settings/src/main/res/values/strings.xml`) to `<site address>/privacy.html`, and use
   the same URL in the Play Console.
5. Optional: a custom domain. Add a `CNAME` file with the domain and point its DNS at GitHub Pages.

At the Play Store launch, replace the "Join the closed test" buttons with the Google Play badge
and link.

## Rules for the copy

The same as the app's: never say "safe", alerts are "advisory", and every claim must match the
shipped app. See `design/website-design.md`, section 3.
