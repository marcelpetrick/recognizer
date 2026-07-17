# C4 Architecture — Recognizer

Architecture documentation following the [C4 model](https://c4model.com): system context, containers, components, and code, plus a runtime and a deployment view. Kept in sync with the source; when structure changes, update this document in the same change set.

## Level 1 — System context

Recognizer is a fully client-side progressive web app. There is no backend: all game logic, persistence, and rankings live in the player's browser.

```mermaid
C4Context
  title System context — Recognizer
  Person(player, "Player", "Wants a fast visual-recognition challenge in the browser")
  System(recognizer, "Recognizer PWA", "Single-player concentration game; runs entirely in the browser, installable, offline-capable")
  System_Ext(pages, "GitHub Pages", "Serves the built static assets over HTTPS")
  Rel(player, recognizer, "Plays, configures, views rankings", "Browser")
  Rel(recognizer, pages, "Is delivered by", "HTTPS, first load and asset updates")
```

## Level 2 — Containers

```mermaid
C4Container
  title Containers — Recognizer
  Person(player, "Player")
  System_Boundary(recognizer, "Recognizer PWA") {
    Container(spa, "Single-Page Application", "React 19, TypeScript, Vite", "All screens, game rules, timing, rankings, and i18n")
    Container(sw, "Service Worker", "Workbox via vite-plugin-pwa", "Precaches the app shell and assets for offline play and installs updates")
    ContainerDb(storage, "Browser Local Storage", "Versioned JSON (schema v2)", "Preferences (name, language, sound, motion, tier) and tiered rankings; validated and migrated on load")
  }
  System_Ext(pages, "GitHub Pages")
  Rel(player, spa, "Uses")
  Rel(spa, storage, "Loads, validates, migrates, saves", "JSON")
  Rel(sw, pages, "Fetches and caches assets", "HTTPS")
  Rel(spa, sw, "Registered by", "virtual:pwa-register")
```

## Level 3 — Components (inside the SPA)

The core rule: everything in `src/domain/` is framework-free TypeScript with injected randomness and time, so the game rules are fully unit-testable without React.

```mermaid
C4Component
  title Components — Single-Page Application
  Container_Boundary(spa, "Single-Page Application") {
    Component(app, "App", "src/App.tsx", "Orchestrator: state, effects, view selection, run lifecycle; no presentation markup")
    Component(views, "Views", "src/views/*", "MenuView, HelpView, GameView, ResultsView, RankingsView, SettingsView — presentational, receive translations and callbacks")
    Component(cards, "Card rendering", "src/components/*", "SymbolCard and SymbolMark render the seeded symbol layouts; ErrorBoundary catches render crashes")
    Component(i18n, "Translations", "src/i18n/*", "Typed en/hr/de tables; a missing key in any language is a compile-time error")
    Component(domain, "Game domain", "src/domain/*", "deck (projective plane), challenge (seeded shuffle), game (run state machine), layout (seeded geometry), timer, rankings, storage, symbols, types")
    Component(audio, "Feedback audio", "src/feedback.ts", "Optional Web Audio tones over one shared AudioContext")
  }
  ContainerDb_Ext(storage, "Browser Local Storage")
  Rel(app, views, "Renders one of")
  Rel(views, cards, "GameView composes")
  Rel(app, domain, "Drives run state, timing, ranking insertion")
  Rel(app, i18n, "Selects the active language table")
  Rel(views, i18n, "Read strings from")
  Rel(app, audio, "Triggers on selection feedback")
  Rel(app, storage, "loadGameData / saveGameData via the storage adapter")
```

## Level 4 — Code (domain model)

```mermaid
classDiagram
  class Card {
    +id: number
    +symbolIds: SymbolId[]
  }
  class GameRun {
    +cards: Card[]
    +layoutSeeds: Record~number, number~
    +phase: active | transitioning | completed | abandoned
    +currentIndex: number
    +incorrectSelections: number
  }
  class RunTimer {
    +startedAt: number
    +finishedAt?: number
  }
  class RankingEntry {
    +id: string
    +playerName: string
    +challengeSize: 10 | 20 | 50
    +elapsedMs: number
    +completedAt: number
    +insertionOrder: number
  }
  class Preferences {
    +playerName: string
    +challengeSize: 10 | 20 | 50
    +soundEnabled: boolean
    +reducedMotion: boolean
    +language: en | hr | de
  }
  class StoredGameData {
    +version: 2
    +preferences: Preferences
    +rankings: TieredRankings
    +nextInsertionOrder: number
  }
  GameRun "1" o-- "10..50" Card : plays
  StoredGameData "1" *-- "1" Preferences
  StoredGameData "1" *-- "3 tiers" RankingEntry : rankings
```

Notes:

- The deck is generated from the finite projective plane of order 7 (`src/domain/deck.ts`): 57 cards, 8 symbols each, every pair of cards shares exactly one symbol. Tests assert every invariant over all card pairs.
- `RunTimer` values come from the monotonic `performance.now()`; only `RankingEntry.completedAt` is a wall-clock date.
- `storage.ts` validates untrusted JSON at the boundary and repairs or migrates old payloads (v1 → v2 added `language`) instead of discarding rankings.

## Runtime view — one correct selection

```mermaid
sequenceDiagram
  participant P as Player
  participant GV as GameView
  participant A as App
  participant D as domain/game
  participant S as domain/storage
  P->>GV: taps the shared symbol
  GV->>A: onSelect(symbolId)
  A->>D: selectSymbol(run, symbolId)
  D-->>A: run in phase "transitioning"
  A->>A: 240 ms guarded transition (session token)
  A->>D: finishTransition(run)
  alt more pairs remain
    D-->>A: next pair, phase "active"
  else final pair solved
    D-->>A: phase "completed"
    A->>A: freeze timer, build result
    A->>S: saveGameData (rankings + preferences)
    A->>GV: switch to ResultsView
  end
```

The complete game state machine (menu, preparing, active, transitioning, completed, abandoned) is diagrammed in [REVIEW_AND_WORKFLOW.md](./REVIEW_AND_WORKFLOW.md).

## Deployment view

```mermaid
flowchart LR
  Dev[Developer push / PR] --> CI[GitHub Actions: ci.yml<br>format, links, lint, types, unit, build, e2e]
  Dev -->|push to master| Deploy[GitHub Actions: deploy-pages.yml<br>build with PUBLIC_BASE_PATH=/recognizer/]
  Deploy --> Pages[GitHub Pages<br>marcelpetrick.github.io/recognizer]
  Pages --> Browser[Player's browser<br>SPA + service worker + localStorage]
  Dependabot[Dependabot weekly] --> CI
```
