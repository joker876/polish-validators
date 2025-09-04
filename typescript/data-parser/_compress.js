#!/usr/bin/env node
/**
 * Tree compression for 4-digit keys "1000".."9999"
 *
 * Usage:
 *   node tree_compress.js input.json output.json [--lookup 1234] [--pretty]
 *
 * Arguments:
 *   input.json   Path to the flat { "1000": "...", ... } file
 *   output.json  Path where the tree-compressed JSON will be written
 *
 * Options:
 *   --lookup <key>  Lookup a single 4-digit key instead of writing the file
 *   --pretty        Pretty-print the JSON output (2-space indent)
 */

const fs = require("fs");
const path = require("path");

const ROOT_DIGITS = ["1","2","3","4","5","6","7","8","9"];
const TEN_DIGITS  = ["0","1","2","3","4","5","6","7","8","9"];

function getFlatValue(flatMap, key4) {
  const v = flatMap[key4];
  return (typeof v === "string") ? v : "";
}

function buildNode(flatMap, prefix, depth) {
  if (depth === 4) {
    const val = getFlatValue(flatMap, prefix);
    return val;
  }

  const digits = (depth === 0) ? ROOT_DIGITS : TEN_DIGITS;
  const childResults = new Map();

  for (const d of digits) {
    const res = buildNode(flatMap, prefix + d, depth + 1);
    childResults.set(d, res);
  }

  const presentChildren = [];
  for (const [d, res] of childResults) {
    if (res !== null) presentChildren.push([d, res]);
  }

  if (presentChildren.length === 0) {
    return null;
  }

  if (presentChildren.length === digits.length) {
    const allStrings = presentChildren.every(([, v]) => typeof v === "string");
    if (allStrings) {
      const first = presentChildren[0][1];
      const allSame = presentChildren.every(([, v]) => v === first);
      if (allSame && first !== "") {
        return first;
      }
    }
  }

  const node = {};
  for (const [d, res] of presentChildren) {
    node[d] = res;
  }
  return node;
}

function buildTree(flatMap) {
  const root = {};
  for (const d of ROOT_DIGITS) {
    const res = buildNode(flatMap, d, 1);
    if (res !== null) {
      root[d] = res;
    }
  }
  return root;
}

function lookup(tree, key) {
  const k = String(key);
  if (!/^\d{4}$/.test(k)) return "";

  let node = tree[k[0]];
  if (node === undefined) return "";

  for (let i = 1; i < 4; i++) {
    if (typeof node === "string") {
      return node;
    }
    node = node[k[i]];
    if (node === undefined) return "";
  }

  return (typeof node === "string") ? node : "";
}

/* -----------------------
   CLI
------------------------ */

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error("Usage: node tree_compress.js <input.json> <output.json> [--lookup 1234] [--pretty]");
    process.exit(1);
  }

  const inputFile = args[0];
  const outputFile = args[1];
  const doPretty = args.includes("--pretty");
  const lookupIdx = args.indexOf("--lookup");
  const doLookup = lookupIdx !== -1 ? args[lookupIdx + 1] : null;

  try {
    const raw = fs.readFileSync(path.resolve(process.cwd(), inputFile), "utf8");
    const flat = JSON.parse(raw);

    const tree = buildTree(flat);

    if (doLookup) {
      console.log(lookup(tree, doLookup));
    } else {
      const json = JSON.stringify(tree, null, doPretty ? 2 : 0);
      fs.writeFileSync(path.resolve(process.cwd(), outputFile), json, "utf8");
      console.log(`Tree written to ${outputFile}`);
    }
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

module.exports = { buildTree, lookup };
