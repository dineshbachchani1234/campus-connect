# CLAUDE.md: Campus Connect

CS 5340 (Computer Human Interaction) high fidelity prototype, Team 12 UX Trio. A mobile first web app that helps commuter and off-campus Northeastern students join small, recurring plans on the days they are on campus. The grade rewards interaction design and changes tied to in-class testing feedback, not backend work. There is no backend.

## Where to look

| What                                                               | Where                                                                           |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| Project overview, screens, routes, feedback table                  | `README.md`                                                                     |
| Branch and PR workflow                                             | `CONTRIBUTING.md`                                                               |
| UI design rules (any change to how the app looks)                  | the `apple-design` skill (personal install, see below)                          |
| App state and every action (our "database", saved to localStorage) | `src/store/useAppStore.ts`                                                      |
| Types, plan helpers (time format, filters, grouping)               | `src/lib/types.ts`, `src/lib/plans.ts`                                          |
| Sample data                                                        | `src/data/seed.ts`                                                              |
| Shared components                                                  | `src/components/` (PlanCard, GroupCard, FormField, ScreenHeader, StateViews...) |
| shadcn/ui primitives                                               | `src/components/ui/`                                                            |
| Design tokens (colors, radius, app width)                          | `src/styles/tokens.css`                                                         |
| Demo panel and session log for test sessions                       | `src/components/DemoPanel.tsx`, `src/lib/eventLog.ts`                           |
| Design evolution log and testing docs                              | `docs/design-evolution.md`, `docs/testing/`                                     |

## Run

```bash
npm install
npm run dev     # http://localhost:5173
npm run check   # type check, lint, formatting (same as CI)
```

## Frontend design (required for every UI change)

Before any frontend work (a new screen, a restyle, a component, or reviewing a screenshot), load **both** skills:

1. **`campus-connect-ui`** (in this repo, `.claude/skills/campus-connect-ui/SKILL.md`): our team rules, including the 44px tap targets, 4.5:1 contrast, tokens, one strong button per view, the in-class feedback items 1 to 6, copy rules, and the PR checklist.
2. **`apple-design`** (personal install): Apple's Human Interface Guidelines, used for the reasoning and citations. Work through accessibility and contrast first, then layout, typography and color. This is a web app, so Apple's principles and foundations apply, not iOS-only conventions.

If `apple-design` is not installed, run this once per machine and start a new Claude Code session:

```bash
npm run setup:skills
```

It installs a pinned, reviewed version from https://github.com/dickwu/apple-design-skill into `~/.claude/skills/apple-design`. It is not committed here because it contains Apple's copyrighted guideline text.

## Conventions

- Never commit to `main`. Pull `main`, create a branch (`feat/...`, `fix/...`, `design/...`, `docs/...`), push, and open a pull request. A teammate reviews it on the Vercel preview link; CI must pass.
- One issue per PR, and put `Closes #<n>` in the description.
- UI text and docs in plain, friendly words. No em dashes, no jargon.
- Never commit course materials, interview transcripts or test recordings. `course-materials/` is gitignored.
