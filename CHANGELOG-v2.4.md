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

## Stats
- 1,699 → 1,887 lines (+188 lines, +11%)
- 6 features/fixes in this release
- Syntax validated ✅
