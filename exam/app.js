/*
 * ACSD ICT practice exam: UI (start screen, instructions, test, results).
 * Classic script: reads window.ACSDMarking (marking.js) and window.ACSD_PAPERS (papers/*.js).
 * State per paper lives in localStorage "acsd-ict:<paperId>":
 *   { version: 1, mode, deadline, responses, overrides, submittedAt }
 * Finished attempts are listed in "acsd-ict:history".
 */
(function () {
  "use strict";

  var M = window.ACSDMarking;
  var PAPERS = window.ACSD_PAPERS || {};
  var KEY = "acsd-ict:";
  var HISTORY_KEY = "acsd-ict:history";
  var VERSION = 1;
  var LETTERS = ["A", "B", "C", "D", "E", "F"];
  var WARN_AT = [10, 5]; // minutes

  function $(id) { return document.getElementById(id); }
  var topbar = $("topbar");
  var main = $("main");
  var qnav = $("qnav");
  var scrim = $("scrim");
  var bottombar = $("bottombar");

  // ------------------------------------------------------------------ DOM helpers

  function h(tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v == null || v === false) return;
        if (k === "class") el.className = v;
        else if (k === "text") el.textContent = v;
        else if (k === "value" || k === "checked") el[k] = v;
        else if (k === "dataset") Object.assign(el.dataset, v);
        else if (k.slice(0, 2) === "on") el.addEventListener(k.slice(2), v);
        else el.setAttribute(k, v === true ? "" : String(v));
      });
    }
    append(el, Array.prototype.slice.call(arguments, 2));
    return el;
  }

  function append(el, children) {
    children.forEach(function (c) {
      if (c == null || c === false) return;
      if (Array.isArray(c)) append(el, c);
      else el.appendChild(typeof c === "object" ? c : document.createTextNode(String(c)));
    });
  }

  var ICONS = {
    menu: '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>',
    clock: '<svg viewBox="0 0 24 24" width="16" height="16"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 7v5l3 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>',
    check: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
    cross: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" fill="none"/></svg>',
    dash: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M6 12h12" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" fill="none"/></svg>',
  };
  function icon(name) {
    var s = h("span", { class: "icon", "aria-hidden": "true" });
    s.innerHTML = ICONS[name];
    return s;
  }

  function plural(n, word) { return n + " " + word + (n === 1 ? "" : "s"); }
  function fmtDate(ms) {
    try { return new Date(ms).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }); }
    catch (e) { return new Date(ms).toLocaleString(); }
  }
  function fmtClock(ms) {
    var s = Math.max(0, Math.ceil(ms / 1000));
    var hh = Math.floor(s / 3600), mm = Math.floor((s % 3600) / 60), ss = s % 60;
    var two = function (n) { return (n < 10 ? "0" : "") + n; };
    return (hh ? hh + ":" + two(mm) : mm) + ":" + two(ss);
  }
  function reducedMotion() { return window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches; }
  function isNarrow() { return window.matchMedia && matchMedia("(max-width: 1023px)").matches; }

  /** Paper prompt mini-format: one paragraph per line, "- " bullets, ``` code fences. */
  function richText(text) {
    var out = [], list = null, code = null;
    String(text || "").split("\n").forEach(function (line) {
      if (line.trim() === "```") {
        if (code) { out.push(codeBlock(code.join("\n"))); code = null; } else { code = []; list = null; }
        return;
      }
      if (code) { code.push(line); return; }
      if (line.indexOf("- ") === 0) {
        if (!list) { list = h("ul"); out.push(list); }
        list.appendChild(h("li", { text: line.slice(2) }));
        return;
      }
      list = null;
      if (line.trim()) out.push(h("p", { text: line }));
    });
    if (code) out.push(codeBlock(code.join("\n")));
    return out;
  }
  function codeBlock(src, prose) { return h("pre", { class: prose ? "code code-prose" : "code" }, h("code", { text: src })); }

  // ------------------------------------------------------------------ storage (works without localStorage)

  var memory = {};
  var storageOK = (function () {
    try { localStorage.setItem(KEY + "probe", "1"); localStorage.removeItem(KEY + "probe"); return true; }
    catch (e) { return false; }
  })();

  function write(key, value) {
    var json = JSON.stringify(value);
    memory[key] = json;
    try { localStorage.setItem(key, json); return true; } catch (e) { return false; }
  }
  function read(key) {
    var raw = null;
    try { raw = localStorage.getItem(key); } catch (e) { /* storage blocked */ }
    if (raw == null) raw = memory[key] == null ? null : memory[key];
    if (raw == null) return null;
    try { return JSON.parse(raw); } catch (e) { return undefined; }
  }
  function remove(key) {
    delete memory[key];
    try { localStorage.removeItem(key); } catch (e) { /* storage blocked */ }
  }

  /** Load an attempt; anything corrupt or from another version is reset. */
  function loadAttempt(id) {
    var s = read(KEY + id);
    if (s === null) return null;
    var ok = s && typeof s === "object" && s.version === VERSION &&
      (s.mode === "exam" || s.mode === "practice") &&
      s.responses && typeof s.responses === "object" &&
      (s.mode !== "exam" || typeof s.deadline === "number");
    if (!ok) { remove(KEY + id); return null; }
    if (!s.overrides || typeof s.overrides !== "object") s.overrides = {};
    return s;
  }
  function loadHistory() {
    var list = read(HISTORY_KEY);
    return Array.isArray(list) ? list : [];
  }

  // ------------------------------------------------------------------ app state

  var paper = null;     // the open paper
  var attempt = null;   // its attempt state
  var index = null;     // { number: {itemId: n}, itemOf: {partId: itemId}, items: [] }
  var navOpen = !isNarrow();
  var selected = { paperId: null, mode: "exam" };
  var timerId = null;
  var warned = {};
  var saveTimer = null;
  var openFeedback = {};
  var booted = false;

  function indexPaper(p) {
    var idx = { number: {}, itemOf: {}, items: [] }, n = 0;
    p.sections.forEach(function (sec) {
      sec.items.forEach(function (item) {
        idx.number[item.id] = ++n;
        idx.items.push(item);
        (item.parts || []).forEach(function (part) { idx.itemOf[part.id] = item.id; });
      });
    });
    return idx;
  }

  function setHash(h) {
    var url = location.pathname + location.search + (h ? "#" + h : "");
    try { history.replaceState(null, "", url); } catch (e) { if (h) location.hash = h; }
  }

  function saveAttempt() { return write(KEY + paper.id, attempt); }

  function finalise(p, a) {
    clearTimeout(saveTimer);
    saveTimer = null;
    a.submittedAt = Date.now();
    write(KEY + p.id, a);
    var res = M.markPaper(p, a.responses, a.overrides);
    var hist = loadHistory();
    hist.unshift({
      date: new Date(a.submittedAt).toISOString(), paperId: p.id, paperTitle: p.title,
      mode: a.mode, score: res.total, max: res.max, submittedAt: a.submittedAt,
    });
    write(HISTORY_KEY, hist.slice(0, 100));
  }

  function autoSubmitExpired() {
    Object.keys(PAPERS).forEach(function (id) {
      var a = loadAttempt(id);
      if (a && a.mode === "exam" && !a.submittedAt && Date.now() >= a.deadline) finalise(PAPERS[id], a);
    });
  }

  function answeredCount() {
    return index.items.filter(function (item) { return M.markItem(item, attempt.responses).answered; }).length;
  }

  // ------------------------------------------------------------------ chrome: top bar, navigator, bottom bar

  function setChrome(opts) {
    document.body.classList.toggle("has-nav", !!opts.nav);
    document.body.classList.toggle("has-bottom", !!opts.bottom);
    bottombar.hidden = !opts.bottom;
    if (!opts.nav) { qnav.hidden = true; scrim.hidden = true; document.body.classList.remove("nav-open"); }
    else setNavOpen(navOpen);
  }

  function setNavOpen(open) {
    navOpen = open;
    qnav.hidden = !open;
    scrim.hidden = !(open && isNarrow());
    document.body.classList.toggle("nav-open", open);
    var btn = $("nav-toggle");
    if (btn) btn.setAttribute("aria-expanded", String(open));
  }

  function brand() {
    return h("span", { class: "tb-brand" }, h("span", { class: "tb-mark", "aria-hidden": "true", text: "ICT" }), "ACSD practice test");
  }

  function renderTopbar(kind) {
    var left = [], right = [];
    if (kind === "test") {
      left.push(
        h("button", {
          class: "icon-btn", id: "nav-toggle", type: "button", "aria-controls": "qnav",
          "aria-expanded": String(navOpen), title: "Question navigator",
          onclick: function () { setNavOpen(!navOpen); },
        }, icon("menu"), h("span", { class: "sr-only", text: "Question navigator" })),
        h("h1", { class: "tb-title", text: paper.title })
      );
      right.push(
        attempt.mode === "exam"
          ? h("div", { class: "pill timer", id: "timer", role: "timer", "aria-label": "Time remaining" },
              icon("clock"), h("span", { id: "timer-text", text: fmtClock(attempt.deadline - Date.now()) }),
              h("span", { class: "pill-suffix", text: "left" }))
          : h("div", { class: "pill" }, "Practice", h("span", { class: "pill-suffix", text: "untimed" })),
        h("div", { class: "progress" },
          h("span", { class: "progress-text", id: "progress-text" }),
          h("span", { class: "progress-bar", "aria-hidden": "true" }, h("span", { class: "progress-fill", id: "progress-fill" }))),
        h("button", { class: "btn btn-primary tb-submit", type: "button", onclick: function () { saveNow(true); confirmSubmit(); } }, "Save and Submit")
      );
    } else if (kind === "results") {
      left.push(brand(), h("span", { class: "tb-sub", text: paper.title }));
      right.push(h("div", { class: "pill pill-done" }, icon("check"), "Submitted"));
    } else {
      left.push(brand());
    }
    topbar.replaceChildren(h("div", { class: "tb-left" }, left), h("div", { class: "tb-right" }, right));
  }

  function renderNav() {
    qnav.replaceChildren();
    append(qnav, [
      h("div", { class: "qnav-head" },
        h("h2", { text: "Questions" }),
        h("button", { class: "icon-btn qnav-close", type: "button", onclick: function () { setNavOpen(false); $("nav-toggle").focus(); } },
          icon("cross"), h("span", { class: "sr-only", text: "Close navigator" }))),
      h("p", { class: "qnav-legend" },
        h("span", { class: "chip chip-answered", "aria-hidden": "true" }), "Answered",
        h("span", { class: "chip", "aria-hidden": "true" }), "Not answered"),
      paper.sections.map(function (sec) {
        return h("div", { class: "qnav-group" },
          h("h3", { text: "Section " + sec.id }),
          h("ol", { class: "qnav-grid" }, sec.items.map(function (item) {
            return h("li", null, h("button", {
              class: "qnav-btn", id: "nav-" + item.id, type: "button",
              onclick: function () { goTo(item.id); },
            }, String(index.number[item.id])));
          })));
      }),
    ]);
  }

  function updateNavItem(itemId) {
    var btn = $("nav-" + itemId);
    if (!btn) return;
    var answered = M.markItem(findItem(itemId), attempt.responses).answered;
    btn.classList.toggle("is-answered", answered);
    btn.setAttribute("aria-label", "Question " + index.number[itemId] + " (" + itemId + "), " + (answered ? "answered" : "not answered"));
  }

  function findItem(id) {
    for (var i = 0; i < index.items.length; i++) if (index.items[i].id === id) return index.items[i];
    return null;
  }

  function goTo(itemId) {
    var card = $("q-" + itemId);
    if (!card) return;
    card.scrollIntoView({ block: "start", behavior: reducedMotion() ? "auto" : "smooth" });
    card.querySelector(".q-title").focus({ preventScroll: true });
    if (isNarrow()) setNavOpen(false);
  }

  function renderBottom() {
    bottombar.replaceChildren(h("div", { class: "bottombar-inner" },
      h("p", { class: "save-status", id: "save-status", "aria-live": "polite" },
        storageOK ? "Answers save automatically" : "Browser storage is blocked: answers won't survive a reload"),
      h("span", { class: "progress-text progress-text-bottom", id: "progress-text-bottom" }),
      h("div", { class: "bottombar-actions" },
        h("button", { class: "btn", type: "button", onclick: function () { saveNow(true); } }, "Save"),
        h("button", { class: "btn btn-primary", type: "button", onclick: function () { saveNow(false); confirmSubmit(); } }, "Submit"))));
  }

  function updateProgress() {
    var done = answeredCount(), total = index.items.length;
    var text = done + " of " + total + " answered";
    var a = $("progress-text"), b = $("progress-text-bottom"), f = $("progress-fill");
    if (a) a.textContent = text;
    if (b) b.textContent = text;
    if (f) f.style.width = (100 * done / total) + "%";
  }

  // ------------------------------------------------------------------ toasts, dialog

  function toast(message, urgent) {
    var t = h("div", { class: "toast" + (urgent ? " toast-urgent" : "") },
      h("p", { text: message }),
      h("button", { class: "icon-btn", type: "button", onclick: function () { t.remove(); } },
        icon("cross"), h("span", { class: "sr-only", text: "Dismiss" })));
    if (urgent) { t.setAttribute("aria-hidden", "true"); $("alerts").textContent = message; }
    $("toasts").appendChild(t);
    setTimeout(function () { t.remove(); }, urgent ? 12000 : 5000);
  }

  function confirmDialog(title, body, okLabel, danger) {
    var dlg = $("dialog");
    $("dialog-title").textContent = title;
    $("dialog-body").textContent = body;
    var ok = $("dialog-ok");
    ok.textContent = okLabel;
    ok.className = "btn " + (danger ? "btn-danger" : "btn-primary");
    if (typeof dlg.showModal !== "function") return Promise.resolve(window.confirm(title + "\n\n" + body));
    return new Promise(function (resolve) {
      dlg.returnValue = "";
      dlg.addEventListener("close", function () { resolve(dlg.returnValue === "ok"); }, { once: true });
      dlg.showModal();
      $("dialog-cancel").focus();
    });
  }

  // ------------------------------------------------------------------ saving

  function setSaveStatus(text) { var s = $("save-status"); if (s) s.textContent = text; }

  function doSave() {
    clearTimeout(saveTimer);
    saveTimer = null;
    var ok = saveAttempt();
    var t = new Date().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
    setSaveStatus(ok ? "Saved at " + t : "Not saved: browser storage is blocked");
    return ok;
  }

  function scheduleSave() {
    setSaveStatus("Saving…");
    clearTimeout(saveTimer);
    saveTimer = setTimeout(doSave, 400);
  }

  function saveNow(announce) {
    if (!attempt || attempt.submittedAt) return;
    var ok = doSave();
    if (announce) toast(ok ? "Your answers are saved." : "Couldn't save: browser storage is blocked.");
  }

  function setResponse(key, value) {
    if (attempt.submittedAt) return;
    attempt.responses[key] = value;
    var itemId = index.itemOf[key] || key;
    updateNavItem(itemId);
    updateProgress();
    if (typeof value === "string") scheduleSave(); else doSave();
    if (openFeedback[itemId]) renderFeedback(findItem(itemId));
  }

  function setOverride(key, checked, auto) {
    if (checked === auto) delete attempt.overrides[key];
    else attempt.overrides[key] = checked;
    saveAttempt();
    refreshScores();
  }

  /** Recompute every visible score after a rubric tick changes. */
  function refreshScores() {
    var res = M.markPaper(paper, attempt.responses, attempt.overrides);
    main.querySelectorAll("[data-score]").forEach(function (el) {
      var parts = el.dataset.score.split(":"), r;
      if (parts[0] === "total") r = { score: res.total, max: res.max };
      else if (parts[0] === "sec") r = res.bySection[parts[1]];
      else if (parts[0] === "item") r = res.items[parts[1]];
      else if (parts[0] === "part") {
        var item = res.items[index.itemOf[parts[1]]];
        r = item && item.parts.filter(function (p) { return p.id === parts[1]; })[0];
      }
      if (!r) return;
      el.textContent = el.dataset.only === "score" ? String(r.score) : r.score + " / " + r.max;
    });
    if (attempt.submittedAt) {
      var hist = loadHistory();
      hist.forEach(function (e) { if (e.paperId === paper.id && e.submittedAt === attempt.submittedAt) e.score = res.total; });
      write(HISTORY_KEY, hist);
    }
  }

  // ------------------------------------------------------------------ start screen

  function statusFor(id) {
    var a = loadAttempt(id);
    if (!a) return "Not started";
    if (a.submittedAt) return "Submitted · " + M.markPaper(PAPERS[id], a.responses, a.overrides).total + " / 100";
    if (a.mode === "exam") return "In progress · Exam · " + fmtClock(a.deadline - Date.now()) + " left";
    return "In progress · Practice";
  }

  function showStart(focusId) {
    stopTimer();
    paper = null; attempt = null; index = null;
    setHash("");
    setChrome({ nav: false, bottom: false });
    renderTopbar("start");
    var ids = Object.keys(PAPERS);
    if (!PAPERS[selected.paperId]) selected.paperId = ids[0];

    main.replaceChildren(h("div", { class: "page" },
      h("h1", { class: "page-title", tabindex: "-1", text: "ACSD in-class test practice" }),
      h("p", { class: "lead", text: "Sit a full mock paper the way the real test runs: 90 minutes, 100 marks, Sections A to E. Pick a paper and a mode to begin." }),
      storageOK ? null : h("p", { class: "notice notice-warn", text: "Your browser is blocking storage for this page, so answers and history won't survive a reload." }),
      ids.length ? startForm(ids) : h("p", { class: "notice notice-bad", text: "No papers found. Keep the papers folder next to index.html." }),
      historyCard()
    ));
    var f = focusId && $(focusId);
    if (f) f.focus();
    else if (booted) main.querySelector("h1").focus({ preventScroll: true });
  }

  function startForm(ids) {
    var existing = loadAttempt(selected.paperId);
    var mode = existing ? existing.mode : selected.mode;
    var primary = !existing ? "Continue" : existing.submittedAt ? "View results" : "Resume attempt";

    function choice(name, value, checked, title, desc, onchange, disabled) {
      var id = name + "-" + value;
      return h("label", { class: "choice", for: id },
        h("input", { type: "radio", name: name, id: id, value: value, checked: checked, disabled: disabled, onchange: onchange }),
        h("span", { class: "choice-body" }, h("span", { class: "choice-title", text: title }), h("span", { class: "choice-desc", text: desc })));
    }

    return h("form", {
      class: "card start-card",
      onsubmit: function (e) {
        e.preventDefault();
        if (existing) open(selected.paperId);
        else showInstructions(selected.paperId, selected.mode);
      },
    },
      h("fieldset", { class: "choices" },
        h("legend", { text: "1. Choose a paper" }),
        ids.map(function (id) {
          var p = PAPERS[id];
          var count = p.sections.reduce(function (n, s) { return n + s.items.length; }, 0);
          return choice("paper", id, id === selected.paperId, p.title,
            count + " questions · " + (p.totalMarks || 100) + " marks · " + p.minutes + " minutes · " + statusFor(id),
            function () { selected.paperId = id; showStart("paper-" + id); });
        })),
      h("fieldset", { class: "choices" },
        h("legend", { text: "2. Choose a mode" }),
        choice("mode", "exam", mode === "exam", "Exam",
          "A 90-minute countdown that keeps running if you reload. Submits itself at 0:00. Results only after you submit.",
          function () { selected.mode = "exam"; }, !!existing),
        choice("mode", "practice", mode === "practice", "Practice",
          "No timer. A Check button on every question shows whether you're right, the explanation and the model answer.",
          function () { selected.mode = "practice"; }, !!existing),
        existing ? h("p", { class: "field-hint", text: "This paper already has an attempt in " + existing.mode + " mode. Reset it to change mode." }) : null),
      h("div", { class: "actions" },
        h("button", { class: "btn btn-primary btn-lg", type: "submit" }, primary),
        existing ? h("button", { class: "btn", type: "button", onclick: function () { resetAttempt(selected.paperId); } }, "Reset attempt") : null)
    );
  }

  function historyCard() {
    var hist = loadHistory();
    return h("section", { class: "card", "aria-labelledby": "history-h" },
      h("h2", { id: "history-h", text: "History" }),
      hist.length
        ? h("div", { class: "table-wrap" }, h("table", { class: "table" },
            h("thead", null, h("tr", null, ["Date", "Paper", "Mode", "Score"].map(function (c) { return h("th", { scope: "col", text: c }); }))),
            h("tbody", null, hist.map(function (e) {
              return h("tr", null,
                h("td", { text: fmtDate(e.submittedAt || Date.parse(e.date)) }),
                h("td", { text: e.paperTitle || e.paperId }),
                h("td", { text: e.mode === "exam" ? "Exam" : "Practice" }),
                h("td", { class: "num", text: e.score + " / " + (e.max || 100) }));
            }))))
        : h("p", { class: "muted", text: "No finished attempts yet. Submitted attempts appear here with their score." }));
  }

  function resetAttempt(id) {
    confirmDialog("Reset this attempt?",
      "Your answers for " + PAPERS[id].title + " will be deleted and you can start again. Finished attempts stay in your history.",
      "Reset attempt", true).then(function (ok) {
      if (!ok) return;
      remove(KEY + id);
      showStart();
      toast("Attempt reset.");
    });
  }

  // ------------------------------------------------------------------ instructions

  function showInstructions(id, mode) {
    paper = PAPERS[id];
    setChrome({ nav: false, bottom: false });
    renderTopbar("start");
    var d = paper.distribution;

    main.replaceChildren(h("div", { class: "page" },
      h("article", { class: "card instructions", "aria-labelledby": "instr-h" },
        h("p", { class: "eyebrow", text: (paper.heading || "Test") + " · " + paper.title }),
        h("h1", { class: "page-title", id: "instr-h", text: paper.module || paper.title }),
        h("dl", { class: "facts" },
          h("div", null, h("dt", { text: "Duration" }), h("dd", { text: paper.duration || paper.minutes + " minutes" })),
          h("div", null, h("dt", { text: "Total marks" }), h("dd", { text: String(paper.totalMarks || 100) })),
          h("div", null, h("dt", { text: "Mode" }), h("dd", { text: mode === "exam" ? "Exam (" + paper.minutes + "-minute timer)" : "Practice (untimed)" }))),
        h("p", { class: "notice" }, mode === "exam"
          ? "The timer starts when you select Begin. It keeps running if you reload or close the page, warns you at 10 and 5 minutes, and submits the test when it reaches 0:00."
          : "There is no timer. Select Check on any question to see whether you're right, the explanation and, for written answers, the model answer and marking rubric."),
        h("h2", { text: paper.instructionsTitle || "Instructions" }),
        h("ul", { class: "instructions-list" }, (paper.instructions || []).map(function (t) { return h("li", { text: t }); })),
        d ? [
          h("h2", { text: paper.distributionTitle || "Mark distribution" }),
          h("div", { class: "table-wrap" }, h("table", { class: "table" },
            h("thead", null, h("tr", null, d.columns.map(function (c, i) { return h("th", { scope: "col", class: i >= 2 ? "num" : null, text: c }); }))),
            h("tbody", null, d.rows.map(function (r) { return h("tr", null, r.map(function (c, i) { return h("td", { class: i >= 2 ? "num" : null, text: c }); })); })),
            d.total ? h("tfoot", null, h("tr", null, d.total.map(function (c, i) { return h(i ? "td" : "th", { scope: i ? null : "row", class: i >= 2 ? "num" : null, text: c }); }))) : null)),
        ] : null,
        h("div", { class: "actions" },
          h("button", { class: "btn btn-primary btn-lg", type: "button", onclick: function () { begin(id, mode); } }, "Begin test"),
          h("button", { class: "btn", type: "button", onclick: function () { showStart(); } }, "Back")))
    ));
    $("instr-h").setAttribute("tabindex", "-1");
    $("instr-h").focus();
    window.scrollTo(0, 0);
  }

  function begin(id, mode) {
    paper = PAPERS[id];
    attempt = {
      version: VERSION, mode: mode,
      deadline: mode === "exam" ? Date.now() + paper.minutes * 60000 : null,
      responses: {}, overrides: {}, submittedAt: null,
    };
    saveAttempt();
    open(id);
  }

  function open(id) {
    paper = PAPERS[id];
    attempt = loadAttempt(id);
    if (!paper || !attempt) return showStart();
    index = indexPaper(paper);
    if (!attempt.submittedAt && attempt.mode === "exam" && Date.now() >= attempt.deadline) {
      finalise(paper, attempt);
      toast("Time ran out, so the test was submitted automatically.", true);
    }
    if (attempt.submittedAt) showResults(); else showTest();
  }

  // ------------------------------------------------------------------ test

  function showTest() {
    openFeedback = {};
    setHash(paper.id + "/test");
    if (isNarrow()) navOpen = false;
    renderTopbar("test");
    renderNav();
    renderBottom();
    setChrome({ nav: true, bottom: true });

    main.replaceChildren(h("div", { class: "paper" },
      paper.sections.map(function (sec) {
        return h("section", { class: "section", id: "sec-" + sec.id, "aria-labelledby": "sec-" + sec.id + "-h" },
          h("header", { class: "section-head" },
            h("h2", { id: "sec-" + sec.id + "-h", text: sec.title }),
            sec.intro ? h("p", { text: sec.intro }) : null),
          sec.items.map(questionCard));
      }),
      paper.end ? h("div", { class: "end-note" }, paper.end.map(function (t) { return h("p", { text: t }); })) : null,
      h("div", { class: "submit-row" },
        h("button", { class: "btn btn-primary btn-lg", type: "button", onclick: function () { saveNow(false); confirmSubmit(); } }, "Submit test"))
    ));

    main.querySelectorAll("textarea").forEach(autogrow);
    index.items.forEach(function (item) { updateNavItem(item.id); });
    updateProgress();
    startTimer();
    window.scrollTo(0, 0);
  }

  function questionCard(item) {
    var n = index.number[item.id];
    var hid = "q-" + item.id + "-h", pid = "q-" + item.id + "-p";
    return h("article", { class: "q card", id: "q-" + item.id, "aria-labelledby": hid },
      h("header", { class: "q-head" },
        h("h3", { class: "q-title", id: hid, tabindex: "-1" }, "Question " + n, h("span", { class: "q-id", text: item.id })),
        h("span", { class: "q-points", text: plural(item.marks, "point") })),
      h("div", { class: "q-prompt", id: pid },
        item.title ? h("p", { class: "q-subtitle", text: item.id + ". " + item.title }) : null,
        richText(item.prompt),
        item.code ? codeBlock(item.code) : null),
      answerArea(item, n, pid),
      attempt.mode === "practice"
        ? h("div", { class: "q-check" }, h("button", {
            class: "btn btn-small", type: "button", "aria-controls": "fb-" + item.id,
            onclick: function () { openFeedback[item.id] = true; doSave(); renderFeedback(item); },
          }, "Check"))
        : null,
      h("div", { class: "feedback", id: "fb-" + item.id, "aria-live": "polite" })
    );
  }

  function answerArea(item, n, pid) {
    if (item.type === "written") {
      return item.parts.map(function (part) {
        var taId = "ta-" + part.id, hintId = "hint-" + part.id, code = part.format === "code";
        return h("div", { class: "part" },
          h("label", { class: part.label ? "part-prompt" : "field-label", for: taId },
            part.label ? [h("span", { class: "part-label", text: part.label + "." }), " ", part.prompt] : "Your answer"),
          h("textarea", {
            id: taId, class: "answer" + (code ? " answer-code" : ""), rows: code ? 6 : 4,
            spellcheck: code ? "false" : "true", autocapitalize: "off", autocomplete: "off",
            "aria-describedby": part.label ? hintId : pid + " " + hintId,
            value: attempt.responses[part.id] || "",
            oninput: function (e) { autogrow(e.target); setResponse(part.id, e.target.value); },
            onkeydown: code ? onCodeKeydown : null,
          }),
          h("p", { class: "field-hint", id: hintId, text: code
            ? "Tab inserts 2 spaces. To leave the box, press Esc and then Tab."
            : plural(part.marks, "mark") }));
      });
    }
    var options = item.type === "tf" ? [true, false] : item.options.map(function (_, i) { return i; });
    return h("fieldset", { class: "options" + (item.type === "tf" ? " options-tf" : ""), "aria-describedby": pid },
      h("legend", { class: "sr-only", text: "Question " + n + " (" + item.id + "): " + (item.type === "tf" ? "True or False" : "choose one answer") }),
      options.map(function (value) {
        return h("label", { class: "option" },
          h("input", {
            type: "radio", name: "r-" + item.id, value: String(value),
            checked: attempt.responses[item.id] === value,
            onchange: function () { setResponse(item.id, value); },
          }),
          item.type === "tf" ? null : h("span", { class: "option-letter", text: LETTERS[value] + "." }),
          h("span", { class: "option-text", text: item.type === "tf" ? (value ? "True" : "False") : item.options[value] }));
      }));
  }

  function autogrow(ta) {
    ta.style.height = "auto";
    ta.style.height = ta.scrollHeight + (ta.offsetHeight - ta.clientHeight) + "px";
  }

  /** Tab inserts two spaces in code boxes; Esc then Tab leaves (no keyboard trap); Shift+Tab always leaves. */
  function onCodeKeydown(e) {
    var ta = e.target;
    if (e.key === "Escape") { ta.dataset.escaped = "1"; return; }
    if (e.key === "Tab" && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
      if (ta.dataset.escaped) { delete ta.dataset.escaped; return; }
      e.preventDefault();
      var inserted = false;
      try { inserted = document.execCommand("insertText", false, "  "); } catch (err) { inserted = false; }
      if (!inserted) {
        ta.setRangeText("  ", ta.selectionStart, ta.selectionEnd, "end");
        ta.dispatchEvent(new Event("input", { bubbles: true }));
      }
      return;
    }
    delete ta.dataset.escaped;
  }

  function answerText(item, value) {
    if (value === undefined || value === null || value === "") return null;
    if (item.type === "tf") return value ? "True" : "False";
    return LETTERS[value] + ". " + item.options[value];
  }

  /** Practice-mode Check: the result, the explanation and (written) the model answer + rubric. */
  function renderFeedback(item) {
    var box = $("fb-" + item.id);
    var m = M.markItem(item, attempt.responses, attempt.overrides);
    if (item.type === "written") {
      box.replaceChildren(h("div", { class: "fb fb-written" },
        h("p", { class: "fb-status" },
          h("strong", { dataset: { score: "item:" + item.id } }, m.score + " / " + m.max), " marks · ",
          h("span", { class: "provisional", text: "provisional (auto-marked; adjust the ticks)" })),
        h("p", { class: "fb-explain", text: item.explain }),
        item.parts.map(function (part, i) { return partReview(part, m.parts[i], false); })));
    } else {
      var state = !m.answered ? "none" : m.correct ? "ok" : "bad";
      box.replaceChildren(h("div", { class: "fb fb-" + state },
        h("p", { class: "fb-status" }, icon(state === "ok" ? "check" : state === "bad" ? "cross" : "dash"),
          state === "ok" ? "Correct" : state === "bad" ? "Incorrect" : "Not answered yet", " · " + m.score + " / " + m.max),
        state === "ok" ? null : h("p", null, h("strong", { text: "Correct answer: " }), answerText(item, item.answer)),
        h("p", { class: "fb-explain", text: item.explain }),
        item.note ? h("p", { class: "fb-note" }, h("strong", { text: "Note: " }), item.note) : null));
    }
  }

  function partReview(part, pr, showYours) {
    return h("div", { class: "part-review" },
      part.label ? h("p", { class: "part-review-title" }, h("strong", { text: "Part " + part.label }), " · ",
        h("span", { dataset: { score: "part:" + part.id } }, pr.score + " / " + pr.max)) : null,
      showYours ? [
        h("h4", { text: "Your answer" }),
        pr.blank ? h("p", { class: "muted", text: "Not answered." }) : codeBlock(attempt.responses[part.id], part.format !== "code"),
      ] : null,
      h("h4", { text: "Model answer" }),
      codeBlock(part.model, part.format !== "code"),
      rubricBlock(part, pr));
  }

  function rubricBlock(part, pr) {
    return h("fieldset", { class: "rubric" },
      h("legend", null, "Rubric · ", h("span", { dataset: { score: "part:" + part.id } }, pr.score + " / " + pr.max), " marks"),
      pr.blank ? h("p", { class: "muted", text: "No answer, so this part scores 0." }) : null,
      h("ul", { class: "rubric-list" }, pr.points.map(function (pt) {
        return h("li", null, h("label", { class: "rubric-point" },
          h("input", {
            type: "checkbox", checked: pt.ticked, disabled: pr.blank,
            onchange: function (e) { setOverride(pt.key, e.target.checked, pt.auto); },
          }),
          h("span", { class: "rubric-text", text: pt.text }),
          h("span", { class: "rubric-meta" },
            h("span", { class: "rubric-marks", text: plural(pt.marks, "mark") }),
            pt.auto ? h("span", { class: "tag", title: "Ticked automatically: your answer matched this point", text: "auto" }) : null)));
      })));
  }

  // ------------------------------------------------------------------ timer & submit

  function startTimer() {
    stopTimer();
    if (attempt.mode !== "exam") return;
    warned = {};
    var left = attempt.deadline - Date.now();
    WARN_AT.forEach(function (m) { if (left <= m * 60000) warned[m] = true; });
    tick();
    timerId = setInterval(tick, 1000);
  }

  function stopTimer() { clearInterval(timerId); timerId = null; }

  function tick() {
    if (!attempt || attempt.submittedAt || attempt.mode !== "exam") return stopTimer();
    var left = attempt.deadline - Date.now();
    if (left <= 0) return autoSubmit();
    var pill = $("timer");
    if (pill) {
      $("timer-text").textContent = fmtClock(left);
      pill.classList.toggle("is-warn", left <= 10 * 60000 && left > 5 * 60000);
      pill.classList.toggle("is-danger", left <= 5 * 60000);
    }
    WARN_AT.forEach(function (m) {
      if (!warned[m] && left <= m * 60000) {
        warned[m] = true;
        toast(m + " minutes left. The test submits itself at 0:00.", true);
      }
    });
  }

  function autoSubmit() {
    stopTimer();
    finalise(paper, attempt);
    showResults();
    toast("Time is up. Your test was submitted automatically.", true);
  }

  function confirmSubmit() {
    var left = index.items.length - answeredCount();
    confirmDialog("Submit your test?",
      (left ? "You have " + plural(left, "unanswered question") + ". " : "You have answered every question. ") +
      "You can't change your answers after you submit.", "Submit").then(function (ok) {
      if (!ok || attempt.submittedAt) return;
      stopTimer();
      finalise(paper, attempt);
      showResults();
    });
  }

  // ------------------------------------------------------------------ results

  function showResults() {
    stopTimer();
    setHash(paper.id + "/results");
    setChrome({ nav: false, bottom: false });
    renderTopbar("results");
    var res = M.markPaper(paper, attempt.responses, attempt.overrides);
    var timedOut = attempt.mode === "exam" && attempt.submittedAt >= attempt.deadline;

    main.replaceChildren(h("div", { class: "page page-wide" },
      h("section", { class: "card results-summary", "aria-labelledby": "results-h" },
        h("p", { class: "eyebrow", text: paper.title + " · " + (attempt.mode === "exam" ? "Exam mode" : "Practice mode") }),
        h("h1", { class: "page-title", id: "results-h", tabindex: "-1", text: "Results" }),
        h("p", { class: "total" },
          h("span", { class: "total-score", dataset: { score: "total", only: "score" } }, String(res.total)),
          h("span", { class: "total-max", text: " / " + res.max })),
        h("p", { class: "muted" }, "Submitted " + fmtDate(attempt.submittedAt) + (timedOut ? " · time ran out, so it was submitted automatically" : "")),
        h("div", { class: "table-wrap" }, h("table", { class: "table section-table" },
          h("caption", { class: "sr-only", text: "Score per section" }),
          h("thead", null, h("tr", null, h("th", { scope: "col", text: "Section" }), h("th", { scope: "col", class: "num", text: "Score" }))),
          h("tbody", null, paper.sections.map(function (sec) {
            var written = sec.items.some(function (i) { return i.type === "written"; });
            return h("tr", null,
              h("th", { scope: "row" }, sec.title.replace(/\s*\(\d+ marks\)\s*$/, ""),
                written ? h("span", { class: "provisional", text: "provisional (auto-marked; adjust the ticks)" }) : null),
              h("td", { class: "num", dataset: { score: "sec:" + sec.id } }, res.bySection[sec.id].score + " / " + res.bySection[sec.id].max));
          })),
          h("tfoot", null, h("tr", null, h("th", { scope: "row", text: "Total" }), h("td", { class: "num", dataset: { score: "total" } }, res.total + " / " + res.max))))),
        h("p", { class: "notice", text: "Sections C and D are marked automatically against a rubric. Compare your answer with the model answer, then tick or untick each rubric point to match: the totals update as you go." }),
        h("div", { class: "actions no-print" },
          h("button", { class: "btn btn-primary", type: "button", onclick: function () { window.print(); } }, "Print / save PDF"),
          h("button", { class: "btn", type: "button", onclick: function () { showStart(); } }, "Back to start"),
          h("button", { class: "btn btn-quiet", type: "button", onclick: function () { resetAttempt(paper.id); } }, "Reset attempt"))),
      paper.sections.map(function (sec) {
        return h("section", { class: "review-section", "aria-labelledby": "rev-" + sec.id },
          h("h2", { id: "rev-" + sec.id, text: sec.title }),
          sec.items.map(function (item) { return reviewCard(item, res.items[item.id]); }));
      })
    ));
    $("results-h").focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }

  function reviewCard(item, m) {
    var n = index.number[item.id];
    var state = item.type === "written" ? null : !m.answered ? "none" : m.correct ? "ok" : "bad";
    return h("article", { class: "q card review" + (state ? " review-" + state : ""), "aria-labelledby": "rv-" + item.id },
      h("header", { class: "q-head" },
        h("h3", { class: "q-title", id: "rv-" + item.id }, "Question " + n, h("span", { class: "q-id", text: item.id })),
        h("span", { class: "q-points" },
          state ? h("span", { class: "badge badge-" + state }, icon(state === "ok" ? "check" : state === "bad" ? "cross" : "dash"),
            state === "ok" ? "Correct" : state === "bad" ? "Incorrect" : "Not answered") : null,
          h("span", { dataset: { score: "item:" + item.id } }, m.score + " / " + m.max))),
      h("div", { class: "q-prompt" },
        item.title ? h("p", { class: "q-subtitle", text: item.id + ". " + item.title }) : null,
        richText(item.prompt),
        item.code ? codeBlock(item.code) : null),
      item.type === "written"
        ? item.parts.map(function (part, i) {
            return h("div", { class: "part" },
              part.label ? h("p", { class: "part-prompt" }, h("span", { class: "part-label", text: part.label + "." }), " ", part.prompt) : null,
              partReview(part, m.parts[i], true));
          })
        : h("dl", { class: "review-answers" },
            h("div", null, h("dt", { text: "Your answer" }), h("dd", { text: answerText(item, attempt.responses[item.id]) || "Not answered" })),
            h("div", null, h("dt", { text: "Correct answer" }), h("dd", { text: answerText(item, item.answer) }))),
      h("p", { class: "fb-explain" }, h("strong", { text: "Why: " }), item.explain),
      item.note ? h("p", { class: "fb-note" }, h("strong", { text: "Note: " }), item.note) : null);
  }

  // ------------------------------------------------------------------ boot

  scrim.addEventListener("click", function () { setNavOpen(false); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && navOpen && isNarrow() && !qnav.hidden) { setNavOpen(false); var b = $("nav-toggle"); if (b) b.focus(); }
  });
  document.addEventListener("visibilitychange", function () { if (!document.hidden && timerId) tick(); });
  window.addEventListener("pagehide", function () { if (saveTimer && attempt) doSave(); });
  if (window.matchMedia) {
    matchMedia("(max-width: 1023px)").addEventListener("change", function (e) {
      navOpen = !e.matches;
      if (document.body.classList.contains("has-nav")) setNavOpen(navOpen);
    });
  }

  if (!M) {
    main.replaceChildren(h("p", { class: "notice notice-bad", text: "marking.js didn't load. Keep all the exam files together in one folder." }));
    return;
  }
  autoSubmitExpired();
  var m = /^#(\w+)\/(test|results)$/.exec(location.hash);
  if (m && PAPERS[m[1]] && loadAttempt(m[1])) open(m[1]);
  else showStart();
  booted = true;
})();
