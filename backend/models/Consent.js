const mongoose = require('mongoose');
const ConsentSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    allowedFields: [{ type: String, enum: ['diagnosis', 'medication', 'notes'] }],
    expiresAt: { type: Date, required: true }
}, { timestamps: true });
module.exports = mongoose.model('Consent', ConsentSchema);
