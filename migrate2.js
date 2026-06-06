const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf-8');

// The multi-replace engine messed up the end of the Dexie initialization block
// Let's remove any orphaned "        }" or "        await loadCatalogToDropdown();"
// and make sure initDB() calls loadCatalogToDropdown.

// Let's just fix the rest of the file first using regexes.
function replaceAll(regex, replacement) {
    content = content.replace(regex, replacement);
}

// Fix orphaned brace and loadCatalogToDropdown
content = content.replace(
    /document\.getElementById\('login-screen'\)\.style\.display = 'flex';\s*\}\s*\/\/ Call init on load\s*initDB\(\);\s*\}\s*await loadCatalogToDropdown\(\);\s*\}\);/,
    `document.getElementById('login-screen').style.display = 'flex';\n        await loadCatalogToDropdown();\n    }\n    initDB();`
);

// We need to fix the case where Dexie code was left behind:
content = content.replace(/\}\s*await loadCatalogToDropdown\(\);\s*\}\);/, `await loadCatalogToDropdown();\n    }\n    initDB();`);

// Login
replaceAll(/const user = await db\.users\.where\('username'\)\.equals\(u\)\.first\(\);/,
    `const qSnap = await db.collection('users').where('username', '==', u).get();\n        const user = qSnap.empty ? null : {id: qSnap.docs[0].id, ...qSnap.docs[0].data()};`
);

// saveStaffUser
replaceAll(/await db\.users\.update\(currentStaffId, payload\);/, `await db.collection('users').doc(currentStaffId).update(payload);`);
replaceAll(/const existing = await db\.users\.where\('username'\)\.equals\(u\)\.first\(\);/, `const eSnap = await db.collection('users').where('username', '==', u).get();\n            const existing = eSnap.empty ? null : eSnap.docs[0];`);
replaceAll(/await db\.users\.add\(payload\);/, `await db.collection('users').add(payload);`);

// editStaff
replaceAll(/const user = await db\.users\.get\(id\);/g, `const d = await db.collection('users').doc(id).get();\n        const user = d.exists ? {id: d.id, ...d.data()} : null;`);

// loadStaffTable
replaceAll(/const allUsers = await db\.users\.toArray\(\);/, `const allUsers = (await db.collection('users').get()).docs.map(d => ({id: d.id, ...d.data()}));`);

// deleteRecord
replaceAll(/await db\[table\]\.delete\(id\);/, `await db.collection(table).doc(id).delete();`);

// toggleSettlePurchase
replaceAll(/await db\.products\.update\(id, \{ isSettled: state \}\);/, `await db.collection('products').doc(id).update({ isSettled: state });`);

// saveCatalog
replaceAll(/await db\.product_catalog\.update\(currentCatalogId, payload\);/, `await db.collection('product_catalog').doc(currentCatalogId).update(payload);`);
replaceAll(/await db\.product_catalog\.add\(payload\);/, `await db.collection('product_catalog').add(payload);`);

// editCatalog
replaceAll(/const cat = await db\.product_catalog\.get\(id\);/g, `const d = await db.collection('product_catalog').doc(id).get();\n        const cat = d.exists ? {id: d.id, ...d.data()} : null;`);

// loadCatalogToDropdown
replaceAll(/const catalog = await db\.product_catalog\.toArray\(\);/g, `const catalog = (await db.collection('product_catalog').get()).docs.map(d => ({id: d.id, ...d.data()}));`);

// loadAllData - tables
replaceAll(/let allProducts = await db\.products\.orderBy\('date'\)\.reverse\(\)\.toArray\(\);/, `let allProducts = (await db.collection('products').orderBy('date', 'desc').get()).docs.map(d => ({id: d.id, ...d.data()}));`);
replaceAll(/let allLeads = await db\.leads\.orderBy\('date'\)\.reverse\(\)\.toArray\(\);/, `let allLeads = (await db.collection('leads').orderBy('date', 'desc').get()).docs.map(d => ({id: d.id, ...d.data()}));`);
replaceAll(/let allPackaging = await db\.packaging\.orderBy\('date'\)\.reverse\(\)\.toArray\(\);/, `let allPackaging = (await db.collection('packaging').orderBy('date', 'desc').get()).docs.map(d => ({id: d.id, ...d.data()}));`);
replaceAll(/let expenses = await db\.expenses\.toArray\(\);/, `let expenses = (await db.collection('expenses').get()).docs.map(d => ({id: d.id, ...d.data()}));`);

// saveLeadData
replaceAll(/await db\.leads\.update\(currentLeadId, payload\);/, `await db.collection('leads').doc(currentLeadId).update(payload);`);
replaceAll(/await db\.leads\.add\(payload\);/, `await db.collection('leads').add(payload);`);

