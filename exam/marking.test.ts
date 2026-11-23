// AC-7 / AC-8: every registered paper has the right shape and its model answers mark to 100.
// The exam files are classic UMD scripts, so they are read and evaluated with a fake `module`.
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

interface RubricPoint { text: string; marks: number; any?: string[]; all?: string[] }
interface Part { id: string; label: string; marks: number; model: string; rubric: RubricPoint[]; wrong: string[] }
interface Item {
  id: string;
  type: "mcq" | "tf" | "written";
  marks: number;
  prompt: string;
  explain: string;
  options?: string[];
  answer?: number | boolean;
  parts?: Part[];
}
interface Paper { id: string; title: string; minutes: number; sections: { id: string; title: string; items: Item[] }[] }
interface PartResult { score: number; max: number; points: { key: string; auto: boolean; ticked: boolean }[] }
interface Marking {
  normalise(s: unknown): string;
  pointKey(partId: string, index: number): string;
  markPart(part: Part, answer: unknown, overrides?: Record<string, boolean>): PartResult;
  markPaper(
    paper: Paper,
    responses: Record<string, unknown>,
    overrides?: Record<string, boolean>,
  ): { total: number; max: number; bySection: Record<string, { score: number; max: number }> };
}

const here = dirname(fileURLToPath(import.meta.url));

function loadUmd<T>(file: string): T {
  const mod: { exports: unknown } = { exports: {} };
  new Function("module", "exports", "self", readFileSync(file, "utf8"))(mod, mod.exports, {});
  return mod.exports as T;
}

const M = loadUmd<Marking>(join(here, "marking.js"));
const papers = readdirSync(join(here, "papers"))
  .filter((f) => f.endsWith(".js"))
  .sort()
  .map((f) => loadUmd<Paper>(join(here, "papers", f)));

const items = (p: Paper) => p.sections.flatMap((s) => s.items);
const parts = (p: Paper) => items(p).flatMap((i) => i.parts ?? []);

function modelResponses(p: Paper): Record<string, unknown> {
  const r: Record<string, unknown> = {};
  for (const item of items(p)) {
    if (item.type === "written") for (const part of item.parts!) r[part.id] = part.model;
    else r[item.id] = item.answer;
  }
  return r;
}

test("1. at least one paper is registered", () => {
  expect(papers.map((p) => p.id)).toContain("mock1");
});

test("2. normalise collapses whitespace, straightens smart quotes and trims", () => {
  expect(M.normalise("  const\n\t x  =  “hi” + ‘a’ ")).toBe(`const x = "hi" + 'a'`);
  expect(M.normalise(undefined)).toBe("");
});

describe.each(papers.map((p) => [p.id, p] as const))("%s", (_id, paper) => {
  // The spec says "45 items", but the module mock's blueprint (20 MCQ + 15 TF + 5 C + 4 D + 5 E)
  // is 49 items, so the blueprint is asserted per section instead.
  test("3. follows the blueprint (20/15/5/4/5 = 49 items), section maxima 20/15/15/40/10 and total 100", () => {
    expect(paper.sections.map((s) => [s.id, s.items.length])).toEqual([
      ["A", 20], ["B", 15], ["C", 5], ["D", 4], ["E", 5],
    ]);
    expect(items(paper)).toHaveLength(49);
    const blank = M.markPaper(paper, {});
    expect(Object.fromEntries(Object.entries(blank.bySection).map(([k, v]) => [k, v.max]))).toEqual({
      A: 20, B: 15, C: 15, D: 40, E: 10,
    });
    expect(blank.max).toBe(100);
  });

  test("4. every item is well formed, with an explanation and a valid answer", () => {
    const ids = new Set<string>();
    for (const item of items(paper)) {
      expect(ids.has(item.id), `duplicate id ${item.id}`).toBe(false);
      ids.add(item.id);
      expect(item.explain, item.id).toBeTruthy();
      if (item.type === "mcq") {
        expect(Number.isInteger(item.answer), item.id).toBe(true);
        expect(item.options![item.answer as number], item.id).toBeDefined();
      } else if (item.type === "tf") {
        expect(typeof item.answer, item.id).toBe("boolean");
      } else {
        const sum = item.parts!.reduce((s, p) => s + p.marks, 0);
        expect(sum, `${item.id} parts sum`).toBe(item.marks);
      }
    }
  });

  test("5. every rubric's marks sum to its part's marks, and every part has 1-2 wrong examples", () => {
    for (const part of parts(paper)) {
      expect(part.rubric.reduce((s, pt) => s + pt.marks, 0), `${part.id} rubric sum`).toBe(part.marks);
      expect(part.model, part.id).toBeTruthy();
      expect(part.wrong.length, `${part.id} wrong examples`).toBeGreaterThanOrEqual(1);
      expect(part.wrong.length, `${part.id} wrong examples`).toBeLessThanOrEqual(2);
      for (const pt of part.rubric) {
        for (const src of [...(pt.any ?? []), ...(pt.all ?? [])]) expect(() => new RegExp(src, "i")).not.toThrow();
      }
    }
  });

  test("6. every model answer auto-ticks every rubric point", () => {
    for (const part of parts(paper)) {
      const res = M.markPart(part, part.model);
      const missed = res.points.filter((pt) => !pt.auto).map((pt) => pt.key);
      expect(missed, `${part.id} model misses`).toEqual([]);
    }
  });

  test("7. all-correct / model responses score 100", () => {
    const res = M.markPaper(paper, modelResponses(paper));
    expect(res.total).toBe(100);
    expect(res.bySection).toEqual({
      A: { score: 20, max: 20 }, B: { score: 15, max: 15 }, C: { score: 15, max: 15 },
      D: { score: 40, max: 40 }, E: { score: 10, max: 10 },
    });
  });

  test("8. all-blank responses score 0 (including whitespace-only text)", () => {
    expect(M.markPaper(paper, {}).total).toBe(0);
    const spaces: Record<string, unknown> = {};
    for (const part of parts(paper)) spaces[part.id] = "   \n\t ";
    expect(M.markPaper(paper, spaces).total).toBe(0);
  });

  test("9. every wrong example scores at most half its part", () => {
    for (const part of parts(paper)) {
      for (const w of part.wrong) {
        expect(M.markPart(part, w).score, `${part.id}: ${w}`).toBeLessThanOrEqual(part.marks / 2);
      }
    }
  });

  test("10. an override un-ticking a point lowers the total; re-ticking a blank part does not score", () => {
    const responses = modelResponses(paper);
    const part = parts(paper)[0];
    const key = M.pointKey(part.id, 0);
    const lowered = M.markPaper(paper, responses, { [key]: false });
    expect(lowered.total).toBe(100 - part.rubric[0].marks);
    expect(M.markPaper(paper, {}, { [key]: true }).total).toBe(0);
  });

  test("11. a wrong MCQ/TF answer scores zero", () => {
    const responses = modelResponses(paper);
    const mcq = items(paper).find((i) => i.type === "mcq")!;
    const tf = items(paper).find((i) => i.type === "tf")!;
    responses[mcq.id] = ((mcq.answer as number) + 1) % mcq.options!.length;
    responses[tf.id] = !tf.answer;
    expect(M.markPaper(paper, responses).total).toBe(100 - mcq.marks - tf.marks);
  });
});
