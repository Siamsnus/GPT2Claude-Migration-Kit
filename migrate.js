// GPT2Claude Migration Kit v2.0
// https://github.com/Siamsnus/GPT2Claude-Migration-Kit
// Exports ChatGPT memories, conversations, and instructions
// No data leaves your browser - everything runs locally

(function() {
  // Prevent double-loading
  if (document.getElementById("gpt2claude-panel")) {
    var existing = document.getElementById("gpt2claude-panel");
    existing.style.animation = "g2c-shake 0.3s ease-in-out";
    setTimeout(function() { existing.style.animation = ""; }, 300);
    return;
  }

  // ========== STYLES ==========
  var style = document.createElement("style");
  style.textContent = "\
    @keyframes g2c-fadein { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }\
    @keyframes g2c-shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }\
    @keyframes g2c-spin { to { transform: rotate(360deg); } }\
    @keyframes g2c-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }\
    #gpt2claude-panel { position: fixed; top: 50%; right: 24px; transform: translateY(-50%); width: 360px; background: #1a1a1f; border: 1px solid #333340; border-radius: 16px; box-shadow: 0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06); z-index: 999999; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #e8e8ec; animation: g2c-fadein 0.3s ease-out; }\
    #gpt2claude-panel * { box-sizing: border-box; margin: 0; padding: 0; }\
    .g2c-header { display: flex; justify-content: space-between; align-items: center; padding: 18px 22px 14px; border-bottom: 1px solid #2a2a35; background: #1e1e24; border-radius: 16px 16px 0 0; }\
    .g2c-title { font-size: 15px; font-weight: 700; letter-spacing: -0.01em; }\
    .g2c-title span.gpt { color: #a0a0e0; }\
    .g2c-title span.arrow { color: #555; margin: 0 4px; }\
    .g2c-title span.claude { color: #d4a574; }\
    .g2c-version { font-size: 10px; color: #666; font-weight: 600; margin-top: 2px; }\
    .g2c-close { background: none; border: none; color: #777; font-size: 20px; cursor: pointer; padding: 4px 8px; border-radius: 6px; line-height: 1; }\
    .g2c-close:hover { background: #252530; color: #e8e8ec; }\
    .g2c-body { padding: 18px 22px 14px; }\
    .g2c-btn { width: 100%; padding: 14px 16px; border: 1px solid #333340; border-radius: 12px; background: #222228; color: #e8e8ec; font-size: 13px; font-weight: 600; cursor: pointer; text-align: left; margin-bottom: 10px; display: flex; align-items: center; gap: 12px; transition: all 0.15s ease; position: relative; overflow: hidden; }\
    .g2c-btn:hover { background: #2a2a32; border-color: #444450; transform: translateY(-1px); }\
    .g2c-btn:active { transform: translateY(0); }\
    .g2c-btn.running { pointer-events: none; border-color: #d4a574; }\
    .g2c-btn.done { border-color: #7eb8a0; }\
    .g2c-btn.error { border-color: #e07070; }\
    .g2c-btn-icon { font-size: 20px; width: 28px; text-align: center; flex-shrink: 0; }\
    .g2c-btn-text { flex: 1; }\
    .g2c-btn-sub { font-size: 11px; color: #777; font-weight: 400; margin-top: 3px; }\
    .g2c-progress { margin-top: 10px; }\
    .g2c-progress-bar { width: 100%; height: 5px; background: #252530; border-radius: 3px; overflow: hidden; }\
    .g2c-progress-fill { height: 100%; background: linear-gradient(90deg, #d4a574, #e8c49a); border-radius: 3px; transition: width 0.3s ease; width: 0%; }\
    .g2c-progress-text { font-size: 11px; color: #999; margin-top: 6px; }\
    .g2c-log { margin-top: 14px; max-height: 140px; overflow-y: auto; background: #141418; border: 1px solid #252530; border-radius: 10px; padding: 10px 12px; font-family: 'SF Mono', 'Consolas', monospace; font-size: 11px; line-height: 1.6; color: #999; display: none; }\
    .g2c-log.visible { display: block; }\
    .g2c-log-entry { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\
    .g2c-log-entry.error { color: #e07070; }\
    .g2c-log-entry.success { color: #7eb8a0; }\
    .g2c-footer { padding: 14px 22px; border-top: 1px solid #252530; display: flex; justify-content: space-between; align-items: center; }\
    .g2c-footer-text { font-size: 10px; color: #555; }\
    .g2c-footer-link { font-size: 10px; color: #d4a574; text-decoration: none; }\
    .g2c-footer-link:hover { text-decoration: underline; }\
    .g2c-spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid #444; border-top-color: #d4a574; border-radius: 50%; animation: g2c-spin 0.6s linear infinite; }\
    .g2c-toggle-log { background: none; border: none; color: #666; font-size: 11px; cursor: pointer; padding: 6px 0; margin-top: 10px; }\
    .g2c-toggle-log:hover { color: #aaa; }\
    .g2c-drag-handle { cursor: move; }\
    .g2c-divider { height: 1px; background: #2a2a35; margin: 6px 0 10px; }\
  ";
  document.head.appendChild(style);

  // ========== PANEL HTML ==========
  var panel = document.createElement("div");
  panel.id = "gpt2claude-panel";
  panel.innerHTML = '\
    <div class="g2c-header g2c-drag-handle">\
      <div>\
        <div class="g2c-title"><span class="gpt">GPT</span><span class="arrow">\u2192</span><span class="claude">Claude</span></div>\
        <div class="g2c-version">Migration Kit v2.0</div>\
      </div>\
      <button class="g2c-close" id="g2c-close">\u00D7</button>\
    </div>\
    <div class="g2c-body">\
      <button class="g2c-btn" id="g2c-btn-memory">\
        <div class="g2c-btn-icon">\uD83E\uDDE0</div>\
        <div class="g2c-btn-text">\
          Export Memories\
          <div class="g2c-btn-sub">Facts ChatGPT learned about you</div>\
        </div>\
      </button>\
      <button class="g2c-btn" id="g2c-btn-convos">\
        <div class="g2c-btn-icon">\uD83D\uDCAC</div>\
        <div class="g2c-btn-text">\
          Export All Conversations\
          <div class="g2c-btn-sub">Every chat with full history</div>\
        </div>\
      </button>\
      <button class="g2c-btn" id="g2c-btn-instructions">\
        <div class="g2c-btn-icon">\u2699\uFE0F</div>\
        <div class="g2c-btn-text">\
          Export Instructions\
          <div class="g2c-btn-sub">Custom instructions &amp; settings</div>\
        </div>\
      </button>\
      <button class="g2c-btn" id="g2c-btn-all" style="border-color:#d4a574;background:#222228;">\
        <div class="g2c-btn-icon">\uD83D\uDCE5</div>\
        <div class="g2c-btn-text">\
          <span style="color:#d4a574;">Export Everything</span>\
          <div class="g2c-btn-sub">All three in one click</div>\
        </div>\
      </button>\
      <div class="g2c-progress" id="g2c-progress" style="display:none;">\
        <div class="g2c-progress-bar"><div class="g2c-progress-fill" id="g2c-progress-fill"></div></div>\
        <div class="g2c-progress-text" id="g2c-progress-text"></div>\
      </div>\
      <button class="g2c-toggle-log" id="g2c-toggle-log">Show log \u25BC</button>\
      <div class="g2c-log" id="g2c-log"></div>\
    </div>\
    <div class="g2c-footer">\
      <span class="g2c-footer-text">All data stays in your browser</span>\
      <a class="g2c-footer-link" href="https://github.com/Siamsnus/GPT2Claude-Migration-Kit" target="_blank">GitHub</a>\
    </div>\
  ';
  document.body.appendChild(panel);

  // ========== DRAGGING ==========
  var isDragging = false;
  var dragOffsetX = 0;
  var dragOffsetY = 0;
  var header = panel.querySelector(".g2c-drag-handle");

  header.addEventListener("mousedown", function(e) {
    if (e.target.classList.contains("g2c-close")) return;
    isDragging = true;
    var rect = panel.getBoundingClientRect();
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;
    panel.style.transition = "none";
    e.preventDefault();
  });

  document.addEventListener("mousemove", function(e) {
    if (!isDragging) return;
    panel.style.right = "auto";
    panel.style.transform = "none";
    panel.style.left = (e.clientX - dragOffsetX) + "px";
    panel.style.top = (e.clientY - dragOffsetY) + "px";
  });

  document.addEventListener("mouseup", function() {
    isDragging = false;
    panel.style.transition = "";
  });

  // ========== HELPERS ==========
  var logEl = document.getElementById("g2c-log");
  var progressEl = document.getElementById("g2c-progress");
  var progressFill = document.getElementById("g2c-progress-fill");
  var progressText = document.getElementById("g2c-progress-text");

  function log(msg, type) {
    var entry = document.createElement("div");
    entry.className = "g2c-log-entry" + (type ? " " + type : "");
    entry.textContent = msg;
    logEl.appendChild(entry);
    logEl.scrollTop = logEl.scrollHeight;
  }

  function setProgress(pct, text) {
    progressEl.style.display = "block";
    progressFill.style.width = pct + "%";
    if (text) progressText.textContent = text;
  }

  function setButtonState(btn, state, label) {
    btn.className = "g2c-btn " + state;
    var iconEl = btn.querySelector(".g2c-btn-icon");
    if (state === "running") {
      iconEl.innerHTML = '<div class="g2c-spinner"></div>';
    } else if (state === "done") {
      iconEl.textContent = "\u2705";
    } else if (state === "error") {
      iconEl.textContent = "\u274C";
    }
    if (label) {
      btn.querySelector(".g2c-btn-sub").textContent = label;
    }
  }

  function downloadFile(content, filename, type) {
    var blob = new Blob([content], {type: type || "text/plain"});
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    log("Downloaded: " + filename, "success");
  }

  var cachedToken = null;

  async function getToken() {
    if (cachedToken) return cachedToken;
    log("Authenticating...");
    var resp = await fetch("https://chatgpt.com/api/auth/session", {credentials: "include"});
    if (resp.status !== 200) {
      throw new Error("Auth failed (HTTP " + resp.status + "). Are you logged in?");
    }
    var data = await resp.json();
    if (!data.accessToken) {
      throw new Error("No token found. Please refresh chatgpt.com and try again.");
    }
    cachedToken = data.accessToken;
    log("Authenticated OK");
    return cachedToken;
  }

  // ========== EXPORT: MEMORIES ==========
  async function exportMemories() {
    var btn = document.getElementById("g2c-btn-memory");
    setButtonState(btn, "running", "Exporting...");

    try {
      var token = await getToken();

      log("Fetching memories...");
      var resp = await fetch("https://chatgpt.com/backend-api/memories", {
        credentials: "include",
        headers: {"Authorization": "Bearer " + token}
      });

      if (resp.status !== 200) {
        throw new Error("Could not fetch memories (HTTP " + resp.status + ")");
      }

      var data = await resp.json();
      var memories = data.memories || data.results || data;
      var md = "# ChatGPT Memory Export\n";
      md += "# Exported: " + new Date().toISOString() + "\n";
      md += "# Tool: GPT2Claude Migration Kit v2.0\n\n";

      var count = 0;
      if (Array.isArray(memories)) {
        count = memories.length;
        for (var i = 0; i < memories.length; i++) {
          var m = memories[i];
          var content = m.content || m.value || m.text || m.memory || JSON.stringify(m);
          md += (i + 1) + ". " + content + "\n";
        }
      } else {
        md += JSON.stringify(memories, null, 2);
      }

      log("Found " + count + " memories");
      downloadFile(md, "chatgpt_memories.md", "text/markdown");
      setButtonState(btn, "done", count + " memories exported");

    } catch (err) {
      log("Memory export failed: " + err.message, "error");
      setButtonState(btn, "error", err.message);
    }
  }

  // ========== EXPORT: CONVERSATIONS ==========
  async function exportConversations() {
    var btn = document.getElementById("g2c-btn-convos");
    setButtonState(btn, "running", "Getting conversation list...");

    try {
      var token = await getToken();
      var headers = {"Authorization": "Bearer " + token};
      var allConvos = [];
      var offset = 0;

      log("Fetching conversation list...");

      while (true) {
        var listResp = await fetch(
          "https://chatgpt.com/backend-api/conversations?offset=" + offset + "&limit=100&order=updated",
          {credentials: "include", headers: headers}
        );

        if (listResp.status !== 200) {
          throw new Error("Could not get conversations (HTTP " + listResp.status + ")");
        }

        var listData = await listResp.json();
        var items = listData.items || [];
        log("Batch: " + items.length + " conversations (offset " + offset + ")");

        for (var j = 0; j < items.length; j++) {
          allConvos.push(items[j]);
        }

        offset += items.length;
        if (items.length < 100) break;
        await new Promise(function(r) { setTimeout(r, 500); });
      }

      log("Total conversations: " + allConvos.length);
      setButtonState(btn, "running", "Downloading 0/" + allConvos.length + "...");

      var fullExport = {
        export_date: new Date().toISOString(),
        tool: "GPT2Claude Migration Kit v2.0",
        total_conversations: allConvos.length,
        conversations: []
      };

      var successCount = 0;
      var errorCount = 0;

      for (var i = 0; i < allConvos.length; i++) {
        var c = allConvos[i];
        var title = c.title || "Untitled";
        var pct = Math.round(((i + 1) / allConvos.length) * 100);

        setProgress(pct, (i + 1) + " / " + allConvos.length + " — " + title);
        setButtonState(btn, "running", "Downloading " + (i + 1) + "/" + allConvos.length + "...");

        try {
          var convoResp = await fetch(
            "https://chatgpt.com/backend-api/conversation/" + c.id,
            {credentials: "include", headers: headers}
          );

          if (convoResp.status === 429) {
            log("Rate limited, waiting 30s...", "error");
            setButtonState(btn, "running", "Rate limited — waiting 30s...");
            await new Promise(function(r) { setTimeout(r, 30000); });
            i--;
            continue;
          }

          if (convoResp.status !== 200) {
            log("Skipped: " + title + " (HTTP " + convoResp.status + ")", "error");
            errorCount++;
            fullExport.conversations.push({id: c.id, title: title, error: "HTTP " + convoResp.status});
            continue;
          }

          var detail = await convoResp.json();
          var messages = [];

          if (detail.mapping) {
            var nodeKeys = Object.keys(detail.mapping);
            var nodes = [];
            for (var k = 0; k < nodeKeys.length; k++) {
              nodes.push(detail.mapping[nodeKeys[k]]);
            }
            nodes.sort(function(a, b) {
              var ta = (a.message && a.message.create_time) ? a.message.create_time : 0;
              var tb = (b.message && b.message.create_time) ? b.message.create_time : 0;
              return ta - tb;
            });

            for (var n = 0; n < nodes.length; n++) {
              var node = nodes[n];
              if (node.message && node.message.content) {
                var parts = node.message.content.parts;
                var text = "";
                if (Array.isArray(parts)) {
                  var textParts = [];
                  for (var p = 0; p < parts.length; p++) {
                    if (typeof parts[p] === "string") {
                      textParts.push(parts[p]);
                    }
                  }
                  text = textParts.join("\n");
                } else {
                  text = JSON.stringify(node.message.content);
                }
                if (text.trim() !== "") {
                  var role = "unknown";
                  if (node.message.author && node.message.author.role) {
                    role = node.message.author.role;
                  }
                  var model = null;
                  if (node.message.metadata && node.message.metadata.model_slug) {
                    model = node.message.metadata.model_slug;
                  }
                  messages.push({
                    role: role,
                    content: text,
                    timestamp: node.message.create_time || null,
                    model: model
                  });
                }
              }
            }
          }

          fullExport.conversations.push({
            id: c.id,
            title: title,
            create_time: c.create_time,
            update_time: c.update_time,
            model: detail.default_model_slug || null,
            message_count: messages.length,
            messages: messages
          });

          successCount++;
          if (i % 25 === 0 && i > 0) {
            log("Progress: " + (i + 1) + "/" + allConvos.length);
          }

        } catch (err) {
          log("Error: " + title + " — " + err.message, "error");
          errorCount++;
          fullExport.conversations.push({id: c.id, title: title, error: err.message});
        }

        await new Promise(function(r) { setTimeout(r, 1000); });
      }

      var json = JSON.stringify(fullExport, null, 2);
      var sizeMB = (json.length / 1024 / 1024).toFixed(1);

      downloadFile(json, "chatgpt_all_conversations.json", "application/json");
      setProgress(100, "Complete! " + successCount + " conversations, ~" + sizeMB + " MB");
      setButtonState(btn, "done", successCount + " conversations exported");
      log("DONE! " + successCount + " conversations, " + errorCount + " errors, ~" + sizeMB + " MB", "success");

    } catch (err) {
      log("Conversation export failed: " + err.message, "error");
      setButtonState(btn, "error", err.message);
    }
  }

  // ========== EXPORT: INSTRUCTIONS ==========
  async function exportInstructions() {
    var btn = document.getElementById("g2c-btn-instructions");
    setButtonState(btn, "running", "Exporting...");

    try {
      var token = await getToken();
      var headers = {"Authorization": "Bearer " + token};

      var endpoints = [
        {name: "custom_instructions", url: "https://chatgpt.com/backend-api/user_system_messages"},
        {name: "settings", url: "https://chatgpt.com/backend-api/settings"}
      ];

      var result = {
        export_date: new Date().toISOString(),
        tool: "GPT2Claude Migration Kit v2.0",
        data: {}
      };

      for (var i = 0; i < endpoints.length; i++) {
        var ep = endpoints[i];
        log("Fetching " + ep.name + "...");
        try {
          var resp = await fetch(ep.url, {credentials: "include", headers: headers});
          if (resp.status === 200) {
            result.data[ep.name] = await resp.json();
            log("Got: " + ep.name);
          } else if (resp.status === 404) {
            result.data[ep.name] = {note: "Not available on this account"};
            log(ep.name + ": not available (skipped)");
          } else {
            result.data[ep.name] = {error: "HTTP " + resp.status};
            log(ep.name + ": HTTP " + resp.status, "error");
          }
        } catch (e) {
          result.data[ep.name] = {error: e.message};
          log(ep.name + " error: " + e.message, "error");
        }
      }

      downloadFile(JSON.stringify(result, null, 2), "chatgpt_instructions.json", "application/json");
      setButtonState(btn, "done", "Instructions exported");

    } catch (err) {
      log("Instructions export failed: " + err.message, "error");
      setButtonState(btn, "error", err.message);
    }
  }

  // ========== EVENT LISTENERS ==========
  document.getElementById("g2c-close").addEventListener("click", function() {
    panel.style.animation = "g2c-fadein 0.2s ease-out reverse";
    setTimeout(function() { panel.remove(); style.remove(); }, 200);
  });

  document.getElementById("g2c-btn-memory").addEventListener("click", exportMemories);
  document.getElementById("g2c-btn-convos").addEventListener("click", exportConversations);
  document.getElementById("g2c-btn-instructions").addEventListener("click", exportInstructions);

  document.getElementById("g2c-btn-all").addEventListener("click", async function() {
    var btn = document.getElementById("g2c-btn-all");
    setButtonState(btn, "running", "Exporting everything...");
    log("--- EXPORT ALL started ---");
    await exportMemories();
    await exportInstructions();
    await exportConversations();
    setButtonState(btn, "done", "All exports complete!");
    log("--- EXPORT ALL finished ---", "success");
  });

  document.getElementById("g2c-toggle-log").addEventListener("click", function() {
    var logVisible = logEl.classList.contains("visible");
    logEl.classList.toggle("visible");
    this.textContent = logVisible ? "Show log \u25BC" : "Hide log \u25B2";
  });

  log("Ready. Click a button to start exporting.");
})();
