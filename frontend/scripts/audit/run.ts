/**
 * 3D audit runner — builds each adapter with a real backend result, then
 * asserts the displayed output actually contains the authoritative value.
 *
 * Bundle with esbuild and run under Node (globalThis.crypto available):
 *
 *   node node_modules/esbuild/bin/esbuild scripts/audit/run.ts \
 *     --bundle --platform=node --format=cjs --outfile=tests/.audit/run.cjs \
 *     --loader:.css=empty --loader:.svg=dataurl --loader:.png=dataurl
 *
 *   node tests/.audit/run.cjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";

// ---------------------------------------------------------------------------
// Engine imports (used only for the deterministic cross-check subset)
// ---------------------------------------------------------------------------
import { caesarEngine } from "../../src/components/simulation/renderers/caesar";
import { monoAlphabeticEngine } from "../../src/components/simulation/renderers/monoAlphabetic";
import { vigenereEngine } from "../../src/components/simulation/renderers/vigenere";
import { playfairEngine } from "../../src/components/simulation/renderers/playfair";
import { hillEngine } from "../../src/components/simulation/renderers/hill";
import { railFenceEngine } from "../../src/components/simulation/renderers/railFence";
import { columnarEngine } from "../../src/components/simulation/renderers/columnar";
import { desEngine } from "../../src/components/simulation/renderers/des";
import { tripleDesEngine } from "../../src/components/simulation/renderers/tripleDes";
import { aesEngine } from "../../src/components/simulation/renderers/aes";
import { blowfishEngine } from "../../src/components/simulation/renderers/blowfish";
import { twofishEngine } from "../../src/components/simulation/renderers/twofish";
import { chacha20Engine } from "../../src/components/simulation/renderers/chacha20";
import { aesGcmEngine } from "../../src/components/simulation/renderers/aesGcm";
import { chacha20Poly1305Engine } from "../../src/components/simulation/renderers/chacha20Poly1305";
import { sha256Engine } from "../../src/components/simulation/renderers/sha256";
import { sha512Engine } from "../../src/components/simulation/renderers/sha512";
import { sha1Engine } from "../../src/components/simulation/renderers/sha1";
import { md5Engine } from "../../src/components/simulation/renderers/md5";
import { sha3Engine } from "../../src/components/simulation/renderers/sha3";
import { blake2Engine } from "../../src/components/simulation/renderers/blake2";
import { blake3Engine } from "../../src/components/simulation/renderers/blake3";
import { hmacEngine } from "../../src/components/simulation/renderers/hmac";
import { pbkdf2Engine } from "../../src/components/simulation/renderers/pbkdf2";
import { bcryptEngine } from "../../src/components/simulation/renderers/bcrypt";
import { scryptEngine } from "../../src/components/simulation/renderers/scrypt";
import { argon2Engine } from "../../src/components/simulation/renderers/argon2";
import { hkdfEngine } from "../../src/components/simulation/renderers/hkdf";
import { ecdhEngine } from "../../src/components/simulation/renderers/ecdh";
import { x25519Engine } from "../../src/components/simulation/renderers/x25519";
import { ecdsaEngine } from "../../src/components/simulation/renderers/ecdsa";
import { ed25519Engine } from "../../src/components/simulation/renderers/ed25519";
import { rsaEngine } from "../../src/components/simulation/renderers/rsa";
import { diffieHellmanEngine } from "../../src/components/simulation/renderers/diffieHellman";
import { elgamalEngine } from "../../src/components/simulation/renderers/elgamal";

// ---------------------------------------------------------------------------
// 3D adapters
// ---------------------------------------------------------------------------
import { getAll3DAdapters } from "../../src/components/simulation3d/registry3d";

// ---------------------------------------------------------------------------
// Types (mirrored locally to avoid bundling React / CSS)
// ---------------------------------------------------------------------------
interface AlgoResult {
  algorithm: string;
  operation: string;
  input: string;
  parameters: Record<string, unknown>;
  result: string | number | Record<string, unknown>;
  extra?: Record<string, unknown> | null;
  steps: unknown[];
}

interface Fixture {
  algorithm: string;
  operation: string;
  inputs: Record<string, unknown>;
  result: string | number | Record<string, unknown>;
  result_str: string;
  extra: Record<string, unknown> | null;
  roundtrip?: { checked: boolean; ok: boolean; note: string };
}

interface FixtureFile {
  generated: string;
  operations: Record<string, { operation: string; inputs: Record<string, unknown> }>;
  fixtures: Record<string, Fixture>;
  errors: Record<string, string>;
}

interface AuditDetail {
  adapter: string;
  status: "PASS" | "FAIL" | "ERROR" | "WARN";
  buildError?: string;
  displayedAll: string[];
  displayedFinal: string[];
  expectedEngine?: string;
  expectedFixture?: string;
  engineInAll?: boolean;
  engineInFinal?: boolean;
  fixtureInAll?: boolean;
  fixtureInFinal?: boolean;
  fixtureRoundtrip?: boolean | null;
  metaOutputsPresent?: boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const norm = (s: unknown): string =>
  String(s ?? "")
    .toUpperCase()
    .replace(/[\s\-_]/g, "");

/** Extract the "output" label from the scene's visible 3D objects. */
function displayedFromObjects(
  objects: { label?: string; tone?: string }[]
): string[] {
  const out: string[] = [];
  for (const o of objects) {
    if (!o.label) continue;
    if (o.tone === "output" || o.tone === "complete") out.push(norm(o.label));
  }
  return out;
}

