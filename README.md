# GPT→Claude Migration Kit

Export everything from ChatGPT — memories, conversations, and custom instructions — and bring it to Claude.

**No extensions. No install. No data leaves your browser.**

🌐 **[Use the tool →](https://siamsnus.github.io/GPT2Claude-Migration-Kit)**

---

## What it does

| Export | Description | Output file |
|--------|-------------|-------------|
| 🧠 **Memories** | Every fact ChatGPT memorized about you, sorted by relevance (warm/cold) | `chatgpt_memories.md` |
| 💬 **Conversations** | Every chat — main, archived, projects, and shared — with full message history, timestamps, model info | `chatgpt_all_conversations.json` |
| ⚙️ **Instructions** | Custom instructions, beta features, model config, account info, Codex usage, compliance | `chatgpt_instructions.json` |

**Smart filenames:** If you use the source filter to export only a subset, the filename adapts: `chatgpt_archived_conversations.json`, `chatgpt_shared_conversations.json`, `chatgpt_project_investing.json`, etc.

No existing browser extension exports memory items, shared conversations, or custom instructions. This tool does.

## Browse your export

Don't want to read raw JSON? Open **[viewer.html](https://siamsnus.github.io/GPT2Claude-Migration-Kit/viewer.html)** in your browser. Drop any of your exported files into it:

**💬 Conversations** — drag `chatgpt_all_conversations.json`
- Browse all conversations by title and date
- Group conversations by project in the sidebar
- Sort by newest, oldest, alphabetical, or longest
- Filter by model (GPT-4o, GPT-5.2, etc.)
- Search across all messages instantly
- Jump from search results straight to the matched spot in the chat
- Read conversations with rendered markdown, tables, and per-message model badges
- Browse regenerated responses with ◀ 1/3 ▶ carousel (use arrow keys!)
- Use the right-side minimap for live position tracking, hover previews, and quick scrub/top/bottom jumps
- Project conversations shown with project badge
- Shared conversations shown with shared badge
- Archived conversations shown with archived badge
- Thinking/reasoning indicators from reasoning models
- Grouped tool activity indicators (search queries, code execution)
- Code interpreter runs and uploaded-file references shown as collapsible sections/cards

**🧠 Memories** — drag `chatgpt_memories.md`
- Browse all memorized facts in a searchable list

**⚙️ Settings** — drag `chatgpt_instructions.json`
- View your custom instructions and account settings

Drop multiple files at once or load them one at a time — the viewer auto-detects file type. Everything runs locally, no data uploaded. Download `viewer.html` and open it offline for extra privacy.

## How to use

### Option A: Bookmarklet (Chrome, Brave, Edge)
1. Visit the [landing page](https://siamsnus.github.io/GPT2Claude-Migration-Kit)
2. Drag the **GPT→Claude Export** button to your bookmark bar
3. Go to [chatgpt.com](https://chatgpt.com) and log in
4. Click the bookmark — a floating export panel appears
5. Click the export buttons — files download automatically

### Option A2: Firefox
Firefox can't use the bookmarklet (exceeds Firefox's 65KB URL limit) and ChatGPT's Content Security Policy blocks external script loading. Use console paste instead:
1. Visit the [landing page](https://siamsnus.github.io/GPT2Claude-Migration-Kit) and click the **Firefox** tab
2. Go to [chatgpt.com](https://chatgpt.com) and log in
3. Press `F12` → click **Console** tab
4. If Firefox warns about pasting, type `allow pasting` and press Enter
5. Click **Copy export script** on the landing page, paste into console, press Enter

### Option B: Console paste (any browser)
1. Go to the [landing page](https://siamsnus.github.io/GPT2Claude-Migration-Kit) and click **"Copy full script to clipboard"**
2. Go to [chatgpt.com](https://chatgpt.com) and log in
3. Press `F12` → click **Console** tab
4. Paste (`Ctrl+V`) and press Enter (Firefox: type `allow pasting` first if prompted)
5. The export panel appears on the page

## Importing to Claude

Upload the exported files to [claude.ai](https://claude.ai) in this order. You can also use the **Claude desktop app** — click the **+** button at the bottom left, then **Add files or photos** (or press `Ctrl+U`).

### Step 1: Memories first
Upload `chatgpt_memories.md` with this prompt:

```
I just migrated from ChatGPT. This file contains all the facts and memories ChatGPT had stored about me. Please read through every item carefully and remember all of these facts about me. Confirm what you've learned and note if anything seems contradictory or outdated.
```

### Step 2: Conversations
Upload `chatgpt_all_conversations.json` with this prompt:

```
This is my complete ChatGPT conversation history. Please analyze it and create a structured summary: (1) Key ongoing projects or topics I frequently discussed, (2) Important decisions or conclusions we reached, (3) Any personal context like my profession, interests, communication style, and preferences, (4) Anything time-sensitive or unfinished that I should pick up.
```

**Large files:** If the JSON is too big to upload (100MB+), zip it first. Claude accepts `.zip` uploads. Right-click → Send to → Compressed (zipped) folder on Windows, or Compress on Mac.

### Step 3: Instructions
Upload `chatgpt_instructions.json` with this prompt:

```
These are my custom instructions and settings from ChatGPT. Please review them and adapt your communication style to match my preferences. Let me know what you've noted about how I like to interact.
```

### Pro tip
If you used ChatGPT mostly for casual chats and only need to migrate work-related context, just upload the memories file. That gives Claude the core facts without cluttering it with thousands of irrelevant conversations. Quality beats quantity.

## What to expect after migrating

**Claude remembers the facts but needs time to know *you*.**

Think of it like switching doctors. The new doctor has your complete medical file — every test, every diagnosis, every note. But they don't *know* you yet. They don't know you downplay pain, or that "I'm fine" means you're not. That takes a few visits.

Claude gets roughly **70% of what ChatGPT knew** from the import — all the facts, topics, and history. The remaining 30% is personal calibration: your communication style, when you want detail vs. brevity, your sense of humor, what matters most to you. That builds naturally over a couple of weeks of real conversations.

**The good news:** if you've changed since you started using ChatGPT, Claude calibrates to who you are *now*, not who you were two years ago. A fresh calibration can actually be better than inherited habits.

### Example conversations after import

```
You:   "Do you remember that sourdough recipe we worked on?"
Claude: "Yes — the one with 78% hydration and the overnight cold proof.
         You said the crust was perfect but the crumb was too dense.
         We were going to try autolyse next. Want to tweak it?"

You:   "What was that movie you recommended?"
Claude: "You asked for sci-fi that doesn't treat the audience like idiots.
         I suggested Arrival, Primer, and Coherence. You watched Primer
         and said it melted your brain. Still haven't tried the other two."
```

Claude has access to everything you imported. Ask it about any topic from your ChatGPT history and it can find it — either from stored memory or by searching your past conversations.

## How it works

The tool runs entirely in your browser using your existing ChatGPT login session. It calls the same internal API endpoints that the ChatGPT web app uses:

- `/api/auth/session` — gets your session token
- `/backend-api/memories` — fetches memory items (with warm/cold status)
- `/backend-api/conversations` — lists all conversations
- `/backend-api/conversations?is_archived=true` — lists archived conversations
- `/backend-api/conversations/batch` — fetches up to 10 conversations at once (~10x faster)
- `/backend-api/conversation/{id}` — fetches full conversation detail (fallback)
- `/backend-api/shared_conversations` — discovers publicly shared conversations
- `/backend-api/share/{id}` — fetches shared conversation detail
- `/backend-api/gizmos/{id}/conversations` — fetches project conversations
- `/backend-api/projects` — discovers user's projects (index endpoint)
- `/backend-api/gizmos/discovery/mine` — discovers user's gizmos/projects (alternate index)
- `/backend-api/user_system_messages` — fetches custom instructions
- `/backend-api/settings/beta_features` — fetches/toggles beta feature flags
- `/backend-api/models` — fetches available model configuration
- `/backend-api/accounts/check/v4-2023-04-27` — detects account type, plan, workspace info
- `/backend-api/codex/usage` — fetches Codex agent rate limits and credits
- `/backend-api/compliance` — fetches registration country and compliance status

No data is sent anywhere. Files are saved directly to your Downloads folder.

## Requirements

- A ChatGPT account (Free, Plus, Team, or Enterprise)
- A modern browser (Chrome, Brave, Edge — drag bookmarklet; Firefox — console paste)
- That's it

## Limitations

- Uses undocumented OpenAI endpoints that may change without notice
- Large accounts (1000+ conversations) may take 15-30 minutes
- Large exports may need to be zipped before uploading to Claude (right-click → compress)
- Rate limiting may occur — the tool handles this automatically with graduated retry logic
- Firefox can't use the bookmarklet (65KB URL limit + CSP blocks external fetch) — use console paste instead
- Teams/Business/Enterprise accounts with workspace scoping may not work yet
- This tool is not affiliated with OpenAI or Anthropic

## Why this exists

OpenAI retired GPT-4o without a migration path. Many users lost years of context, memories, and conversation history with no way to export their data to another platform.

Existing browser extensions can export conversations as formatted text, but none of them export **memory items** (the facts ChatGPT learned about you), **custom instructions**, or **message-level metadata** (timestamps, model used, role attribution). This tool exports everything — the actual data structures needed for a real migration, not just a printout.

Your data. Your choice where it lives.

## Features

Everything runs in your browser — no data is sent anywhere.

**Export:**
- One-click export of all conversations, memories, and custom instructions
- Batch download engine — fetches 10 conversations at a time (~10x faster)
- Graduated retry: retry → split batch → individual fallback → resume batch
- Smart download filters: filter by model, date range, count limit
- Search filter: type a keyword to export only matching conversations
- Shared conversations: discovers and exports publicly shared chats
- Archived conversations: discovers and exports archived chats separately
- Incremental export: load previous export to skip already-downloaded conversations
- Era presets: one-click date buttons for GPT-3.5 / GPT-4 / GPT-4o / GPT-5+ eras
- Enhanced memory export with warm/cold status and token usage
- Full profile export: custom instructions, beta features, model config
- Account detection: plan type, workspace info, logged at startup
- Expanded instructions export: account structure, Codex usage, compliance (7 endpoints)
- Desktop camera toggle: enable/disable webcam input on desktop ChatGPT (Chromium only)
- Conversation metadata: memory_scope and do-not-remember flags preserved
- Project conversations included via 5-method discovery cascade
- Branch/regeneration data preserved
- Reasoning model support: thinking blocks, reasoning recaps, 7 content types
- Citation marker and image group stripping (OpenAI private-use Unicode)
- Image references captured as placeholders
- Rate limit handling with auto-retry
- Batch truncation detection: flags suspicious conversations and re-fetches via single endpoint
- Time estimate before download

**Viewer:**
- Tabbed interface: 💬 Chats · 🧠 Memories · ⚙️ Settings
- Multi-file drag & drop with auto-detection
- Search across all messages
- Search results jump to the matched section
- Sort by date, name, or length
- Sidebar project grouping for conversations
- Filter by model
- Per-message model badges
- Chat minimap with live position readout, hover previews, and quick scrub jumps
- Branch/regeneration carousel with keyboard nav
- Thinking/reasoning indicators from reasoning models
- Grouped tool activity indicators (search queries, code execution)
- File attachment cards and collapsible code-interpreter sections
- Project and shared conversation badges
- Markdown rendering with tables and improved code blocks
- Works fully offline

## Planned features

- **Teams/Business/Enterprise support** — Account detection is implemented; workspace-scoped conversations still need testing with a Teams account volunteer.
- **Project-scoped memory export** — OpenAI added siloed project memories. Export per-project memories to map to Claude Project instructions.
- **Image export** — Download images (uploaded photos, DALL-E generations) referenced in conversations. Currently the JSON contains image markers but not the actual files.
- **Browser extension** — Chrome/Firefox extension with auto-updates, toolbar icon, and no bookmarklet size limits.
- **Import to other platforms** — Tested import prompts for Gemini, Copilot, etc.
- **Statistics dashboard** — Model usage over time, conversation frequency chart in the viewer.

## Contributing

Found a bug? Endpoint changed? PRs welcome. This is a community tool.

## License

MIT — do whatever you want with it.

---

**Built with [Claude](https://claude.ai) by [Siamsnus](https://www.siamsnus.com)**
