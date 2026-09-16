// Run without credentials: node --test tests/competition-detail.test.mjs
// Uses the existing TypeScript dependency, not a new test/build toolchain.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { test } from "node:test";
import ts from "typescript";
import { createElement } from "react";
import * as jsxRuntime from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";
const id = "11111111-1111-1111-1111-111111111111";
const competition = { id, name: "Test competition", type: "domestic", countries: null };
const source = readFileSync(new URL("../src/lib/features/competitions/detail.ts", import.meta.url), "utf8");
const listSource = readFileSync(new URL("../src/lib/features/competitions/queries.ts", import.meta.url), "utf8");

function load(fixtures = {}, failures = {}, clientError) {
  const calls = [];
  const client = {
    from(table) {
      let rows = fixtures[table] ?? [];
      let limit = Infinity;
      const query = {
        select(...args) { calls.push([table, "select", ...args]); return query; },
        eq(key, value) {
          calls.push([table, "eq", key, value]);
          rows = rows.filter((row) => key.split(".").reduce((part, field) => part?.[field], row) === value);
          return query;
        },
        order(...args) { calls.push([table, "order", ...args]); return query; },
        limit(value) { limit = value; calls.push([table, "limit", value]); return query; },
        maybeSingle() { return Promise.resolve({ data: rows[0] ?? null, error: failures[table] ?? null }); },
        then(success, failure) {
          return Promise.resolve({ data: rows.slice(0, limit), count: rows.length, error: failures[table] ?? null }).then(success, failure);
        },
      };
      return query;
    },
  };
  const compiled = { exports: {} };
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  runInNewContext(code, {
    exports: compiled.exports,
    require(name) {
      if (name === "react") return { cache: (fn) => fn };
      if (name === "next/navigation") return { unstable_rethrow: (error) => { if (error?.frameworkSignal) throw error; } };
      if (name === "@/lib/core/supabase/server") return { createClient: async () => { if (clientError) throw clientError; return client; } };
      throw new Error(`Unexpected import: ${name}`);
    },
  });
  return { get: compiled.exports.getCompetitionDetail, calls };
}

test("invalid UUIDs never query the database", async () => {
  const { get, calls } = load();
  for (const value of ["ghana-premier-league", "", "../players", `${id}/extra`]) assert.equal((await get(value)).state, "missing");
  assert.equal(calls.length, 0);
});

test("missing competition stops before coverage queries", async () => {
  const { get, calls } = load();
  assert.equal((await get(id)).state, "missing");
  assert.ok(calls.every(([table]) => table === "competitions"));
});

test("database failure is not confused with a missing competition", async () => {
  assert.equal((await load({}, { competitions: { message: "offline" } }).get(id)).state, "unavailable");
  assert.equal((await load({}, {}, new Error("offline")).get(id)).state, "unavailable");
});

test("empty published coverage remains genuinely empty", async () => {
  const result = await load({ competitions: [competition] }).get(id);
  assert.equal(result.state, "ready");
  for (const section of [result.players, result.reports]) {
    assert.equal(section.rows.length, 0);
    assert.equal(section.total, 0);
    assert.equal(section.unavailable, false);
  }
});

test("broader admin/owner access still excludes drafts, unrelated records and draft report parents", async () => {
  const player = { id: "player", slug: "player", full_name: "Test player", status: "published", current_competition_id: id };
  const report = { id: "report", status: "published", competition_id: id, players: { slug: "historical-player", full_name: "Historical player", status: "published", current_competition_id: null } };
  const { get, calls } = load({
    competitions: [competition],
    players: [player, { ...player, id: "draft", status: "draft" }, { ...player, id: "other", current_competition_id: null }],
    scout_reports: [report, { ...report, id: "draft", status: "draft" }, { ...report, id: "other", competition_id: null }, { ...report, id: "draft-parent", players: { ...report.players, status: "draft" } }],
  });
  const result = await get(id);
  assert.equal(result.players.total, 1);
  assert.equal(result.reports.total, 1);
  assert.equal(result.reports.rows[0].id, "report"); // historical membership, not current player assignment
  const select = calls.find(([table, method]) => table === "scout_reports" && method === "select");
  assert.match(select[2], /players!inner/);
  assert.equal(select[3].count, "exact");
});

