#!/bin/sh
# Installs the apple-design skill (Apple Human Interface Guidelines) for Claude Code
# into ~/.claude/skills/apple-design. It is not committed to this repo because it
# contains Apple's guideline text.
#
# Pinned to the version the team reviewed. To update, change COMMIT after reading the diff.
#
# Usage: npm run setup:skills
set -eu

REPO="https://github.com/dickwu/apple-design-skill"
COMMIT="ab027f02f51572fcf494cbc182dd26b888a1d2bd"
DEST="$HOME/.claude/skills/apple-design"

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo "Downloading apple-design skill ($COMMIT)..."
git clone --quiet "$REPO" "$TMP/apple-design-skill"
git -C "$TMP/apple-design-skill" checkout --quiet "$COMMIT"

mkdir -p "$DEST"
rm -rf "$DEST/references"
# Only the instructions and the guideline pages. The repo's scripts are not needed for reviews.
cp -R "$TMP/apple-design-skill/SKILL.md" "$TMP/apple-design-skill/references" "$TMP/apple-design-skill/LICENSE" "$DEST/"
echo "source: $REPO @ $COMMIT" > "$DEST/SOURCE.txt"

echo "Installed to $DEST"
echo "The project skill campus-connect-ui is already in this repo (.claude/skills)."
echo "Start a new Claude Code session so it picks up both skills."