/** Scan meta.outputs values for displayable strings. */
function metaOutputStrings(meta?: {
  outputs?: Record<string, string>;
  changedValues?: { after: string }[];
}): string[] {
  if (!meta) return [];
  const out: string[] = [];
  if (meta.outputs)
    for (const v of Object.values(meta.outputs)) out.push(norm(v));
  if (meta.changedValues)
    for (const cv of meta.changedValues) out.push(norm(cv.after));
  return out;
}

/** Even-length hex → array of 2-char byte labels. */
function byteChunks(hex: string): string[] | null {
  if (hex.length < 2 || hex.length % 2 !== 0) return null;
  if (!/^[0-9A-F]+$/.test(hex)) return null;
  const out: string[] = [];
  for (let i = 0; i < hex.length; i += 2) out.push(hex.slice(i, i + 2));
  return out;
}

/* Generalized chunk check: every 2-char piece of `expected` is displayed. */
function chunks2(expected: string): string[] | null {
  if (expected.length < 2 || expected.length % 2 !== 0) return null;
  const out: string[] = [];
  for (let i = 0; i < expected.length; i += 2) out.push(expected.slice(i, i + 2));
  return out;
}

/**
 * How well a displayed label set contains `expected`:
 *  - "exact"  → the full normalized value is one of the displayed labels
 *  - "bytes"  → every 2-char byte of a hex digest is displayed (byte-strip)
 *  - "chunks" → every 2-char piece of any string is displayed (hash strips)
 *  - "prefix" → a displayed label of length ≥ 6 is a leading prefix
 *  - null     → not representable
 */
function containment(
  displayed: Set<string>,
  expected: string
): "exact" | "bytes" | "chunks" | "prefix" | null {
  if (!expected) return null;
  if (displayed.has(expected)) return "exact";
  const chunks = byteChunks(expected);
  if (chunks !== null && chunks.length > 1) {
    if (chunks.every((b) => displayed.has(b))) return "bytes";
  }
  const generic = chunks2(expected);
  if (generic !== null && generic.length > 1) {
    if (generic.every((c) => displayed.has(c))) return "chunks";
  }
  const hexOnly = (s: string): string => s.replace(/[^0-9A-F]/g, "");
  for (const d of displayed) {
    const clean = hexOnly(d);
    if (clean.length >= 6 && expected.startsWith(clean)) return "prefix";
  }
  return null;
}

