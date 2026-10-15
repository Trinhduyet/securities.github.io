# Change summary — BSC WebTrading Playwright rewrite

## Before

Expected files:
- `docs/case-studies/bsc-webtrading.md` — rewrite from Playwright evidence
- `docs/case-studies/index.md` — BSC card + summary
- `docs/case-studies/broker-domain-matrix.md` — re-score BSC cells
- `docs/case-studies/visual-gallery.md` — BSC section
- `docs/case-studies/screenshots/index.md` + `README.md` — provenance
- `docs/case-studies/screenshots/bsc/public/*.png` — fresh public shots
- `docs/resources/references.md` — official BSC links
- `docs/.vitepress/config.mts` — only if nav needed (not expected)

## After

Changed files:
- `docs/case-studies/bsc-webtrading.md` — full rewrite from 15/10/2026 Playwright + official docs
- `docs/case-studies/index.md` — visual BSC card, dates, learning summary
- `docs/case-studies/broker-domain-matrix.md` — conservative BSC evidence rescoring
- `docs/case-studies/visual-gallery.md` — representative BSC screenshots
- `docs/case-studies/screenshots/index.md` — BSC folder in tree
- `docs/case-studies/screenshots/README.md` — provenance rows for BSC public PNGs
- `docs/case-studies/screenshots/bsc/public/*.png` — captured screenshots
- `docs/resources/references.md` — curated official BSC sources
- `.ai-review/change-summary.md` — this report

Not changed:
- `docs/.vitepress/config.mts` — BSC nav already present
- SSI/VPS/TCBS case study bodies
- Authenticated BSC screenshots (session not available)

## Reason

Public BSC case study previously mixed assumptions with observation. Re-inspected rendered WebTrading via MCP Playwright and rebuilt documentation with explicit evidence levels.

## Risk

- Some product-board screenshots (derivatives/odd-lot) may show submenu-over-board or adjacent board state near market close; captions document what is educationally proven.
- Order-entry remains 🟡 official only — do not treat as observed form fields.
