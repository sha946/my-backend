const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

app.use(express.json({ limit: '2mb' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/routes_projects'));

app.get('/', (req, res) => res.send('🤖 Robot API is running!'));

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('✅ MongoDB connected');

  const PORT = process.env.PORT || 8080;

  app.listen(PORT, () => {
    console.log(`🚀 Server on port ${PORT}`);
  });
})
.catch(err => {
  console.error('❌ MongoDB error:', err);
});