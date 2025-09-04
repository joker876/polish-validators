#!/usr/bin/env node
/**
 * Index strings in a trie-like tree:
 * - Input:  tree.json  (object where leaves may be strings; inner nodes are objects or strings)
 * - Output: strings.json  (array of unique strings, first-seen order)
 *          tree.indexed.json (same tree shape, but strings replaced by their index number)
 *
 * Usage:
 *   node index_strings.js <inputTree.json> <outStrings.json> <outTree.json> [--pretty]
 */

const fs = require("fs");
const path = require("path");

/**
 * Create a stable, first-seen ordering of strings and replace each string
 * in the tree with its numeric index into the `strings` array.
 *
 * Notes:
 * - Traversal is deterministic: object keys are processed in ascending order.
 * - Non-string values (numbers, booleans, null) are left as-is.
 * - If a string is "", it will be interned and indexed too (even though your
 *   tree builder usually omits empties).
 */
function indexTreeStrings(tree) {
  const strings = [];
  const indexByValue = new Map(); // string -> idx

  const intern = (s) => {
    if (indexByValue.has(s)) return indexByValue.get(s);
    const idx = strings.length;
    strings.push(s);
    indexByValue.set(s, idx);
    return idx;
    };

  const transform = (node) => {
    const t = typeof node;

    if (t === "string") {
      return intern(node);
    }

    if (node === null || t !== "object") {
      // number, boolean, null, undefined -> keep as is
      return node;
    }

    if (Array.isArray(node)) {
      // Not expected in your tree, but handle gracefully
      return node.map(transform);
    }

    // Object: copy with sorted keys for deterministic traversal
    const out = {};
    for (const k of Object.keys(node).sort()) {
      out[k] = transform(node[k]);
    }
    return out;
  };

  const indexedTree = transform(tree);
  return { strings, indexedTree };
}

/* -----------------------
   CLI
------------------------ */

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 3) {
    console.error("Usage: node index_strings.js <inputTree.json> <outStrings.json> <outTree.json> [--pretty]");
    process.exit(1);
  }

  const [inFile, outStringsFile, outTreeFile] = args;
  const pretty = args.includes("--pretty");

  try {
    const raw = fs.readFileSync(path.resolve(process.cwd(), inFile), "utf8");
    const tree = JSON.parse(raw);

    const { strings, indexedTree } = indexTreeStrings(tree);

    fs.writeFileSync(
      path.resolve(process.cwd(), outStringsFile),
      JSON.stringify(strings, null, pretty ? 2 : 0),
      "utf8"
    );

    fs.writeFileSync(
      path.resolve(process.cwd(), outTreeFile),
      JSON.stringify(indexedTree, null, pretty ? 2 : 0),
      "utf8"
    );

    console.log(`Wrote ${strings.length} unique strings to ${outStringsFile}`);
    console.log(`Wrote indexed tree to ${outTreeFile}`);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

module.exports = { indexTreeStrings };
