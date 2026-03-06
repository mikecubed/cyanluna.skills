# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repo Is

A **skill ecosystem for Claude Code**. It ships skills (`kanban/`, `kanban-init/`, `kanban-spec/`) that get installed into `~/.claude/skills/`, plus a central web board (`kanban-board/`) that serves a REST API backed by per-project SQLite databases.

Skills are markdown files — they are not built or compiled; they are copied to `~/.claude/skills/` and invoked via `/skill-name` in Claude Code sessions.

## Commands

### kanban-board (the only buildable component)

```bash
cd kanban-board
pnpm install     # install dependencies
pnpm dev         # start Vite dev server on port 5173
pnpm build       # production build
pnpm preview     # preview production build
```

No linting or test runner is configured.

### Skill installation (not a build step)

```bash
cp -R kanban      ~/.claude/skills/
cp -R kanban-init ~/.claude/skills/
cp -R kanban-spec ~/.claude/skills/
cp -R model-router ~/.claude/skills/
cp -R gemini-claude-loop ~/.claude/skills/
```

### Demo utilities

```bash
cd scripts
npx tsx capture-screenshots.ts   # capture demo screenshots
npx tsx record-demo.ts           # record demo video
```

## Architecture

### Data Flow

```
User → /kanban-spec run "add user auth"          ← UPSTREAM: spec-driven phases
         └─ Architect  → .spec/constitution.md
         └─ Specifier  → .spec/features/001-user-auth/spec.md
         └─ Planner    → .spec/features/001-user-auth/plan.md
         └─ Strategist → .spec/features/001-user-auth/tasks.md
                              └─ auto-imports tasks into kanban DB

User → /kanban run <ID>                          ← DOWNSTREAM: execution pipeline
         └─ reads .claude/kanban.json  { "project": "name" }
         └─ resolves DB at ~/.claude/kanban-dbs/{project}.db
         └─ dispatches Task agents sequentially per pipeline level
         └─ each agent reads/writes specific task fields via REST API
              └─ or direct sqlite3 CLI if board is not running
```

The kanban skill itself is **stateless** — it reads the project name from `.claude/kanban.json`, talks to the board's HTTP API (or SQLite directly as fallback), and fires agents. All state lives in the SQLite DB.

`kanban-spec` is the upstream bridge: it runs spec-driven phases (constitution → specify → plan → tasks) and automatically imports the resulting task list into the kanban DB. Spec artifacts live in `.spec/` in the project root and are committed to version control.

### The 7-Column Pipeline

Tasks flow left to right. Valid transitions are enforced by the API:

```
todo → plan → plan_review → impl → impl_review → test → done
```

Pipeline level determines which columns a task visits:
- **L1**: `todo → impl → done`
- **L2**: `todo → plan → impl → impl_review → done`
- **L3**: full pipeline including `plan_review` and `test`

### Agent Roles and Ownership

Each agent has a fixed nickname used as a signature header in all output:

| Nickname | Model | Writes To |
|----------|-------|-----------|
| `Planner` | opus | `plan`, `decision_log` |
| `Critic` | sonnet | `plan_review_comments` |
| `Builder` | opus | `implementation_notes` |
| `Shield` | sonnet | `implementation_notes` (append) |
| `Inspector` | sonnet | `review_comments` |
| `Ranger` | sonnet | `test_results` |

Every agent output must begin with:
```
> **AgentName** `model` · ISO8601timestamp
```

Agent templates live at `kanban/templates/`. The schema (source of truth for the 27-column DB) is at `kanban/schema.md`.

### kanban-board: Vite + Plugin Architecture

The web board is a single-page vanilla TypeScript app. The backend is implemented as a **Vite plugin** (`kanban-board/plugins/kanban-api.ts`) that intercepts HTTP requests during `pnpm dev` and `pnpm preview`. There is no separate server process.

- `kanban-api.ts` — all REST endpoints, SQLite connection pooling, schema migration, image storage, status-transition enforcement
- `src/main.ts` — all frontend logic (board rendering, drag-and-drop, modal, list view, search/filter, markdown rendering, Mermaid diagrams)
- `src/style.css` — dark theme

### SQLite Conventions

- **No WAL mode** — uses `PRAGMA journal_mode=DELETE` so `.db` files are safe for OneDrive/cloud sync (no `-wal`/`-shm` sidecars)
- **Per-project DBs** — `~/.claude/kanban-dbs/{project}.db`, never a shared DB
- **Backward migration** — `kanban-api.ts` runs `ALTER TABLE ADD COLUMN IF NOT EXISTS` on startup to handle old 4-column schemas

### Project Config

Each user project registers itself with a single file:

```json
// {project-root}/.claude/kanban.json
{ "project": "project-name" }
```

The kanban skill reads this to resolve the correct `.db` file. `kanban-init` creates this file plus the DB and a `kanban-board/start.sh` launcher in the user's project.

### API-First Design

The web board exposes a REST API on `http://localhost:5173` (or configurable port). CLI skill commands prefer this HTTP API for reads/writes and fall back to `sqlite3` CLI if the board is not running. This means the API is the contract — both the web UI and agent scripts depend on it.

Key environment overrides (for the Vite plugin):
- `KANBAN_DBS_DIR` — override `~/.claude/kanban-dbs`
- `KANBAN_IMAGES` — override `~/.claude/kanban-images`

## Key Files

| File | Purpose |
|------|---------|
| `kanban/SKILL.md` | Full spec for the `/kanban` skill — agent dispatch procedure, all commands, DB resolution, API endpoints |
| `kanban/schema.md` | Source of truth for the 27-column SQLite schema and agent definitions |
| `kanban-init/SKILL.md` | Spec for `/kanban-init` — 5-step initialization procedure |
| `kanban-spec/SKILL.md` | Spec for `/kanban-spec` — constitution/specify/plan/tasks phases + kanban import |
| `kanban-spec/templates/*.md` | Agent prompt templates — Architect, Specifier, Planner, Strategist |
| `kanban-board/plugins/kanban-api.ts` | Entire backend: REST API, SQLite, migrations, image uploads |
| `kanban-board/src/main.ts` | Entire frontend: board, modal, list view, search, drag-drop |
| `kanban/templates/*.md` | Agent prompt templates — one per pipeline role |

## Skill Relationship

```
/kanban-init     → registers project, creates DB
/kanban-spec     → upstream: constitution → spec → plan → tasks → imports into kanban
/kanban          → downstream: executes tasks through 7-column AI pipeline
/kanban-init is a prerequisite for both /kanban-spec and /kanban.
/kanban-spec is optional — tasks can also be added manually with /kanban add.
```
