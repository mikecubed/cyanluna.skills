---
name: kanban-spec
description: Spec-driven development phases (constitution, specify, plan, tasks) that automatically import tasks into the kanban execution pipeline. Run /kanban-init first to register the project.
license: MIT
---

Runs upstream spec-driven development phases and bridges the output into the kanban execution pipeline. Produces a `.spec/` directory that is the living source of truth — specs generate tasks, tasks drive implementation.

## Usage

```
/kanban-spec                              — show spec status for this project
/kanban-spec constitution                 — define project governing principles (run once)
/kanban-spec specify <description>        — draft spec from feature description
/kanban-spec plan                         — generate technical plan from latest spec
/kanban-spec tasks                        — generate tasks and auto-import into kanban
/kanban-spec run <description>            — full wizard: all phases sequentially
```

## Project Config

Reads `.claude/kanban.json` (created by `/kanban-init`) for the project name and derives the DB path from it. If missing, prompt user to run `/kanban-init` first.

```bash
PROJECT=$(cat .claude/kanban.json 2>/dev/null | python3 -c "import sys,json; print(json.load(sys.stdin)['project'])" 2>/dev/null || basename "$(pwd)")
# Sanitize to match kanban-board/plugins/kanban-api.ts sanitizeProject:
# only letters, digits, '.', '_', '-' are kept; everything else becomes '_'
SANITIZED_PROJECT="${PROJECT//[^A-Za-z0-9_.-]/_}"
DB="$HOME/.claude/kanban-dbs/${SANITIZED_PROJECT}.db"
```

## Spec Directory Structure

All spec artifacts live in `.spec/` relative to the project root:

```
.spec/
├── constitution.md                  ← project governing principles (one per project)
└── features/
    ├── 001-user-auth/
    │   ├── spec.md                  ← requirements and user stories
    │   ├── plan.md                  ← technical architecture plan
    │   └── tasks.md                 ← task checklist (kanban import source)
    └── 002-payment-flow/
        └── ...
```

`.spec/constitution.md` and `spec.md`/`plan.md`/`tasks.md` should be committed to version control — they are the source of truth. Add `.spec/**/*.lock` to `.gitignore`.

## Feature Numbering

When creating a new feature directory:

```bash
LAST_NUM=$(ls -d .spec/features/[0-9]* 2>/dev/null \
  | sed -E 's|.*/([0-9]+).*|\1|' \
  | sort -n \
  | tail -n 1)
NEXT_NUM=$([ -z "$LAST_NUM" ] && echo 1 || echo $((10#$LAST_NUM + 1)))
FEATURE_NUM=$(printf "%03d" "$NEXT_NUM")
```

Feature directory name: `NNN-<short-slug>` where short-slug is 2-4 words from the description, hyphenated, lowercase (e.g. `001-user-auth`, `002-payment-flow`).

## Agent Roster

| Nickname | Phase | Template | Model |
|----------|-------|----------|-------|
| `Architect` | constitution | `constitution-agent.md` | `sonnet` |
| `Specifier` | specify | `spec-agent.md` | `opus` |
| `Planner` | plan | `plan-agent.md` | `opus` |
| `Strategist` | tasks | `tasks-agent.md` | `sonnet` |

All agents sign output with:
```
> **Nickname** `model` · ISO8601timestamp
```

## Agent Dispatch Procedure

For every phase, execute in this order:

```
① Gather codebase context
   - Read package.json (or equivalent: Cargo.toml, go.mod, pyproject.toml)
   - Read README.md
   - List top-level directories and src/ (or equivalent)
   - Read existing .spec/ files relevant to this phase

② Read template
   Read: ~/.claude/skills/kanban-spec/templates/<agent>.md

③ Fill placeholders
   Replace every occurrence of:
     <PROJECT>         → project name
     <FEATURE_NUM>     → NNN (e.g. "001")
     <FEATURE_NAME>    → feature slug (e.g. "user-auth")
     <FEATURE_DIR>     → full directory name, i.e. "${FEATURE_NUM}-${FEATURE_NAME}" (e.g. "001-user-auth")
     <DESCRIPTION>     → user's feature description
     <CONSTITUTION>    → contents of .spec/constitution.md (or "None yet")
     <SPEC>            → contents of current feature's spec.md (or "")
     <PLAN>            → contents of current feature's plan.md (or "")
     <CLARIFICATIONS>  → prior clarification Q&A (or "None")
     <CODEBASE_CONTEXT>→ gathered context from step ①
     <TIMESTAMP>       → current UTC time (ISO 8601)

④ Launch Task tool
   Task(
     subagent_type = "general-purpose",
     model         = "<sonnet|opus>",
     prompt        = <filled template content>
   )

⑤ Write agent output to .spec/ file
   Use Write tool to save to appropriate path.
```

