# Warhammer API Research

> Comprehensive list of every known Warhammer-related API, data source, and programmatic data access point. Focused primarily on Warhammer 40,000, but also covering Age of Sigmar, Old World, specialist games, and video game APIs.

**Note:** Games Workshop does **not** provide any official public API for tabletop game data. All tabletop data APIs listed below are unofficial, community-maintained projects unless otherwise noted.

---

## Table of Contents

- [Tabletop Game APIs (Hosted/Live)](#tabletop-game-apis-hostedlive)
- [Data Export / CSV / JSON Datasets](#data-export--csv--json-datasets)
- [Wiki / Lore APIs](#wiki--lore-apis)
- [Army Builder & Roster APIs](#army-builder--roster-apis)
- [Statistics & Damage Calculator APIs](#statistics--damage-calculator-apis)
- [Video Game APIs](#video-game-apis)
- [BattleScribe Data Repositories](#battlescribe-data-repositories)
- [Other Notable Data Sources](#other-notable-data-sources)

---

## Tabletop Game APIs (Hosted/Live)

### 1. Warhammer 40,000 API (Takerumi)

- **URL:** https://github.com/Takerumi/warhammer-40000-api
- **Type:** REST API
- **Tech:** Node.js
- **Status:** Active (low activity, 1 star)
- **Data returned:** Characteristics and brief information on Warhammer 40,000 units and the wargame in general.
- **Notes:** Minimal documentation. A small hobby project providing basic 40k game data through API endpoints.

---

### 2. AoS API (Age of Sigmar) — brittonhayes/warhammer

- **URL:** https://github.com/brittonhayes/warhammer (previously https://github.com/brittonhayes/aos)
- **Docs:** Previously at https://aos-api.com/docs
- **Type:** REST + GraphQL API
- **Tech:** Go, SQLite, OpenAPI spec
- **Status:** ⚠️ Public hosted instance **sunset as of January 1, 2025**. Can still be self-hosted.
- **Endpoints:**
  - `GET /cities` — All cities or by ID
  - `GET /grand-alliances` — All grand alliances or by ID
  - `GET /grand-strategies` — All grand strategies or by ID
  - `GET /units` — All units or by ID
  - `GET /warscrolls` — All warscrolls or by ID
  - `GET /graphql` — GraphQL playground
  - `POST /query` — GraphQL query endpoint
- **Data returned:** Age of Sigmar units, warscrolls, cities, grand alliances, grand strategies. Data stored in YAML fixture files. Read-only API.
- **Self-hosting:** Docker Compose supported. Go client library available via `pkg.go.dev/github.com/brittonhayes/warhammer`.
- **Notes:** The most fully-featured community Warhammer API that existed. Included OpenTelemetry, Grafana, and Jaeger for observability. Not affiliated with Games Workshop.

---

### 3. Warhammer Proto gRPC API — brittonhayes/warhammer-proto

- **URL:** https://github.com/brittonhayes/warhammer-proto
- **Docs:** https://buf.build/brittonhayes/warhammer/docs
- **Type:** gRPC + HTTP REST (via Protocol Buffers)
- **Tech:** Go, Protobuf, OpenAPI spec
- **Status:** ⚠️ **Archived** (February 2023)
- **Data returned:** CRUD operations on Age of Sigmar entities. Protobuf schemas for generating clients/servers in any language.
- **Deployment:** Railway, Docker Compose, or Kubernetes
- **Notes:** Designed to help creators build game companion tools. OpenAPI spec available for HTTP client generation.

---

### 4. Warhammer 40,000: Tacticus API (Official)

- **URL:** https://api.tacticusgame.com/
- **GitHub:** https://github.com/SnowprintStudios/tacticus-api
- **Type:** REST API (Official, by Snowprint Studios)
- **Status:** ✅ Active, officially maintained
- **Authentication:** Player API keys generated at https://api.tacticusgame.com/settings
- **Data returned:** Player data, guild data, game statistics for the Warhammer 40,000: Tacticus mobile game. Supports third-party analytics tools and companion apps.
- **Third-party tools built on it:**
  - [Tacticus Analytics](https://www.tacticusanalytics.com/) — Guild raid analytics, boss leaderboards, performance metrics, token tracking
  - [Guild Data Fetcher](https://tacticus.site/) — Guild data extraction tool for officers
- **Notes:** This is the **only official Warhammer API** with documented public access, provided by the game's developer (Snowprint Studios, not Games Workshop directly). Read-only player/guild data access.

---

### 5. KTDash API (Kill Team)

- **URL:** https://ktdash.app/
- **GitHub:** https://github.com/vjosset/ktdash-v4-public (v4), https://github.com/vjosset/ktdash (v2)
- **Type:** REST API (publicly accessible, documentation available via Discord)
- **Status:** ✅ Active
- **Data returned:** Kill Team rosters, team data, operative profiles, equipment, and game mechanics for Kill Team 2021 and Kill Team 2024.
- **Third-party tools:**
  - [Kill Team At A Glance](https://github.com/smwest87/killteamataglance) — Simplified rendering of KTDash API data
- **Notes:** Backend API is publicly available for third-party integration. Contact developer on Discord for detailed documentation.

---

### 6. New Recruit API

- **URL:** https://www.newrecruit.eu/
- **Docs:** https://www.newrecruit.eu/tutorials
- **Type:** REST API
- **Authentication:** Required — HTTP headers `NR-Login` and `NR-Password`
- **Status:** ✅ Active
- **Endpoints:**
  - `POST /api/systems` — Returns available game systems and their IDs
  - `POST /api/reports` — Game report data
  - `POST /api/tournament` — Specific tournament details (teams, participants, lists)
  - `POST /api/tournaments` — List of available tournaments
- **Data returned:** Game systems, tournament data, player rosters, game reports. Supports BattleScribe-compatible data formats.
- **Notes:** Free web-based army builder for Warhammer 40k and other miniature games. API requires user authentication.

---

### 7. Fantasy Battle DB API

- **URL:** https://fantasy-battle-db.com/
- **Docs:** https://fantasy-battle-db.com/api/doc (Swagger)
- **Type:** REST API with Swagger documentation
- **Status:** ⚠️ Intermittent (500 errors observed)
- **Data returned:** Fantasy battle unit profiles, game systems, races, nations, and worlds. Covers:
  - Warhammer Fantasy Battle (editions V3–V8)
  - Warhammer: The Old World
  - Warhammer Armies Project
  - Age of Sigmar
  - Mordheim, The 9th Age, and more
- **Database size:** ~2,009 unit profiles, 65 nations, 14 game systems
- **Notes:** Initial data loaded from BSData project. Covers both Warhammer Fantasy and Old World systems.

---

### 8. Battle Cogitator API

- **URL:** https://github.com/alexdawn/battle-cogitator
- **Type:** REST API (Flask)
- **Tech:** Python, Flask
- **Status:** Work in progress
- **Data returned:** Calculated stats from simulated Warhammer 40k combat scenarios. Probability distributions for damage outcomes.
- **Notes:** Designed for programmatic combat simulation queries.

---

## Data Export / CSV / JSON Datasets

### 9. Wahapedia Data Export (40k)

- **URL:** https://wahapedia.ru/wh40k10ed/the-rules/data-export
- **Spec:** https://wahapedia.ru/wh40k10ed/Export%20Data%20Specs.xlsx
- **Type:** CSV file export (pipe `|` delimited)
- **Status:** ✅ Active, auto-updated within ~30 minutes of site changes
- **Data returned:** Comprehensive 40k 10th Edition game data via linked CSV tables:
  - `Factions.csv` — Factions and subfactions
  - `Source.csv` — Supplements, rulebooks, and products
  - `Datasheets.csv` — Unit datasheets (faction_id, role, transport, leader info)
  - `Datasheets_abilities.csv` — Abilities (datasheet_id, ability_id, name, description)
  - `Datasheets_keywords.csv` — Keywords and faction keywords
  - `Datasheets_models.csv` — Model stats (M, T, S, W, Ld, OC, base size)
  - `Datasheets_options.csv` — Wargear options
  - `Datasheets_wargear.csv` — Weapon profiles (range, type, A, BS/WS, S, AP, D)
  - Additional files: unit composition, costs, stratagems, enhancements, detachment abilities, leaders
- **Format notes:** Boolean fields as "true"/"false" strings. Description/abilities fields in HTML. ID fields are strings.
- **Notes:** The most comprehensive structured 40k data source available. Not a live API — files must be downloaded. Creator recommends "powered by Wahapedia" attribution. Powers tools like [Rebus Stats](https://rebusstats.com/) and [Forces](https://offblastsoftworks.com/forces). Also has a 9th Edition export at https://wahapedia.ru/wh40k9ed/the-rules/data-export/.

---

### 10. Ektoer WH40K 10th Edition JSON

- **URL:** https://github.com/ektoer/wh40k
- **Type:** JSON dataset
- **Status:** Community maintained
- **Files:**
  - `wh40k_10th.json` — Complete compilation of all units from GW datasheets
  - `wh40k_10th_min.json` — Minified version
  - `schema.json` — JSON schema defining the data structure
- **Data returned:** Every unit available via GW's free downloadable PDF datasheets for 10th Edition. Abilities as `[name, effect]` pairs, weapon profiles, model stats.
- **Notes:** Extracted from GW's PDF datasheets using PHP/regex. Community can report errors for correction.

---

### 11. Tabletop JSON — W40K 10th Edition

- **URL:** https://github.com/tabletop-json/w40k.10e
- **Type:** JSON dataset
- **License:** GPL-3.0
- **Status:** Community maintained
- **Data returned:** Faction-organized JSON files for 10th Edition (e.g., `adeptusMechanicus.json`, `aeldari.json`). Each file contains units, stats, and abilities for that faction.
- **Notes:** Designed for programmatic integration into digital army-building tools.

---

### 12. Kill Team JSON Dataset

- **URL:** https://github.com/vjosset/killteamjson
- **Type:** JSON dataset
- **Status:** Active (22 stars)
- **Files:** `kt21.json`, `kt24.json`, compendium files
- **Data returned:** Kill Team 2021 and 2024 data — team compositions, operative profiles, equipment, abilities, ploys. Includes compendium and additional teams from White Dwarf and boxed sets.
- **Notes:** Powers the KTDash application. Comprehensive Kill Team data source.

---

### 13. Game Datacards Datasources

- **URL:** https://github.com/game-datacards/datasources
- **Type:** JSON/XML dataset
- **Status:** Active (333+ commits)
- **Data returned:** 40k unit data for 10th Edition and earlier. Includes XML conversion tools (`convert_xml.mjs`) for transforming data formats.
- **Notes:** Powers the Game Datacards web app for generating printable datacards.

---

### 14. Warhammer Underworlds Data

- **URL:** https://github.com/capoferro/warhammer_underworlds_data
- **Type:** Raw card data (JSON)
- **Status:** Community maintained
- **Data returned:** Raw card data for Warhammer Underworlds — fighters, gambits, objectives, upgrades.
- **Related:** [wh-underworlds](https://github.com/guidokessels/wh-underworlds) — Documentation at https://guidokessels.github.io/wh-underworlds/

---

### 15. UnitCrunch Data Exports

- **URL:** https://github.com/korzxd/UnitCrunch-data-exports
- **Type:** TXT file format (importable into UnitCrunch)
- **Status:** Community maintained
- **Data returned:** Warhammer 40k faction indices with unit profiles, weapons, abilities, squad sizes, and special rules. Organized by faction folders with versioned files.
- **Notes:** Designed for import into [UnitCrunch](https://unitcrunch.com/) web app for battle simulation. Currently only accepts its own export format.

---

### 16. RosterizerTestData — Warhammer 40k 10e

- **URL:** https://github.com/RosterizerTestData/Warhammer40k10e
- **Type:** Rulebook files and points data (JavaScript/TypeScript)
- **Status:** Active (1,400+ commits)
- **Data returned:** Points values, rules, and unit data formatted for the Rosterizer system. Also covers Horus Heresy and 9th Edition.
- **Notes:** Part of the Rosterizer ecosystem. Multiple game systems supported.

---

## Wiki / Lore APIs

### 17. Warhammer 40k Lexicanum MediaWiki API

- **URL:** https://wh40k.lexicanum.com/mediawiki/api.php
- **Sandbox:** https://wh40k.lexicanum.com/wiki/Warhammer_40k_-_Lexicanum:API_sandbox
- **Type:** MediaWiki API (standard)
- **Status:** ✅ Active
- **Endpoints (examples):**
  - `api.php?action=query&list=search&srwhat=text&srsearch=[query]&format=json` — Search articles
  - `api.php?action=parse&page=[PageName]&format=json` — Parse/render a wiki page
  - `api.php?action=query&prop=revisions&titles=[PageName]&rvprop=content&format=json` — Get raw page content
- **Data returned:** 47,096+ articles covering Warhammer 40,000 lore — factions, characters, battles, weapons, vehicles, planets, and more. Available in English, French, and German.
- **Notes:** The most comprehensive Warhammer 40k lore resource with full MediaWiki API support. Free, no authentication required.

---

### 18. Warhammer 40k Fandom Wiki API

- **URL:** https://warhammer40k.fandom.com/api.php
- **Type:** MediaWiki API (Fandom-hosted)
- **Status:** ✅ Active
- **Endpoints (examples):**
  - `api.php?action=parse&page=[PageName]&format=json` — Get rendered HTML
  - `api.php?action=query&prop=revisions&titles=[PageName]&rvprop=content&rvparse=1&format=json` — Get page content
  - `index.php?title=[PageName]&action=render` — Direct rendered page
- **Data returned:** 7,200+ articles on Warhammer 40k lore, factions, units, campaigns, and background. Covers the full breadth of the 40k universe.
- **Notes:** Runs on MediaWiki 1.19 (some newer API features may be unavailable). No authentication required for read access.

---

## Army Builder & Roster APIs

### 19. Depot — Warhammer 40k Companion App

- **URL:** https://godepot.dev/
- **GitHub:** https://github.com/fjlaubscher/depot
- **Type:** Web app with internal API (Cogitator API via Cloudflare Workers)
- **Tech:** TypeScript, React 19, Vite, Tailwind CSS
- **License:** MIT
- **Status:** ✅ Active
- **Architecture:**
  - `@depot/core` — Shared TypeScript types and utilities
  - `@depot/cli` — Fetches Wahapedia CSV exports and converts to typed JSON
  - `@depot/web` — React PWA with IndexedDB offline storage
  - `@depot/workers` — Cloudflare Pages/Workers handlers (Cogitator API)
- **Data returned:** Army lists, datasheets, crusade planning tools. Powered by Wahapedia data.
- **Notes:** Free, open-source, offline-capable. Consumes Wahapedia CSV data and transforms it into a typed JSON API.

---

### 20. AppDeptus — Unofficial 40k Companion

- **URL:** https://appdeptus.com/
- **GitHub:** https://github.com/doranakan/appdeptus
- **License:** MIT
- **Status:** Active
- **Data returned:** Warhammer 40,000 army building and companion features.

---

### 21. Rosterizer

- **URL:** https://rosterizer.com/roster
- **GitHub:** https://github.com/RosterizerTestData
- **Type:** Web app with Manifest-based data system
- **Status:** Beta
- **Data returned:** Army roster building for Warhammer 40k, Age of Sigmar, Horus Heresy, and many other game systems. Uses community-created "Manifest" files for game data.
- **Notes:** Game system-agnostic. Allows editing unit stats within rosters (useful for Crusade campaigns). Currently in beta with a Kickstarter for v1.0.

---

## Statistics & Damage Calculator APIs

### 22. Warhammer Stats Engine

- **URL:** https://github.com/akabbeke/WarhammerStatsEngine
- **Website:** warhammer-stats-engine.com
- **PyPI:** `pip install warhammer-stats` ([warhammer-stats 0.1.1](https://pypi.org/project/warhammer-stats/))
- **Type:** Python library + web app
- **License:** MIT
- **Status:** Inactive (no updates in 2+ years)
- **Data returned:** Probability mass functions (PMFs) for Warhammer 40k attack simulations. Define weapons (BS, shots, S, AP, D) and targets (T, saves, W) to get probability distributions of damage outcomes.
- **Notes:** Core logic extracted into the `warhammer-stats` pip package. Powers the warhammer-stats-engine.com website.

---

### 23. Cogpunk MathHammer

- **URL:** https://github.com/cogpunk/mathhammer
- **Type:** Java framework
- **License:** Apache-2.0
- **Status:** Available (8th & 9th Editions)
- **Data returned:** Probability calculations for Warhammer 40k combat — hit rolls, wound rolls, save rolls, damage output distributions.

---

### 24. Rebus Stats

- **URL:** https://rebusstats.com/
- **Type:** Web app (consumes Wahapedia export data)
- **Status:** ✅ Active
- **Data returned:** Graphed damage output across entire armies against various enemy profiles. Upload roster files from the official 40k app or New Recruit. Supports unit modification with buffs/debuffs for comparing weapon loadouts.
- **Notes:** Powered by Wahapedia data export. One of the most practical consumer tools of the Wahapedia data.

---

### 25. GrimSlate Combat Calculator

- **URL:** https://grimslate.com/combat-calc
- **Type:** Web app
- **Status:** ✅ Active
- **Data returned:** Simulated attack outcomes with expected damage statistics. Select attacking/defending units to get statistical averages based on probability.

---

### 26. UnitCrunch

- **URL:** https://unitcrunch.com/
- **Type:** Web app with import/export
- **Status:** ✅ Active
- **Data returned:** Combat simulations with detailed probability breakdowns. Supports importing faction data files and running complex multi-unit battle simulations.
- **Notes:** Only accepts its own file format for data import. Community maintains export files at https://github.com/korzxd/UnitCrunch-data-exports.

---

### 27. Cogitator40k

- **URL:** https://www.cogitator40k.com/
- **Type:** Web app
- **Status:** Active
- **Data returned:** Damage simulation and trade analysis for Warhammer 40k units.

---

## Video Game APIs

### 28. Warhammer 40k: Tacticus API (Official)

_(See entry #4 above for full details)_

- **URL:** https://api.tacticusgame.com/
- **GitHub:** https://github.com/SnowprintStudios/tacticus-api
- **Notes:** The only official Warhammer game API with public developer access.

---

### 29. Overwolf Game Events API — Space Marine 2

- **URL:** https://dev.overwolf.com/ow-native/live-game-data-gep/supported-games/warhammer
- **Type:** Game Events Provider (GEP) API
- **Status:** ✅ Active (since GEP v259.0)
- **Data returned:**
  - `gep_internal` — Local/public version info
  - `game_info` — Current scene state ("lobby", "ingame", "death")
  - `match_info` — Match events: `match_start`, `match_end`, `knockout`, `death`
- **Notes:** For building Overwolf overlay apps for Space Marine 2. Sample app available on GitHub.

---

### 30. Total War: Warhammer Data Parser

- **URL:** https://github.com/krmarshall/TotalWarhammerDataParser
- **Type:** Data extraction tool
- **Status:** Available
- **Data returned:** Character skill trees from Total War: Warhammer 2/3 and mods, exported to JSON format.

---

### 31. TotalWarAPI

- **URL:** https://github.com/Lucky-Seb/TotalWarAPI
- **Type:** REST API (Java/Maven)
- **Status:** Available (33 commits)
- **Data returned:** Total War game data through a Java-based API.

---

### 32. Total War Warhammer Unit Stats

- **URL:** https://github.com/SymmetricChaos/TotalWarWarhammer
- **Type:** Python data extraction
- **Status:** Available
- **Data returned:** Unit statistics from Total War: Warhammer games in Python pickle/pandas DataFrame format. Stats include name, damage, ground speed, and many more attributes.

---

### 33. Darktide Mod Framework & Source Data

- **URL:** https://github.com/Darktide-Mod-Framework/Darktide-Mod-Framework
- **Source Code:** https://github.com/Aussiemon/Darktide-Source-Code
- **Type:** Modding framework + decompiled game scripts
- **Status:** ✅ Active
- **Data returned:** Decompiled Lua game scripts for Warhammer 40k: Darktide — content, core systems, dialogues, and gameplay scripts. The mod framework enables reading and modifying game state.
- **Notes:** Not a traditional API, but provides programmatic access to all game data and systems.

---

## BattleScribe Data Repositories

BattleScribe/BSData is the largest organized collection of Warhammer game data. Data is in XML catalogue format (`.cat`/`.gst` files) and accessible via GitHub or the BattleScribe app.

### 34. BSData — Warhammer 40k 10th Edition

- **URL:** https://github.com/BSData/wh40k-10e
- **Status:** ✅ Active (2,944 commits, 217 stars, 196 forks)
- **Data returned:** Complete army catalogues for all Warhammer 40k 10th Edition factions. Unit entries, wargear, rules, points, detachments, enhancements, and stratagems.
- **Access:** Direct GitHub download, or via BattleScribe app at battlescribedata.appspot.com

### 35. BSData — Kill Team

- **URL:** https://github.com/BSData/wh40k-killteam
- **Status:** ✅ Active (109 stars, 92 forks)
- **Data returned:** Kill Team data files — operatives, equipment, ploys, and team compositions.

### 36. BSData — Age of Sigmar 4th Edition

- **URL:** https://github.com/BSData/age-of-sigmar-4th
- **Status:** ✅ Active (created July 2024)
- **Data returned:** Age of Sigmar 4th Edition army data.

### 37. BSData — Warhammer Fantasy / Old World

- **URL:** https://github.com/BSData/whfb
- **Status:** Available
- **Data returned:** Warhammer Fantasy Battle army lists across multiple editions and factions.

### 38. BSData — Horus Heresy: Legions Imperialis

- **URL:** https://github.com/BSData/Horus-Heresy-Legions-Imperialis
- **Status:** Active (182 commits)
- **Data returned:** Legions Imperialis game data including Collegia Titanica and faction-specific rules.

### 39. BSData — Warhammer 40k Apocalypse

- **URL:** https://github.com/BSData/wh40k-apocalypse
- **Status:** Available
- **Data returned:** Apocalypse rules datasheets and formation data.

### Programmatic Access to BSData

- **py_battlescribe:** Python library for parsing BattleScribe data — https://github.com/akabbeke/py_battlescribe
- **dataslate-parser:** Generates unit cards from BattleScribe rosters for Kill Team, 40k, Horus Heresy, AoS — https://github.com/stvnksslr/dataslate-parser / https://dataslate.dev/
- **BattleScribe Simulator:** Processes BattleScribe files and runs combat simulations — https://github.com/phughk/BattleScribe-Simulator
- **Gallery Index:** BSData maintains a gallery system indexing 172+ game system repositories — https://github.com/bsdata

---

## Other Notable Data Sources

### 40. Official Warhammer 40,000 App

- **URL:** https://app.warhammer40000.com/
- **Platforms:** iOS, Android
- **Status:** ✅ Active (official Games Workshop product)
- **Data:** Core rules, Index datasheets for all factions, Combat Patrol datasheets, Battle Forge army builder. Codex content unlocked via codes in physical books.
- **API:** ❌ No public API. Data locked within the app. Requires Warhammer+ subscription for full features.

### 41. Warhammer Community / GW Store

- **URL:** https://www.warhammer-community.com/ / https://www.games-workshop.com/
- **API:** ❌ No public API for product data, rules, or community content.
- **Notes:** No known developer access. Third-party price comparison tools (e.g., [PriceHammer](https://pricehammer.xyz/)) track retailer prices rather than scraping GW directly.

### 42. Old World Builder

- **URL:** https://old-world-builder.com/
- **GitHub:** https://github.com/nthiebes/old-world-builder
- **Type:** Web app for building Warhammer: The Old World and Fantasy Battles army lists.
- **Data:** Contains structured game data for army building, but no public API documented.

### 43. Crusade Manager

- **URL:** https://crusade-manager.net/
- **Type:** Web app for managing 40k narrative campaigns
- **Data:** Datasheets, weapons, spells, requisition tracking, XP, battle honours, and crusade army management.
- **API:** No public API — web app only.

### 44. OmniArmory

- **URL:** https://omniarmory.io/
- **Type:** Web app with AI-powered features
- **Data:** Army builder with AI-powered unit recognition from photos, datasheet generation, PDF export. Includes a Telegram bot for mobile access.

### 45. 40k Roster Formatter

- **URL:** https://40001format.xyz/
- **GitHub:** https://github.com/maybe-hello-world/40k-roster-formatter
- **License:** MIT
- **Data:** Formats BattleScribe/app roster files into clean printable output.

---

## Summary Table

| # | Name | Type | 40k? | Status | Auth Required | Link |
|---|------|------|------|--------|---------------|------|
| 1 | Takerumi 40k API | REST | ✅ | Active | No | [GitHub](https://github.com/Takerumi/warhammer-40000-api) |
| 2 | AoS API | REST+GraphQL | ❌ (AoS) | Self-host only | No | [GitHub](https://github.com/brittonhayes/warhammer) |
| 3 | Warhammer Proto gRPC | gRPC+REST | ❌ (AoS) | Archived | No | [GitHub](https://github.com/brittonhayes/warhammer-proto) |
| 4 | Tacticus API | REST | ✅ (mobile) | ✅ Active | API Key | [API](https://api.tacticusgame.com/) |
| 5 | KTDash API | REST | Kill Team | ✅ Active | No | [App](https://ktdash.app/) |
| 6 | New Recruit API | REST | ✅ | ✅ Active | Login/Pass | [Docs](https://www.newrecruit.eu/tutorials) |
| 7 | Fantasy Battle DB | REST (Swagger) | ❌ (Fantasy) | Intermittent | No | [API](https://fantasy-battle-db.com/api/doc) |
| 8 | Battle Cogitator | REST (Flask) | ✅ | WIP | No | [GitHub](https://github.com/alexdawn/battle-cogitator) |
| 9 | Wahapedia Export | CSV files | ✅ | ✅ Active | No | [Export](https://wahapedia.ru/wh40k10ed/the-rules/data-export) |
| 10 | Ektoer WH40K JSON | JSON | ✅ | Available | No | [GitHub](https://github.com/ektoer/wh40k) |
| 11 | Tabletop JSON 10e | JSON | ✅ | Available | No | [GitHub](https://github.com/tabletop-json/w40k.10e) |
| 12 | Kill Team JSON | JSON | Kill Team | ✅ Active | No | [GitHub](https://github.com/vjosset/killteamjson) |
| 13 | Game Datacards | JSON/XML | ✅ | ✅ Active | No | [GitHub](https://github.com/game-datacards/datasources) |
| 14 | Underworlds Data | JSON | Underworlds | Available | No | [GitHub](https://github.com/capoferro/warhammer_underworlds_data) |
| 15 | UnitCrunch Exports | TXT | ✅ | Available | No | [GitHub](https://github.com/korzxd/UnitCrunch-data-exports) |
| 16 | RosterizerTestData | JS/TS | ✅ | ✅ Active | No | [GitHub](https://github.com/RosterizerTestData/Warhammer40k10e) |
| 17 | Lexicanum Wiki API | MediaWiki | ✅ (lore) | ✅ Active | No | [API](https://wh40k.lexicanum.com/mediawiki/api.php) |
| 18 | Fandom Wiki API | MediaWiki | ✅ (lore) | ✅ Active | No | [API](https://warhammer40k.fandom.com/api.php) |
| 19 | Depot | Web/Workers | ✅ | ✅ Active | No | [App](https://godepot.dev/) |
| 29 | Overwolf SM2 GEP | Game Events | ✅ (video game) | ✅ Active | Overwolf SDK | [Docs](https://dev.overwolf.com/ow-native/live-game-data-gep/supported-games/warhammer) |

---

## Key Takeaways

1. **No official Games Workshop tabletop API exists.** All tabletop game data APIs are community-maintained.
2. **Wahapedia's CSV export** is the most comprehensive structured 40k data source — it's the backbone of many community tools.
3. **The Tacticus API** is the only official Warhammer API with documented public access (for the mobile game, not tabletop).
4. **BSData/BattleScribe** repositories collectively represent the largest structured Warhammer data ecosystem across all game systems.
5. **The AoS API** was the most polished community API but its public instance was sunset in January 2025 — it can still be self-hosted.
6. **Wiki APIs** (Lexicanum and Fandom) provide the best programmatic access to Warhammer lore via standard MediaWiki endpoints.
7. **Most "APIs" are really data files** (JSON, CSV, XML) hosted on GitHub rather than live REST services.

---

*Last updated: March 6, 2026*
