const express = require('express');
const router = express.Router();
const Consent = require('../models/Consent');

router.post('/grant', async (req, res) => {
    try {
        const { patientId, hospitalId, allowedFields, durationMinutes } = req.body;
        const expiresAt = new Date(Date.now() + durationMinutes * 60000);

        // Update existing mapping or create a new token context
        const consent = await Consent.findOneAndUpdate(
            { patientId, hospitalId },
            { allowedFields, expiresAt },
            { upsert: true, new: true }
        );
        res.json({ message: 'Granular consent token generated!', consent });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
