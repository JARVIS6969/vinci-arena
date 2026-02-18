const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend server is running!',
    timestamp: new Date()
  });
});

// Basic routes
app.get('/api/tournaments', (req, res) => {
  res.json({ 
    message: 'Tournaments route working',
    tournaments: []
  });
});

// Start server
app.listen(PORT, () => {
  console.log('✅ Backend running on http://localhost:' + PORT);
  console.log('🔍 Test: http://localhost:' + PORT + '/api/health');
});
