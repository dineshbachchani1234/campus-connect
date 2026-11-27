---
name: campus-connect-ui
description: Team UI rules for the Campus Connect CS 5340 prototype. Load before building, restyling or reviewing any screen or component in this repo (React, Tailwind, shadcn/ui). Covers our tokens, components, accessibility floor, the in-class feedback items each screen must address, copy rules, and how to log design changes for the T4 report. Pairs with the apple-design skill.
---

# Campus Connect UI

Use this skill for any frontend change in this repo: a new screen, a restyle, a component, or a review of a screenshot. It holds our team's decisions. For the underlying guideline text, also load the `apple-design` skill (Apple Human Interface Guidelines). If `apple-design` is missing, tell the user to run `npm run setup:skills` and start a new session.

## Who and what

- **Product:** Campus Connect helps commuter and off-campus Northeastern students join small, recurring plans (study group, lunch, gym) on the days they are actually on campus.
- **People:** Maya, a schedule-bound commuter whose barrier is time, and Jordan, who is on campus but out of sync and whose barrier is energy and having no one to go with.
- **Platform:** a mobile-first web app at 390px. It shows inside a phone frame on desktop. Apple's principles and foundations apply (accessibility, color, typography, layout, writing). iOS-only conventions apply only where a web equivalent exists.
- **Grade:** interaction design and changes tied to in-class feedback. There is no backend, so do not add one.

## Before you start

1. Read the screen's GitHub issue ("Done when" checklist) and its row in the README screens table.
2. Load `apple-design` and open the guideline pages for what is on screen (forms: `entering-data`, `text-fields`; sheets: `sheets`; lists and cards: `lists-and-tables`; empty or error states: `feedback`, `writing`).
3. Reuse before you build: `src/components/` (PlanCard, GroupCard, FormField, ScreenHeader, Screen, StateViews, AvatarStack, VerifiedBadge) and `src/components/ui/` (shadcn). Add new shadcn parts with `npx shadcn@latest add <name>`.

## Hard rules (a PR fails review without these)

| Rule                                                      | How                                                                                                                                                                                            |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tap targets at least 44px                                 | `Button` sizes `default`, `lg`, `xl`, `icon`, `icon-lg` are 44px. `sm` and `icon-sm` add an invisible 44px hit area. Custom chips and links use `h-11` or `min-h-11`.                          |
| Text contrast at least 4.5:1 (3:1 for bold or large text) | Use tokens only: `text-foreground`, `text-muted-foreground`, `text-primary`, `text-success`, `text-destructive`. Never hard-code hex or gray-400 style colors. Check text on tinted cards too. |
| Text size                                                 | Body 16px (`text-base`), secondary 14px (`text-sm`), 12px (`text-xs`) only for badges and timestamps. Inputs stay at 16px so iPhone Safari does not zoom.                                      |
| Nothing by color alone                                    | Pair color with an icon or a word: "You're going" with a check icon, "Full" as text.                                                                                                           |
| Keyboard and screen reader                                | Every control is reachable with Tab and shows the focus ring. Icon-only buttons have `aria-label`. Use real `<button>` and `<a>` elements, never a clickable `<div>`.                          |
| Every action gives feedback                               | A toast (`sonner`), a new screen, or a visible state change. Use a confirmation screen for big moments (join, post, make weekly).                                                              |
| Every list has states                                     | Loading (skeleton or `LoadingState`), empty (`EmptyState` with a next step), error (`ErrorState` with Try again).                                                                              |
| One strong button per view                                | `variant="default"` for the single most likely action. Others use `outline`, `secondary` or `ghost`. The same action keeps the same emphasis on every screen.                                  |
| One color means one thing                                 | Teal (`primary`) means "you can tap this". Green (`success`) means verified or you're going. Do not use teal on static labels.                                                                 |

## Our tokens

Defined in `src/styles/tokens.css`. Change a value there, never in a screen.

- `--primary` teal, for actions and links (6.6:1 with white text)
- `--success` green, for verified and joined states
- `--accent` / `--accent-foreground`, for a light teal surface on tappable chips
- `--muted-foreground`, for secondary text
- `--warning`, for facilitator and demo UI only
- `--app-max-width` 420px, `--tap-target` 44px

## The in-class feedback each change should serve

Every screen exists to fix at least one of these. Say which in the PR, and add before and after screenshots to `docs/screenshots/before-after/` named `feedback-<n>-after-<screen>.png`.

1. **Plans did not stand out.** Cards look tappable (border, shadow, hover lift, chevron, whole card is the link). Headings stay quiet text.
2. **No text entry affordance.** Real labelled inputs with `FormField`, a placeholder that shows the format, errors under the field.
3. **No already-enrolled state.** Joined plans show "You're going" instead of Join, and a second tap explains why.
4. **Missing feedback.** See the feedback rule above.
5. **Create a plan was hard to find.** Keep Create prominent on Home, in empty states and in My Groups, with no forced tutorial.
6. **Add to calendar and Message the group too close.** One strong and one outline button, different icons, a short line under each, and space between them. Keep this order on every screen that shows both.

## Copy

- Plain, friendly words a student would say. No jargon, no em dashes.
- Buttons start with a verb and say what happens: "Join this plan", "Add to calendar", "Save changes". Never "Submit", "OK" or "Done" when a verb fits.
- An action keeps its name through the flow: "Make it weekly" leads to "Weekly group created".
- Use sentence case for buttons, titles and labels, everywhere.
- Errors say how to fix it: "Use your Northeastern email (ends in @northeastern.edu)".
- Empty screens invite the next step.
- Low pressure tone. This is not a dating app, so no "match" or "swipe" language.

## Privacy and safety (design principle 5)

Only verified Northeastern students appear. Never show a home address or exact location, only the campus spot chosen for a plan. Show pronouns when people share them.

## Before you open a PR

- [ ] `npm run check` passes
- [ ] Checked at 375px and 390px width and in the desktop frame
- [ ] Tab through the screen: every control is reachable and shows the focus ring
- [ ] Loading, empty and error states shown where they apply
- [ ] Screenshot saved for the report if it addresses feedback 1 to 6
- [ ] Row added to `docs/design-evolution.md` with the PR link

## Reviewing a screen

Run the `apple-design` review process (five lenses: accessibility, conventions, craft, interaction, writing), then check the hard rules table above. Measure contrast and sizes in the browser rather than guessing, and cite the guideline file for each finding.
