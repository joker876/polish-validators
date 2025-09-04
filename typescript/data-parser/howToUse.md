# Using the data stealer

1. Run the data stealer. It will use playwright to access the results and then output everything into the specified JSON file (default: `results.json`).
* * Adjust the settings if needed (for rate limitting, etc.)
2. Run the data stealer again, because some api requests might have returned a false-negative.
* * Change the output file name in the settings
3. Run the results merger on those two files. It will output the merged JSON into another file.
* * Usage: `node _merge-results.js file1.json file2.json --out merged.json`
4. Run the compression script. It will compress the linear, 9 thousand line long results file into a compact tree.
* * Usage `node _compress.js input.json output.json --pretty`
5. Manually remove all empty string values. Use regex for that (didn't have time to properly implement the compressor...)
6. Run the tree-to-array script. It will take out every string from the generated tree, store it in an array, and replace the string with the index in the array. It will result in two files: file containing an array of strings, and file containing the new tree.
* * Usage: `node _tree-to-array.js input.json out-names.json out-tree.json --pretty`
7. Use the results for whatever purpose is needed.
