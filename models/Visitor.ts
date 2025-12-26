import mongoose from 'mongoose';

const VisitorSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    region: {
        type: String,
        enum: ['North America', 'Europe', 'Asia', 'Africa', 'Australia', 'Other'],
        required: true
    },
    institution: { type: String, required: true },
    institutionType: {
        type: String,
        enum: ['Corporate', 'Government', 'Educational', 'Personal', 'Other']
    },
    contactEmail: String,
    contactPhone: String,
    signatureData: { type: String, required: true }, // Base64
    purpose: String,
    hostEmployee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    checkInTime: { type: Date, default: Date.now },
    checkOutTime: Date,
    status: { type: String, enum: ['checked_in', 'checked_out'], default: 'checked_in' },
    receptionist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    notes: String
}, { timestamps: true });

export default mongoose.models.Visitor || mongoose.model('Visitor', VisitorSchema);
