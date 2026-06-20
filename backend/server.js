// server.js
const express = require('express');
const cors = require('cors');
const db = require('./db');
const { authenticateToken } = require('./middleware');

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

// 3. CREATE NEW CONTRACT (Receives payload from the "Nouveau contrat" modal)
app.post('/api/contracts', (req, res) => {
  const { client_name, titre_foncier, work_type, price } = req.body;

  // Guard clause to ensure no empty fields pass through
  if (!client_name || !titre_foncier || !work_type || !price) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const query = `INSERT INTO contracts (client_name, titre_foncier, work_type, price) VALUES (?, ?, ?, ?)`;

  db.run(query, [client_name, titre_foncier, work_type, parseFloat(price)], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    // Return the unique auto-incremented ID back to React
    res.json({ id: this.lastID });
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Administrative Backend Server running on port ${PORT}`);
});