## Commands

### `/kanban-spec` — Status

Show current spec state:

1. Check `.spec/constitution.md` exists → ✅/❌
2. List all feature directories with completion markers:
   - spec.md ✅/❌, plan.md ✅/❌, tasks.md ✅/❌, imported ✅/❌
3. Show: `Board: http://localhost:5173/?project=<PROJECT>`
4. Suggest next step if phases are incomplete

Example output:
```
📋 kanban-spec status: my-project

  Constitution: ✅ .spec/constitution.md

  Features:
    001-user-auth   spec ✅  plan ✅  tasks ✅  imported ✅  (5 tasks)
    002-search      spec ✅  plan ❌  tasks ❌  imported ❌

  Next: /kanban-spec plan   ← for 002-search
  Board: http://localhost:5173/?project=my-project
```

### `/kanban-spec constitution` — Constitution Phase

Establish project governing principles. Run once per project at start.

**If `.spec/constitution.md` already exists:**
- Show current content summary
- Ask user via AskUserQuestion: "Update constitution, or keep as-is?"

**Procedure:**
```
① Gather full codebase context (key config files, src structure, existing tests)
② Dispatch Architect agent (sonnet) with constitution-agent.md
③ Write output to .spec/constitution.md
④ Show constitution to user
⑤ Ask: "Any principles to add or change?" — iterate if needed (max 1 revision round)
```

### `/kanban-spec specify <description>` — Specify Phase

Generate a structured specification from a natural language feature description.

**Procedure:**
```
① Read .spec/constitution.md
② Determine FEATURE_NUM and create slug from description
③ mkdir -p .spec/features/NNN-slug/
④ Dispatch Specifier agent (opus) with spec-agent.md
⑤ Write output to .spec/features/NNN-slug/spec.md
⑥ Show spec to user
⑦ Clarification loop (if [NEEDS CLARIFICATION] markers exist):
   - Extract all [NEEDS CLARIFICATION] items
   - Present as AskUserQuestion (max 4 per round, max 2 rounds)
   - Re-dispatch Specifier with prior clarifications filled in
   - Repeat until no markers remain OR 2 rounds done (mark remaining as "deferred")
```

### `/kanban-spec plan` — Plan Phase

Generate technical architecture plan from spec. Requires `spec.md` to exist.

**If multiple features have spec but no plan:** ask user which feature to plan via AskUserQuestion.

**Procedure:**
```
① Read .spec/constitution.md and target feature's spec.md
② Gather codebase context: read key source files mentioned in spec, schema files, API routes
③ Dispatch Planner agent (opus) with plan-agent.md
④ Write output to .spec/features/NNN-slug/plan.md
⑤ Show plan to user, confirm before proceeding
```

### `/kanban-spec tasks` — Tasks Phase + Kanban Import

Generate task checklist from plan and automatically import into kanban. Requires `plan.md` to exist.

**If multiple features have plan but no tasks:** ask user which feature to process.

**If `.spec/features/NNN-slug/tasks-imported.lock` already exists:** warn user and confirm re-import (will create duplicate tasks).

**Procedure:**
```
① Read target feature's spec.md and plan.md
② Dispatch Strategist agent (sonnet) with tasks-agent.md
③ Write output to .spec/features/NNN-slug/tasks.md
④ Parse tasks.md (see Import Logic below)
⑤ Create kanban entries for each task
⑥ Write .spec/features/NNN-slug/tasks-imported.lock with timestamp and task IDs
⑦ Show import summary
```

#### Import Logic

Parse each line of tasks.md matching this pattern:
```
- [ ] T001 [L2] [US1] Description of the task in src/some/file.ts
       ↑    ↑    ↑              ↑
     check level story       kanban title
```

For each unchecked task (`- [ ]`), create a kanban entry:

> **Note:** Extract `$LEVEL` as a bare integer before use — the format in tasks.md is `[L1]`/`[L2]`/`[L3]`, but the kanban DB and API expect numeric `1`/`2`/`3`:
> ```bash
> LEVEL=$(echo "$LEVEL_TAG" | sed 's/[^0-9]//g')  # "[L2]" → "2"
> ```