test("coverage is bounded with exact totals, and a section failure preserves the other section", async () => {
  const players = Array.from({ length: 30 }, (_, n) => ({ id: `${n}`, status: "published", current_competition_id: id }));
  const result = await load({ competitions: [competition], players }, { scout_reports: { message: "offline" } }).get(id);
  assert.equal(result.players.rows.length, 24);
  assert.equal(result.players.total, 30);
  assert.equal(result.players.unavailable, false);
  assert.equal(result.reports.unavailable, true);
  assert.equal(result.reports.total, null);
  assert.equal(result.reports.rows.length, 0);
});

test("Next.js framework control-flow errors are rethrown", async () => {
  const signal = { frameworkSignal: true };
  await assert.rejects(load({}, {}, signal).get(id), (error) => error === signal);
});

function loadCompetitionList(clientError) {
  const compiled = { exports: {} };
  const code = ts.transpileModule(listSource, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  runInNewContext(code, {
    exports: compiled.exports,
    require(name) {
      if (name === "next/navigation") {
        return { unstable_rethrow: (error) => { if (error?.frameworkSignal) throw error; } };
      }
      if (name === "@/lib/core/supabase/server") {
        return { createClient: async () => { throw clientError; } };
      }
      throw new Error(`Unexpected competition list import: ${name}`);
    },
  });
  return compiled.exports.listCompetitions;
}

test("competition list reports ordinary database failures as unavailable", async () => {
  const result = await loadCompetitionList(new Error("offline"))();
  assert.equal(result.unavailable, true);
  assert.equal(result.competitions.length, 0);
});

test("competition list preserves Next.js framework control-flow errors", async () => {
  const signal = { frameworkSignal: true };
  await assert.rejects(loadCompetitionList(signal)(), (error) => error === signal);
});

function loadPage(result) {
  const pageSource = readFileSync(new URL("../src/app/(public)/leagues/[id]/page.tsx", import.meta.url), "utf8");
  const compiled = { exports: {} };
  const code = ts.transpileModule(pageSource, { fileName: "page.tsx", compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  runInNewContext(code, {
    exports: compiled.exports,
    require(name) {
      if (name === "react/jsx-runtime") return jsxRuntime;
      if (name === "next/link") return { default: ({ children, ...props }) => createElement("a", props, children) };
      if (name === "next/navigation") return { notFound: () => { throw new Error("NOT_FOUND"); } };
      if (name === "lucide-react") return {};
      if (name === "@/components/shared/empty-state") return { EmptyState: ({ title, description }) => createElement("div", null, title, description) };
      if (name === "@/lib/features/competitions/detail") return { getCompetitionDetail: async () => result };
      throw new Error(`Unexpected page import: ${name}`);
    },
  });
  return compiled.exports;
}

test("page renders genuine empty states, and unavailable metadata is not indexable", async () => {
  const result = await load({ competitions: [competition] }).get(id);
  const page = loadPage(result);
  const html = renderToStaticMarkup(await page.default({ params: Promise.resolve({ id }) }));
  assert.match(html, /No published players linked yet/);
  assert.match(html, /No published reports linked yet/);
  assert.match(html, /Fixtures and standings are not available yet/);
  const offline = loadPage({ state: "unavailable" });
  assert.equal((await offline.generateMetadata({ params: Promise.resolve({ id }) })).robots.index, false);
  await assert.rejects(loadPage({ state: "missing" }).default({ params: Promise.resolve({ id }) }), /NOT_FOUND/);
});

test("populated pages link actual player dossiers and historical report routes", async () => {
  const result = await load({ competitions: [competition], players: [{ id: "p", slug: "test-player", full_name: "Test player", status: "published", current_competition_id: id }], scout_reports: [{ id: "r", competition_id: id, status: "published", match_date: "2026-09-01", match_description: "Recorded match", players: { slug: "test-player", full_name: "Test player", status: "published" } }] }).get(id);
  const html = renderToStaticMarkup(await loadPage(result).default({ params: Promise.resolve({ id }) }));
  assert.match(html, /href="\/players\/test-player"/);
  assert.match(html, /href="\/players\/test-player\/reports\/r"/);
  assert.match(html, /Showing 1 of 1/);
  assert.doesNotMatch(html, /No published players linked yet/);
});
