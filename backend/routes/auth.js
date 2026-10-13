const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// DYNAMIC DB REGISTRATION PIPELINE
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        // Assert entry logic boundary
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ error: 'Email coordinate registry already matched.' });

        // Hash credentials
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();
        res.status(201).json({ message: 'Identity node safely committed to DB.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// SECURE DB AUTHENTICATION LOGIN PIPELINE
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Invalid Identity Map' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Credential validation breakdown' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret');
        res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
