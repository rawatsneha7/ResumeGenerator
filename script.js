(function () {
  var KEY = "resume-generator:v2";

  var SAMPLE = {
    template: "classic",
    accent: "#2b5f8e",
    basics: {
      name: "Sneha Rawat", title: "B.Tech Computer Science and Engineering",
      email: "sneha.rawat@example.com", phone: "+91 00000 00000", location: "Dehradun, Uttarakhand",
      linkedin: "linkedin.com/in/your-handle", github: "github.com/your-handle", website: "",
      summary: "Pre-final year Computer Science student at UIT Dehradun with a strong base in data structures, algorithms and full-stack web development. Enjoys building practical projects and solving problems, and is looking for a software development internship."
    },
    education: [
      { school: "UIT Dehradun", degree: "B.Tech, Computer Science and Engineering", period: "2023 – 2027", score: "CGPA: 0.00 / 10", details: "Relevant coursework: Data Structures and Algorithms, DBMS, Operating Systems, Computer Networks, Object-Oriented Programming" }
    ],
    experience: [
      { role: "Software Development Intern", org: "Company name", period: "Mon YYYY – Mon YYYY", bullets: "Built a feature using React and Node.js that (describe the result, for example reduced page load time by 20%).\nDescribe a second concrete task with a number or outcome." }
    ],
    projects: [
      { name: "Project name (web app)", tech: "React, Node.js, Express, MongoDB", link: "github.com/your-handle/project", bullets: "One line on what the app does and who it helps.\nOne line on the key feature, such as login, search or an API you built." },
      { name: "Project name (C++ / Python)", tech: "C++, Python", link: "github.com/your-handle/project-2", bullets: "One line on the problem you solved.\nOne line on the approach and the result." }
    ],
    skills: [
      { group: "Languages", items: "C++, Python, Java, JavaScript, SQL" },
      { group: "Web", items: "HTML, CSS, React, Node.js, Express" },
      { group: "Databases", items: "MySQL, MongoDB" },
      { group: "Tools", items: "Git, GitHub, Linux, VS Code, Postman" },
      { group: "Core CS", items: "Data Structures, Algorithms, OOP, DBMS, Operating Systems, Computer Networks" }
    ],
    extra: "Add a hackathon, coding contest or rank here.\nAdd a club, society or leadership role here."
  };

  var LISTS = {
    education: { title: "Education", add: "Add education", blank: { school: "", degree: "", period: "", score: "", details: "" },
      fields: [["school", "Institution", 1], ["degree", "Degree / program", 1], ["period", "Period"], ["score", "CGPA / score"], ["details", "Details", 1, "area"]],
      label: function (e) { return e.school || "New education"; } },
    experience: { title: "Experience", add: "Add experience", blank: { role: "", org: "", period: "", bullets: "" },
      fields: [["role", "Role"], ["org", "Organization"], ["period", "Period", 1], ["bullets", "Bullet points (one per line)", 1, "area"]],
      label: function (e) { return (e.role || "New experience") + (e.org ? " · " + e.org : ""); } },
    projects: { title: "Projects", add: "Add project", blank: { name: "", tech: "", link: "", bullets: "" },
      fields: [["name", "Project name"], ["tech", "Tech stack"], ["link", "Link", 1], ["bullets", "Bullet points (one per line)", 1, "area"]],
      label: function (e) { return e.name || "New project"; } },
    skills: { title: "Skills", add: "Add skill group", blank: { group: "", items: "" },
      fields: [["group", "Group"], ["items", "Skills (comma separated)"]],
      label: function (e) { return e.group || "New group"; } }
  };
  var ORDER = ["education", "experience", "projects", "skills"];

  var state;
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function load() {
    try { var raw = localStorage.getItem(KEY); if (raw) { var p = JSON.parse(raw); if (p && p.basics) return p; } } catch (e) {}
    return clone(SAMPLE);
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function lines(s) { return String(s || "").split(/\r?\n/).map(function (l) { return l.replace(/^\s*[-•*]\s*/, "").trim(); }).filter(Boolean); }
  function bullets(s) { var l = lines(s); return l.length ? "<ul>" + l.map(function (b) { return "<li>" + esc(b) + "</li>"; }).join("") + "</ul>" : ""; }
  function href(u) { u = String(u || "").trim(); return /^https?:\/\//i.test(u) ? u : "https://" + u; }
  function bare(u) { return String(u || "").replace(/^https?:\/\//i, "").replace(/\/$/, ""); }
  function link(u) { return u ? '<a href="' + esc(href(u)) + '">' + esc(bare(u)) + "</a>" : ""; }

  /* ---------- editor ---------- */
  function fieldHTML(sec, idx, key, label, wide, kind, value) {
    var data = 'data-sec="' + sec + '"' + (idx === null ? "" : ' data-idx="' + idx + '"') + ' data-key="' + key + '"';
    var control = kind === "area"
      ? "<textarea " + data + ">" + esc(value) + "</textarea>"
      : '<input type="text" ' + data + ' value="' + esc(value) + '">';
    return '<label class="f' + (wide ? " wide" : "") + '">' + esc(label) + control + "</label>";
  }

  function buildEditor() {
    var b = state.basics, h = "";
    h += "<fieldset><legend>Personal details</legend><div class='grid2'>";
    [["name", "Full name", 1], ["title", "Headline", 1], ["email", "Email"], ["phone", "Phone"], ["location", "Location", 1],
     ["linkedin", "LinkedIn"], ["github", "GitHub"], ["website", "Website", 1]].forEach(function (f) {
      h += fieldHTML("basics", null, f[0], f[1], f[2], "", b[f[0]]);
    });
    h += fieldHTML("basics", null, "summary", "Summary", 1, "area", b.summary);
    h += "</div></fieldset>";

    ORDER.forEach(function (sec) {
      var cfg = LISTS[sec], list = state[sec];
      h += '<fieldset><legend>' + cfg.title + '<button class="btn small" data-act="add" data-sec="' + sec + '">' + cfg.add + "</button></legend>";
      list.forEach(function (e, i) {
        h += '<details class="entry"' + (list.length === 1 || i === list.length - 1 && e._new ? " open" : "") + "><summary><span class='t'>" + esc(cfg.label(e)) + "</span>" +
          '<span class="acts">' +
          '<button class="btn small" data-act="up" data-sec="' + sec + '" data-idx="' + i + '" aria-label="Move up"' + (i === 0 ? " disabled" : "") + ">↑</button>" +
          '<button class="btn small" data-act="down" data-sec="' + sec + '" data-idx="' + i + '" aria-label="Move down"' + (i === list.length - 1 ? " disabled" : "") + ">↓</button>" +
          '<button class="btn small danger" data-act="del" data-sec="' + sec + '" data-idx="' + i + '" aria-label="Remove">Remove</button>' +
          "</span></summary><div class='entry-body'><div class='grid2'>";
        cfg.fields.forEach(function (f) { h += fieldHTML(sec, i, f[0], f[1], f[2], f[3], e[f[0]]); });
        h += "</div></div></details>";
      });
      if (!list.length) h += "<p class='hint'>Nothing here yet.</p>";
      h += "</fieldset>";
    });

    h += "<fieldset><legend>Achievements</legend>" + fieldHTML("root", null, "extra", "One per line", 1, "area", state.extra) + "</fieldset>";
    document.getElementById("editor").innerHTML = h;
  }

  /* ---------- preview ---------- */
  function section(title, body) { return body ? "<section><h2>" + title + "</h2>" + body + "</section>" : ""; }

  function buildPaper() {
    var b = state.basics;
    var contact = [b.email && esc(b.email), b.phone && esc(b.phone), b.location && esc(b.location), link(b.linkedin), link(b.github), link(b.website)].filter(Boolean);
    var h = "<header><div><h1>" + esc(b.name || "Your name") + "</h1>" + (b.title ? '<div class="role">' + esc(b.title) + "</div>" : "") + "</div>" +
      '<div class="contact">' + contact.map(function (c) { return "<span>" + c + "</span>"; }).join("") + "</div></header>";

    h += section("Summary", b.summary ? "<p>" + esc(b.summary) + "</p>" : "");

    h += section("Education", state.education.map(function (e) {
      return '<div class="entry-p"><div class="row"><b>' + esc(e.school) + '</b><span class="date">' + esc(e.period) + "</span></div>" +
        '<div class="row"><span class="sub">' + esc(e.degree) + "</span><span class=\"date\">" + esc(e.score) + "</span></div>" +
        (e.details ? "<p>" + esc(e.details) + "</p>" : "") + "</div>";
    }).join(""));

    h += section("Experience", state.experience.map(function (e) {
      return '<div class="entry-p"><div class="row"><b>' + esc(e.role) + '</b><span class="date">' + esc(e.period) + "</span></div>" +
        (e.org ? '<div class="sub">' + esc(e.org) + "</div>" : "") + bullets(e.bullets) + "</div>";
    }).join(""));

    h += section("Projects", state.projects.map(function (e) {
      return '<div class="entry-p"><div class="row"><span><b>' + esc(e.name) + "</b>" + (e.tech ? ' <span class="sub">| ' + esc(e.tech) + "</span>" : "") + "</span>" +
        '<span class="date">' + link(e.link) + "</span></div>" + bullets(e.bullets) + "</div>";
    }).join(""));

    h += section("Skills", state.skills.filter(function (s) { return s.group || s.items; }).map(function (s) {
      return "<p><b>" + esc(s.group) + (s.group ? ":" : "") + "</b> " + esc(s.items) + "</p>";
    }).join(""));

    h += section("Achievements", bullets(state.extra));
    return h;
  }

  var paper = document.getElementById("paper"), scaler = document.getElementById("scaler"),
      stage = document.getElementById("stage"), pagecount = document.getElementById("pagecount"),
      previewBox = document.getElementById("preview");

  function fit() {
    var avail = previewBox.clientWidth - (window.innerWidth <= 900 ? 24 : 48);
    var s = Math.min(1, Math.max(0.3, avail / 794));
    scaler.style.transform = "scale(" + s + ")";
    stage.style.width = 794 * s + "px";
    stage.style.height = paper.offsetHeight * s + "px";
    var pages = Math.max(1, Math.ceil((paper.offsetHeight - 2) / 1123));
    pagecount.textContent = pages === 1 ? "Fits on 1 page" : "Runs to " + pages + " pages — trim content for a one-page resume";
    pagecount.className = "pagecount" + (pages > 1 ? " warn" : "");
  }

  function renderPreview() {
    paper.className = "paper t-" + state.template;
    paper.style.setProperty("--accent", state.accent);
    paper.innerHTML = buildPaper();
    fit();
    save();
  }

  /* ---------- events ---------- */
  var editor = document.getElementById("editor");
  editor.addEventListener("input", function (e) {
    var t = e.target, sec = t.getAttribute("data-sec"); if (!sec) return;
    var key = t.getAttribute("data-key"), idx = t.getAttribute("data-idx");
    if (sec === "root") state[key] = t.value;
    else if (idx === null) state[sec][key] = t.value;
    else {
      state[sec][+idx][key] = t.value;
      var summ = t.closest("details").querySelector("summary .t");
      if (summ) summ.textContent = LISTS[sec].label(state[sec][+idx]);
    }
    renderPreview();
  });

  editor.addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-act]"); if (!btn) return;
    e.preventDefault();
    var sec = btn.getAttribute("data-sec"), act = btn.getAttribute("data-act"), i = +btn.getAttribute("data-idx"), list = state[sec];
    if (act === "add") { var n = clone(LISTS[sec].blank); n._new = true; list.push(n); }
    if (act === "del") list.splice(i, 1);
    if (act === "up" && i > 0) { var a = list[i]; list[i] = list[i - 1]; list[i - 1] = a; }
    if (act === "down" && i < list.length - 1) { var c = list[i]; list[i] = list[i + 1]; list[i + 1] = c; }
    buildEditor();
    list.forEach(function (x) { delete x._new; });
    renderPreview();
  });

  var tpl = document.getElementById("tpl"), accent = document.getElementById("accent");
  tpl.addEventListener("change", function () { state.template = tpl.value; renderPreview(); });
  accent.addEventListener("input", function () { state.accent = accent.value; renderPreview(); });

  document.getElementById("printBtn").addEventListener("click", function () {
    try { window.print(); } catch (e) { alert("Printing is blocked here. Open the page in its own tab and try again."); }
  });
  document.getElementById("resetBtn").addEventListener("click", function () {
    if (!confirm("Reset everything to the sample resume?")) return;
    state = clone(SAMPLE); syncAll();
  });

  var dlg = document.getElementById("dlg"), json = document.getElementById("json"), dmsg = document.getElementById("dmsg");
  document.getElementById("dataBtn").addEventListener("click", function () {
    json.value = JSON.stringify(state, null, 2); dmsg.textContent = "";
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
  });
  document.getElementById("closeBtn").addEventListener("click", function () { dlg.close ? dlg.close() : dlg.removeAttribute("open"); });
  document.getElementById("copyBtn").addEventListener("click", function () {
    json.select();
    var ok = false; try { ok = document.execCommand("copy"); } catch (e) {}
    dmsg.textContent = ok ? "Copied." : "Select the text and copy it manually.";
  });
  document.getElementById("loadBtn").addEventListener("click", function () {
    try {
      var p = JSON.parse(json.value);
      if (!p || !p.basics) throw new Error("Missing basics");
      var merged = clone(SAMPLE); Object.keys(p).forEach(function (k) { merged[k] = p[k]; });
      ORDER.forEach(function (s) { if (!Array.isArray(merged[s])) merged[s] = []; });
      state = merged; syncAll();
      dlg.close ? dlg.close() : dlg.removeAttribute("open");
    } catch (err) { dmsg.textContent = "That JSON could not be loaded: " + err.message; }
  });

  var main = document.getElementById("main");
  document.querySelectorAll(".tabs .btn").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = b.getAttribute("data-view"); main.setAttribute("data-view", v);
      document.querySelectorAll(".tabs .btn").forEach(function (x) { x.setAttribute("aria-selected", String(x === b)); });
      fit();
    });
  });

  window.addEventListener("resize", fit);
  window.addEventListener("beforeprint", function () { scaler.style.transform = "none"; });
  window.addEventListener("afterprint", fit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);

  function syncAll() { tpl.value = state.template; accent.value = state.accent; buildEditor(); renderPreview(); }
  state = load();
  syncAll();
})();
