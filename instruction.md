# 📊 Monthly Budget & Lead System (Instructions)

Bhau, hi ek complete Dashboard system aahe. Hi system offline chalte karan aapan yat **Dexie.js (IndexedDB)** waparla aahe. System chi UI ekdum modern disnyasathi **Tailwind CSS** cha wapar kela aahe.

## 📌 Step 1: File Banvne
Tujhya computer var ek navin folder banav aani tyat `index.html` navachi ek file tayar kar.

## 📌 Step 2: Code Copy Karun Paste Karne
Khalil purn code copy kar aani tyat `index.html` file madhye paste kar. Yatamadhye HTML, CSS aani JS ekach thikani aahet, jyamule system lagesh run hoil.

```html
<!DOCTYPE html>
<html lang="mr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Budget & Lead Dashboard</title>
    <script src="[https://cdn.tailwindcss.com](https://cdn.tailwindcss.com)"></script>
    <script src="[https://unpkg.com/dexie@latest/dist/dexie.js](https://unpkg.com/dexie@latest/dist/dexie.js)"></script>
</head>
<body class="bg-slate-100 p-4 md:p-8 font-sans">
    <div class="max-w-7xl mx-auto space-y-8">
        
        <div class="bg-white p-6 rounded-xl shadow-lg flex flex-col md:flex-row justify-between items-center border-l-8 border-blue-600">
            <div>
                <h1 class="text-3xl font-extrabold text-slate-800">📊 Monthly Budget & Lead System</h1>
                <p class="text-slate-500 mt-1">Manage your Leads, Products, and Expenses efficiently.</p>
            </div>
            <div class="mt-4 md:mt-0 font-semibold text-blue-600" id="currentDate"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div class="bg-white p-6 rounded-xl shadow-lg border-t-4 border-emerald-500">
                <h2 class="text-xl font-bold mb-4 text-emerald-700">📌 Daily Leads Entry</h2>
                <form id="leadForm" class="space-y-4">
                    <div>
                        <label class="block text-sm font-semibold text-slate-700">Date</label>
                        <input type="date" id="leadDate" class="mt-1 w-full p-2 border border-slate-300 rounded focus:ring-emerald-500 focus:border-emerald-500" required>
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-slate-700">Daily Budget (Rs)</label>
                        <input type="number" id="dailyBudget" class="mt-1 w-full p-2 border border-slate-300 rounded" required>
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-slate-700">Total Leads</label>
                        <input type="number" id="totalLeads" class="mt-1 w-full p-2 border border-slate-300 rounded" required>
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-slate-700">Confirmed Leads</label>
                        <input type="number" id="confirmedLeads" class="mt-1 w-full p-2 border border-slate-300 rounded" required>
                    </div>
                    <button type="submit" class="w-full bg-emerald-500 text-white font-bold p-3 rounded hover:bg-emerald-600 transition duration-300">Save Lead Data</button>
                </form>
            </div>

            <div class="bg-white p-6 rounded-xl shadow-lg border-t-4 border-violet-500">
                <h2 class="text-xl font-bold mb-4 text-violet-700">🛒 Product Sales</h2>
                <form id="productForm" class="space-y-4">
                    <div>
                        <label class="block text-sm font-semibold text-slate-700">Date</label>
                        <input type="date" id="productDate" class="mt-1 w-full p-2 border border-slate-300 rounded" required>
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-slate-700">Product Name</label>
                        <select id="productName" class="mt-1 w-full p-2 border border-slate-300 rounded" required>
                            <option value="Herbal crown">Herbal crown</option>
                            <option value="Medaharani">Medaharani</option>
                            <option value="Kesharaja">Kesharaja</option>
                            <option value="Mass Go">Mass Go</option>
                            <option value="Asthma capsule">Asthma capsule</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-slate-700">Price (Rs)</label>
                        <input type="number" id="productPrice" class="mt-1 w-full p-2 border border-slate-300 rounded" required>
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-slate-700">Quantity</label>
                        <input type="number" id="productQty" class="mt-1 w-full p-2 border border-slate-300 rounded" required>
                    </div>
                    <button type="submit" class="w-full bg-violet-500 text-white font-bold p-3 rounded hover:bg-violet-600 transition duration-300">Save Product</button>
                </form>
            </div>

            <div class="bg-white p-6 rounded-xl shadow-lg border-t-4 border-rose-500">
                <h2 class="text-xl font-bold mb-4 text-rose-700">💸 Weekly Expenses</h2>
                <form id="expenseForm" class="space-y-4">
                    <div>
                        <label class="block text-sm font-semibold text-slate-700">Week</label>
                        <select id="weekName" class="mt-1 w-full p-2 border border-slate-300 rounded" required>
                            <option value="Week 1">Week 1</option>
                            <option value="Week 2">Week 2</option>
                            <option value="Week 3">Week 3</option>
                            <option value="Week 4">Week 4</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-slate-700">Total Ads Spent (Rs)</label>
                        <input type="number" id="adsSpent" class="mt-1 w-full p-2 border border-slate-300 rounded" required>
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-slate-700">Product Cost (Rs)</label>
                        <input type="number" id="productCost" class="mt-1 w-full p-2 border border-slate-300 rounded" required>
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-slate-700">Other Costs (Rs)</label>
                        <input type="number" id="otherCosts" class="mt-1 w-full p-2 border border-slate-300 rounded" required>
                    </div>
                    <button type="submit" class="w-full bg-rose-500 text-white font-bold p-3 rounded hover:bg-rose-600 transition duration-300">Save Expenses</button>
                </form>
            </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
            <h2 class="text-2xl font-bold mb-4 text-slate-800">📋 Lead Records & Calculations</h2>
            <table class="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                    <tr class="bg-slate-800 text-white text-sm">
                        <th class="p-3 rounded-tl-lg">Date</th>
                        <th class="p-3">Budget</th>
                        <th class="p-3">Total Leads</th>
                        <th class="p-3">Confirmed</th>
                        <th class="p-3 bg-blue-700">Cost / Lead (A)</th>
                        <th class="p-3 bg-emerald-700 rounded-tr-lg">Cost / Confirmed (B)</th>
                    </tr>
                </thead>
                <tbody id="leadsTableBody" class="text-sm text-slate-700">
                    </tbody>
            </table>
        </div>

    </div>

    <script>
        // Set Current Date in Header
        document.getElementById('currentDate').textContent = new Date().toDateString();

        // 1. Initialize Dexie Database
        const db = new Dexie("MonthlyBudgetSystemDB");
        db.version(1).stores({
            leads: "++id, date, dailyBudget, totalLeads, confirmedLeads",
            products: "++id, date, productName, price, qty",
            expenses: "++id, week, adsSpent, productCost, otherCosts"
        });

        // 2. Handle Lead Form
        document.getElementById('leadForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = {
                date: document.getElementById('leadDate').value,
                dailyBudget: parseFloat(document.getElementById('dailyBudget').value),
                totalLeads: parseInt(document.getElementById('totalLeads').value),
                confirmedLeads: parseInt(document.getElementById('confirmedLeads').value)
            };
            await db.leads.add(data);
            e.target.reset();
            loadLeads();
            alert("✅ Lead Data successfully saved!");
        });

        // 3. Handle Product Form
        document.getElementById('productForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = {
                date: document.getElementById('productDate').value,
                productName: document.getElementById('productName').value,
                price: parseFloat(document.getElementById('productPrice').value),
                qty: parseInt(document.getElementById('productQty').value)
            };
            await db.products.add(data);
            e.target.reset();
            alert("✅ Product Data successfully saved!");
        });

        // 4. Handle Expense Form
        document.getElementById('expenseForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = {
                week: document.getElementById('weekName').value,
                adsSpent: parseFloat(document.getElementById('adsSpent').value),
                productCost: parseFloat(document.getElementById('productCost').value),
                otherCosts: parseFloat(document.getElementById('otherCosts').value)
            };
            await db.expenses.add(data);
            e.target.reset();
            alert("✅ Expense Data successfully saved!");
        });

        // 5. Load and Calculate Data
        async function loadLeads() {
            const leads = await db.leads.orderBy('date').reverse().toArray();
            const tbody = document.getElementById('leadsTableBody');
            tbody.innerHTML = "";
            
            leads.forEach(lead => {
                // Auto Calculations for Cost per Lead
                const costPerLead = lead.totalLeads > 0 ? (lead.dailyBudget / lead.totalLeads).toFixed(2) : "0.00";
                const costPerConfirmed = lead.confirmedLeads > 0 ? (lead.dailyBudget / lead.confirmedLeads).toFixed(2) : "0.00";

                tbody.innerHTML += `
                    <tr class="border-b hover:bg-slate-50 transition duration-150">
                        <td class="p-3 font-medium">${lead.date}</td>
                        <td class="p-3">Rs. ${lead.dailyBudget}</td>
                        <td class="p-3 text-center">${lead.totalLeads}</td>
                        <td class="p-3 text-center font-bold text-emerald-600">${lead.confirmedLeads}</td>
                        <td class="p-3 text-blue-600 font-semibold">Rs. ${costPerLead}</td>
                        <td class="p-3 text-emerald-600 font-semibold">Rs. ${costPerConfirmed}</td>
                    </tr>
                `;
            });
        }

        // Initialize the table on page load
        loadLeads();
    </script>
</body>
</html>