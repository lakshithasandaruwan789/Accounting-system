const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf-8');

// 1. Remove Dexie
content = content.replace('<script src="https://unpkg.com/dexie/dist/dexie.js"></script>', '');

// 2. Module script
content = content.replace('<script>', '<script type="module">');

// 3. Add Firebase imports and init
const firebaseInit = `
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBxNzd_rKWalcdHWzxUz5l0T1YTa9EMszE",
  authDomain: "herbalcrown-system.firebaseapp.com",
  projectId: "herbalcrown-system",
  storageBucket: "herbalcrown-system.firebasestorage.app",
  messagingSenderId: "638288258970",
  appId: "1:638288258970:web:061d9e96cc4dbbed143c23",
  measurementId: "G-ESWB7KE1BN"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Make global functions work with type="module"
window.db = db;
window.collection = collection;
window.doc = doc;
window.getDoc = getDoc;
window.getDocs = getDocs;
window.addDoc = addDoc;
window.updateDoc = updateDoc;
window.deleteDoc = deleteDoc;
window.query = query;
window.where = where;
window.orderBy = orderBy;
`;

content = content.replace('// --- DATABASE SETUP (DEXIE V6) ---', firebaseInit + '\n// --- OLD DEXIE STUFF REMOVED ---');

// Replace Dexie DB Init
const dexieInitRegex = /const db = new Dexie[\s\S]*?db\.on\('ready', async function\(\) \{([\s\S]*?)document\.getElementById\('login-screen'\)\.style\.display = 'flex';\s*\}\);/;
const match = content.match(dexieInitRegex);
if(match) {
    const innerLogic = match[1];
    let newInit = `
    async function initDB() {
        const catSnap = await getDocs(collection(db, "product_catalog"));
        if (catSnap.empty) {
            const defaults = [
                {name: "Herbal crown", price: 210},
                {name: "Medaharani", price: 420},
                {name: "Kesharaja", price: 410},
                {name: "Mass Go", price: 550},
                {name: "Asthma capsule", price: 600}
            ];
            for(let d of defaults) await addDoc(collection(db, "product_catalog"), d);
        }
        
        const userSnap = await getDocs(collection(db, "users"));
        if (userSnap.empty) {
            await addDoc(collection(db, "users"), {
                username: "admin@company.com",
                password: "123",
                permissions: ["dashboard", "leads", "purchases", "packaging", "profit", "catalog", "staff"]
            });
        }
        document.getElementById('login-screen').style.display = 'flex';
    }
    initDB();
    `;
    content = content.replace(dexieInitRegex, newInit);
}

// Global scope fix: since we are in a module, functions need to be on window. 
// They are already mostly window.fn = ... but some internal vars might not be.
// "let currentUser = null;" -> "window.currentUser = null;"
content = content.replace('let currentUser = null;', 'window.currentUser = null;');

// Dexie Replacements
// login
content = content.replace(
    /const user = await db\.users\.where\('username'\)\.equals\(u\)\.first\(\);/,
    `const qSnap = await getDocs(query(collection(db, "users"), where("username", "==", u)));\n        const user = qSnap.empty ? null : {id: qSnap.docs[0].id, ...qSnap.docs[0].data()};`
);

// user update/add
content = content.replace(
    /await db\.users\.update\(currentStaffId, payload\);/,
    `await updateDoc(doc(db, "users", currentStaffId), payload);`
);
content = content.replace(
    /const existing = await db\.users\.where\('username'\)\.equals\(u\)\.first\(\);/,
    `const eSnap = await getDocs(query(collection(db, "users"), where("username", "==", u)));\n            const existing = eSnap.empty ? null : eSnap.docs[0];`
);
content = content.replace(
    /await db\.users\.add\(payload\);/,
    `await addDoc(collection(db, "users"), payload);`
);

// editStaff
content = content.replace(
    /const user = await db\.users\.get\(id\);/g,
    `const d = await getDoc(doc(db, "users", id)); const user = d.exists() ? {id: d.id, ...d.data()} : null;`
);

// loadStaffTable
content = content.replace(
    /const allUsers = await db\.users\.toArray\(\);/,
    `const allUsers = (await getDocs(collection(db, "users"))).docs.map(d => ({id: d.id, ...d.data()}));`
);

// loadCatalogToDropdown
content = content.replace(
    /const catalog = await db\.product_catalog\.toArray\(\);/g,
    `const catalog = (await getDocs(collection(db, "product_catalog"))).docs.map(d => ({id: d.id, ...d.data()}));`
);

// editCatalog
content = content.replace(
    /const cat = await db\.product_catalog\.get\(id\);/g,
    `const d = await getDoc(doc(db, "product_catalog", id)); const cat = d.exists() ? {id: d.id, ...d.data()} : null;`
);

// saveCatalog
content = content.replace(
    /await db\.product_catalog\.update\(currentCatalogId, payload\);/,
    `await updateDoc(doc(db, "product_catalog", currentCatalogId), payload);`
);
content = content.replace(
    /await db\.product_catalog\.add\(payload\);/,
    `await addDoc(collection(db, "product_catalog"), payload);`
);

