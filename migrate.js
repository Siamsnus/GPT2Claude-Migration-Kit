// GPT2Claude Migration Kit v2.3
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
    @keyframes g2c-indeterminate { 0% { left: -30%; width: 30%; } 50% { left: 50%; width: 30%; } 100% { left: 100%; width: 30%; } }\
    @keyframes g2c-pulse-count { 0%,100% { opacity: 1; } 50% { opacity: 0.7; } }\
    @keyframes g2c-dot-bounce { 0%,80%,100% { transform: translateY(0); } 40% { transform: translateY(-4px); } }\
    .g2c-progress-fill.indeterminate { position: relative; width: 100% !important; background: none !important; overflow: hidden; }\
    .g2c-progress-fill.indeterminate::after { content: ''; position: absolute; top: 0; left: -30%; width: 30%; height: 100%; background: linear-gradient(90deg, transparent, #d4a574, transparent); border-radius: 3px; animation: g2c-indeterminate 1.5s ease-in-out infinite; }\
    .g2c-scan-hero { text-align: center; padding: 20px 0 10px; }\
    .g2c-scan-hero .g2c-scan-count { font-size: 42px; font-weight: 800; color: #d4a574; font-variant-numeric: tabular-nums; animation: g2c-pulse-count 2s ease-in-out infinite; line-height: 1; }\
    .g2c-scan-hero .g2c-scan-label { font-size: 12px; color: #888; margin-top: 4px; }\
    .g2c-scan-hero .g2c-scan-status { display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 12px; font-size: 12px; color: #999; }\
    .g2c-scan-dots { display: flex; gap: 3px; }\
    .g2c-scan-dots span { width: 4px; height: 4px; background: #d4a574; border-radius: 50%; animation: g2c-dot-bounce 1.2s ease-in-out infinite; }\
    .g2c-scan-dots span:nth-child(2) { animation-delay: 0.15s; }\
    .g2c-scan-dots span:nth-child(3) { animation-delay: 0.3s; }\
    .g2c-scan-models { display: flex; flex-wrap: wrap; gap: 4px; justify-content: center; margin-top: 14px; padding-top: 14px; border-top: 1px solid #2a2a35; }\
    .g2c-scan-tag { font-size: 10px; padding: 3px 10px; background: #1e1e26; border: 1px solid #2a2a35; border-radius: 20px; color: #a0a0e0; font-family: 'SF Mono', Consolas, monospace; }\
    .g2c-scan-reassure { font-size: 11px; color: #555; text-align: center; margin-top: 12px; }\
    .g2c-dl-hero { text-align: center; padding: 16px 0 8px; }\
    .g2c-dl-hero .g2c-dl-count { font-size: 28px; font-weight: 700; color: #7eb8a0; }\
    .g2c-dl-hero .g2c-dl-of { font-size: 14px; color: #555; }\
    .g2c-dl-hero .g2c-dl-title { font-size: 11px; color: #888; margin-top: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding: 0 10px; }\
    .g2c-dl-pct { font-size: 11px; color: #d4a574; font-family: 'SF Mono', Consolas, monospace; text-align: right; margin-top: 6px; }\
    .g2c-dl-remaining { font-size: 11px; color: #666; text-align: center; margin-top: 8px; }\
    .g2c-complete { text-align: center; padding: 20px 0 10px; }\
    .g2c-complete-icon { font-size: 36px; margin-bottom: 6px; }\
    .g2c-complete-title { font-size: 18px; font-weight: 700; color: #7eb8a0; }\
    .g2c-complete-sub { font-size: 12px; color: #888; margin-top: 6px; }\
    .g2c-complete-models { font-size: 11px; color: #d4a574; margin-top: 6px; font-family: 'SF Mono', Consolas, monospace; }\
.g2c-complete-models-wrap { display: flex; flex-wrap: wrap; gap: 4px; justify-content: center; margin-top: 12px; }\
.g2c-models-extra { display: flex; flex-wrap: wrap; gap: 4px; justify-content: center; width: 100%; margin-top: 4px; }\
.g2c-models-toggle { font-size: 10px; padding: 3px 10px; background: none; border: 1px dashed #333340; border-radius: 20px; color: #888; cursor: pointer; font-family: 'SF Mono', Consolas, monospace; }\
.g2c-models-toggle:hover { border-color: #d4a574; color: #d4a574; }\
    .g2c-whatsnext { margin: 16px 0; padding: 14px; background: #141418; border: 1px solid #252530; border-radius: 10px; }\
    .g2c-whatsnext-title { font-size: 11px; color: #888; margin-bottom: 10px; font-weight: 600; }\
    .g2c-whatsnext-item { font-size: 12px; color: #ccc; line-height: 1.8; margin-bottom: 10px; }\
    .g2c-whatsnext-item:last-child { margin-bottom: 0; }\
    .g2c-whatsnext-item a { color: #d4a574; text-decoration: none; }\
    .g2c-whatsnext-item a:hover { text-decoration: underline; }\
    .g2c-whatsnext-badge { font-size: 10px; color: #7eb8a0; background: rgba(126,184,160,0.12); padding: 1px 6px; border-radius: 4px; }\
    .g2c-copy-log { background: none; border: none; color: #666; font-size: 11px; cursor: pointer; padding: 6px 0; margin-top: 10px; margin-left: 12px; }\
    .g2c-copy-log:hover { color: #aaa; }\
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
    .g2c-filter-panel { margin-top: 10px; }\
    .g2c-filter-section { margin-bottom: 12px; }\
    .g2c-filter-label { font-size: 10px; color: #888; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }\
    .g2c-filter-models { max-height: 120px; overflow-y: auto; background: #141418; border: 1px solid #252530; border-radius: 8px; padding: 6px 8px; }\
    .g2c-model-row { display: flex; align-items: center; padding: 3px 0; font-size: 12px; cursor: pointer; color: #ccc; }\
    .g2c-model-row:hover { color: #fff; }\
    .g2c-model-row input { margin-right: 8px; accent-color: #d4a574; }\
    .g2c-model-row .cnt { color: #666; margin-left: auto; font-size: 10px; font-family: monospace; }\
    .g2c-filter-row { display: flex; gap: 8px; align-items: center; margin-bottom: 6px; }\
    .g2c-filter-input { flex: 1; padding: 6px 8px; background: #141418; border: 1px solid #252530; border-radius: 6px; color: #e8e8ec; font-size: 12px; font-family: monospace; outline: none; }\
    .g2c-filter-input:focus { border-color: #d4a574; }\
    .g2c-filter-input::placeholder { color: #555; }\
    .g2c-filter-summary { font-size: 12px; color: #d4a574; padding: 8px 0; font-weight: 600; }\
    .g2c-filter-drop { border: 1px dashed #333340; border-radius: 8px; padding: 10px; text-align: center; font-size: 11px; color: #666; cursor: pointer; transition: all 0.15s; }\
    .g2c-filter-drop:hover { border-color: #d4a574; color: #999; }\
    .g2c-filter-drop.active { border-color: #7eb8a0; color: #7eb8a0; }\
    .g2c-select-btns { display: flex; gap: 6px; margin-top: 4px; }\
    .g2c-select-btns button { background: none; border: none; color: #666; font-size: 10px; cursor: pointer; padding: 0; }\
    .g2c-select-btns button:hover { color: #d4a574; }\
  ";
  document.head.appendChild(style);

  // ========== PANEL HTML ==========
  var panel = document.createElement("div");
  panel.id = "gpt2claude-panel";
  panel.innerHTML = '\
    <div class="g2c-header g2c-drag-handle">\
      <div>\
        <div class="g2c-title"><span class="gpt">GPT</span><span class="arrow">\u2192</span><span class="claude">Claude</span></div>\
        <div class="g2c-version">Migration Kit v2.3</div>\
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
          <div class="g2c-btn-sub">Scans first, then you choose what to download</div>\
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
      <button class="g2c-copy-log" id="g2c-copy-log">Copy log</button>\
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

  // Safe event listener helper — guards against null elements in ChatGPT's SPA
  function safeAddEvent(id, event, handler) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener(event, handler);
    } else {
      log("Warning: element #" + id + " not found", "error");
    }
    return el;
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

  // Extract model from conversation metadata — tries multiple field names
  function getConvoModel(c) {
    return c.default_model_slug || c.model || c.model_slug || c.gpt_model || "unknown";
  }

  // Extract timestamp from conversation — handles epoch (seconds or ms) and ISO strings
  function getConvoTime(c) {
    var raw = c.update_time || c.updated_at || c.create_time || c.created_at || 0;
    if (!raw) return 0;
    if (typeof raw === "string") {
      // ISO date string
      var parsed = new Date(raw).getTime() / 1000;
      return isNaN(parsed) ? 0 : parsed;
    }
    // Epoch: if > 1e12 it's milliseconds, convert to seconds
    if (raw > 1e12) return raw / 1000;
    return raw;
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
      md += "# Tool: GPT2Claude Migration Kit v2.3\n\n";

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
  var scannedConvos = [];
  var previousExportIds = {};
  var BATCH_SIZE = 10;

  async function exportConversations() {
    var btn = document.getElementById("g2c-btn-convos");
    setButtonState(btn, "running", "Scanning...");

    // Show indeterminate progress
    var progressEl = document.getElementById("g2c-progress");
    progressEl.style.display = "block";
    var fillEl = document.getElementById("g2c-progress-fill");
    fillEl.classList.add("indeterminate");
    fillEl.style.width = "100%";

    // Insert scan hero display (State 2)
    var scanHero = document.createElement("div");
    scanHero.className = "g2c-scan-hero";
    scanHero.id = "g2c-scan-hero";
    scanHero.innerHTML = '<div class="g2c-scan-count" id="g2c-scan-count">0</div>' +
      '<div class="g2c-scan-label">conversations found</div>' +
      '<div class="g2c-scan-status" id="g2c-scan-status">' +
        '<span class="g2c-scan-dots"><span></span><span></span><span></span></span>' +
        ' Scanning your conversations\u2026' +
      '</div>' +
      '<div class="g2c-scan-models" id="g2c-scan-models"></div>' +
      '<div class="g2c-scan-reassure">Filter options appear when scan completes</div>';
    progressEl.parentNode.insertBefore(scanHero, progressEl.nextSibling);

    try {
      var token = await getToken();
      var headers = {"Authorization": "Bearer " + token};
      scannedConvos = [];
      var offset = 0;
      var liveModels = {};

      log("Scanning conversation list...");

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

        // Log first item's keys for diagnostics
        if (offset === 0 && items.length > 0) {
          var sampleKeys = Object.keys(items[0]).join(", ");
          log("API fields: " + sampleKeys);
          var sample = items[0];
          log("Sample model: " + (sample.default_model_slug || sample.model || sample.model_slug || "null"));
          log("Sample time: update=" + sample.update_time + " create=" + sample.create_time);
          log("Sample gizmo: " + (sample.gizmo_id || sample.conversation_template_id || sample.workspace_id || "none"));
        }

        for (var j = 0; j < items.length; j++) {
          scannedConvos.push(items[j]);
          var m = getConvoModel(items[j]);
          liveModels[m] = (liveModels[m] || 0) + 1;
        }

        // Update scan hero display
        var countEl = document.getElementById("g2c-scan-count");
        var statusEl = document.getElementById("g2c-scan-status");
        if (countEl) countEl.textContent = scannedConvos.length.toLocaleString();
        if (statusEl) {
          statusEl.innerHTML = items.length >= 100
            ? '<span class="g2c-scan-dots"><span></span><span></span><span></span></span> Still scanning \u2014 this takes a minute, all good'
            : 'Scan complete!';
        }

        // Update model tags
        var tagsHtml = "";
        var modelKeys = Object.keys(liveModels).sort(function(a, b) { return liveModels[b] - liveModels[a]; });
        for (var mi = 0; mi < modelKeys.length; mi++) {
          tagsHtml += '<span class="g2c-scan-tag">' + modelKeys[mi] + ' (' + liveModels[modelKeys[mi]] + ')</span>';
        }
        var modelsEl = document.getElementById("g2c-scan-models");
        if (modelsEl) modelsEl.innerHTML = tagsHtml;

        offset += items.length;
        if (items.length < 100) break;
        await new Promise(function(r) { setTimeout(r, 500); });
      }

      log("Total conversations: " + scannedConvos.length);

      // Discover and fetch project conversations via sidebar DOM scraping
      try {
        log("Checking for projects...");
        var statusEl = document.getElementById("g2c-scan-status");
        if (statusEl) statusEl.innerHTML = '<span class="g2c-scan-dots"><span></span><span></span><span></span></span> Checking projects\u2026';

        var discoveredProjects = {};

        // Method 1: Check conversation items for gizmo_id (project conversations have this)
        for (var gi = 0; gi < scannedConvos.length; gi++) {
          var gid = scannedConvos[gi].gizmo_id || scannedConvos[gi].conversation_template_id || scannedConvos[gi].workspace_id || null;
          if (gid && gid.indexOf("g-p-") === 0 && !discoveredProjects[gid]) {
            discoveredProjects[gid] = null; // name unknown yet
            log("Found project gizmo in conversation list: " + gid);
          }
        }

        // Method 2: Try API endpoint for user's gizmos/projects
        try {
          var gizmoResp = await fetch(
            "https://chatgpt.com/backend-api/gizmos/discovery/mine",
            {credentials: "include", headers: headers}
          );
          if (gizmoResp.status === 200) {
            var gizmoData = await gizmoResp.json();
            var gizmoItems = gizmoData.list || gizmoData.items || gizmoData.gizmos || [];
            if (Array.isArray(gizmoItems)) {
              for (var gmi = 0; gmi < gizmoItems.length; gmi++) {
                var gizmo = gizmoItems[gmi].resource || gizmoItems[gmi].gizmo || gizmoItems[gmi];
                var gizmoId = gizmo.id || gizmo.short_url || "";
                if (gizmoId.indexOf("g-p-") === 0 || (gizmo.type && gizmo.type === "project")) {
                  var gName = (gizmo.display && gizmo.display.name) || gizmo.name || gizmo.title || "Project";
                  discoveredProjects[gizmoId] = gName;
                  log("Found project via API: " + gName + " (" + gizmoId + ")");
                }
              }
            }
          } else {
            log("Gizmos API: HTTP " + gizmoResp.status + " (trying other methods)");
          }
        } catch (apiErr) {
          log("Gizmos API failed: " + apiErr.message + " (trying other methods)");
        }

        // Method 3: DOM scraping fallback — scan sidebar for project links
        var projLinks = document.querySelectorAll('a[href*="/g/g-p-"]');
        for (var pl = 0; pl < projLinks.length; pl++) {
          var href = projLinks[pl].getAttribute("href") || "";
          var idMatch = href.match(/g-p-[a-f0-9]+/);
          if (!idMatch) continue;
          var projId = idMatch[0];
          if (discoveredProjects[projId]) continue;
          var slugMatch = href.match(/g-p-[a-f0-9]+-([^/]+)/);
          var linkText = projLinks[pl].textContent.trim();
          var projName = linkText || (slugMatch ? slugMatch[1].replace(/-/g, " ") : "Project");
          if (href.indexOf("/c/") > -1) continue;
          discoveredProjects[projId] = projName;
          log("Found project via DOM: " + projName + " (" + projId + ")");
        }

        var projIds = Object.keys(discoveredProjects);
        if (projIds.length > 0) {
          log("Found " + projIds.length + " project(s) total");

          // Build index of existing conversation IDs for deduplication
          var existingIdx = {};
          for (var ei = 0; ei < scannedConvos.length; ei++) {
            existingIdx[scannedConvos[ei].id] = ei;
          }

          for (var pi = 0; pi < projIds.length; pi++) {
            var projId = projIds[pi];
            var projName = discoveredProjects[projId] || "Project";

            // Try to resolve project name if unknown
            if (projName === "Project" || projName === null) {
              try {
                var infoResp = await fetch(
                  "https://chatgpt.com/backend-api/gizmos/" + projId,
                  {credentials: "include", headers: headers}
                );
                if (infoResp.status === 200) {
                  var infoData = await infoResp.json();
                  var gizmoInfo = infoData.gizmo || infoData;
                  projName = (gizmoInfo.display && gizmoInfo.display.name) || gizmoInfo.name || gizmoInfo.title || "Project";
                  log("Resolved project name: " + projName);
                }
              } catch (nameErr) {
                // keep default name
              }
            }

            log("Fetching project: " + projName + " (" + projId + ")");
            var statusEl = document.getElementById("g2c-scan-status");
            if (statusEl) statusEl.innerHTML = '<span class="g2c-scan-dots"><span></span><span></span><span></span></span> Scanning project: ' + projName + '\u2026';

            var cursor = 0;
            var projConvoCount = 0;
            var projTaggedCount = 0;
            while (true) {
              var projConvoResp = await fetch(
                "https://chatgpt.com/backend-api/gizmos/" + projId + "/conversations?cursor=" + cursor,
                {credentials: "include", headers: headers}
              );
              if (projConvoResp.status !== 200) {
                log("Project " + projName + ": HTTP " + projConvoResp.status, "error");
                break;
              }
              var projConvoData = await projConvoResp.json();
              var projItems = projConvoData.items || [];
              for (var pj = 0; pj < projItems.length; pj++) {
                projItems[pj]._project = projName;
                projItems[pj]._project_id = projId;
                // Only add if not already in main scan (deduplicate)
                if (existingIdx[projItems[pj].id] === undefined) {
                  scannedConvos.push(projItems[pj]);
                  existingIdx[projItems[pj].id] = scannedConvos.length - 1;
                  projConvoCount++;
                } else {
                  // Tag the existing entry as belonging to this project
                  var dupIdx = existingIdx[projItems[pj].id];
                  scannedConvos[dupIdx]._project = projName;
                  scannedConvos[dupIdx]._project_id = projId;
                  projTaggedCount++;
                }
              }
              var countEl = document.getElementById("g2c-scan-count");
              if (countEl) countEl.textContent = scannedConvos.length.toLocaleString();

              // Cursor-based pagination: null cursor means no more pages
              if (projConvoData.cursor === null || projConvoData.cursor === undefined || projItems.length === 0) break;
              cursor = projConvoData.cursor;
              await new Promise(function(r) { setTimeout(r, 500); });
            }
            log("Project " + projName + ": " + projConvoCount + " new, " + projTaggedCount + " tagged");
          }
          log("Total with projects: " + scannedConvos.length);
        } else {
          log("No projects found");
        }
      } catch (projErr) {
        log("Projects check failed: " + projErr.message + " (continuing without)");
      }

      // Show filter panel
      setButtonState(btn, "done", scannedConvos.length + " conversations found");

      // Clean up scan hero display
      var scanHeroEl = document.getElementById("g2c-scan-hero");
      if (scanHeroEl) scanHeroEl.parentNode.removeChild(scanHeroEl);
      var fillEl = document.getElementById("g2c-progress-fill");
      fillEl.classList.remove("indeterminate");
      fillEl.style.width = "0%";
      document.getElementById("g2c-progress").style.display = "none";

      showFilterPanel();

    } catch (err) {
      log("Scan failed: " + err.message, "error");
      setButtonState(btn, "error", err.message);
    }
  }

  // ========== FILTER PANEL (State 3) ==========
  function showFilterPanel() {
    var models = {};
    var oldest = Infinity;
    var newest = 0;
    var sources = {}; // Track main vs project conversations
    for (var i = 0; i < scannedConvos.length; i++) {
      var c = scannedConvos[i];
      var m = getConvoModel(c);
      models[m] = (models[m] || 0) + 1;
      var t = getConvoTime(c);
      if (t > 0 && t < oldest) oldest = t;
      if (t > 0 && t > newest) newest = t;
      // Track source
      var src = c._project || "Main conversations";
      sources[src] = (sources[src] || 0) + 1;
    }
    var modelKeys = Object.keys(models).sort(function(a, b) { return models[b] - models[a]; });

    function tsToDate(ts) {
      if (!ts || ts === Infinity) return "";
      if (typeof ts === "string") {
        // ISO string — just extract the date part
        var d = new Date(ts);
        if (isNaN(d.getTime())) return "";
        return d.toISOString().slice(0, 10);
      }
      var d = new Date(ts > 1e12 ? ts : ts * 1000);
      if (isNaN(d.getTime())) return "";
      return d.toISOString().slice(0, 10);
    }

    var modelCheckboxes = "";
    for (var i = 0; i < modelKeys.length; i++) {
      var mk = modelKeys[i];
      modelCheckboxes += '<label class="g2c-model-row"><input type="checkbox" checked data-model="' + mk + '"> ' + mk + '<span class="cnt">' + models[mk] + '</span></label>';
    }

    // Build source/project checkboxes
    var sourceKeys = Object.keys(sources).sort(function(a, b) {
      if (a === "Main conversations") return -1;
      if (b === "Main conversations") return 1;
      return sources[b] - sources[a];
    });
    var sourceCheckboxes = "";
    var hasProjects = sourceKeys.length > 1;
    for (var si = 0; si < sourceKeys.length; si++) {
      var sk = sourceKeys[si];
      var icon = sk === "Main conversations" ? "\uD83D\uDCAC" : "\uD83D\uDCC1";
      sourceCheckboxes += '<label class="g2c-model-row"><input type="checkbox" checked data-source="' + sk + '"> ' + icon + ' ' + sk + '<span class="cnt">' + sources[sk] + '</span></label>';
    }

    // Scan summary — show project breakdown if applicable
    var projCount = sourceKeys.length - 1;
    var projConvoCount = scannedConvos.filter(function(c) { return c._project; }).length;
    var mainCount = scannedConvos.length - projConvoCount;
    var scanSummaryText = scannedConvos.length.toLocaleString() + '</span>' +
      '<span style="font-size:12px;color:#888;"> conversations scanned</span>';
    if (projCount > 0) {
      scanSummaryText += '<div style="font-size:11px;color:#7eb8a0;margin-top:4px;">' +
        mainCount.toLocaleString() + ' main + ' + projConvoCount + ' from ' + projCount + ' project' + (projCount > 1 ? 's' : '') + '</div>';
    }
    var scanSummary = '<div style="text-align:center;margin-bottom:14px;">' +
      '<span style="font-size:28px;font-weight:800;color:#7eb8a0;">' + scanSummaryText +
      '</div>';

    // Determine if model filter is useful (not just "unknown")
    var hasRealModels = modelKeys.length > 1 || (modelKeys.length === 1 && modelKeys[0] !== "unknown");

    var modelSection = '';
    if (hasRealModels) {
      modelSection = '\
        <div class="g2c-filter-section">\
          <div class="g2c-filter-label">Models</div>\
          <div class="g2c-filter-models" id="g2c-filter-models">' + modelCheckboxes + '</div>\
          <div class="g2c-select-btns"><button id="g2c-sel-all">Select all</button> \u00B7 <button id="g2c-sel-none">Select none</button></div>\
        </div>';
    }

    var filterHtml = '\
      <div class="g2c-filter-panel" id="g2c-filter-panel">\
        ' + scanSummary + '\
        ' + (hasProjects ? '\
        <div class="g2c-filter-section">\
          <div class="g2c-filter-label">Source</div>\
          <div class="g2c-filter-models" id="g2c-filter-sources">' + sourceCheckboxes + '</div>\
        </div>' : '') + '\
        ' + modelSection + '\
        <div class="g2c-filter-section">\
          <div class="g2c-filter-label">Date range</div>\
          <div class="g2c-filter-row">\
            <input type="date" class="g2c-filter-input" id="g2c-date-from" value="' + tsToDate(oldest) + '">\
            <span style="color:#555;">\u2192</span>\
            <input type="date" class="g2c-filter-input" id="g2c-date-to" value="' + tsToDate(newest) + '">\
          </div>\
          <div class="g2c-select-btns" id="g2c-era-btns" style="flex-wrap:wrap;margin-top:4px;">\
            <button data-era="all">All</button> \u00B7\
            <button data-era="gpt35">GPT-3.5</button> \u00B7\
            <button data-era="gpt4">GPT-4</button> \u00B7\
            <button data-era="gpt4o">GPT-4o</button> \u00B7\
            <button data-era="gpt5">GPT-5+</button>\
          </div>\
        </div>\
        <div class="g2c-filter-section">\
          <div class="g2c-filter-label">Max conversations (0 = all)</div>\
          <input type="number" class="g2c-filter-input" id="g2c-limit" value="0" min="0" style="width:100%;">\
        </div>\
        <div class="g2c-filter-section">\
          <div class="g2c-filter-label">Incremental export (skip already exported)</div>\
          <div class="g2c-filter-drop" id="g2c-prev-drop">Drop or click to load previous export</div>\
          <input type="file" id="g2c-prev-file" accept=".json" style="display:none;">\
        </div>\
        <div class="g2c-filter-summary" id="g2c-filter-summary">' + scannedConvos.length + ' conversations selected</div>\
        <button class="g2c-btn" id="g2c-btn-download" style="border-color:#d4a574;margin-bottom:0;">\
          <div class="g2c-btn-icon">\uD83D\uDCE5</div>\
          <div class="g2c-btn-text"><span style="color:#d4a574;">Download ' + scannedConvos.length + ' conversations</span>\
            <div class="g2c-btn-sub">~' + estimateTime(scannedConvos.length) + '</div>\
          </div>\
        </button>\
      </div>';

    // Insert filter panel — with fallback for SPA DOM issues
    var bodyEl = panel.querySelector(".g2c-body");
    if (!bodyEl) {
      log("Warning: panel body not found", "error");
      return;
    }
    var progressEl = document.getElementById("g2c-progress");
    var filterDiv = document.createElement("div");
    filterDiv.innerHTML = filterHtml;
    var filterPanel = filterDiv.firstElementChild || filterDiv.firstChild;
    if (progressEl && progressEl.parentNode) {
      progressEl.parentNode.insertBefore(filterPanel, progressEl);
    } else {
      bodyEl.appendChild(filterPanel);
    }

    // Hide the main buttons — with null guards
    var hideIds = ["g2c-btn-memory", "g2c-btn-convos", "g2c-btn-instructions", "g2c-btn-all"];
    for (var hi = 0; hi < hideIds.length; hi++) {
      var hideEl = document.getElementById(hideIds[hi]);
      if (hideEl) hideEl.style.display = "none";
    }

    // Wire up events using safeAddEvent (BUG FIX)
    safeAddEvent("g2c-sel-all", "click", function() {
      var boxes = document.querySelectorAll("#g2c-filter-models input");
      for (var i = 0; i < boxes.length; i++) boxes[i].checked = true;
      updateFilterSummary();
    });
    safeAddEvent("g2c-sel-none", "click", function() {
      var boxes = document.querySelectorAll("#g2c-filter-models input");
      for (var i = 0; i < boxes.length; i++) boxes[i].checked = false;
      updateFilterSummary();
    });

    safeAddEvent("g2c-prev-drop", "click", function() {
      var fileInput = document.getElementById("g2c-prev-file");
      if (fileInput) fileInput.click();
    });

    var filterInputs = document.querySelectorAll("#g2c-filter-models input, #g2c-filter-sources input, #g2c-date-from, #g2c-date-to, #g2c-limit");
    for (var fi = 0; fi < filterInputs.length; fi++) {
      filterInputs[fi].addEventListener("change", updateFilterSummary);
    }

    // Era preset buttons
    var eraRanges = {
      "all": [tsToDate(oldest), tsToDate(newest)],
      "gpt35": ["2022-11-30", "2023-03-13"],
      "gpt4": ["2023-03-14", "2024-05-12"],
      "gpt4o": ["2024-05-13", "2025-08-06"],
      "gpt5": ["2025-08-07", tsToDate(newest)]
    };
    var eraBtns = document.querySelectorAll("#g2c-era-btns button");
    for (var ei = 0; ei < eraBtns.length; ei++) {
      eraBtns[ei].addEventListener("click", function() {
        var era = this.getAttribute("data-era");
        var range = eraRanges[era];
        if (range) {
          var fromEl = document.getElementById("g2c-date-from");
          var toEl = document.getElementById("g2c-date-to");
          if (fromEl) fromEl.value = range[0];
          if (toEl) toEl.value = range[1];
          // Highlight active era button
          var siblings = document.querySelectorAll("#g2c-era-btns button");
          for (var si = 0; si < siblings.length; si++) siblings[si].style.color = "";
          this.style.color = "#d4a574";
          updateFilterSummary();
        }
      });
    }

    safeAddEvent("g2c-prev-file", "change", function() {
      if (this.files.length) loadPreviousExport(this.files[0]);
    });
    var dropEl = document.getElementById("g2c-prev-drop");
    if (dropEl) {
      dropEl.addEventListener("dragover", function(e) { e.preventDefault(); this.style.borderColor = "#d4a574"; });
      dropEl.addEventListener("dragleave", function() { this.style.borderColor = ""; });
      dropEl.addEventListener("drop", function(e) {
        e.preventDefault();
        this.style.borderColor = "";
        if (e.dataTransfer.files.length) loadPreviousExport(e.dataTransfer.files[0]);
      });
    }

    safeAddEvent("g2c-btn-download", "click", startFilteredDownload);

    // Ensure all model and source checkboxes are programmatically checked (defensive)
    var allBoxes = document.querySelectorAll("#g2c-filter-models input, #g2c-filter-sources input");
    for (var bi = 0; bi < allBoxes.length; bi++) allBoxes[bi].checked = true;

    // Force-recalculate summary after DOM is fully wired
    updateFilterSummary();
  }

  function estimateTime(count) {
    // Real-world calibration: 3361 convos = 29m34s = ~5.3s per batch of 10
    // Using 5s per batch as conservative estimate
    var secs = Math.ceil(count / BATCH_SIZE) * 5;
    if (secs < 60) return "~" + Math.max(Math.round(secs), 1) + " seconds";
    var mins = Math.round(secs / 60);
    if (mins < 60) return "~" + mins + " minutes";
    var hrs = (secs / 3600).toFixed(1);
    return "~" + hrs + " hours";
  }

  function getFilteredConvos() {
    try {
      var selectedModels = {};
      var boxes = document.querySelectorAll("#g2c-filter-models input");
      for (var i = 0; i < boxes.length; i++) {
        if (boxes[i].checked) selectedModels[boxes[i].getAttribute("data-model")] = true;
      }

      // Source/project filter
      var selectedSources = {};
      var sourceBoxes = document.querySelectorAll("#g2c-filter-sources input");
      for (var si = 0; si < sourceBoxes.length; si++) {
        if (sourceBoxes[si].checked) selectedSources[sourceBoxes[si].getAttribute("data-source")] = true;
      }
      var hasSourceFilter = sourceBoxes.length > 0 && Object.keys(selectedSources).length > 0;

      // If no models selected, return all (fail-open)
      var hasModelFilter = Object.keys(selectedModels).length > 0;

      var fromEl = document.getElementById("g2c-date-from");
      var toEl = document.getElementById("g2c-date-to");
      var limitEl = document.getElementById("g2c-limit");

      var fromStr = fromEl ? fromEl.value : "";
      var toStr = toEl ? toEl.value : "";
      var fromTs = fromStr ? new Date(fromStr + "T00:00:00").getTime() / 1000 : 0;
      var toTs = toStr ? new Date(toStr + "T23:59:59").getTime() / 1000 : Infinity;

      var limit = limitEl ? (parseInt(limitEl.value) || 0) : 0;

      var filtered = [];
      var mainCount = 0;
      for (var i = 0; i < scannedConvos.length; i++) {
        var c = scannedConvos[i];

        // Source filter
        if (hasSourceFilter) {
          var src = c._project || "Main conversations";
          if (!selectedSources[src]) continue;
        }

        var model = getConvoModel(c);
        if (hasModelFilter && !selectedModels[model]) continue;

        var ts = getConvoTime(c);
        if (ts > 0 && (ts < fromTs || ts > toTs)) continue;

        if (previousExportIds[c.id]) continue;

        // Limit only applies to main conversations — project convos always included
        if (!c._project) {
          if (limit > 0 && mainCount >= limit) continue;
          mainCount++;
        }

        filtered.push(c);
      }
      return filtered;
    } catch (err) {
      log("Filter error: " + err.message, "error");
      return scannedConvos; // fail-open: return all
    }
  }

  function updateFilterSummary() {
    var filtered = getFilteredConvos();
    var summary = document.getElementById("g2c-filter-summary");
    var dlBtn = document.getElementById("g2c-btn-download");
    var skipped = Object.keys(previousExportIds).length;
    var text = filtered.length + " conversations selected";
    if (skipped > 0) text += " (" + skipped + " skipped from previous export)";
    if (summary) summary.textContent = text;
    if (dlBtn) {
      var spanEl = dlBtn.querySelector(".g2c-btn-text span");
      if (spanEl) spanEl.textContent = "Download " + filtered.length + " conversations";
      var subEl = dlBtn.querySelector(".g2c-btn-sub");
      if (subEl) subEl.textContent = estimateTime(filtered.length);
    }
  }

  function loadPreviousExport(file) {
    var dropEl = document.getElementById("g2c-prev-drop");
    if (dropEl) dropEl.textContent = "Loading " + file.name + "...";
    var reader = new FileReader();
    reader.onload = function(e) {
      try {
        var data = JSON.parse(e.target.result);
        var convos = data.conversations || data || [];
        if (Array.isArray(convos)) {
          previousExportIds = {};
          for (var i = 0; i < convos.length; i++) {
            if (convos[i].id) previousExportIds[convos[i].id] = true;
          }
          if (dropEl) {
            dropEl.textContent = "\u2705 " + Object.keys(previousExportIds).length + " conversations from previous export";
            dropEl.className = "g2c-filter-drop active";
          }
          log("Loaded previous export: " + Object.keys(previousExportIds).length + " conversation IDs");
          updateFilterSummary();
        }
      } catch (err) {
        if (dropEl) dropEl.textContent = "\u274C Could not parse file";
        log("Previous export error: " + err.message, "error");
      }
    };
    reader.readAsText(file);
  }

  // ========== CONVERSATION PROCESSING HELPERS ==========
  function extractNodeText(node) {
    if (!node || !node.message || !node.message.content) return "";
    var parts = node.message.content.parts;
    if (!Array.isArray(parts)) return JSON.stringify(node.message.content);
    var textParts = [];
    for (var p = 0; p < parts.length; p++) {
      if (typeof parts[p] === "string") {
        textParts.push(parts[p]);
      } else if (parts[p] && typeof parts[p] === "object") {
        if (parts[p].content_type === "image_asset_pointer" || parts[p].asset_pointer) {
          var imgName = (parts[p].metadata && parts[p].metadata.dalle && parts[p].metadata.dalle.prompt)
            ? "DALL-E: " + parts[p].metadata.dalle.prompt : "image";
          textParts.push("[\uD83D\uDDBC " + imgName + "]");
        }
      }
    }
    return textParts.join("\n");
  }

  function extractNodeRole(node) {
    return (node.message && node.message.author && node.message.author.role) || "unknown";
  }

  function extractNodeModel(node) {
    return (node.message && node.message.metadata && node.message.metadata.model_slug) || null;
  }

  function extractNodeTime(node) {
    return (node.message && node.message.create_time) || null;
  }

  function processConversationDetail(detail, listItem) {
    var messages = [];
    var hasBranches = false;

    if (detail.mapping) {
      var mapKeys = Object.keys(detail.mapping);
      var rootId = null;
      for (var mk = 0; mk < mapKeys.length; mk++) {
        if (!detail.mapping[mapKeys[mk]].parent) {
          rootId = mapKeys[mk];
          break;
        }
      }
      if (!rootId) rootId = mapKeys[0];

      var current = rootId;
      var visited = {};
      var safety = 0;

      while (current && safety < 50000) {
        safety++;
        if (visited[current]) break;
        visited[current] = true;
        var node = detail.mapping[current];
        if (!node) break;

        if (node.message && node.message.content) {
          var text = extractNodeText(node);
          if (text.trim() !== "") {
            var msgObj = {
              role: extractNodeRole(node),
              content: text,
              timestamp: extractNodeTime(node),
              model: extractNodeModel(node)
            };

            if (node.parent && detail.mapping[node.parent]) {
              var parentNode = detail.mapping[node.parent];
              if (parentNode.children && parentNode.children.length > 1) {
                var alts = [];
                for (var ci = 0; ci < parentNode.children.length; ci++) {
                  var sibId = parentNode.children[ci];
                  if (sibId === current) continue;
                  var sib = detail.mapping[sibId];
                  if (sib && sib.message && sib.message.content) {
                    var sibText = extractNodeText(sib);
                    if (sibText.trim()) {
                      alts.push({
                        content: sibText,
                        role: extractNodeRole(sib),
                        timestamp: extractNodeTime(sib),
                        model: extractNodeModel(sib)
                      });
                    }
                  }
                }
                if (alts.length > 0) {
                  msgObj.alternatives = alts;
                  hasBranches = true;
                }
              }
            }

            messages.push(msgObj);
          }
        }

        if (node.children && node.children.length > 0) {
          current = node.children[node.children.length - 1];
        } else {
          break;
        }
      }
    }

    // Extract model from mapping metadata (since list API no longer provides it)
    var model = detail.default_model_slug || null;
    if (!model && detail.mapping) {
      var mKeys = Object.keys(detail.mapping);
      for (var mi = 0; mi < mKeys.length; mi++) {
        var mNode = detail.mapping[mKeys[mi]];
        if (mNode && mNode.message && mNode.message.metadata && mNode.message.metadata.model_slug) {
          model = mNode.message.metadata.model_slug;
          break;
        }
      }
    }

    return {
      id: detail.conversation_id || (listItem && listItem.id) || detail.id,
      title: detail.title || (listItem && listItem.title) || "Untitled",
      create_time: detail.create_time || (listItem && listItem.create_time) || null,
      update_time: detail.update_time || (listItem && listItem.update_time) || null,
      model: model,
      project: (listItem && listItem._project) || null,
      project_id: (listItem && listItem._project_id) || null,
      has_branches: hasBranches,
      message_count: messages.length,
      messages: messages
    };
  }

  // ========== FILTERED DOWNLOAD (States 4 & 5) ==========

  function updateDlUI(completed, total, title, startTime) {
    var pct = Math.round((completed / total) * 100);
    var remaining = total - completed;

    var dlCount = document.getElementById("g2c-dl-count");
    var dlTitle = document.getElementById("g2c-dl-title");
    var dlFill = document.getElementById("g2c-dl-fill");
    var dlPct = document.getElementById("g2c-dl-pct");
    var dlRemaining = document.getElementById("g2c-dl-remaining");
    var dlMode = document.getElementById("g2c-dl-mode");

    if (dlCount) dlCount.textContent = completed;
    if (dlTitle) dlTitle.textContent = title;
    if (dlFill) dlFill.style.width = pct + "%";
    if (dlPct) dlPct.textContent = pct + "%";

    if (dlRemaining && completed > 0) {
      var elapsed = (Date.now() - startTime) / 1000;
      var perItem = elapsed / completed;
      var secsLeft = Math.round(perItem * remaining);
      if (secsLeft < 60) {
        dlRemaining.textContent = "~" + secsLeft + " seconds remaining";
      } else {
        dlRemaining.textContent = "~" + Math.round(secsLeft / 60) + " minutes remaining";
      }
    }
  }

  async function downloadBatch(ids, token) {
    var resp = await fetch("https://chatgpt.com/backend-api/conversations/batch", {
      method: "POST",
      credentials: "include",
      headers: {"Authorization": "Bearer " + token, "Content-Type": "application/json"},
      body: JSON.stringify({conversation_ids: ids})
    });
    return resp;
  }

  async function downloadSingle(id, token) {
    var resp = await fetch("https://chatgpt.com/backend-api/conversation/" + id, {
      credentials: "include",
      headers: {"Authorization": "Bearer " + token}
    });
    return resp;
  }

  async function startFilteredDownload() {
    var filtered = getFilteredConvos();
    if (filtered.length === 0) {
      alert("No conversations selected. Adjust your filters.");
      return;
    }

    // Replace filter panel with download hero UI (State 4)
    var filterPanel = document.getElementById("g2c-filter-panel");
    if (filterPanel) {
      filterPanel.innerHTML = '\
        <div class="g2c-dl-hero" id="g2c-dl-hero">\
          <span class="g2c-dl-count" id="g2c-dl-count">0</span>\
          <span class="g2c-dl-of" id="g2c-dl-of"> / ' + filtered.length + '</span>\
          <div class="g2c-dl-title" id="g2c-dl-title">Starting download\u2026</div>\
        </div>\
        <div style="margin:10px 0;">\
          <div class="g2c-progress-bar"><div class="g2c-progress-fill" id="g2c-dl-fill" style="width:0%;"></div></div>\
          <div class="g2c-dl-pct" id="g2c-dl-pct">0%</div>\
        </div>\
        <div class="g2c-dl-remaining" id="g2c-dl-remaining"></div>\
        <div class="g2c-dl-mode" id="g2c-dl-mode" style="text-align:center;font-size:10px;color:#666;margin-top:4px;"></div>';
    }

    var startTime = Date.now();

    try {
      var token = await getToken();

      var fullExport = {
        export_date: new Date().toISOString(),
        tool: "GPT2Claude Migration Kit v2.3",
        format_version: 3,
        total_conversations: filtered.length,
        conversations: []
      };

      var successCount = 0;
      var errorCount = 0;
      var useBatch = true;

      // Build ID-to-listItem lookup
      var listLookup = {};
      for (var li = 0; li < filtered.length; li++) {
        listLookup[filtered[li].id] = filtered[li];
      }

      // ---- TRY BATCH MODE FIRST ----
      log("Using batch download (10 at a time)\u2026");
      var dlMode = document.getElementById("g2c-dl-mode");
      if (dlMode) dlMode.textContent = "\u26A1 Batch mode \u2014 10x faster";

      var batchIndex = 0;
      while (batchIndex < filtered.length && useBatch) {
        var batchItems = filtered.slice(batchIndex, batchIndex + BATCH_SIZE);
        var batchIds = [];
        for (var bi = 0; bi < batchItems.length; bi++) batchIds.push(batchItems[bi].id);

        try {
          var batchResp = await downloadBatch(batchIds, token);

          if (batchResp.status === 429) {
            log("Rate limited, waiting 30s\u2026", "error");
            var dlTitle = document.getElementById("g2c-dl-title");
            var dlRemaining = document.getElementById("g2c-dl-remaining");
            if (dlTitle) dlTitle.textContent = "Rate limited \u2014 waiting 30s\u2026";
            if (dlRemaining) dlRemaining.textContent = "Will resume automatically";
            await new Promise(function(r) { setTimeout(r, 30000); });
            continue; // retry same batch
          }

          if (batchResp.status === 422 || batchResp.status === 405 || batchResp.status === 404) {
            // Batch endpoint not available — fall back to individual
            log("Batch endpoint unavailable (HTTP " + batchResp.status + "), falling back to individual downloads\u2026", "error");
            useBatch = false;
            break;
          }

          if (batchResp.status !== 200) {
            log("Batch error (HTTP " + batchResp.status + "), falling back\u2026", "error");
            useBatch = false;
            break;
          }

          var batchData = await batchResp.json();
          var batchArr = Array.isArray(batchData) ? batchData : Object.values(batchData);

          // Process each conversation in batch
          for (var bj = 0; bj < batchArr.length; bj++) {
            try {
              var detail = batchArr[bj];
              var detailId = detail.conversation_id || detail.id;
              var listItem = listLookup[detailId] || batchItems[bj];
              var processed = processConversationDetail(detail, listItem);
              fullExport.conversations.push(processed);
              successCount++;
            } catch (procErr) {
              var errTitle = (batchItems[bj] && batchItems[bj].title) || "Unknown";
              log("Error processing: " + errTitle + " \u2014 " + procErr.message, "error");
              errorCount++;
              fullExport.conversations.push({
                id: batchIds[bj],
                title: errTitle,
                error: procErr.message
              });
            }
          }

          // Update UI after each batch
          var completed = successCount + errorCount;
          var lastTitle = batchItems[batchItems.length - 1].title || "Untitled";
          updateDlUI(completed, filtered.length, lastTitle, startTime);

          if (completed % 100 === 0 || completed === filtered.length) {
            log("Progress: " + completed + "/" + filtered.length);
          }

          batchIndex += BATCH_SIZE;

          // Small delay between batches to be respectful
          await new Promise(function(r) { setTimeout(r, 500); });

        } catch (batchErr) {
          log("Batch error: " + batchErr.message + ", falling back\u2026", "error");
          useBatch = false;
          break;
        }
      }

      // ---- FALLBACK: INDIVIDUAL DOWNLOADS ----
      if (!useBatch) {
        if (dlMode) dlMode.textContent = "\uD83D\uDC22 Individual mode";
        log("Switching to individual downloads\u2026");

        // Start from where batch left off
        var startFrom = successCount + errorCount;
        for (var i = startFrom; i < filtered.length; i++) {
          var c = filtered[i];
          var title = c.title || "Untitled";

          updateDlUI(i + 1, filtered.length, title, startTime);

          try {
            var convoResp = await downloadSingle(c.id, token);

            if (convoResp.status === 429) {
              log("Rate limited, waiting 30s\u2026", "error");
              var dlTitle = document.getElementById("g2c-dl-title");
              var dlRemaining = document.getElementById("g2c-dl-remaining");
              if (dlTitle) dlTitle.textContent = "Rate limited \u2014 waiting 30s\u2026";
              if (dlRemaining) dlRemaining.textContent = "Will resume automatically";
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
            var processed = processConversationDetail(detail, c);
            fullExport.conversations.push(processed);
            successCount++;

            if (i % 25 === 0 && i > 0) {
              log("Progress: " + (i + 1) + "/" + filtered.length);
            }

          } catch (err) {
            log("Error: " + title + " \u2014 " + err.message, "error");
            errorCount++;
            fullExport.conversations.push({id: c.id, title: title, error: err.message});
          }

          await new Promise(function(r) { setTimeout(r, 1000); });
        }
      }

      var json = JSON.stringify(fullExport, null, 2);
      var sizeMB = (json.length / 1024 / 1024).toFixed(1);

      // Smart filename based on what was exported
      var exportFilename = "chatgpt_all_conversations.json";
      var projectNames = {};
      var hasMain = false;
      for (var fi = 0; fi < fullExport.conversations.length; fi++) {
        if (fullExport.conversations[fi].project) {
          projectNames[fullExport.conversations[fi].project] = true;
        } else {
          hasMain = true;
        }
      }
      var projNameList = Object.keys(projectNames);
      if (!hasMain && projNameList.length === 1) {
        // Only one project exported
        exportFilename = "chatgpt_project_" + projNameList[0].toLowerCase().replace(/[^a-z0-9]+/g, "_") + ".json";
      } else if (!hasMain && projNameList.length > 1) {
        exportFilename = "chatgpt_projects.json";
      }
      downloadFile(json, exportFilename, "application/json");
      log("DONE! " + successCount + " conversations, " + errorCount + " errors, ~" + sizeMB + " MB", "success");

      // Collect model breakdown from export
      var modelBreakdown = {};
      for (var mi = 0; mi < fullExport.conversations.length; mi++) {
        var cm = fullExport.conversations[mi].model || "unknown";
        modelBreakdown[cm] = (modelBreakdown[cm] || 0) + 1;
      }
      var sortedModels = Object.keys(modelBreakdown).sort(function(a, b) {
        return modelBreakdown[b] - modelBreakdown[a];
      });

      // Build model tags HTML — top 5 visible, rest collapsed
      var TOP_N = 5;
      var modelTagsHtml = '<div class="g2c-complete-models-wrap">';
      for (var ti = 0; ti < Math.min(TOP_N, sortedModels.length); ti++) {
        var mk = sortedModels[ti];
        modelTagsHtml += '<span class="g2c-scan-tag">' + mk + ' <span style="opacity:0.6;">' + modelBreakdown[mk] + '</span></span>';
      }
      if (sortedModels.length > TOP_N) {
        var moreCount = sortedModels.length - TOP_N;
        modelTagsHtml += '<button class="g2c-models-toggle" id="g2c-models-toggle">+' + moreCount + ' more</button>';
        modelTagsHtml += '<div class="g2c-models-extra" id="g2c-models-extra" style="display:none;">';
        for (var ti = TOP_N; ti < sortedModels.length; ti++) {
          var mk = sortedModels[ti];
          modelTagsHtml += '<span class="g2c-scan-tag">' + mk + ' <span style="opacity:0.6;">' + modelBreakdown[mk] + '</span></span>';
        }
        modelTagsHtml += '</div>';
      }
      modelTagsHtml += '</div>';

      // Show completion screen (State 5)
      var filterPanel = document.getElementById("g2c-filter-panel");
      if (filterPanel) {
        var elapsed = Math.round((Date.now() - startTime) / 1000);
        var elapsedStr = elapsed < 60 ? elapsed + "s" : Math.round(elapsed / 60) + "m " + (elapsed % 60) + "s";

        filterPanel.innerHTML = '\
          <div class="g2c-complete">\
            <div class="g2c-complete-icon">\u2705</div>\
            <div class="g2c-complete-title">Export Complete!</div>\
            <div class="g2c-complete-sub">' + successCount + ' conversations \u00B7 ' + sizeMB + ' MB \u00B7 ' + elapsedStr + '</div>\
            ' + modelTagsHtml + '\
          </div>\
          <div class="g2c-whatsnext">\
            <div class="g2c-whatsnext-title">What\u2019s next?</div>\
            <div class="g2c-whatsnext-item">\
              <span style="color:#a0a0e0;">\uD83D\uDC40 Browse your data</span><br>\
              <span style="color:#999;">Open the <a href="https://siamsnus.github.io/GPT2Claude-Migration-Kit/viewer.html" target="_blank">Conversation Viewer</a> to explore your chats. You can <a href="https://siamsnus.github.io/GPT2Claude-Migration-Kit/viewer.html" download target="_blank">download it</a> for fully offline use.</span>\
            </div>\
            <div class="g2c-whatsnext-item">\
              <span style="color:#7eb8a0;">\uD83D\uDE80 Import to Claude</span> <span class="g2c-whatsnext-badge">recommended</span><br>\
              <span style="color:#999;">Follow the <a href="https://siamsnus.github.io/GPT2Claude-Migration-Kit/#importing" target="_blank">import guide</a> to bring your history into Claude.</span>\
            </div>\
          </div>';

        // Wire up "show more models" toggle
        var modelsToggle = document.getElementById("g2c-models-toggle");
        if (modelsToggle) {
          modelsToggle.addEventListener("click", function() {
            var extra = document.getElementById("g2c-models-extra");
            if (extra) {
              var showing = extra.style.display !== "none";
              extra.style.display = showing ? "none" : "flex";
              this.textContent = showing ? "+" + (sortedModels.length - TOP_N) + " more" : "show less";
            }
          });
        }
      }

    } catch (err) {
      log("Download failed: " + err.message, "error");
      var dlTitle = document.getElementById("g2c-dl-title");
      if (dlTitle) dlTitle.textContent = "Error: " + err.message;
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
        tool: "GPT2Claude Migration Kit v2.3",
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
    log("Memories & instructions done. Scanning conversations...");
    await exportConversations();
    log("Memories & instructions exported. Configure conversation filters and click Download.", "success");
  });

  document.getElementById("g2c-toggle-log").addEventListener("click", function() {
    var logVisible = logEl.classList.contains("visible");
    logEl.classList.toggle("visible");
    this.textContent = logVisible ? "Show log \u25BC" : "Hide log \u25B2";
  });

  // Copy log button
  document.getElementById("g2c-copy-log").addEventListener("click", function() {
    var copyBtn = this;
    var entries = document.querySelectorAll(".g2c-log-entry");
    var text = "";
    for (var i = 0; i < entries.length; i++) {
      text += entries[i].textContent + "\n";
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function() {
        copyBtn.textContent = "\u2705 Copied!";
        setTimeout(function() { copyBtn.textContent = "Copy log"; }, 2000);
      }).catch(function() {
        fallbackCopy(text, copyBtn);
      });
    } else {
      fallbackCopy(text, copyBtn);
    }
  });

  function fallbackCopy(text, btn) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      btn.textContent = "\u2705 Copied!";
      setTimeout(function() { btn.textContent = "Copy log"; }, 2000);
    } catch (e) {
      btn.textContent = "Copy failed";
      setTimeout(function() { btn.textContent = "Copy log"; }, 2000);
    }
    document.body.removeChild(ta);
  }

  log("Ready. Click a button to start exporting.");
})();
