const express = require('express');
const cors = require('cors');
const sequelize = require('./db');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobsRoutes');
const hrRoutes =require('./routes/hrRoutes');
const applicationRoutes=require('./routes/applicationRoutes');
const adminRoutes =require('./routes/adminRoutes');
require('dotenv').config();

const app = express();    

// ✅ CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// ✅ Parse JSON request bodies
app.use(express.json());

// ✅ Routes
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/hr', hrRoutes);
app.use('/api/apply',applicationRoutes);
app.use('/api/admin',adminRoutes);

const PORT = process.env.PORT || 5000;

// ✅ Test DB connection & sync models
sequelize.authenticate({ alter: true })
  .then(() => {
    console.log('Database connected.');
    return sequelize.sync({ alter: true }); // Sync models with DB schema changes
  })
  .then(() => {
    console.log('Models synced.');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error('Database connection error:', err));
