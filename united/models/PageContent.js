const mongoose = require('mongoose');

const PageContentSchema = new mongoose.Schema({
    page: {
        type: String,
        required: true,
        default: 'Home'
    },
    section: {
        type: String,
        required: true
    },
    title: {
        type: String,
        trim: true
    },
    content: {
        type: String
    },
    image: {
        type: String
    },
    data: {
        type: mongoose.Schema.Types.Mixed
    },
    // Stats fields
    students: {
        type: String
    },
    teachers: {
        type: String
    },
    meals: {
        type: String
    },
    years: {
        type: String
    },
    subtitle: {
        type: String
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

PageContentSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('PageContent', PageContentSchema);
