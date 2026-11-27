# Contributing

How the three of us work on Campus Connect without stepping on each other.

## First time setup

```bash
git clone https://github.com/dineshbachchani1234/campus-connect.git
cd campus-connect
npm install
npm run dev
```

Recommended VS Code extensions: Tailwind CSS IntelliSense, Prettier, oxc.

## Every task

1. **Pick your issue** on the project board and move it to In progress.
2. **Update main and branch off it**
   ```bash
   git checkout main
   git pull
   git checkout -b feat/plans-details-join
   ```
   Branch names: `feat/<area>-<thing>` for new work, `fix/<area>-<thing>` for bugs, `design/<area>-<thing>` for small visual tweaks.
3. **Build it.** Replace the `PlaceholderScreen` in your screen with the real UI. Reuse the shared components in `src/components/` before making new ones.
4. **Check it**
   ```bash
   npm run format
   npm run check
   ```
5. **Commit and push**
   ```bash
   git add .
   git commit -m "Plan details: who is going and join button"
   git push -u origin feat/plans-details-join
   ```
6. **Open a pull request** into `main` and fill in the template. Add `Closes #<issue number>`. If it addresses in-class feedback, say which number and add a before and after screenshot.
7. **Ask a teammate to review** on the Vercel preview link. Fix what they find.
8. **Squash and merge** once CI is green and it is approved. Delete the branch.

## Rules of thumb

- Never push straight to `main`. It is protected.
- Keep pull requests small, one screen or one component each. Small PRs get reviewed fast.
- If you change a shared component (`PlanCard`, `Button`, `FormField`...), say so in the PR, since it affects everyone's screens.
- If you need new state or a new action, add it to `src/store/useAppStore.ts` and mention it in the PR.
- New colors or sizes go in `src/styles/tokens.css`, not hard coded in a screen.
- Every screen needs a way forward and a way back, and handles its empty or error state.
- Write UI text in plain, friendly words. No jargon.

## Design checklist before you open a PR

- Works at phone width (375px) and inside the desktop phone frame
- Every tappable thing looks tappable and is at least 44px tall
- You can reach every control with Tab and see the focus ring
- Each action gives visible feedback (toast, new screen or state change)
- Text inputs have a label, and errors appear under the field

## Getting unstuck

Post in the team chat with a screenshot and the branch name. If Git gets messy, do not force push to a shared branch; ask first.