// saveProductPurchase
replaceAll(/await db\.products\.add\(/, `await db.collection('products').add(`);

// savePackaging
replaceAll(/await db\.packaging\.add\(/, `await db.collection('packaging').add(`);

// saveExpenses
replaceAll(/const existingExp = await db\.expenses\.where\('week'\)\.equals\(week\)\.first\(\);/, `const expSnap = await db.collection('expenses').where('week', '==', week).get();\n        const existingExp = expSnap.empty ? null : {id: expSnap.docs[0].id, ...expSnap.docs[0].data()};`);
replaceAll(/await db\.expenses\.update\(existingExp\.id, payload\);/, `await db.collection('expenses').doc(existingExp.id).update(payload);`);
replaceAll(/await db\.expenses\.add\(payload\);/, `await db.collection('expenses').add(payload);`);

// resetCurrentWeek
replaceAll(/const leads = await db\.leads\.toArray\(\);/, `const leads = (await db.collection('leads').get()).docs.map(d => ({id: d.id, ...d.data()}));`);
replaceAll(/await db\.leads\.bulkDelete\(leads\.filter\(x => x\.week === week\)\.map\(x => x\.id\)\);/, `for(let id of leads.filter(x => x.week === week).map(x => x.id)) await db.collection('leads').doc(id).delete();`);

replaceAll(/const products = await db\.products\.toArray\(\);/, `const products = (await db.collection('products').get()).docs.map(d => ({id: d.id, ...d.data()}));`);
replaceAll(/await db\.products\.bulkDelete\(products\.filter\(x => x\.week === week\)\.map\(x => x\.id\)\);/, `for(let id of products.filter(x => x.week === week).map(x => x.id)) await db.collection('products').doc(id).delete();`);

replaceAll(/const packaging = await db\.packaging\.toArray\(\);/, `const packaging = (await db.collection('packaging').get()).docs.map(d => ({id: d.id, ...d.data()}));`);
replaceAll(/await db\.packaging\.bulkDelete\(packaging\.filter\(x => x\.week === week\)\.map\(x => x\.id\)\);/, `for(let id of packaging.filter(x => x.week === week).map(x => x.id)) await db.collection('packaging').doc(id).delete();`);

replaceAll(/const expenses = await db\.expenses\.toArray\(\);/g, `const expenses = (await db.collection('expenses').get()).docs.map(d => ({id: d.id, ...d.data()}));`);
replaceAll(/await db\.expenses\.bulkDelete\(expenses\.filter\(x => x\.week === week\)\.map\(x => x\.id\)\);/, `for(let id of expenses.filter(x => x.week === week).map(x => x.id)) await db.collection('expenses').doc(id).delete();`);

// resetAllData
replaceAll(/await db\.leads\.clear\(\);/, `for(let id of leads.map(x => x.id)) await db.collection('leads').doc(id).delete();`);
replaceAll(/await db\.products\.clear\(\);/, `for(let id of products.map(x => x.id)) await db.collection('products').doc(id).delete();`);
replaceAll(/await db\.packaging\.clear\(\);/, `for(let id of packaging.map(x => x.id)) await db.collection('packaging').doc(id).delete();`);
replaceAll(/await db\.expenses\.clear\(\);/, `for(let id of expenses.map(x => x.id)) await db.collection('expenses').doc(id).delete();`);

// Fix onclick with string ID issue:
// deleteRecord('table', ${p.id}) -> deleteRecord('table', '${p.id}')
content = content.replace(/deleteRecord\('products', \$\{p\.id\}\)/g, "deleteRecord('products', '${p.id}')");
content = content.replace(/deleteRecord\('leads', \$\{l\.id\}\)/g, "deleteRecord('leads', '${l.id}')");
content = content.replace(/deleteRecord\('packaging', \$\{pk\.id\}\)/g, "deleteRecord('packaging', '${pk.id}')");
content = content.replace(/deleteRecord\('expenses', \$\{e\.id\}\)/g, "deleteRecord('expenses', '${e.id}')");
content = content.replace(/editCatalog\(\$\{c\.id\}\)/g, "editCatalog('${c.id}')");
content = content.replace(/deleteRecord\('product_catalog', \$\{c\.id\}\)/g, "deleteRecord('product_catalog', '${c.id}')");
content = content.replace(/editStaff\(\$\{u\.id\}\)/g, "editStaff('${u.id}')");
content = content.replace(/deleteRecord\('users', \$\{u\.id\}\)/g, "deleteRecord('users', '${u.id}')");
content = content.replace(/toggleSettlePurchase\(\$\{p\.id\},/g, "toggleSettlePurchase('${p.id}',");

fs.writeFileSync('index.html', content);
console.log('Done migrating');
