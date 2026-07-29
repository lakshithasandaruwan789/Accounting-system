const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Database එකට සම්බන්ධ වීම
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'budget_db'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL Database.');
});

// 2. දත්ත ලබා දීමේ API Endpoint එක (GET Request)
app.get('/api/daily-tracking', (req, res) => {
    const sql = "SELECT * FROM daily_tracking";
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(results); // දත්ත JSON ආකාරයෙන් ලබා දෙයි
        }
    });
});

// 3. Server එක Run කිරීම
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
