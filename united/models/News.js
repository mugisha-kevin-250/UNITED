const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    excerpt: {
        type: String
    },
    image: {
        type: String
    },
    author: {
        type: String,
        default: 'Admin'
    },
    category: {
        type: String,
        enum: ['Events', 'Announcements', 'Achievements', 'News', 'General'],
        default: 'News'
    },
    published: {
        type: Boolean,
        default: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('News', NewsSchema);
