require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to Secure Medical Locker DB'))
    .catch(err => console.error(err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/records', require('./routes/records'));
app.use('/api/consent', require('./routes/consent'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`MediVault Infrastructure running on port ${PORT}`));
