# Changelog

All notable changes to the GPT→Claude Migration Kit.

## [2.3.0] — 2026-02-18

### Fixed
- **Projects export** — completely rewritten project discovery. Old `/backend-api/projects` endpoint was removed by OpenAI (404). Now discovers projects via sidebar DOM scraping and fetches conversations via `/backend-api/gizmos/{project-id}/conversations` with cursor-based pagination. Reported via community feedback.
- **Deduplication** — project conversations are deduplicated against main scan by conversation ID, preventing duplicates in exports.

### Added
- **Source filter** — when projects are detected, filter panel shows a "Source" section with checkboxes for `💬 Main conversations` and `📁 Project Name`, allowing export of only project conversations or everything together.
- **Scan summary breakdown** — shows "3,360 main + 1 from 1 project" when projects are found.
- **Smart filenames** — export filename adapts based on content: `chatgpt_all_conversations.json` for everything, `chatgpt_project_investing.json` for a single project, `chatgpt_projects.json` for multiple projects only.
- **Era presets** — one-click date range buttons (GPT-3.5 / GPT-4 / GPT-4o / GPT-5+) based on actual model launch dates. Lets users quickly export conversations from a specific era without knowing exact dates.

## [2.2.0] — 2026-02-16

### Added
- **Batch download engine** — uses OpenAI's undocumented `POST /backend-api/conversations/batch` endpoint to download up to 10 conversations per API call, dramatically reducing export time.
- **Automatic fallback** — if batch endpoint fails (HTTP 500/429), seamlessly falls back to individual downloads and continues.
- **Visual batch status** — progress indicator shows whether batch or individual mode is active.
- **Copy log button** — copies the full export log to clipboard for debugging.
- **Completion screen** — shows model distribution breakdown, export stats, and links to viewer/import guide after export finishes.

### Changed
- Export time reduced from ~1.5 hours to ~40 minutes for large accounts (3,000+ conversations).
- Time estimate formula updated for batch mode.
- API field handling updated for OpenAI's switch from epoch timestamps to ISO 8601 strings.
- `default_model_slug` removed from list API — model now extracted from message metadata during download.

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
