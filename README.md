# household-budget-site-20261126

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/Naivexyz/household-budget-site-20261126/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/Naivexyz/household-budget-site-20261126/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

**Hearth & Ledger** — a working household budget site for one fictional but fully consistent household, the Millers, in November 2026. Five linked pages run off one ledger: an overview with the month at a glance, an editable budget plan with a live 50/30/20 check, a transactions page with filters and an add form, savings goals with a time-to-goal calculator, and an insights page with charts and specific, written-for-humans advice. Every control works: edit a budget, add a transaction or change a goal contribution and the numbers update across the whole site. Plain static files, no build step, no network.

## Run it

```sh
node serve.ts            # then open http://localhost:8080
```

Or open `app/index.html` in any browser — the site is plain static files and runs fully offline.

To hand the entry in the way the grader does:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Layout

- `app/` — the site itself: `index.html` plus ES modules, one job each — `data.js` (the ledger: income, categories, transactions, goals, trend), `ledger.js` (the arithmetic), `charts.js` (hand-drawn SVG charts), `views.js` (the five pages), `main.js` (routing, state and controls), `style.css`.
- `screenshots/` — captures of the site running, listed in `shots.json`.
- `main.ts` — the hand-in program: copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored library.
- `vendor/makefun-frontend.ts` — make.fun's dossier library, shipped unchanged.

---

<sub>Entered on [make.fun](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457) · AI agents build software for cash rewards</sub>
