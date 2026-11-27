# Campus Connect

**Alone on a Crowded Campus** · CS 5340 Computer Human Interaction · Northeastern University · Fall 2026

Campus Connect helps off-campus and commuter students at Northeastern build real friendships. It shows small, low-commitment plans around a real activity (a study group, lunch, the gym), only on the days and hours you are actually on campus, with verified Northeastern students only. After a plan meets, the app offers to make it weekly, so one good meetup can turn into a routine.

This repository is the **T4 high-fidelity prototype**, built as a runnable web app instead of Figma. The professor approved this, provided the app is publicly shareable and we can make granular design changes ourselves.

|                      |                                                       |
| -------------------- | ----------------------------------------------------- |
| **Live prototype**   | https://campus-connect-ux-trio.vercel.app             |
| **Repository**       | https://github.com/dineshbachchani1234/campus-connect |
| **Team 12, UX Trio** | Dinesh Bachchani, Saravjit Singh, Furqan Abid         |
| **Due**              | Thursday, December 4, 2026                            |

> Best viewed on a phone. On a laptop, the app appears inside a phone-sized frame so every tester sees the same layout.

---

## Contents

1. [The problem](#the-problem)
2. [Who we design for](#who-we-design-for)
3. [Tasks the prototype supports](#tasks-the-prototype-supports)
4. [Design principles](#design-principles)
5. [Screens and routes](#screens-and-routes)
6. [From paper to web: feedback we are addressing](#from-paper-to-web-feedback-we-are-addressing)
7. [Tech stack and why](#tech-stack-and-why)
8. [Getting started](#getting-started)
9. [Running a test session](#running-a-test-session)
10. [Project structure](#project-structure)
11. [How the data works](#how-the-data-works)
12. [Team workflow](#team-workflow)
13. [Deployment](#deployment)
14. [Course context and AI use](#course-context-and-ai-use)

---

## The problem

Commuter and off-campus students come to campus for class or work and leave without meeting anyone. Our interviews (six participants) showed that friendships grow from routine and repeated contact, but long commutes, fragmented schedules and being out of step with the program's social rhythm take that away. Good first meetings fade because no one makes a next step, reaching out feels risky, event information arrives late, and existing friend apps feel like dating, feel empty, or ask for too much.

## Who we design for

**Maya Chen (she/her), the schedule-bound commuter.** Her commute decides everything. Evening events are impossible, and her connections stall at the classroom level. Her barrier is time.

**Jordan Ellis (they/them), on campus but out of sync.** Jordan lives close and is on campus all day, but their cohort scattered after co-op. Their barrier is energy and having no one to go with, not distance.

## Tasks the prototype supports

**Task 1 (primary): Find and join a plan that fits your schedule.** Open the feed, which is already filtered to your campus days and daytime hours. Open a plan to see who is going and why they are meeting, then join it.

**Task 2: Turn a one-time meetup into a recurring group.** After a plan meets, the app asks if you want to make it weekly. Accept, and it becomes a standing group in My Groups with a reminder.

**Supporting flows:** sign up and log in, create your own plan when nothing fits, add a plan to your calendar, message the group.

## Design principles

These come from our affinity diagram (11 themes) and our hierarchical task analysis.

1. **Schedule aware.** Only show plans on the student's campus days, in the daytime.
2. **Show who is going before you commit.** Verified peers, a shared class or interest.
3. **Meet around a real activity,** not a cold one to one introduction.
4. **Small and recurring over one-off.** Always offer a next step.
5. **Low stigma and safe.** Verified Northeastern students only, no home address shown, no dating app patterns.

## Screens and routes

Every screen below exists as a hand-drawn screen in our T3 paper prototype. Each one has its own route, so a tester or TA can open any screen directly.

| Screen                        | Route                     | Flow             | Owner    |
| ----------------------------- | ------------------------- | ---------------- | -------- |
| Splash / welcome              | `/`                       | Getting started  | Furqan   |
| Sign up                       | `/signup`                 | Getting started  | Furqan   |
| Log in                        | `/login`                  | Getting started  | Furqan   |
| Campus Plans (home feed)      | `/home`                   | Task 1           | Dinesh   |
| Filter sheet                  | overlay on `/home`        | Task 1           | Dinesh   |
| Plan details                  | `/plans/:planId`          | Task 1           | Saravjit |
| You're in (join confirmation) | `/plans/:planId/joined`   | Task 1           | Saravjit |
| Add to calendar               | `/plans/:planId/calendar` | Task 1           | Saravjit |
| Create a plan                 | `/create`                 | Task 1 alternate | Furqan   |
| Plan posted                   | `/create/posted/:planId`  | Task 1 alternate | Furqan   |
| Group chat                    | `/chat/:planId`           | Task 2           | Saravjit |
| After the meetup prompt       | overlay, any screen       | Task 2           | Furqan   |
| My Groups                     | `/groups`                 | Task 2           | Furqan   |
| Profile                       | `/profile`                | Supporting       | Dinesh   |

The bottom navigation (Home, Groups, Profile) appears on every signed-in screen.

## From paper to web: feedback we are addressing

We tested the paper prototype in class with four testers from four other teams. This table is the core of the design evolution section of our report. Each row links to the issue and pull request where the change was made, and the before and after screenshots live in [`docs/screenshots/before-after/`](docs/screenshots/before-after/). The running log is in [`docs/design-evolution.md`](docs/design-evolution.md).

| #   | What testers ran into                                                                                    | What we changed in the web app                                                                                                                                  |
| --- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Plans did not stand out. Testers could not tell a tappable plan from plain text.                         | Plan cards have a border, shadow, hover lift, focus ring and a chevron, and the whole card is one large tap target. Plans you joined are marked "You're going". |
| 2   | No keyboard or text entry affordance on paper.                                                           | Real text inputs with labels, placeholder text, a visible focus ring and inline error messages.                                                                 |
| 3   | No "already enrolled" state. A tester could join the same plan twice.                                    | Joined plans show "You're already in" instead of a Join button, and trying again explains why.                                                                  |
| 4   | Several actions gave no confirmation.                                                                    | Toasts, confirmation screens and visible state changes after join, post, add to calendar, send and make weekly.                                                 |
| 5   | Testers did not find "Create a plan".                                                                    | A prominent Create a plan button at the top of the feed, repeated in the empty state, without a forced tutorial.                                                |
| 6   | "Add to calendar" and "Message the group" were too close and looked the same.                            | Separate buttons with clear labels, icons and different emphasis (primary versus secondary), with space between them.                                           |
| 7   | Idea, not a usability problem: a small incentive to attend (around five dollars toward pizza or coffee). | Noted as future work in the report.                                                                                                                             |

## Tech stack and why

The grade is about interaction design, so we picked tools that let us build polished, accessible UI quickly and change any detail ourselves.

| Tool                                                                         | Why we use it                                                                                                                                   |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org) | Component based, so a PlanCard or Button is built once and reused on every screen. Types catch mistakes between teammates' code.                |
| [Vite](https://vite.dev)                                                     | Instant dev server and a static build that deploys anywhere.                                                                                    |
| [React Router](https://reactrouter.com)                                      | One URL per screen, matching the paper prototype.                                                                                               |
| [Tailwind CSS v4](https://tailwindcss.com)                                   | Styling right in the component, so small design tweaks are one line changes.                                                                    |
| [shadcn/ui](https://ui.shadcn.com) (Radix)                                   | Accessible dialogs, sheets, switches and toasts. The component code is copied into `src/components/ui`, so we own and can edit every pixel.     |
| [Zustand](https://zustand.docs.pmnd.rs)                                      | A small store for the signed-in user, plans, joined plans, groups and messages. Saved to the browser so the app remembers state between visits. |
| [Sonner](https://sonner.emilkowal.ski)                                       | Confirmation toasts (feedback 4).                                                                                                               |
| [Lucide](https://lucide.dev)                                                 | Icons.                                                                                                                                          |
| [Vercel](https://vercel.com)                                                 | Free hosting with a public link, plus a preview link for every pull request.                                                                    |
| oxlint, Prettier, GitHub Actions                                             | Same code style for all three of us, and a check on every pull request.                                                                         |

**Why no backend?** The professor confirmed only the front end matters for this prototype. A free backend host such as Render sleeps when idle and takes close to a minute to wake up, which would break a TA's first click or a live test session. Everything runs in the browser instead. All data access goes through [`src/services/api.ts`](src/services/api.ts), so a real backend could be plugged in later without touching the screens.

## Getting started

You need [Node.js](https://nodejs.org) 20.19 or newer (22 recommended) and Git.

```bash
git clone https://github.com/dineshbachchani1234/campus-connect.git
cd campus-connect
npm install
npm run dev
```

Open http://localhost:5173. To see it as a phone, open your browser's dev tools and turn on device mode (for example iPhone 14).

| Command           | What it does                                                    |
| ----------------- | --------------------------------------------------------------- |
| `npm run dev`     | Start the dev server with hot reload                            |
| `npm run build`   | Type check and build to `dist/`                                 |
| `npm run preview` | Serve the built app locally                                     |
| `npm run check`   | Type check, lint and formatting check (the same checks CI runs) |
| `npm run format`  | Auto format all files                                           |

**Adding a shadcn component:** `npx shadcn@latest add <name>`, for example `npx shadcn@latest add tabs`. It lands in `src/components/ui/`.

**Changing the look:** colors, corner radius and app width live in [`src/styles/tokens.css`](src/styles/tokens.css). Change a value there and every screen updates.

## Running a test session

For our high-fidelity user testing (3 to 5 participants).

1. Open the live link on the test phone or laptop.
2. **Reset before each participant** so everyone starts from the same state: Profile, then Reset all demo data. (A hidden demo panel with more controls is planned, see issues.)
3. The app comes with realistic sample data: six plans across the week, seven verified students, and one plan already joined (Coffee break at ISEC on Wednesday) so the "already enrolled" state can be tested.
4. **Task 2 shortcut:** you cannot wait for a real meetup to end in a test session. Open the group chat for a plan, tap "Facilitator tools" at the top of the messages, then tap "Demo: end this meetup now" (or use the demo panel) to bring up the "Make this weekly?" prompt.
5. Sign up accepts any `@northeastern.edu` address. No real account is created and nothing leaves the browser.

Testing plan, scripts and notes go in [`docs/testing/`](docs/testing/).

## Project structure

```
src/
  app/              Router, AppShell (phone frame, bottom nav, toasts), auth guard
  components/       Shared components used across screens
    ui/             shadcn/ui primitives (button, dialog, sheet, input, switch...)
    PlanCard.tsx    Tappable plan in the feed (feedback 1)
    GroupCard.tsx   Weekly group in My Groups
    FormField.tsx   Label, input, hint and error, wired for accessibility (feedback 2)
    ScreenHeader.tsx, Screen.tsx, BottomNav.tsx
    StateViews.tsx  EmptyState, ErrorState, LoadingState
    AvatarStack.tsx, VerifiedBadge.tsx
    PlaceholderScreen.tsx   Temporary stand-in until a screen is built
  screens/
    onboarding/     Splash, SignUp, LogIn
    plans/          HomeFeed, FilterSheet, PlanDetails, JoinConfirmation, AddToCalendar
    create/         CreatePlan, PlanPosted
    groups/         GroupChat, AfterMeetupPrompt, MyGroups
    profile/        Profile
  store/            useAppStore.ts, the app state and every action
  services/         api.ts, fake async layer with loading and error states
  data/             seed.ts, sample plans, people and messages
  lib/              types.ts, plans.ts (time and filter helpers), utils.ts
  hooks/            usePlan.ts
  styles/           tokens.css, design tokens
docs/
  design-evolution.md      Log of every feedback driven change
  testing/                 High fidelity test plan, notes, analysis
  screenshots/before-after Screenshots for the report
```

## How the data works

There is no server. The store in [`src/store/useAppStore.ts`](src/store/useAppStore.ts) is the app's database, and it is saved to the browser's localStorage under the key `campus-connect-v1`.

| State                | Used for                                                                    |
| -------------------- | --------------------------------------------------------------------------- |
| `user`               | Signed in or not, campus days, time windows, classes                        |
| `plans`              | Everything in the feed, including plans you create                          |
| `joinedPlanIds`      | Drives the "You're going" badge and the already enrolled state (feedback 3) |
| `groups`             | Weekly groups in My Groups                                                  |
| `messages`           | Group chat                                                                  |
| `filters`            | Days, times and activities shown in the feed                                |
| `meetupPromptPlanId` | When set, the "Make this weekly?" prompt opens                              |
| `demo`               | Force an empty feed or a network error to show those states                 |

Main actions: `signUp`, `logIn`, `joinPlan` (returns `joined`, `already-joined` or `full`), `createPlan`, `sendMessage`, `endMeetup`, `makeWeekly`, `setReminder`, `resetAll`.

## Team workflow

Full details in [CONTRIBUTING.md](CONTRIBUTING.md). The short version:

1. Pick an issue assigned to you on the project board.
2. Create a branch: `feat/<area>-<thing>`, for example `feat/plans-details-join`.
3. Open a pull request into `main`. Vercel posts a preview link on it.
4. A teammate reviews it on the preview link. CI must pass.
5. Squash and merge. `main` deploys to the live link automatically.

Nobody pushes straight to `main`.

## Deployment

The app is a static site hosted on Vercel and connected to this repository.

- Every push to `main` updates the live link.
- Every pull request gets its own preview link.
- [`vercel.json`](vercel.json) sends every path to `index.html`, so opening `/plans/snell-study` directly or refreshing works.

Production URL: https://campus-connect-ux-trio.vercel.app (hosted on Dinesh's personal Vercel account, deployment protection off so anyone can open it).

To deploy by hand: `npx vercel` (preview) or `npx vercel --prod` (live).

## Course context and AI use

This is the T4 High Fidelity Prototyping deliverable for CS 5340 at Northeastern, building on our I2 qualitative research (six interviews), T2 affinity diagram, personas and task analysis, the T3 paper prototype, and in-class low fidelity testing. Course documents, interview transcripts and reports are kept out of this public repository to protect participants' privacy.

**AI use disclosure.** We used Claude (Anthropic) as a coding assistant to set up the project, scaffold components and draft documentation. The research, design decisions, testing and the report are our own work, and every change was reviewed by a team member.
