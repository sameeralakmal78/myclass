const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Database setup
const db = new sqlite3.Database('quiz.db');

// Create tables
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS quiz_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_name TEXT,
        score INTEGER,
        total_questions INTEGER,
        time_taken TEXT,
        submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

// Admin credentials
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "math123";

// Check admin login
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        res.json({ success: true, message: 'Login successful' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Save student results
app.post('/api/quiz/submit', (req, res) => {
    const { studentName, score, totalQuestions, timeTaken } = req.body;
    
    db.run("INSERT INTO quiz_results (student_name, score, total_questions, time_taken) VALUES (?, ?, ?, ?)",
        [studentName, score, totalQuestions, timeTaken], function(err) {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Error saving results' });
        }
        res.json({ success: true, message: 'Results saved successfully' });
    });
});

// Get all results for admin
app.get('/api/admin/results', (req, res) => {
    db.all("SELECT * FROM quiz_results ORDER BY submitted_at DESC", (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        res.json({ success: true, results: rows });
    });
});

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Admin panel: http://localhost:${PORT}/admin.html`);
});