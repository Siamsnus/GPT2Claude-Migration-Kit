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

### 📷 Desktop Camera Toggle
- One-click toggle to enable/disable webcam input on desktop ChatGPT
- Reads current `video_screen_sharing` beta flag state on panel load
- Toggles via `POST /backend-api/settings/beta_features?feature=video_screen_sharing`
- Status indicator shows ON/OFF with color coding
- Instruction note after toggle: "Refresh the page (F5) to see the camera icon"
- Hides during scan/filter mode to avoid UI clutter

### 🦊 Firefox Console Paste
- Full bookmarklet (93KB) exceeds Firefox's ~65KB bookmark URL limit
- External script loader blocked by ChatGPT's Content-Security-Policy (`connect-src` whitelist)
- Firefox tab now directs users to console paste method with dedicated copy button
- Includes `allow pasting` instruction for Firefox's paste protection

## Bug Fixes

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
- 1,699 → 1,992 lines (+293 lines, +17%)
- 8 features/fixes in this release
- Syntax validated ✅
