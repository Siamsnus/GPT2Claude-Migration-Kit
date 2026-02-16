// GPT2Claude Migration Kit v2.1
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
    .g2c-progress-fill.indeterminate { position: relative; width: 100% !important; background: none !important; overflow: hidden; }\
    .g2c-progress-fill.indeterminate::after { content: ''; position: absolute; top: 0; left: -30%; width: 30%; height: 100%; background: linear-gradient(90deg, transparent, #d4a574, transparent); border-radius: 3px; animation: g2c-indeterminate 1.5s ease-in-out infinite; }\
    .g2c-scan-live { margin-top: 10px; background: #141418; border: 1px solid #252530; border-radius: 8px; padding: 10px 12px; font-size: 11px; }\
    .g2c-scan-live .g2c-scan-count { font-size: 20px; font-weight: 700; color: #d4a574; font-family: -apple-system, sans-serif; }\
    .g2c-scan-live .g2c-scan-status { color: #888; margin-top: 4px; }\
    .g2c-scan-models { margin-top: 8px; display: flex; flex-wrap: wrap; gap: 4px; }\
    .g2c-scan-tag { font-size: 10px; padding: 2px 8px; background: #222228; border: 1px solid #333340; border-radius: 10px; color: #a0a0e0; font-family: monospace; }\
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
        <div class="g2c-version">Migration Kit v2.1</div>\
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
      md += "# Tool: GPT2Claude Migration Kit v2.1\n\n";

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
  var scannedConvos = []; // all conversation metadata after scan
  var previousExportIds = {}; // IDs from previous export for incremental mode

  async function exportConversations() {
    var btn = document.getElementById("g2c-btn-convos");
    setButtonState(btn, "running", "Scanning...");

    // Show indeterminate progress + live counter
    var progressEl = document.getElementById("g2c-progress");
    progressEl.style.display = "block";
    var fillEl = document.getElementById("g2c-progress-fill");
    fillEl.classList.add("indeterminate");
    fillEl.style.width = "100%";

    // Insert live scan display
    var scanLive = document.createElement("div");
    scanLive.className = "g2c-scan-live";
    scanLive.id = "g2c-scan-live";
    scanLive.innerHTML = '<div class="g2c-scan-count" id="g2c-scan-count">0</div>' +
      '<div class="g2c-scan-status" id="g2c-scan-status">Scanning your conversations...</div>' +
      '<div class="g2c-scan-models" id="g2c-scan-models"></div>';
    progressEl.parentNode.insertBefore(scanLive, progressEl.nextSibling);

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

        for (var j = 0; j < items.length; j++) {
          scannedConvos.push(items[j]);
          var m = items[j].default_model_slug || "unknown";
          liveModels[m] = (liveModels[m] || 0) + 1;
        }

        // Update live display
        document.getElementById("g2c-scan-count").textContent = scannedConvos.length;
        document.getElementById("g2c-scan-status").textContent = items.length >= 100 ? "Still scanning..." : "Scan complete!";

        // Update model tags
        var tagsHtml = "";
        var modelKeys = Object.keys(liveModels).sort(function(a, b) { return liveModels[b] - liveModels[a]; });
        for (var mi = 0; mi < modelKeys.length; mi++) {
          tagsHtml += '<span class="g2c-scan-tag">' + modelKeys[mi] + ' (' + liveModels[modelKeys[mi]] + ')</span>';
        }
        document.getElementById("g2c-scan-models").innerHTML = tagsHtml;

        offset += items.length;
        if (items.length < 100) break;
        await new Promise(function(r) { setTimeout(r, 500); });
      }

      log("Total conversations: " + scannedConvos.length);

      // Try to fetch project conversations too
      try {
        log("Checking for projects...");
        document.getElementById("g2c-scan-status").textContent = "Checking projects...";
        var projResp = await fetch(
          "https://chatgpt.com/backend-api/projects?offset=0&limit=100",
          {credentials: "include", headers: headers}
        );
        if (projResp.status === 200) {
          var projData = await projResp.json();
          var projects = projData.items || projData.projects || projData || [];
          if (Array.isArray(projects) && projects.length > 0) {
            log("Found " + projects.length + " projects");
            for (var pi = 0; pi < projects.length; pi++) {
              var proj = projects[pi];
              var projName = proj.title || proj.name || ("Project " + (pi + 1));
              var projId = proj.id || proj.project_id;
              log("Fetching project: " + projName);
              var projOffset = 0;
              while (true) {
                var projConvoResp = await fetch(
                  "https://chatgpt.com/backend-api/conversations?project_id=" + projId + "&offset=" + projOffset + "&limit=100&order=updated",
                  {credentials: "include", headers: headers}
                );
                if (projConvoResp.status !== 200) break;
                var projConvoData = await projConvoResp.json();
                var projItems = projConvoData.items || [];
                for (var pj = 0; pj < projItems.length; pj++) {
                  projItems[pj]._project = projName;
                  projItems[pj]._project_id = projId;
                  scannedConvos.push(projItems[pj]);
                }
                document.getElementById("g2c-scan-count").textContent = scannedConvos.length;
                document.getElementById("g2c-scan-status").textContent = "Scanning project: " + projName + "...";
                projOffset += projItems.length;
                if (projItems.length < 100) break;
                await new Promise(function(r) { setTimeout(r, 500); });
              }
            }
            log("Total with projects: " + scannedConvos.length);
          } else {
            log("No projects found");
          }
        } else {
          log("Projects not available (HTTP " + projResp.status + ")");
        }
      } catch (projErr) {
        log("Projects check failed: " + projErr.message + " (continuing without)");
      }

      // Show filter panel
      setButtonState(btn, "done", scannedConvos.length + " conversations found");

      // Clean up scan live display
      var scanLiveEl = document.getElementById("g2c-scan-live");
      if (scanLiveEl) scanLiveEl.parentNode.removeChild(scanLiveEl);
      // Reset progress bar to determinate
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

  function showFilterPanel() {
    // Build model breakdown
    var models = {};
    var oldest = Infinity;
    var newest = 0;
    for (var i = 0; i < scannedConvos.length; i++) {
      var c = scannedConvos[i];
      var m = c.default_model_slug || "unknown";
      models[m] = (models[m] || 0) + 1;
      if (c.update_time && c.update_time < oldest) oldest = c.update_time;
      if (c.update_time && c.update_time > newest) newest = c.update_time;
    }
    var modelKeys = Object.keys(models).sort(function(a, b) { return models[b] - models[a]; });

    // Format dates for inputs
    function tsToDate(ts) {
      if (!ts || ts === Infinity) return "";
      var d = new Date(ts > 1e12 ? ts : ts * 1000);
      return d.toISOString().slice(0, 10);
    }

    var modelCheckboxes = "";
    for (var i = 0; i < modelKeys.length; i++) {
      var mk = modelKeys[i];
      modelCheckboxes += '<label class="g2c-model-row"><input type="checkbox" checked data-model="' + mk + '"> ' + mk + '<span class="cnt">' + models[mk] + '</span></label>';
    }

    var filterHtml = '\
      <div class="g2c-filter-panel" id="g2c-filter-panel">\
        <div class="g2c-filter-section">\
          <div class="g2c-filter-label">Models</div>\
          <div class="g2c-filter-models" id="g2c-filter-models">' + modelCheckboxes + '</div>\
          <div class="g2c-select-btns"><button id="g2c-sel-all">Select all</button> · <button id="g2c-sel-none">Select none</button></div>\
        </div>\
        <div class="g2c-filter-section">\
          <div class="g2c-filter-label">Date range</div>\
          <div class="g2c-filter-row">\
            <input type="date" class="g2c-filter-input" id="g2c-date-from" value="' + tsToDate(oldest) + '">\
            <span style="color:#555;">→</span>\
            <input type="date" class="g2c-filter-input" id="g2c-date-to" value="' + tsToDate(newest) + '">\
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

    // Insert filter panel after buttons, before progress
    var progressEl = document.getElementById("g2c-progress");
    var filterDiv = document.createElement("div");
    filterDiv.innerHTML = filterHtml;
    progressEl.parentNode.insertBefore(filterDiv.firstElementChild || filterDiv.firstChild, progressEl);

    // Hide the main buttons
    document.getElementById("g2c-btn-memory").style.display = "none";
    document.getElementById("g2c-btn-convos").style.display = "none";
    document.getElementById("g2c-btn-instructions").style.display = "none";
    document.getElementById("g2c-btn-all").style.display = "none";

    // Wire up select all/none buttons
    document.getElementById("g2c-sel-all").addEventListener("click", function() {
      var boxes = document.querySelectorAll("#g2c-filter-models input");
      for (var i = 0; i < boxes.length; i++) boxes[i].checked = true;
      updateFilterSummary();
    });
    document.getElementById("g2c-sel-none").addEventListener("click", function() {
      var boxes = document.querySelectorAll("#g2c-filter-models input");
      for (var i = 0; i < boxes.length; i++) boxes[i].checked = false;
      updateFilterSummary();
    });

    // Wire up drop zone click
    document.getElementById("g2c-prev-drop").addEventListener("click", function() {
      document.getElementById("g2c-prev-file").click();
    });

    // Wire up filter change events
    var filterInputs = document.querySelectorAll("#g2c-filter-models input, #g2c-date-from, #g2c-date-to, #g2c-limit");
    for (var fi = 0; fi < filterInputs.length; fi++) {
      filterInputs[fi].addEventListener("change", updateFilterSummary);
    }

    // Previous export file handler
    document.getElementById("g2c-prev-file").addEventListener("change", function() {
      if (this.files.length) loadPreviousExport(this.files[0]);
    });
    var dropEl = document.getElementById("g2c-prev-drop");
    dropEl.addEventListener("dragover", function(e) { e.preventDefault(); this.style.borderColor = "#d4a574"; });
    dropEl.addEventListener("dragleave", function() { this.style.borderColor = ""; });
    dropEl.addEventListener("drop", function(e) {
      e.preventDefault();
      this.style.borderColor = "";
      if (e.dataTransfer.files.length) loadPreviousExport(e.dataTransfer.files[0]);
    });

    // Download button
    document.getElementById("g2c-btn-download").addEventListener("click", startFilteredDownload);
  }

  function estimateTime(count) {
    // ~1.5 seconds per conversation (1s delay + fetch time)
    var secs = count * 1.5;
    if (secs < 60) return "~" + Math.round(secs) + " seconds";
    var mins = Math.round(secs / 60);
    if (mins < 60) return "~" + mins + " minutes";
    var hrs = (secs / 3600).toFixed(1);
    return "~" + hrs + " hours";
  }

  function getFilteredConvos() {
    // Get selected models
    var selectedModels = {};
    var boxes = document.querySelectorAll("#g2c-filter-models input");
    for (var i = 0; i < boxes.length; i++) {
      if (boxes[i].checked) selectedModels[boxes[i].getAttribute("data-model")] = true;
    }

    // Date range
    var fromStr = document.getElementById("g2c-date-from").value;
    var toStr = document.getElementById("g2c-date-to").value;
    var fromTs = fromStr ? new Date(fromStr + "T00:00:00").getTime() / 1000 : 0;
    var toTs = toStr ? new Date(toStr + "T23:59:59").getTime() / 1000 : Infinity;

    // Limit
    var limit = parseInt(document.getElementById("g2c-limit").value) || 0;

    var filtered = [];
    for (var i = 0; i < scannedConvos.length; i++) {
      var c = scannedConvos[i];
      var model = c.default_model_slug || "unknown";
      if (!selectedModels[model]) continue;

      var ts = c.update_time || c.create_time || 0;
      if (ts < fromTs || ts > toTs) continue;

      // Skip if in previous export
      if (previousExportIds[c.id]) continue;

      filtered.push(c);
      if (limit > 0 && filtered.length >= limit) break;
    }
    return filtered;
  }

  function updateFilterSummary() {
    var filtered = getFilteredConvos();
    var summary = document.getElementById("g2c-filter-summary");
    var dlBtn = document.getElementById("g2c-btn-download");
    var skipped = Object.keys(previousExportIds).length;
    var text = filtered.length + " conversations selected";
    if (skipped > 0) text += " (" + skipped + " skipped from previous export)";
    summary.textContent = text;
    dlBtn.querySelector(".g2c-btn-text span").textContent = "Download " + filtered.length + " conversations";
    dlBtn.querySelector(".g2c-btn-sub").textContent = estimateTime(filtered.length);
  }

  function loadPreviousExport(file) {
    var dropEl = document.getElementById("g2c-prev-drop");
    dropEl.textContent = "Loading " + file.name + "...";
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
          dropEl.textContent = "\u2705 " + Object.keys(previousExportIds).length + " conversations from previous export";
          dropEl.className = "g2c-filter-drop active";
          log("Loaded previous export: " + Object.keys(previousExportIds).length + " conversation IDs");
          updateFilterSummary();
        }
      } catch (err) {
        dropEl.textContent = "\u274C Could not parse file";
        log("Previous export error: " + err.message, "error");
      }
    };
    reader.readAsText(file);
  }

  async function startFilteredDownload() {
    var filtered = getFilteredConvos();
    if (filtered.length === 0) {
      alert("No conversations selected. Adjust your filters.");
      return;
    }

    var btn = document.getElementById("g2c-btn-download");
    setButtonState(btn, "running", "Downloading 0/" + filtered.length + "...");

    // Show determinate progress bar
    document.getElementById("g2c-progress").style.display = "block";
    document.getElementById("g2c-progress-fill").classList.remove("indeterminate");

    // Disable filter inputs
    var inputs = document.querySelectorAll("#g2c-filter-panel input, #g2c-filter-panel button:not(#g2c-btn-download)");
    for (var fi = 0; fi < inputs.length; fi++) inputs[fi].disabled = true;

    try {
      var token = await getToken();
      var headers = {"Authorization": "Bearer " + token};

      var fullExport = {
        export_date: new Date().toISOString(),
        tool: "GPT2Claude Migration Kit v2.1",
        format_version: 3,
        total_conversations: filtered.length,
        conversations: []
      };

      var successCount = 0;
      var errorCount = 0;

      for (var i = 0; i < filtered.length; i++) {
        var c = filtered[i];
        var title = c.title || "Untitled";
        var pct = Math.round(((i + 1) / filtered.length) * 100);

        setProgress(pct, (i + 1) + " / " + filtered.length + " \u2014 " + title);
        setButtonState(btn, "running", "Downloading " + (i + 1) + "/" + filtered.length + "...");

        try {
          var convoResp = await fetch(
            "https://chatgpt.com/backend-api/conversation/" + c.id,
            {credentials: "include", headers: headers}
          );

          if (convoResp.status === 429) {
            log("Rate limited, waiting 30s...", "error");
            setButtonState(btn, "running", "Rate limited \u2014 waiting 30s...");
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
                    var imgName = (parts[p].metadata && parts[p].metadata.dalle && parts[p].metadata.dalle.prompt) ? "DALL-E: " + parts[p].metadata.dalle.prompt : "image";
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

          fullExport.conversations.push({
            id: c.id,
            title: title,
            create_time: c.create_time,
            update_time: c.update_time,
            model: detail.default_model_slug || null,
            project: c._project || null,
            project_id: c._project_id || null,
            has_branches: hasBranches,
            message_count: messages.length,
            messages: messages
          });

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

      var json = JSON.stringify(fullExport, null, 2);
      var sizeMB = (json.length / 1024 / 1024).toFixed(1);

      downloadFile(json, "chatgpt_all_conversations.json", "application/json");
      setProgress(100, "Complete! " + successCount + " conversations, ~" + sizeMB + " MB");
      setButtonState(btn, "done", successCount + " conversations exported");
      log("DONE! " + successCount + " conversations, " + errorCount + " errors, ~" + sizeMB + " MB", "success");

    } catch (err) {
      log("Download failed: " + err.message, "error");
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
        tool: "GPT2Claude Migration Kit v2.1",
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
    // exportConversations now shows filter panel — user clicks Download from there
    log("Memories & instructions exported. Configure conversation filters and click Download.", "success");
  });

  document.getElementById("g2c-toggle-log").addEventListener("click", function() {
    var logVisible = logEl.classList.contains("visible");
    logEl.classList.toggle("visible");
    this.textContent = logVisible ? "Show log \u25BC" : "Hide log \u25B2";
  });

  log("Ready. Click a button to start exporting.");
})();
