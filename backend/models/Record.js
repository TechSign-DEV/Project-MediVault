const mongoose = require('mongoose');
const RecordSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    diagnosis: { type: String, required: true },   // Will store AES Encrypted Text
    medication: { type: String, required: true },  // Will store AES Encrypted Text
    notes: { type: String, required: true }        // Will store AES Encrypted Text
}, { timestamps: true });
module.exports = mongoose.model('Record', RecordSchema);
