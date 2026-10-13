const express = require('express');
const router = express.Router();
const Record = require('../models/Record');
const Consent = require('../models/Consent');
const { encrypt, decrypt } = require('../utils/crypto');

// 1. Create Form Endpoint - Automatically Encrypts data elements
router.post('/add', async (req, res) => {
    try {
        const { patientId, hospitalId, title, diagnosis, medication, notes } = req.body;
        const newRecord = new Record({
            patientId,
            hospitalId,
            title,
            diagnosis: encrypt(diagnosis),
            medication: encrypt(medication),
            notes: encrypt(notes)
        });
        await newRecord.save();
        res.status(201).json({ message: 'EMR Record securely encrypted and saved to storage vault.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. View/Retrieve Endpoint - Conditional, Field-Level Decryption Logic
router.post('/hospital/view-patient', async (req, res) => {
    try {
        const { patientId, hospitalId } = req.body;

        const consent = await Consent.findOne({
            patientId,
            hospitalId,
            expiresAt: { $gt: new Date() }
        });

        if (!consent) {
            return res.status(403).json({ message: 'Access Denied: No valid or active consent token found.' });
        }

        const records = await Record.find({ patientId });

        const filteredData = records.map(record => {
            let cleanRecord = { 
                _id: record._id, 
                title: record.title, 
                createdAt: record.createdAt 
            };

            // Granular Field Verification Check
            cleanRecord.diagnosis = consent.allowedFields.includes('diagnosis') ? decrypt(record.diagnosis) : '🚫 Restricted';
            cleanRecord.medication = consent.allowedFields.includes('medication') ? decrypt(record.medication) : '🚫 Restricted';
            cleanRecord.notes = consent.allowedFields.includes('notes') ? decrypt(record.notes) : '🚫 Restricted';

            return cleanRecord;
        });

        res.json(filteredData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
