const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ← CORS must be FIRST, before everything else
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors());   // handle preflight for ALL routes

app.use(express.json({ limit: '2mb' }));

// Routes
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));

app.get('/', (req, res) => res.send('🤖 Robot API is running!'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT || 8080, () => console.log(`🚀 Server on port ${process.env.PORT || 8080}`));
  })
  .catch(err => { console.error('❌ MongoDB error:', err); process.exit(1); });