**Via HTTP API (preferred — if board is running):**
```bash
curl -s -X POST http://localhost:5173/api/task \
  -H 'Content-Type: application/json' \
  -d "$(jq -n \
    --arg title "$TASK_TITLE" \
    --arg project "$PROJECT" \
    --argjson level "$LEVEL" \
    --arg feature_name "$FEATURE_NAME" \
    --arg story_label "$STORY_LABEL" \
    --arg feature_dir "$FEATURE_DIR" \
    '{
      title: $title,
      project: $project,
      status: "todo",
      priority: "medium",
      level: $level,
      description: ("Feature: " + $feature_name + "\n\nUser Story: " + $story_label + "\n\nSpec: .spec/features/" + $feature_dir + "/spec.md\nPlan: .spec/features/" + $feature_dir + "/plan.md"),
      tags: ([$story_label, "spec-imported", $feature_dir] | tojson)
    }')"
```

**Via sqlite3 fallback (if board not running):**
```bash
sqlite3 "$DB" <<EOF
.parameter init
.parameter set :title "$TASK_TITLE"
.parameter set :project "$PROJECT"
.parameter set :level "$LEVEL"
.parameter set :description "Feature: $FEATURE_NAME

User Story: $STORY_LABEL

Spec: .spec/features/$FEATURE_DIR/spec.md
Plan: .spec/features/$FEATURE_DIR/plan.md"
.parameter set :tags "[\"$STORY_LABEL\",\"spec-imported\",\"$FEATURE_DIR\"]"
INSERT INTO tasks (title, project, status, priority, level, description, tags, created_at)
  VALUES (:title, :project, 'todo', 'medium', :level, :description, :tags, datetime('now'));
EOF
```

After all tasks are imported, write the lock file:
```bash
echo "{\"imported_at\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\", \"task_ids\": [$IDS]}" \
  > .spec/features/$FEATURE_DIR/tasks-imported.lock
```

#### Level Auto-Assignment

The Strategist agent assigns `[L1]`, `[L2]`, or `[L3]` per task. Heuristics:

| Signal | Level |
|--------|-------|
| fix, update, rename, remove, config, typo, text change | L1 |
| Single file, no API, no schema, no new dependencies | L1 |
| add, improve, refactor, enhance, support | L2 |
| 2–5 files, existing API modification, needs review | L2 |
| implement, create, design, integrate, migrate, auth, security | L3 |
| New API endpoints, schema changes, 6+ files, new UI component | L3 |
| Architecture decision required | L3 |

Default: **L2** when ambiguous.

### `/kanban-spec run <description>` — Full Wizard

Runs all four phases sequentially with user confirmation between each:

```
Step 1: Constitution
  → Skip if .spec/constitution.md exists and user confirms keeping it
  → Otherwise run constitution phase

Step 2: Specify
  → Run specify phase with <description>
  → Resolve all [NEEDS CLARIFICATION] items
  → Pause: show spec, ask user to confirm

Step 3: Plan
  → Run plan phase
  → Pause: show plan, ask user to confirm

Step 4: Tasks + Import
  → Run tasks phase
  → Auto-import into kanban
  → Show summary table

Final output:
  ✅ Imported N tasks for feature NNN-slug into my-project kanban

  Tasks created:
    #42  [L3]  Implement OAuth2 flow in src/auth/oauth.ts
    #43  [L2]  Add /api/auth/login endpoint
    ...

  Start execution:
    /kanban run 42
```

## Level Mapping to Kanban Pipeline

| Level | Kanban Path |
|-------|------------|
| L1 | `todo → impl → done` |
| L2 | `todo → plan → impl → impl_review → done` |
| L3 | `todo → plan → plan_review → impl → impl_review → test → done` |

Note: kanban's Planner agent will expand the spec's `description` field (which links to spec.md) into a full implementation plan during the `plan` column.

## Setup

Run once per project (after `/kanban-init`):
```
/kanban-spec constitution
```

Then per feature:
```
/kanban-spec run "add user authentication with OAuth2"
```

Or step by step:
```
/kanban-spec specify "add user authentication with OAuth2"
/kanban-spec plan
/kanban-spec tasks
```

Then execute with kanban:
```
/kanban list          ← see imported tasks
/kanban run <ID>      ← run first task through pipeline
```

## Install

```bash
cp -R kanban-spec ~/.claude/skills/
```

Add to `.gitignore` in each project:
```
.spec/**/*.lock
```
