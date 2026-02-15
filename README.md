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

### Option B: Console (if bookmarklet doesn't work)
1. Go to [chatgpt.com](https://chatgpt.com) and log in
2. Press `F12` → click **Console** tab
3. Paste this and press Enter:
```js
var s=document.createElement('script');s.src='https://raw.githubusercontent.com/Siamsnus/GPT2Claude-Migration-Kit/main/migrate.js?v='+Date.now();document.head.appendChild(s);
```

## Importing to Claude

Upload the exported files to [claude.ai](https://claude.ai) and use this prompt:

> I just migrated from ChatGPT. Please parse these files, remember the key facts about me, and summarize my most important conversations.

- **Memories** → Claude stores as persistent memory
- **Conversations** → Claude extracts key topics, decisions, and context
- **Instructions** → Claude matches your preferred interaction style

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
- Rate limiting may occur — the tool handles this automatically with retry logic
- This tool is not affiliated with OpenAI or Anthropic

## Why this exists

OpenAI retired GPT-4o without a migration path. Many users lost years of context, memories, and conversation history with no way to export their data to another platform. This tool fills that gap.

## Contributing

Found a bug? Endpoint changed? PRs welcome. This is a community tool.

## License

MIT — do whatever you want with it.

---

**Built with [Claude](https://claude.ai) by [Siamsnus](https://github.com/Siamsnus)**
