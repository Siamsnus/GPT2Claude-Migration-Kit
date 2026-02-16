# Changelog

All notable changes to the GPT→Claude Migration Kit.

## [2.2.0] — 2026-02-16

### Added
- **⚡ Batch download engine** — uses undocumented `/conversations/batch` POST endpoint to download 10 conversations per request instead of one-by-one. Reduces a 3,357 conversation export from ~1.4 hours to ~6 minutes. Automatically falls back to individual downloads if batch endpoint is unavailable.
- **Model breakdown on completion** — completion screen now shows model distribution (e.g. "gpt-4o (1200), gpt-5-2 (800)") since models are extracted from message metadata during download
- **Elapsed time on completion** — shows total export duration
- **Batch/individual mode indicator** — shows ⚡ or 🐢 during download so user knows which mode is active
- **Scan hero UI** — big animated counter (42px, pulsing), bouncing dots, "conversations found" label, reassurance text during scan
- **Download progress hero** — clean counter showing "87 / 154", current conversation title, progress bar with percentage, real-time "~X minutes remaining" estimate
- **Completion screen** — ✅ checkmark, "Export Complete!" with conversation count and file size, "What's next?" card linking to Conversation Viewer and import guide
- **Copy Log button** — copies full log text to clipboard (with execCommand fallback for older browsers)
- **Scan summary header** — filter panel now shows big green count of total conversations scanned

### Fixed
- **OpenAI API field changes** — `default_model_slug` removed from list API, timestamps changed from epoch numbers to ISO 8601 strings. Added `getConvoModel()` and `getConvoTime()` helpers that try multiple field names and handle both formats.
- **`addEventListener` null crash** — after scan completes, projects returning 404 could cause `showFilterPanel()` to crash when wiring event listeners on elements not yet in the DOM. Added `safeAddEvent()` helper with null guards and warning logs.
- **"0 conversations selected" bug** — filter now fails-open: returns all conversations if no model checkboxes found. Date filter skips conversations with no valid timestamp instead of filtering them out. Whole function wrapped in try/catch.
- **Diagnostic logging** — first batch now logs `API fields:`, `Sample model:`, `Sample time:` to help debug future API changes
- DOM insertion fallback — filter panel insertion now tries `progressEl.parentNode` first, falls back to `bodyEl.appendChild`
- Button hiding now uses loop with null guards instead of direct access
- All DOM updates in download progress use null guards to prevent crashes

### Changed
- Scan counter uses `.toLocaleString()` for thousand separators
- Scan status messages improved: "Still scanning — this takes a minute, all good"
- Project scan messages use proper ellipsis character (…)
- Model tags use updated pill styling with SF Mono font, centered layout with top border separator

## [2.1.0] — 2026-02-16

### Added
- **Conversation Viewer** (`viewer.html`) — browse, search, and read exported conversations in a chat-like interface. Works offline.
- **Model filter** — dropdown in viewer to filter conversations by actual models used in messages (not just conversation-level tag)
- **Per-message model badge** — each AI response shows which model generated it (e.g. gpt-4o, gpt-5.2)
- **Memories viewer tab** — drag chatgpt_memories.md into the viewer to browse and search all your memories
- **Instructions viewer tab** — drag chatgpt_instructions.json to see your custom instructions and account settings
- **Multi-file support** — drag multiple files at once or load them one at a time; auto-detects file type
- **Branch/regeneration carousel** — messages with regenerated responses show ◀ 1/3 ▶ navigation to browse alternatives
- **Branch detection** — conversations with regenerations show 🔀 icon in sidebar, stats show count
- **Keyboard navigation** — left/right arrow keys cycle through regenerated responses
- **Old export banner** — detects exports without branch data and suggests re-exporting with latest tool
- **First-branch highlight** — subtle pulse animation on first branched message when opening a conversation
- **Export format v3** — migrate.js now preserves the full conversation tree including all regenerated responses
- **Smart download filters** — scan first, then choose what to download:
  - Filter by model (checkboxes with counts)
  - Date range picker
  - Max conversation limit
  - **Incremental export** — load previous export to skip already-downloaded conversations
  - Time estimate shown before download starts
- **Per-alternative model badges** — carousel shows which model generated each alternative
- **Version footer** — shows viewer version and export tool version for debugging
- **Tab navigation** — sidebar switches between 💬 Chats, 🧠 Memories, ⚙️ Settings with badge counts
- **"Load more files" button** — add files after initial load without reloading the page
- **Project export** — conversations inside ChatGPT Projects are now included in the export, tagged with project name
- **Markdown rendering** — viewer renders bold, headers, code blocks, lists, and links instead of showing raw markdown
- **Image placeholders** — image references in conversations show an inline SVG placeholder with description instead of a blank gap
- **Metadata filtering** — internal system messages (model_editable_context, etc.) are hidden in the viewer
- **Loading progress** — file size and progress bar when loading large JSON files into the viewer
- **Privacy note** — viewer includes download link for offline use

### Fixed
- Date sorting (newest/oldest) now works when timestamps are null or strings
- Sidebar previews show first user message instead of hidden system messages
- Search skips metadata messages

### Changed
- Export now captures image references as `[🖼 DALL-E: prompt]` or `[🖼 image]` markers instead of silently dropping them
- Landing page rebuilt with updated bookmarklet

## [2.0.0] — 2026-02-15

### Added
- **Export All button** — exports memories, instructions, and conversations in one click
- **Browser-aware landing page** — auto-detects Chrome/Firefox/other and shows appropriate installation instructions
- **Firefox support** — manual bookmark creation flow with copy button (Firefox strips `javascript:` from dragged links)
- **Console paste method** — copy full script for any browser via F12 → Console
- All external links (chatgpt.com, claude.ai) now clickable and open in new tabs

### Fixed
- 404 handling for `/backend-api/settings` — logs "not available (skipped)" instead of error
- CSP bypass — entire script embedded inline in bookmarklet URL, no external fetches

### Changed
- Panel UI: lighter background, more spacing, larger buttons, thicker progress bar
- Bookmarklet fully self-contained (no external script loading)

## [1.0.0] — 2026-02-14

### Added
- Initial release
- Export memories via `/backend-api/memories`
- Export all conversations via `/backend-api/conversations` + `/backend-api/conversation/{id}`
- Export custom instructions via `/backend-api/user_system_messages`
- Floating export panel with progress bar and log
- Draggable panel with close button
- Rate limit handling with automatic retry
- Claude import prompts in README
