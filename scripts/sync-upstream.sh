#!/usr/bin/env bash
# Pull BentoPDF upstream changes into ClassPDF without being a git fork.
# ClassPDF is a standalone repo cut from BentoPDF; its history is unrelated to
# upstream, so we cherry-pick upstream's new commits rather than merge histories.
# The last synced upstream SHA lives in .upstream-sync.
#
# Usage: scripts/sync-upstream.sh          # cherry-picks new upstream commits onto a branch
set -euo pipefail
cd "$(dirname "$0")/.."

UPSTREAM_URL="https://github.com/alam00000/bentopdf.git"
MARKER=".upstream-sync"
LAST="$(tr -d '[:space:]' < "$MARKER")"

git remote get-url upstream >/dev/null 2>&1 || git remote add upstream "$UPSTREAM_URL"
git fetch upstream --quiet
HEAD_SHA="$(git rev-parse upstream/main)"

if [ "$LAST" = "$HEAD_SHA" ]; then
  echo "Already up to date with upstream ($HEAD_SHA)."
  exit 0
fi

echo "New upstream commits since last sync ($LAST):"
git log --format='  %h %s' "$LAST"..upstream/main
echo

BRANCH="sync/upstream-$(git log -1 --format=%cd --date=format:%Y-%m-%d upstream/main)"
git checkout -b "$BRANCH"
# Oldest-first so patches apply in order. Conflicts land in rebranded files
# (index.html, README, css, locales, favicons) — resolve by keeping ClassPDF's
# branding and taking upstream's logic, then `git cherry-pick --continue`.
git cherry-pick "$LAST"..upstream/main

echo "$HEAD_SHA" > "$MARKER"
git add "$MARKER"
git commit -m "chore: record upstream sync marker $HEAD_SHA"

echo
echo "Done on branch $BRANCH. Run tests/build, then open a PR."
echo "  npx vitest run && npx tsc --noEmit"
