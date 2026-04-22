# GPT→Claude Migration Kit

Export everything from ChatGPT — memories, conversations, and custom instructions — and bring it to Claude.

**No extensions. No install. No data leaves your browser.**

🌐 **[Use the tool → gpt2claude.com](https://gpt2claude.com)**

---

## What it does

| Export | Description | Output file |
| --- | --- | --- |
| 🧠 **Memories** | Every fact ChatGPT memorized about you | `chatgpt_memories.md` |
| 💬 **Conversations** | Every chat including projects, with full message history, timestamps, model info | `chatgpt_all_conversations.json` |
| ⚙️ **Instructions** | Custom instructions and account settings | `chatgpt_instructions.json` |

No existing browser extension exports memory items or custom instructions. This tool does.

## Browse your export

Don't want to read raw JSON? Open the **[Conversation Viewer](https://gpt2claude.com/viewer)** in your browser. Drop any of your exported files into it:

**💬 Conversations** — drag `chatgpt_all_conversations.json`

* Browse all conversations by title and date
* Sort by newest, oldest, alphabetical, or longest
* Filter by model (GPT-4o, GPT-5, etc.)
* Search across all messages instantly
* Read conversations with rendered markdown and per-message model badges
* Browse regenerated responses with ◀ 1/3 ▶ carousel (use arrow keys!)
* Project conversations shown with project badge

**🧠 Memories** — drag `chatgpt_memories.md`

* Browse all memorized facts in a searchable list

**⚙️ Settings** — drag `chatgpt_instructions.json`

* View your custom instructions and account settings

Drop multiple files at once or load them one at a time — the viewer auto-detects file type. Everything runs locally, no data uploaded. [Download viewer.html](https://gpt2claude.com/viewer.html) and open it offline for extra privacy.

## How to use

### Option A: Bookmarklet (Chrome, Brave, Edge)

1. Visit **[gpt2claude.com](https://gpt2claude.com)**
2. Drag the **GPT→Claude Export** button to your bookmark bar
3. Go to [chatgpt.com](https://chatgpt.com) and log in
4. Click the bookmark — a floating export panel appears
5. Click the export buttons — files download automatically

### Option B: Console paste (Firefox & any browser)

1. Go to **[gpt2claude.com](https://gpt2claude.com)** and click **"Copy full script to clipboard"**
2. Go to [chatgpt.com](https://chatgpt.com) and log in
3. Press `F12` → click **Console** tab
4. Firefox only: type `allow pasting` and press Enter
5. Paste (`Ctrl+V`) and press Enter
6. The export panel appears on the page

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

## Persona Editor

The **[Persona Editor](https://gpt2claude.com/persona)** is a separate tool for power users. It processes your official OpenAI data export (Settings → Data controls → Export data) and extracts every memory operation from ChatGPT's internal bio tool chain — what was remembered, forgotten, or failed. Review, edit, then export a curated persona briefing. Memory extraction logic by [KylieKat17](https://github.com/KylieKat17/Migration-Kit-Discrepancy-Audit).

## What to expect after migrating

**Claude remembers the facts but needs time to know *you*.**

Think of it like switching doctors. The new doctor has your complete medical file — every test, every diagnosis, every note. But they don't *know* you yet. That takes a few visits.

Claude gets roughly **70% of what ChatGPT knew** from the import — all the facts, topics, and history. The remaining 30% is personal calibration: your communication style, when you want detail vs. brevity, your sense of humor. That builds naturally over a couple of weeks.

## How it works

The tool runs entirely in your browser using your existing ChatGPT login session. It calls the same internal API endpoints that the ChatGPT web app uses:

* `/api/auth/session` — gets your session token
* `/backend-api/memories` — fetches memory items
* `/backend-api/conversations` — lists all conversations
* `/backend-api/conversation/{id}` — fetches full conversation detail
* `/backend-api/user_system_messages` — fetches custom instructions

No data is sent anywhere. Files are saved directly to your Downloads folder.

## Features

**Export:**

* One-click export of all conversations, memories, and custom instructions
* Smart download filters: filter by model, date range, count limit
* Incremental export: load previous export to skip already-downloaded conversations
* 5-method project discovery cascade (fixes silent conversation loss)
* Batch downloading (10 conversations at a time)
* Truncation detection and recovery
* Archived and shared conversation export
* Rate limit handling with auto-retry

**Viewer:**

* Tabbed interface: 💬 Chats · 🧠 Memories · ⚙️ Settings
* Multi-file drag & drop with auto-detection
* Search across all messages
* Sort by date, name, or length
* Filter by model
* Per-message model badges
* Branch/regeneration carousel with keyboard nav
* Markdown rendering
* Project badges
* Works fully offline

## Planned features

* **Browser extension** — Firefox addon first, then Chrome. Solves bookmarklet size limits and enables auto-updates.
* **Image export** — Download images (uploaded photos, DALL-E generations) referenced in conversations.
* **Import to other platforms** — Tested import prompts for Gemini, Copilot, etc.

## Requirements

* A ChatGPT account (Free, Plus, Team, or Enterprise)
* A modern browser (Chrome, Firefox, Edge, Brave)
* That's it

## Limitations

* Uses undocumented OpenAI endpoints that may change without notice
* Large accounts (1000+ conversations) may take 15-30 minutes
* Rate limiting may occur — the tool handles this automatically with retry logic
* This tool is not affiliated with OpenAI or Anthropic
* OpenAI's Terms of Use prohibit automated data extraction — see [our FAQ](https://gpt2claude.com/#faq) for details

## Contributing

Found a bug? Endpoint changed? PRs welcome. This is a community tool.

## License

MIT — do whatever you want with it.

---

**Built with [Claude](https://claude.ai) by [Siamsnus](https://www.siamsnus.com)** · **[gpt2claude.com](https://gpt2claude.com)**
