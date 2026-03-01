# v2.7 Changelog

## New Features

### 🔍 Batch Truncation Detection & Recovery
**Problem:** The batch endpoint (`/conversations/batch`) intermittently returns incomplete mapping trees. Cross-examination found 143 conversations with missing messages — 6,798 messages lost total — with no warning to the user.

**Fix:** After batch download completes, a new truncation detection pass scans every conversation for suspicious patterns:
- Conversations with mapping nodes but zero extractable messages
- Month+ conversations with fewer than 40 mapping nodes
- Week+ conversations with fewer than 20 nodes
- Multi-day conversations with fewer than 4 messages

Flagged conversations are automatically re-fetched via the single-conversation endpoint (`GET /conversation/{id}`). If the single endpoint returns more data, the batch result is replaced with the complete version.

**Recovery metadata preserved per conversation:**
- `_truncation_recovered: true` — marks conversations that were recovered
- `_batch_node_count` — original node count from batch endpoint
- `_batch_message_count` — original message count before recovery

**Reporting:**
- Progress log: `Truncation check: 4 conversation(s) flagged, re-fetching…`
- Recovery log: `Recovered: [title] (15 → 96 messages)` for each recovered conversation
- Completion summary includes recovery count: `(3 recovered from truncation)`
- Clean pass log: `Truncation check: all 4 verified OK`

**Rate limit handling:** If rate-limited during re-fetch, waits 30s and retries automatically.

### 📊 Mapping Node Count Tracking
- `_mapping_node_count` field added to every exported conversation
- Records the number of nodes in the conversation's mapping tree
- Enables post-export analysis and future truncation detection improvements

## Version Bumps
- `migrate.js` header → v2.7
- Panel UI badge → v2.7
- Export JSON `tool` field → v2.7
- Export `format_version` → 7
- Memory export header → v2.7
- Instructions export header → v2.7

## Stats
- 2,284 → 2,391 lines (+107 lines, +5%)
- Syntax validated ✅

---

# v2.6 Changelog

## Bug Fixes

### 🔧 Project Discovery Overhaul — "The Kylie Bug"
**Root cause:** Project conversations were silently dropped because the only API discovery endpoint (`/gizmos/discovery/mine`) returns HTTP 404 on Plus (personal) accounts. The DOM scraping fallback used a single CSS selector that only caught projects visible in the sidebar — typically 1 out of 16+.

**Impact:** Up to ~60% of conversations silently missing from export. On the reporting account: 534 out of 926 conversations dropped with no warning.

**Fix:** Replaced 3-method discovery with 5-method cascade:
- **Method 1: Conversation scan** — scans fetched conversations for `gizmo_id` fields (existing, improved)
- **Method 2: `/projects` API** — NEW, tries the projects index endpoint
- **Method 3: `/gizmos/discovery/mine` API** — existing gizmos endpoint
- **Method 4: DOM scraping** — now uses 5 CSS selectors for resilience against ChatGPT UI changes, plus a deep fallback that scans ALL anchor elements for `g-p-` patterns
- **Method 5: `__NEXT_DATA__` scan** — NEW, extracts project IDs from Next.js app state embedded in the page

**Additional improvements:**
- **Cross-discovery during fetch** — when fetching conversations from a known project, any new `gizmo_id` values found are added to the discovery queue automatically. Projects can now discover other projects.
- **Discovery method logging** — log shows which methods found projects: "Found 16 project(s) via conversation scan + DOM + __NEXT_DATA__"
- **API 404 warning** — when both API endpoints return 404, a visible warning appears
- **Smart hint** — if no projects found but conversations contain project references, suggests scrolling sidebar to load projects into DOM
- **Per-project summary totals** — "Projects total: 534 new conversations from 16 project(s)"

