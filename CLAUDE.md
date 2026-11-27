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

## Frontend design

For any frontend UI work (new screens, restyling, reviewing a screenshot), load the `apple-design` skill first and follow Apple's Human Interface Guidelines through it: accessibility and contrast first, then layout, typography and color. This is a web app, so Apple's principles and foundations apply (accessibility, color, typography, layout, writing), not iOS-only conventions.

- Keep using the tokens in `src/styles/tokens.css` and the shadcn components in `src/components/ui/`. No hard coded colors in screens.
- Tap targets at least 44px, visible focus rings, nothing conveyed by color alone.
- Every action gives visible feedback (toast, new screen or state change), and every list has an empty and error state.
- Tie design changes to the in-class feedback items 1 to 6 in `README.md` and log them in `docs/design-evolution.md` with before and after screenshots.

The skill isn't in this repo, because it contains Apple's copyrighted guideline text. Install it once per machine:

```bash
git clone --depth 1 https://github.com/dickwu/apple-design-skill /tmp/apple-design-skill
mkdir -p ~/.claude/skills/apple-design
cp -R /tmp/apple-design-skill/SKILL.md /tmp/apple-design-skill/references ~/.claude/skills/apple-design/
```

Then start a new Claude Code session.

## Conventions

- Never commit to `main`. Pull `main`, create a branch (`feat/...`, `fix/...`, `design/...`, `docs/...`), push, and open a pull request. A teammate reviews it on the Vercel preview link; CI must pass.
- One issue per PR, and put `Closes #<n>` in the description.
- UI text and docs in plain, friendly words. No em dashes, no jargon.
- Never commit course materials, interview transcripts or test recordings. `course-materials/` is gitignored.
