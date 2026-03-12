const mongoose = require('mongoose');

const AdmissionSchema = new mongoose.Schema({
    // Student Information
    studentName: {
        type: String,
        required: [true, 'Student name is required'],
        trim: true
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Date of birth is required']
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female']
    },
    grade: {
        type: String,
        required: [true, 'Grade/Class is required']
    },
    
    // Parent/Guardian Information
    parentName: {
        type: String,
        required: [true, 'Parent name is required']
    },
    parentPhone: {
        type: String,
        required: [true, 'Phone number is required']
    },
    parentEmail: {
        type: String,
        required: [true, 'Email is required'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    relationship: {
        type: String,
        required: true
    },
    
    // Address
    address: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    
    // Additional Information
    previousSchool: {
        type: String,
        default: 'N/A'
    },
    specialNeeds: {
        type: String,
        default: 'None'
    },
    howHeard: {
        type: String,
        default: 'N/A'
    },
    
    // Status
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    rejectionReason: {
        type: String,
        default: ''
    },
    adminNotes: {
        type: String,
        default: ''
    },
    reviewedBy: {
        type: String,
        default: ''
    },
    reviewedAt: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Admission', AdmissionSchema);
