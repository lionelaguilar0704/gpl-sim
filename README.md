# Great Pirate Life Sim v10.0 — Living World Remaster

Major cohesive build:
- Cinematic start screen with name, origin, race, settings.
- Paths are not chosen at birth; they emerge during life.
- Free and locked origins/races groundwork.
- Gems earned through play and used for future unlocks.
- Dashboard with progress percentages, ranks, and power rating.
- Visible locked actions.
- Outcome popups after actions.
- Interactive world map with island details and events.
- Crew/Marine state changes after joining.
- Quick move-based combat screen.
- Stable save/load/start flow.


## v10.1 Boot Hotfix
- Fixes blank gradient startup screen.
- Renames risky browser globals that may crash Safari/iPad browsers.
- Adds startup recovery screen instead of blank page.
- Hardens save normalization.
- Keeps v10.0 Living World Remaster features.


## v10.2 Start Flow Hotfix
- Fixes being stuck on first screen.
- New Life now directly reveals character creation.
- Begin Life has safer fallback handling.
- Premium origins/races stay visible but locked.
- Keeps v10.0/v10.1 systems.


## v10.3 Modal Continue Hotfix
- Fixes Birth popup Continue trapping the player.
- Continue now always closes modal and forces dashboard render.
- Adds tap-outside emergency escape.
- Adds old save fallback from v10.2/v10.1/v10.0.


## v10.4 Safari top() Fix
- Fixes iPad/Safari error: "top is not a function".
- Renames the topbar helper away from protected browser window.top.
- Replaces render with a Safari-safe version.
- Continue from Birth now routes to dashboard.