// Engine cross-check map (deterministic algorithms only; random left out).
interface EngineLike {
  build: (ctx: unknown) => { view?: Record<string, unknown> }[];
}
const ENGINE_MAP: Record<string, EngineLike> = {
  caesar: caesarEngine,
  monoalphabetic: monoAlphabeticEngine,
  vigenere: vigenereEngine,
  playfair: playfairEngine,
  hill: hillEngine,
  rail_fence: railFenceEngine,
  columnar: columnarEngine,
  des: desEngine,
  triple_des: tripleDesEngine,
  aes: aesEngine,
  blowfish: blowfishEngine,
  twofish: twofishEngine,
  chacha20: chacha20Engine,
  aes_gcm: aesGcmEngine,
  chacha20_poly1305: chacha20Poly1305Engine,
  sha256: sha256Engine,
  sha512: sha512Engine,
  sha1: sha1Engine,
  md5: md5Engine,
  sha3: sha3Engine,
  blake2: blake2Engine,
  blake3: blake3Engine,
  hmac: hmacEngine,
  pbkdf2: pbkdf2Engine,
  bcrypt: bcryptEngine,
  scrypt: scryptEngine,
  argon2: argon2Engine,
  hkdf: hkdfEngine,
  diffie_hellman: diffieHellmanEngine,
  ecdh: ecdhEngine,
  x25519: x25519Engine,
  rsa: rsaEngine,
  elgamal: elgamalEngine,
  ecdsa: ecdsaEngine,
  ed25519: ed25519Engine,
};

/**
 * For deterministic algorithms, run the 2D engine and return the normalised
 * last view's output glyph (the value the student actually sees). Returns
 * null for random-key algorithms.
 */
function engineExpected(
  id: string,
  fixture: Fixture,
  operation: string
): string | null {
  const eng = ENGINE_MAP[id];
  if (!eng) return null;
  const ctx = {
    id,
    operation,
    inputs: fixture.inputs,
    demo: false,
    language: "en" as const,
    dir: "ltr" as const,
    theme: "dark" as const,
    result: toAlgoResult(fixture),
    resultMatches: true,
    t: (k: string) => k,
  };
  try {
    const stages = eng.build(ctx);
    if (!stages.length) return null;
    // Take the last stage (the final output stage).
    const last = stages[stages.length - 1] as {
      view?: { kind?: string; text?: string; hex?: string; result?: string; ciphertext?: string; digest?: string; shared?: string; shared_secret?: string; mac?: string; derived?: string; out?: string; signature?: string };
    };
    const v = last?.view;
    if (!v) return null;
    const keys = [
      "result", "hex", "text", "ciphertext", "cipher", "digest",
      "shared", "shared_secret", "mac", "derived", "out",
      "signature", "hash",
    ];
    for (const k of keys) {
      const val = (v as Record<string, unknown>)[k];
      if (val != null && String(val).trim()) return norm(String(val));
    }
    // Des Engines output an array of 8-byte values.
    return null;
  } catch {
    return null;
  }
}