// loadAllData
// products
content = content.replace(
    /let allProducts = await db\.products\.orderBy\('date'\)\.reverse\(\)\.toArray\(\);/,
    `const pSnap = await getDocs(query(collection(db, "products"), orderBy("date", "desc"))); let allProducts = pSnap.docs.map(d => ({id: d.id, ...d.data()}));`
);
// leads
content = content.replace(
    /let allLeads = await db\.leads\.orderBy\('date'\)\.reverse\(\)\.toArray\(\);/,
    `const lSnap = await getDocs(query(collection(db, "leads"), orderBy("date", "desc"))); let allLeads = lSnap.docs.map(d => ({id: d.id, ...d.data()}));`
);
// packaging
content = content.replace(
    /let allPackaging = await db\.packaging\.orderBy\('date'\)\.reverse\(\)\.toArray\(\);/,
    `const pkSnap = await getDocs(query(collection(db, "packaging"), orderBy("date", "desc"))); let allPackaging = pkSnap.docs.map(d => ({id: d.id, ...d.data()}));`
);
// expenses
content = content.replace(
    /let expenses = await db\.expenses\.toArray\(\);/,
    `const eSnap = await getDocs(collection(db, "expenses")); let expenses = eSnap.docs.map(d => ({id: d.id, ...d.data()}));`
);

// deleteRecord
content = content.replace(
    /await db\[table\]\.delete\(id\);/,
    `await deleteDoc(doc(db, table, id));`
);

// toggleSettlePurchase
content = content.replace(
    /await db\.products\.update\(id, \{ isSettled: state \}\);/,
    `await updateDoc(doc(db, "products", id), { isSettled: state });`
);

// saveLeadData
content = content.replace(
    /await db\.leads\.update\(currentLeadId, payload\);/,
    `await updateDoc(doc(db, "leads", currentLeadId), payload);`
);
content = content.replace(
    /await db\.leads\.add\(payload\);/,
    `await addDoc(collection(db, "leads"), payload);`
);

// saveProductPurchase
content = content.replace(
    /await db\.products\.add\(/,
    `await addDoc(collection(db, "products"), `
);

// savePackaging
content = content.replace(
    /await db\.packaging\.add\(/,
    `await addDoc(collection(db, "packaging"), `
);

// saveExpenses
content = content.replace(
    /const existingExp = await db\.expenses\.where\('week'\)\.equals\(week\)\.first\(\);/,
    `const expSnap = await getDocs(query(collection(db, "expenses"), where("week", "==", week))); const existingExp = expSnap.empty ? null : {id: expSnap.docs[0].id, ...expSnap.docs[0].data()};`
);
content = content.replace(
    /await db\.expenses\.update\(existingExp\.id, payload\);/,
    `await updateDoc(doc(db, "expenses", existingExp.id), payload);`
);
content = content.replace(
    /await db\.expenses\.add\(payload\);/,
    `await addDoc(collection(db, "expenses"), payload);`
);

// resetCurrentWeek
content = content.replace(
    /const leads = await db\.leads\.toArray\(\);/,
    `const leads = (await getDocs(collection(db, "leads"))).docs.map(d => ({id: d.id, ...d.data()}));`
);
content = content.replace(
    /await db\.leads\.bulkDelete\(leads\.filter\(x => x\.week === week\)\.map\(x => x\.id\)\);/,
    `for(let id of leads.filter(x => x.week === week).map(x => x.id)) await deleteDoc(doc(db, "leads", id));`
);
content = content.replace(
    /const products = await db\.products\.toArray\(\);/,
    `const products = (await getDocs(collection(db, "products"))).docs.map(d => ({id: d.id, ...d.data()}));`
);
content = content.replace(
    /await db\.products\.bulkDelete\(products\.filter\(x => x\.week === week\)\.map\(x => x\.id\)\);/,
    `for(let id of products.filter(x => x.week === week).map(x => x.id)) await deleteDoc(doc(db, "products", id));`
);
content = content.replace(
    /const packaging = await db\.packaging\.toArray\(\);/,
    `const packaging = (await getDocs(collection(db, "packaging"))).docs.map(d => ({id: d.id, ...d.data()}));`
);
content = content.replace(
    /await db\.packaging\.bulkDelete\(packaging\.filter\(x => x\.week === week\)\.map\(x => x\.id\)\);/,
    `for(let id of packaging.filter(x => x.week === week).map(x => x.id)) await deleteDoc(doc(db, "packaging", id));`
);
content = content.replace(
    /const expenses = await db\.expenses\.toArray\(\);/g,
    `const expenses = (await getDocs(collection(db, "expenses"))).docs.map(d => ({id: d.id, ...d.data()}));`
);
content = content.replace(
    /await db\.expenses\.bulkDelete\(expenses\.filter\(x => x\.week === week\)\.map\(x => x\.id\)\);/,
    `for(let id of expenses.filter(x => x.week === week).map(x => x.id)) await deleteDoc(doc(db, "expenses", id));`
);

// resetAllData
content = content.replace(
    /await db\.leads\.clear\(\);/,
    `for(let id of leads.map(x => x.id)) await deleteDoc(doc(db, "leads", id));`
);
content = content.replace(
    /await db\.products\.clear\(\);/,
    `for(let id of products.map(x => x.id)) await deleteDoc(doc(db, "products", id));`
);
content = content.replace(
    /await db\.packaging\.clear\(\);/,
    `for(let id of packaging.map(x => x.id)) await deleteDoc(doc(db, "packaging", id));`
);
content = content.replace(
    /await db\.expenses\.clear\(\);/,
    `for(let id of expenses.map(x => x.id)) await deleteDoc(doc(db, "expenses", id));`
);

fs.writeFileSync('index.html', content);
console.log("Migration complete!");
