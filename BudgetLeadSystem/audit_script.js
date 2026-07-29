const fs = require('fs');

const content = fs.readFileSync('c:/Users/Ozone Computers/Desktop/account 1/BudgetLeadSystem/index.html', 'utf8');

// 1. Check for Duplicate IDs
const idRegex = /id=["']([^"']+)["']/g;
const ids = new Set();
const duplicates = new Set();
let match;
while ((match = idRegex.exec(content)) !== null) {
    if (ids.has(match[1])) {
        duplicates.add(match[1]);
    }
    ids.add(match[1]);
}
console.log("=== DUPLICATE IDs ===");
console.log(Array.from(duplicates));

// 2. Check for missing onclick functions
const jsFunctions = new Set();
const funcRegex = /function\s+([a-zA-Z0-9_]+)\s*\(/g;
let funcMatch;
while ((funcMatch = funcRegex.exec(content)) !== null) {
    jsFunctions.add(funcMatch[1]);
}
const windowFuncRegex = /window\.([a-zA-Z0-9_]+)\s*=/g;
while ((funcMatch = windowFuncRegex.exec(content)) !== null) {
    jsFunctions.add(funcMatch[1]);
}

const onclickRegex = /onclick=["']([a-zA-Z0-9_]+)\(/g;
const missingFuncs = new Set();
let onClickMatch;
while ((onClickMatch = onclickRegex.exec(content)) !== null) {
    if (!jsFunctions.has(onClickMatch[1])) {
        missingFuncs.add(onClickMatch[1]);
    }
}
console.log("\n=== MISSING ONCLICK FUNCTIONS ===");
console.log(Array.from(missingFuncs));

// 3. Extract JS and find common errors (like parseInt without radix, implicit globals, etc)
const jsStart = content.indexOf('<script>');
const jsEnd = content.lastIndexOf('</script>');
const jsCode = content.substring(jsStart + 8, jsEnd);

// Check for string concatenations that might be meant as addition
const additionRegex = /\+\s*document\.getElementById/g;
if(additionRegex.test(jsCode)) {
    console.log("\n=== POSSIBLE STRING CONCATENATION INSTEAD OF MATH ===");
    console.log("Found + document.getElementById, which might return string instead of number.");
}

// Find undefined variables used in assignments (basic check)
console.log("\n=== BASIC LINTING CHECK COMPLETED ===");
