// server.js
import express from 'express';
import cors from 'cors';
import db from './db.js'; 
import { authenticateToken } from './middleware.js'; 
import { adminLogin, adminPassword, AccessTokenSecret, AccessTokenExpiry } from './env.js';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

// Set up directory path parsing for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// 📦 SERVE STATIC FRONTEND FILES 
// Tells Express to look inside the public folder for the compiled production UI
app.use(express.static(path.join(__dirname, 'public')));

// 1. GET ALL CONTRACTS
app.get('/api/contracts', authenticateToken, (req, res) => {
  const query = `SELECT * FROM contracts ORDER BY id DESC`;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows || []);
  });
});

// 2. GET SINGLE CONTRACT (QR Code verification path)
app.get('/api/contracts/:id', (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM contracts WHERE id = ?`;
  db.get(query, [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Contract reference records not found." });
    res.json(row);
  });
});

// 3. ADMIN LOGIN
app.post('/login', (req, res) => {
  const { login, password } = req.body;
  if (!login || !password) return res.status(400).json({ error: "Missing required fields." });
  if (login !== adminLogin || password !== adminPassword) {
    return res.status(403).json({ error: "Only admin has access to this route" });
  }
  const access_token = jwt.sign({ login: login }, AccessTokenSecret, { expiresIn: AccessTokenExpiry });
  return res.status(200).json({ access_token });
});

// 4. CREATE NEW CONTRACT
app.post('/api/contracts', authenticateToken, (req, res) => {
  const { formData } = req.body;
  if (!formData) return res.status(400).json({ error: "Missing contract data." });

  const secureId = uuidv4();

  db.get(`SELECT MAX(sequence) as maxSequence FROM contracts`, [], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    const nextSequence = (row?.maxSequence || 0) + 1;

    const query = `INSERT INTO contracts (id, sequence, data) VALUES (?, ?, ?)`;
    db.run(query, [secureId, nextSequence, JSON.stringify(formData)], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: secureId, message: "Contrat sauvegardé avec succès" });
    });
  });
});

// 🌍 CATCH-ALL ROUTE
// Using a regex ensures it safely matches every unspecified frontend path!
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Administrative Backend Server running on port ${PORT}`);
});