# GPT→Claude Migration Kit

Export everything from ChatGPT — memories, conversations, and custom instructions — and bring it to Claude.

**No extensions. No install. No data leaves your browser.**

🌐 **[Use the tool →](https://siamsnus.github.io/GPT2Claude-Migration-Kit)**

---

## What it does

| Export | Description | Output file |
|--------|-------------|-------------|
| 🧠 **Memories** | Every fact ChatGPT memorized about you | `chatgpt_memories.md` |
| 💬 **Conversations** | Every chat with full message history, timestamps, model info | `chatgpt_all_conversations.json` |
| ⚙️ **Instructions** | Custom instructions and account settings | `chatgpt_instructions.json` |

No existing browser extension exports memory items or custom instructions. This tool does.

## How to use

### Option A: Bookmarklet (easiest)
1. Visit the [landing page](https://siamsnus.github.io/GPT2Claude-Migration-Kit)
2. Drag the **GPT→Claude Export** button to your bookmark bar
3. Go to [chatgpt.com](https://chatgpt.com) and log in
4. Click the bookmark — a floating export panel appears
5. Click the export buttons — files download automatically

### Option B: Console paste (if bookmarklet doesn't work)
1. Go to the [landing page](https://siamsnus.github.io/GPT2Claude-Migration-Kit) and click **"Copy full script to clipboard"**
2. Go to [chatgpt.com](https://chatgpt.com) and log in
3. Press `F12` → click **Console** tab
4. Paste (`Ctrl+V`) and press Enter
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
- `/backend-api/memories` — fetches memory items
- `/backend-api/conversations` — lists all conversations
- `/backend-api/conversation/{id}` — fetches full conversation detail
- `/backend-api/user_system_messages` — fetches custom instructions

No data is sent anywhere. Files are saved directly to your Downloads folder.

## Requirements

- A ChatGPT account (Free, Plus, Team, or Enterprise)
- A modern browser (Chrome, Firefox, Edge, Brave)
- That's it

## Limitations

- Uses undocumented OpenAI endpoints that may change without notice
- Large accounts (1000+ conversations) may take 15-30 minutes
- Large exports may need to be zipped before uploading to Claude (right-click → compress)
- Rate limiting may occur — the tool handles this automatically with retry logic
- This tool is not affiliated with OpenAI or Anthropic

## Why this exists

OpenAI retired GPT-4o without a migration path. Many users lost years of context, memories, and conversation history with no way to export their data to another platform.

Existing browser extensions can export conversations as formatted text, but none of them export **memory items** (the facts ChatGPT learned about you), **custom instructions**, or **message-level metadata** (timestamps, model used, role attribution). This tool exports everything — the actual data structures needed for a real migration, not just a printout.

Your data. Your choice where it lives.

## Contributing

Found a bug? Endpoint changed? PRs welcome. This is a community tool.

## License

MIT — do whatever you want with it.

---

**Built with [Claude](https://claude.ai) by [Siamsnus](https://www.siamsnus.com)**