**Credit:** Bug discovered and diagnosed by [KylieKat17](https://github.com/KylieKat17/Migration-Kit-Discrepancy-Audit)

## Version Bumps
- `migrate.js` header → v2.6
- Panel UI badge → v2.6
- Export JSON `tool` field → v2.6
- Export `format_version` → 6
- Memory export header → v2.6
- Instructions export header → v2.6

## Stats
- 2,159 → 2,284 lines (+125 lines, +6%)
- Syntax validated ✅

---

# v2.5 Changelog

## New Features

### 📦 Archived Conversations Export
- Scans `/conversations?is_archived=true` endpoint to discover archived conversations
- Paginated scan with progress logging: `Archived: 24 fetched (page 1)`
- Deduplication: archived conversations already in main list are tagged, not duplicated
- Appears as "📦 Archived" in the source filter panel
- Smart filename: `chatgpt_archived_conversations.json` when exporting only archived
- `archived: true` flag preserved in export JSON per conversation
- Resolves reports of 50%+ missing conversations from users who archive aggressively

### 📊 Improved Scan Summary
- Breakdown now shows all source categories: "3,373 main + 24 archived + 1 from 1 project + 3 shared"
- Only shown when multiple sources detected

## Bug Fixes

### Archived Conversations Were Silently Excluded
- Root cause: default `/conversations` endpoint excludes archived conversations without any indication
- The `total` field in API responses is unreliable (returns page count, not grand total)
- Discovery: `is_archived` field exists on every conversation object but was never checked
- Two user reports confirmed the gap: ~600 missing (KylieKat17) and ~950 missing (Actual-Air1296)

## Version Bumps
- `migrate.js` header → v2.5
- Panel UI badge → v2.5
- Export JSON `tool` field → v2.5
- Export `format_version` → 5
- Memory export header → v2.5
- Instructions export header → v2.5

## Stats
- 2,073 → 2,159 lines (+86 lines, +4%)
- Syntax validated ✅

---

# v2.4 Changelog

## New Features

### 🔍 Search-Powered Selective Export
- Search box in filter panel — type a keyword to filter conversations by title
- Live filtering as you type, updates count and download button instantly
- Export only conversations about "python" or "work" instead of all 3,000+

### 🔗 Shared Conversations Export
- Discovers and exports conversations you've shared publicly
- Scans `/shared_conversations` endpoint with pagination
- Appears as "🔗 Shared conversations" in the source filter
- Downloads via `/share/{id}` endpoint (separate from batch flow)
- Deduplication: shared conversations already in main list are tagged, not duplicated
- Smart filename: `chatgpt_shared_conversations.json` when exporting only shared

### 🧠 Enhanced Memory Export
- Now uses `include_memory_entries=true` parameter for complete memory data
- Memories tagged as **warm** (active) or **cold** (older/less relevant)
- Sorted: warm memories first, cold memories last with `[older/less relevant]` tag
- Export header shows token usage: "Tokens used: 9,323 / 5,000,000"
- Completion shows breakdown: "203 memories (199 active, 4 older)"

### ⚙️ Full Profile Export
- Instructions export now includes beta features and model configuration
- New endpoints: `/settings/beta_features`, `/models`
- Captures personality traits, disabled tools, and feature flags
- Gives Claude complete context about your ChatGPT setup

### 🔍 Account Detection
- Detects account type at authentication via `/accounts/check/v4-2023-04-27`
- Logs "Account: Plus (personal)" or "Account: Teams (workspace)" at startup
- Extracts plan_type, structure, workspace_type, organization_id, HIPAA compliance
- Account features list captured (entitlements differ from beta_features flags)
- Workspace detection warns when Teams/Business/Enterprise account found
- Account info included in conversation export JSON for import context

### 📊 Expanded Instructions Export
- 3 new endpoints added to instructions export:
  - `/accounts/check` — full account structure, plan type, features, entitlements
  - `/codex/usage` — rate limits, credits, plan info for Codex agent
  - `/compliance` — registration country, cookie/age verification status
- Instructions export now captures 7 endpoints total (was 4)

### 💾 Conversation Metadata
- `memory_scope` field preserved per conversation (e.g. "global_enabled")
- `is_do_not_remember` flag preserved — identifies conversations opted out of memory

### 📷 Desktop Camera Toggle
- One-click toggle to enable/disable webcam input on desktop ChatGPT
- Reads current `video_screen_sharing` beta flag state on panel load
- Toggles via `POST /backend-api/settings/beta_features?feature=video_screen_sharing`
- Status indicator shows ON/OFF with color coding
- Instruction note after toggle: "Refresh the page (F5) to see the camera icon"
- Hides during scan/filter mode to avoid UI clutter
- **Chromium only** (Chrome, Brave, Edge) — Firefox sets the API flag but ChatGPT doesn't render the camera icon

### 🦊 Firefox Console Paste
- Full bookmarklet (93KB) exceeds Firefox's ~65KB bookmark URL limit
- External script loader blocked by ChatGPT's Content-Security-Policy (`connect-src` whitelist)
- Firefox tab now directs users to console paste method with dedicated copy button
- Includes `allow pasting` instruction for Firefox's paste protection

## Bug Fixes

### Shared Conversations Progress & Performance
- Added progress logging during shared conversations scan — was silent "Checking shared conversations..." with no updates
- Each page now logs: `Shared: 200 unique fetched (page 3)` with live status bar update
- Fixed infinite pagination loop — `while (sharedItems.length >= 100)` checked total count (always true after page 1), now checks last page size
- Added cycle detection — if >50% of a page contains IDs already seen, stops pagination (API was returning duplicate/global items)
- Added hard cap of 50 pages (5,000 items) to prevent runaway pagination
- Inline dedup during fetch — duplicate shared items skipped before accumulating
- Fixed O(n²) dedup for tagging shared items in main list — now O(1) hash map lookup
- Better completion log: `Shared conversations: 500 found (3 unique, 497 already in main)`

### Log Output Fix
- Fixed missing visual separation between log entries
- "No projects foundReady." → proper line breaks with 1px padding

## Version Bumps
- `migrate.js` header → v2.4
- Panel UI badge → v2.4
- Export JSON `tool` field → v2.4
- Export `format_version` → 4
- Memory export header → v2.4
- Instructions export header → v2.4
- Firefox tab → console paste with dedicated copy button

## Stats
- 1,699 → 2,073 lines (+374 lines, +22%)
- 12 features/fixes in this release
- Syntax validated ✅
