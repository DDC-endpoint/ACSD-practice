/*
 * ACSD ICT practice exam: pure marking functions (no DOM, no storage).
 * UMD: in the browser this sets window.ACSDMarking; under Node/Vitest it is module.exports.
 *
 * Responses are keyed by item id (mcq/tf: option index or boolean) and by part id
 * (written: the answer text). Overrides are keyed by pointKey(partId, index) -> boolean.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module && module.exports) module.exports = api;
  else root.ACSDMarking = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  /** Collapse whitespace, turn smart quotes into straight quotes, trim. */
  function normalise(s) {
    return String(s == null ? "" : s)
      .replace(/[‘’‚‛′]/g, "'")
      .replace(/[“”„‟″]/g, '"')
      .replace(/\s+/g, " ")
      .trim();
  }

  function pointKey(partId, index) {
    return partId + "#" + index;
  }

  var compiled = {};
  function re(source) {
    return compiled[source] || (compiled[source] = new RegExp(source, "i"));
  }

  /** A point matches when every `all` regex matches and (if given) at least one `any` regex does. */
  function pointMatches(point, text) {
    var all = point.all || [];
    var any = point.any || [];
    if (!all.length && !any.length) return false;
    return (
      all.every(function (p) { return re(p).test(text); }) &&
      (!any.length || any.some(function (p) { return re(p).test(text); }))
    );
  }

  /** Mark one written part. An empty answer scores 0 and cannot be ticked. */
  function markPart(part, answer, overrides) {
    var text = normalise(answer);
    var blank = text === "";
    var ov = overrides || {};
    var raw = 0;
    var points = part.rubric.map(function (pt, i) {
      var key = pointKey(part.id, i);
      var auto = !blank && pointMatches(pt, text);
      var ticked = blank ? false : Object.prototype.hasOwnProperty.call(ov, key) ? !!ov[key] : auto;
      if (ticked) raw += pt.marks;
      return { key: key, text: pt.text, marks: pt.marks, auto: auto, ticked: ticked };
    });
    return { id: part.id, score: Math.min(raw, part.marks), max: part.marks, blank: blank, points: points };
  }

  /** Mark one item. MCQ/TF are exact: full marks or zero. */
  function markItem(item, responses, overrides) {
    var r = responses || {};
    if (item.type === "written") {
      var parts = item.parts.map(function (p) { return markPart(p, r[p.id], overrides); });
      return {
        id: item.id,
        type: item.type,
        score: parts.reduce(function (s, p) { return s + p.score; }, 0),
        max: item.marks,
        answered: parts.some(function (p) { return !p.blank; }),
        parts: parts,
      };
    }
    var resp = r[item.id];
    var answered = resp !== undefined && resp !== null && resp !== "";
    var correct = answered && resp === item.answer;
    return {
      id: item.id,
      type: item.type,
      score: correct ? item.marks : 0,
      max: item.marks,
      answered: answered,
      correct: correct,
    };
  }

  /** Mark a whole paper -> { total, max, bySection: {A: {score, max}, ...}, items: {A1: ..., ...} }. */
  function markPaper(paper, responses, overrides) {
    var out = { total: 0, max: 0, bySection: {}, items: {} };
    paper.sections.forEach(function (sec) {
      var s = { score: 0, max: 0 };
      sec.items.forEach(function (item) {
        var m = markItem(item, responses, overrides);
        out.items[item.id] = m;
        s.score += m.score;
        s.max += m.max;
      });
      out.bySection[sec.id] = s;
      out.total += s.score;
      out.max += s.max;
    });
    return out;
  }

  return {
    normalise: normalise,
    pointKey: pointKey,
    markPart: markPart,
    markItem: markItem,
    markPaper: markPaper,
  };
});
