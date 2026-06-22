// server.js
import express from 'express';
import cors from 'cors';
import db from './db.js'; // Note: you must add the .js extension here
import { authenticateToken } from './middleware.js'; // Ensure path is correct
import { adminLogin, adminPassword, AccessTokenSecret, AccessTokenExpiry } from './env.js';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const app = express();

// Enable CORS so your frontend at localhost:5173 can talk to port 5000
app.use(cors({
  origin: 'http://localhost:5173', // Allow your frontend to talk to the backend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// 1. GET ALL CONTRACTS (For mapping the grid layout on page load)
app.get('/api/contracts',
  authenticateToken,
  (req, res) => {
    const query = `SELECT * FROM contracts ORDER BY id DESC`;

    db.all(query, [], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      // Returns the complete array of contracts (or an empty array if none exist)
      res.json(rows || []);
    });
  });

// 2. GET SINGLE CONTRACT (For the mobile QR verification lookup)
app.get('/api/contracts/:id',
  authenticateToken,
  (req, res) => {
    const { id } = req.params;
    const query = `SELECT * FROM contracts WHERE id = ?`;

    db.get(query, [id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!row) {
        return res.status(404).json({ error: "Contract reference records not found." });
      }
      res.json(row);
    });
  });

app.post('/login', (req, res) => {
  const { login, password } = req.body
  if (!login, !password)
    return res.status(400).json({ error: "Missing required fields." });

  if (login !== adminLogin || password !== adminPassword)
    return res.status(403).json({ error: "Only admin has access to this route" })

  const access_token = jwt.sign({ login: login }, AccessTokenSecret, { expiresIn: AccessTokenExpiry })
  return res.status(200).json({ access_token })
});

// 3. CREATE NEW CONTRACT (Receives payload from the "Nouveau contrat" modal)
app.post('/api/contracts',
  authenticateToken,
  (req, res) => {
    const { client_name, titre_foncier, work_type, price } = req.body;

    // Guard clause to ensure no empty fields pass through
    if (!client_name || !titre_foncier || !work_type || !price) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const secureId = uuidv4();

    // Get the next sequence number
    db.get(`SELECT MAX(sequence) as maxSequence FROM contracts`, [], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      const nextSequence = (row?.maxSequence || 0) + 1;

      const query = `INSERT INTO contracts (id, sequence, client_name, titre_foncier, work_type, price) VALUES (?, ?, ?, ?, ?, ?)`;

      db.run(query, [secureId, nextSequence, client_name, titre_foncier, work_type, parseFloat(price)], function(err) {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ id: secureId, sequence: nextSequence });
      });
    });
  });

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Administrative Backend Server running on port ${PORT}`);
});
