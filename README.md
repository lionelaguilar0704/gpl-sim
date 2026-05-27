# Great Pirate Life Sim v11.0 — Living World Foundation

Clean rebuild focused on stability and purpose.

- Stable start / save / load / render
- Dashboard/actions/crew/world/inventory/logbook/relationships/settings
- Every inventory item has a use
- Levels unlock systems
- Outcome popups after actions
- Crew and relationship interactions
- Fast move-based combat


## v11.1 Inventory Realism + Rarity Colors
- New characters start with empty inventory and no weapon.
- Rarity colors added: grey common, green uncommon, blue rare, purple epic, gold legendary, red mythic.
- Inventory empty state added.
- Added early item progression actions: Ask for Gift, Visit Market, Buy First Weapon.


## v12.0 Living World Update
- Living world engine with yearly world events.
- Dynamic island weather.
- Personality system: honor, aggression, greed, courage, discipline, kindness.
- NPC memory system.
- Achievements that reward gems.
- Titles with active title selection.
- Random event choice popups.
- Early ship foundation unlocked at age 13.
- World state panel for pirate heat and marine pressure.


## v14.1 Stable Core Integration
- Fixes maximum call stack / recursion crashes from stacked v13-v14 patches.
- Integrates v13 Sea Life systems and v14 Faction/Territory systems into one stable render pipeline.
- Adds ship management, sea travel, pirate raids, Marine missions.
- Adds faction reputation, territory control, territory actions, and ownership.
- Avoids recursive oldDashboard/oldInventory/oldRender override chains.
