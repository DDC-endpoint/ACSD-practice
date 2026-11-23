#!/usr/bin/env bash
# Whole-pack self-check (spec AC-1..AC-4, AC-6, AC-7/8 via exam tests, AC-11).
# Run from anywhere:  bash scripts/selfcheck.sh
# Checks the current branch (starters) and the `solutions` branch (via a temporary git worktree).
set -u
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
FAILS=0
pass() { echo "PASS  $*"; }
fail() { echo "FAIL  $*"; FAILS=$((FAILS + 1)); }

TMP="$(mktemp -d)"
WT="$TMP/solutions"
cleanup() { git -C "$ROOT" worktree remove --force "$WT" >/dev/null 2>&1; rm -rf "$TMP"; }
trap cleanup EXIT

[ -d node_modules ] || npm ci --no-fund --no-audit >/dev/null 2>&1

# ---------- AC-1: starters type-check ----------
if npx tsc --noEmit >"$TMP/tsc.log" 2>&1; then pass "AC-1 typecheck on $(git branch --show-current)"; else fail "AC-1 typecheck"; tail -20 "$TMP/tsc.log"; fi

# ---------- AC-2: every drill has >=1 failing test; no file fails to load ----------
npx vitest run --reporter=json --outputFile="$TMP/main.json" >/dev/null 2>&1
node -e '
const r = require(process.argv[1]); const byDrill = {};
let loadErr = [];
for (const f of r.testResults) {
  const m = f.name.replace(/\/g, "/").match(/drills\/(d\d\d)[^/]*\//); if (!m) continue;
  const d = (byDrill[m[1]] ??= { fail: 0, total: 0 });
  if (f.assertionResults.length === 0) loadErr.push(f.name + ": " + (f.message || "").split("\n")[0]);
  for (const a of f.assertionResults) { d.total++; if (a.status !== "passed") d.fail++; }
}
let bad = 0;
for (const [d, c] of Object.entries(byDrill).sort()) { const ok = c.fail >= 1; if (!ok) bad++; console.log((ok ? "  ok   " : "  BAD  ") + d + ": " + c.fail + "/" + c.total + " failing on starter"); }
for (const e of loadErr) { bad++; console.log("  LOAD " + e); }
process.exit(bad ? 1 : 0);
' "$TMP/main.json" && pass "AC-2 every drill starts red, all test files load" || fail "AC-2 starter red-check"

# ---------- exam tests must pass on main too (papers carry their own answers) ----------
if [ -d exam ]; then
  if npx vitest run exam >"$TMP/exam.log" 2>&1; then pass "AC-7/AC-8 exam marking tests"; else fail "AC-7/AC-8 exam marking tests"; tail -30 "$TMP/exam.log"; fi
  # AC-6: no remote resource loads in exam/
  if grep -rnE '(src|href)=["'"'"']https?://|fetch\(|@import url\(["'"'"']?https?:' exam --include='*.html' --include='*.js' --include='*.css' >"$TMP/net.log"; then fail "AC-6 remote resources in exam/"; cat "$TMP/net.log"; else pass "AC-6 exam/ loads nothing remote"; fi
  # AC-11: the word Blackboard never renders (only allowed in comments)
  if grep -rniE 'blackboard' exam --include='*.html' --include='*.js' --include='*.css' | grep -vE '^\S+:[0-9]+:\s*(//|/\*|\*|<!--)' >"$TMP/bb.log"; then fail "AC-11 'Blackboard' outside comments"; cat "$TMP/bb.log"; else pass "AC-11 no Blackboard branding"; fi
fi

# ---------- AC-3 / AC-4: solutions branch ----------
if git show-ref --verify --quiet refs/heads/solutions; then
  git worktree add -q "$WT" solutions >/dev/null 2>&1
  cp -r node_modules "$WT/" 2>/dev/null
  if (cd "$WT" && npx tsc --noEmit >"$TMP/stsc.log" 2>&1 && npx vitest run >"$TMP/stest.log" 2>&1); then pass "AC-3 solutions: typecheck + all tests green"; else fail "AC-3 solutions"; tail -30 "$TMP/stsc.log" "$TMP/stest.log"; fi
  EXTRA=$(git diff --name-only HEAD solutions | grep -vE '^drills/d[0-9]{2}-[^/]+/src/' || true)
  if [ -z "$EXTRA" ]; then pass "AC-4 solutions differs only under drills/*/src/"; else fail "AC-4 solutions touches: $EXTRA"; fi
else
  echo "SKIP  AC-3/AC-4 (no solutions branch yet)"
fi

echo
[ "$FAILS" -eq 0 ] && echo "SELFCHECK PASS" || { echo "SELFCHECK FAIL ($FAILS)"; exit 1; }
