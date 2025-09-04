#!/usr/bin/env node
/**
 * Merge two results.json files produced by the Playwright script.
 *
 * Usage:
 *   node merge-results.js fileA.json fileB.json [--out merged.json] [--prefer first|second]
 *
 * Rules:
 * - Value considered "blank" if it's undefined, null, empty string, or "-".
 * - For each key in the union:
 *     pick the first non-blank among (preferred file, other file).
 * - If both files have different non-blank values, we record a conflict and
 *   keep the preferred file's value (default: first).
 *
 * Outputs:
 * - merged JSON to --out (default: merged.results.json)
 * - conflicts (if any) to <out>.conflicts.json
 */

import { readFile, writeFile } from 'fs/promises';
import { basename } from 'path';

function parseArgs(argv) {
  const args = argv.slice(2);
  const opts = { out: 'merged.results.json', prefer: 'first' };
  const files = [];

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--out' && i + 1 < args.length) {
      opts.out = args[++i];
    } else if (a === '--prefer' && i + 1 < args.length) {
      const val = args[++i];
      if (val !== 'first' && val !== 'second') {
        throw new Error(`--prefer must be "first" or "second", got "${val}"`);
      }
      opts.prefer = val;
    } else if (a.startsWith('-')) {
      throw new Error(`Unknown option: ${a}`);
    } else {
      files.push(a);
    }
  }

  if (files.length !== 2) {
    throw new Error('Please provide exactly two input files.\nExample: node merge-results.js a.json b.json --out merged.json');
  }

  return { fileA: files[0], fileB: files[1], ...opts };
}

function isBlank(v) {
  if (v === undefined || v === null) return true;
  const s = String(v).trim();
  return s === '' || s === '-';
}

function pickValue(a, b, prefer /* 'first'|'second' */) {
  const primary = prefer === 'first' ? a : b;
  const secondary = prefer === 'first' ? b : a;

  if (!isBlank(primary)) return primary;
  if (!isBlank(secondary)) return secondary;
  // both blank or missing -> keep blank (empty string) for clarity
  return '';
}

async function loadJson(path) {
  const raw = await readFile(path, 'utf8');
  try {
    const obj = JSON.parse(raw);
    if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
      return obj;
    }
    throw new Error('JSON root must be an object of { numStr: bankName }');
  } catch (e) {
    throw new Error(`Failed to parse JSON from ${path}: ${e.message}`);
  }
}

async function main() {
  const { fileA, fileB, out, prefer } = parseArgs(process.argv);

  const [a, b] = await Promise.all([loadJson(fileA), loadJson(fileB)]);

  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  const merged = {};
  const conflicts = {}; // key -> { first, second }

  for (const k of keys) {
    const va = a[k];
    const vb = b[k];

    // Record conflicts only if both are non-blank and different
    if (!isBlank(va) && !isBlank(vb) && String(va).trim() !== String(vb).trim()) {
      conflicts[k] = { first: va, second: vb };
    }

    merged[k] = pickValue(va, vb, prefer);
  }

  await writeFile(out, JSON.stringify(merged, null, 2), 'utf8');
  console.log(`Merged ${keys.size} keys into ${out}.`);

  const conflictCount = Object.keys(conflicts).length;
  if (conflictCount > 0) {
    const conflictsPath = `${out.replace(/\.json$/i, '')}.conflicts.json`;
    await writeFile(conflictsPath, JSON.stringify(conflicts, null, 2), 'utf8');
    console.warn(
      `⚠️  ${conflictCount} conflict(s) detected (different non-blank values).` +
      ` Preferred: ${prefer}. Details written to ${conflictsPath}.`
    );
  } else {
    console.log('No conflicts detected.');
  }

  // Helpful summary
  const fileALabel = basename(fileA);
  const fileBLabel = basename(fileB);
  const sampleKey = [...keys][0];
  console.log(`Done. Inputs: ${fileALabel}, ${fileBLabel}. Sample key: ${sampleKey ?? '(none)'}`);
}

main().catch(err => {
  console.error(err.message || err);
  process.exit(1);
});
