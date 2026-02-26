// GPT2Claude Project Diagnostic — paste in browser console on chatgpt.com
// This only reads data, changes nothing, sends nothing anywhere

(async function() {
  console.log("=== GPT2Claude Project Diagnostic ===\n");
  
  var session = await (await fetch("https://chatgpt.com/api/auth/session", {credentials: "include"})).json();
  var token = session.accessToken;
  var h = {"Authorization": "Bearer " + token};
  
  // 1. Account type
  console.log("--- ACCOUNT ---");
  try {
    var acct = await (await fetch("https://chatgpt.com/backend-api/accounts/check/v4-2023-04-27", {credentials: "include", headers: h})).json();
    var accounts = acct.accounts || {};
    var ids = Object.keys(accounts).filter(function(k) { return k !== "default"; });
    if (ids.length > 0) {
      var primary = accounts[ids[0]].account || {};
      console.log("Plan: " + (primary.plan_type || "unknown"));
      console.log("Structure: " + (primary.structure || "unknown"));
      console.log("Workspace: " + (primary.workspace_type || "none"));
      console.log("Org ID: " + (primary.organization_id || "none"));
    }
  } catch(e) { console.log("Account check failed: " + e.message); }
  
  // 2. Projects API endpoint
  console.log("\n--- PROJECT ENDPOINTS ---");
  try {
    var r1 = await fetch("https://chatgpt.com/backend-api/projects", {credentials: "include", headers: h});
    console.log("/projects: HTTP " + r1.status);
    if (r1.status === 200) {
      var d1 = await r1.json();
      console.log("  Response: " + JSON.stringify(d1).substring(0, 500));
    }
  } catch(e) { console.log("/projects error: " + e.message); }
  
  try {
    var r2 = await fetch("https://chatgpt.com/backend-api/gizmos/discovery/mine", {credentials: "include", headers: h});
    console.log("/gizmos/discovery/mine: HTTP " + r2.status);
    if (r2.status === 200) {
      var d2 = await r2.json();
      console.log("  Response: " + JSON.stringify(d2).substring(0, 500));
    }
  } catch(e) { console.log("/gizmos/discovery/mine error: " + e.message); }

  // 3. DOM scrape for project links
  console.log("\n--- DOM PROJECT LINKS ---");
  var links = document.querySelectorAll('a[href*="/g/g-p-"]');
  if (links.length > 0) {
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute("href");
      var match = href.match(/g-p-[a-f0-9]+/);
      var name = links[i].textContent.trim().substring(0, 50);
      console.log("  Found: " + (match ? match[0] : href) + " — " + name);
    }
  } else {
    console.log("  No project links found in sidebar DOM");
    console.log("  (Make sure at least one project is visible in the sidebar)");
  }
  
  // 4. Check first 5 conversations for gizmo_id
  console.log("\n--- CONVERSATION GIZMO_ID CHECK ---");
  try {
    var convos = await (await fetch("https://chatgpt.com/backend-api/conversations?limit=5&offset=0", {credentials: "include", headers: h})).json();
    var items = convos.items || [];
    console.log("Conversations returned: " + items.length);
    for (var j = 0; j < items.length; j++) {
      var c = items[j];
      console.log("  " + (c.title || "Untitled").substring(0, 40) + " — gizmo_id: " + (c.gizmo_id || "null") + " — workspace_id: " + (c.workspace_id || "null"));
    }
  } catch(e) { console.log("Conversations check failed: " + e.message); }
  
  // 5. If we found project IDs, try fetching their conversations
  console.log("\n--- PROJECT CONVERSATION TEST ---");
  var projectIds = [];
  // From DOM
  var domLinks = document.querySelectorAll('a[href*="/g/g-p-"]');
  for (var k = 0; k < domLinks.length; k++) {
    var m = domLinks[k].getAttribute("href").match(/g-p-[a-f0-9]+/);
    if (m) projectIds.push(m[0]);
  }
  // From conversation gizmo_ids
  if (items) {
    for (var l = 0; l < items.length; l++) {
      if (items[l].gizmo_id && items[l].gizmo_id.startsWith("g-p-") && projectIds.indexOf(items[l].gizmo_id) === -1) {
        projectIds.push(items[l].gizmo_id);
      }
    }
  }
  
  if (projectIds.length > 0) {
    for (var p = 0; p < projectIds.length; p++) {
      try {
        var pr = await fetch("https://chatgpt.com/backend-api/gizmos/" + projectIds[p] + "/conversations?cursor=0", {credentials: "include", headers: h});
        console.log("  " + projectIds[p] + ": HTTP " + pr.status);
        if (pr.status === 200) {
          var pd = await pr.json();
          console.log("    Items: " + (pd.items ? pd.items.length : 0) + ", Cursor: " + pd.cursor);
        }
      } catch(e) { console.log("  " + projectIds[p] + " error: " + e.message); }
    }
  } else {
    console.log("  No project IDs found to test");
    console.log("  (If you have projects, expand one in the sidebar and re-run)");
  }

  console.log("\n=== DIAGNOSTIC COMPLETE ===");
  console.log("Copy everything above and share it (no personal data is included)");
})();
