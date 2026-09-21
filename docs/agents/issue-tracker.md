# Issue tracker

Products use **Linear** as the issue tracker.

## Conventions

- One Linear team per product, short key (`PAY`, `WEB`, `ENG`).
- Issue ids look like `PAY-12`. Put that id in the branch name, commit messages, and PR title.
- Connect the product's GitHub repo in Linear so PRs link and move status.
- Size labels: `tiny`, `normal`, `unclear`.
- Production bugs: label `from-production`.

## Agent rules

- Prefer the Linear id from the branch or PR over inventing one.
- Change artifacts live at `docs/changes/<TEAM>-<N>-short-slug>/`.
- Do not create Linear issues unless the human asks (Maintain hand-off is human-led).
- GitHub Issues are not the source of truth for this company.