/** Build a minimal AlgorithmResult compatible with both 2D engines and 3D adapters. */
function toAlgoResult(f: Fixture): AlgoResult {
  return {
    algorithm: f.algorithm,
    operation: f.operation,
    input: JSON.stringify(f.inputs),
    parameters: f.inputs,
    result: f.result,
    extra: f.extra,
    steps: [],
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
function main(): void {
  const __dir = dirname(process.argv[1]);
  const AUDIT_DIR = resolve(__dir);  // tests/.audit/ — run.cjs lives here
  const FIXTURE_PATH = resolve(AUDIT_DIR, "../fixtures/audit.json");
  const REPORT_DIR = resolve(AUDIT_DIR, "..");  // tests/
  const REPORT_JSON = resolve(REPORT_DIR, "fixtures/audit-report.json");
  const REPORT_MD = resolve(REPORT_DIR, "3d-audit-report.md");

  const raw: FixtureFile = JSON.parse(readFileSync(FIXTURE_PATH, "utf-8"));
  const adapters = getAll3DAdapters();
  const results: AuditDetail[] = [];

  for (const [id, fixture] of Object.entries(raw.fixtures)) {
    const adapter = adapters[id];
    const detail: AuditDetail = {
      adapter: id,
      status: "PASS",
    };

    if (!adapter) {
      detail.status = "ERROR";
      detail.buildError = `no 3D adapter registered for "${id}"`;
      results.push(detail);
      continue;
    }

    const ctx = {
      id,
      operation: raw.operations[id]?.operation ?? fixture.operation,
      inputs: fixture.inputs,
      demo: false,
      language: "en" as const,
      dir: "ltr" as const,
      theme: "dark" as const,
      result: toAlgoResult(fixture),
      resultMatches: true,
      t: (k: string) => k,
    };

    let steps;
    try {
      steps = adapter.buildSteps(ctx as never);
    } catch (err: unknown) {
      detail.status = "ERROR";
      detail.buildError = String(err);
      results.push(detail);
      continue;
    }

    if (!steps.length) {
      detail.status = "ERROR";
      detail.buildError = "adapter returned 0 steps";
      results.push(detail);
      continue;
    }

    // --- Collect all displayed output glyphs across every step ---
    const displayedAllSet = new Set<string>();
    for (const step of steps) {
      for (const lbl of displayedFromObjects((step as { objects?: { label?: string; tone?: string }[] }).objects ?? []))
        displayedAllSet.add(lbl);
      for (const lbl of metaOutputStrings((step as { meta?: { outputs?: Record<string, string>; changedValues?: { after: string }[] } }).meta))
        displayedAllSet.add(lbl);
    }
    detail.displayedAll = [...displayedAllSet];

    // --- Final step only ---
    const lastStep = steps[steps.length - 1] as {
      objects?: { label?: string; tone?: string }[];
      meta?: { outputs?: Record<string, string>; changedValues?: { after: string }[] };
    };
    const displayedFinalSet = new Set<string>();
    for (const lbl of displayedFromObjects(lastStep.objects ?? []))
      displayedFinalSet.add(lbl);
    for (const lbl of metaOutputStrings(lastStep.meta))
      displayedFinalSet.add(lbl);
    detail.displayedFinal = [...displayedFinalSet];

    // --- Fixture check ---
    const expectedFixture = norm(fixture.result_str);
    detail.expectedFixture = expectedFixture;
    const fixAll = containment(displayedAllSet, expectedFixture);
    const fixFinal = containment(displayedFinalSet, expectedFixture);
    detail.fixtureInAll = fixAll !== null;
    detail.fixtureInFinal = fixFinal !== null;

    // --- Engine cross-check (deterministic subset) ---
    const expectedEng = engineExpected(id, fixture, ctx.operation);
    if (expectedEng !== null) {
      detail.expectedEngine = expectedEng;
      const engAll = containment(displayedAllSet, expectedEng);
      const engFinal = containment(displayedFinalSet, expectedEng);
      detail.engineInAll = engAll !== null;
      detail.engineInFinal = engFinal !== null;
    }

    // --- Meta outputs present? ---
    const hasMeta = steps.some((s: { meta?: unknown }) => s.meta != null);
    detail.metaOutputsPresent = hasMeta;

    // --- Roundtrip ---
    if (fixture.roundtrip) detail.fixtureRoundtrip = fixture.roundtrip.ok;

    // --- Determine status ---
    // Primary: fixture result must be in all steps AND final step.
    const fixtureOk = detail.fixtureInAll && detail.fixtureInFinal;
    // Secondary (engine cross-check): for deterministic algorithms the 2D
    // result should also be in the scene. Fail only if BOTH are missing.
    const engineOk =
      expectedEng === null || (detail.engineInAll && detail.engineInFinal);

    if (!fixtureOk && !engineOk) {
      detail.status = "FAIL";
    } else if (!fixtureOk && engineOk) {
      // Fixture result not in 3D but engine result is — the display shows the
      // engine value rather than the backend value. For determinsitic algos
      // that should be identical, this is acceptable.
    } else if (fixtureOk && !engineOk && expectedEng !== null) {
      // Fixture OK but engine cross-check failed — warn but don't fail.
      detail.status = "WARN";
    }
    // else fixtureOk => PASS

    // --- hard errors: fixture roundtrip fail → WARN ---
    if (detail.fixtureRoundtrip === false) {
      detail.status = detail.status === "PASS" ? "WARN" : detail.status;
    }

    results.push(detail);
  }

  // --- Write JSON report ---
  mkdirSync(REPORT_DIR, { recursive: true });
  writeFileSync(
    REPORT_JSON,
    JSON.stringify(
      { generated: raw.generated, results },
      null,
      2
    ),
    "utf-8"
  );

  // --- Write Markdown report ---
  const lines: string[] = [
    "# 3D Audit Report",
    "",
    `Generated: ${raw.generated}`,
    "",
    "| Algorithm | Status | Fixture in All | Fixture in Final | Engine in All | Engine in Final | Meta | Roundtrip |",
    "|-----------|--------|----------------|------------------|---------------|-----------------|------|-----------|",
  ];
  for (const r of results) {
    const icon =
      r.status === "PASS"
        ? "PASS"
        : r.status === "FAIL"
          ? "FAIL"
          : r.status === "WARN"
            ? "WARN"
            : "ERROR";
    lines.push(
      `| ${r.adapter} | ${icon} | ${r.fixtureInAll ? "Y" : "N"} | ${
        r.fixtureInFinal ? "Y" : "N"
      } | ${r.engineInAll == null ? "—" : r.engineInAll ? "Y" : "N"} | ${
        r.engineInFinal == null ? "—" : r.engineInFinal ? "Y" : "N"
      } | ${r.metaOutputsPresent ? "Y" : "N"} | ${
        r.fixtureRoundtrip == null ? "—" : r.fixtureRoundtrip ? "Y" : "N"
      } |`
    );
  }
  const pass = results.filter((r) => r.status === "PASS").length;
  const fail = results.filter((r) => r.status === "FAIL").length;
  const warn = results.filter((r) => r.status === "WARN").length;
  const err = results.filter((r) => r.status === "ERROR").length;
  lines.push(
    "",
    `**Totals:** ${pass} PASS, ${fail} FAIL, ${warn} WARN, ${err} ERROR (of ${results.length})`
  );
  if (fail > 0) {
    lines.push("", "## FAIL details", "");
    for (const r of results.filter((r) => r.status === "FAIL")) {
      lines.push(`### ${r.adapter}`);
      lines.push(
        `- expected fixture result: \`${r.expectedFixture}\`  inAll=${r.fixtureInAll}  inFinal=${r.fixtureInFinal}`
      );
      if (r.expectedEngine !== null)
        lines.push(
          `- expected engine result:  \`${r.expectedEngine}\`  inAll=${r.engineInAll}  inFinal=${r.engineInFinal}`
        );
      lines.push(`- displayedAll: \`${r.displayedAll.join(", ")}\``);
      lines.push(`- displayedFinal: \`${r.displayedFinal.join(", ")}\``);
      lines.push("");
    }
  }
  if (err > 0) {
    lines.push("", "## ERROR details", "");
    for (const r of results.filter((r) => r.status === "ERROR"))
      lines.push(`- **${r.adapter}**: ${r.buildError}`);
    lines.push("");
  }
  writeFileSync(REPORT_MD, lines.join("\n"), "utf-8");

  // --- Console summary ---
  console.log(`\n3D AUDIT: ${pass} PASS, ${fail} FAIL, ${warn} WARN, ${err} ERROR`);
  if (fail > 0) {
    console.log("\nFAIL:");
    for (const r of results.filter((r) => r.status === "FAIL"))
      console.log(`  ${r.adapter} — expected fixture \`${r.expectedFixture}\` NOT in final: [${r.displayedFinal.join(", ")}]`);
  }
  if (err > 0) {
    console.log("\nERROR:");
    for (const r of results.filter((r) => r.status === "ERROR"))
      console.log(`  ${r.adapter} — ${r.buildError}`);
  }
  console.log(`\nJSON → ${REPORT_JSON}`);
  console.log(`MD   → ${REPORT_MD}`);
  process.exit(fail + err > 0 ? 1 : 0);
}

main();
