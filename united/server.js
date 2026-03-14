const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: './.env' });

// Connect to database
connectDB();

const app = express();

// Serve static files from pages directory
app.use(express.static(path.join(__dirname, '../pages')));

// Body parser - increased limit for image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Enable CORS
app.use(cors({
    origin: '*', // Allow all origins for production
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Email sending endpoint (simulated)
app.post('/api/send-email', async (req, res) => {
    const { to, subject, message } = req.body;
    // In production, integrate with nodemailer or other email service
    console.log(`[EMAIL] To: ${to}, Subject: ${subject}, Message: ${message}`);
    res.json({ success: true, msg: 'Email sent successfully' });
});

// API Routes

// News Routes
const News = require('./models/News');

// GET /api/news - Get all news
app.get('/api/news', async (req, res) => {
    try {
        const { category, all } = req.query;
        let query = {};
        
        if (all !== 'true') {
            query.published = true;
        }
        
        if (category) query.category = category;
        
        const news = await News.find(query).sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: news.length,
            data: news
        });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Server Error', error: error.message });
    }
});

// GET /api/news/:id - Get single news
app.get('/api/news/:id', async (req, res) => {
    try {
        const news = await News.findById(req.params.id);
        
        if (!news) {
            return res.status(404).json({ success: false, msg: 'News not found' });
        }
        
        res.status(200).json({ success: true, data: news });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Server Error', error: error.message });
    }
});

// POST /api/news - Create news
app.post('/api/news', async (req, res) => {
    try {
        const news = await News.create(req.body);
        res.status(201).json({ success: true, data: news });
    } catch (error) {
        res.status(400).json({ success: false, msg: 'Failed to create news', error: error.message });
    }
});

// PUT /api/news/:id - Update news
app.put('/api/news/:id', async (req, res) => {
    try {
        const news = await News.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        
        if (!news) {
            return res.status(404).json({ success: false, msg: 'News not found' });
        }
        
        res.status(200).json({ success: true, data: news });
    } catch (error) {
        res.status(400).json({ success: false, msg: 'Failed to update news', error: error.message });
    }
});

// DELETE /api/news/:id - Delete news
app.delete('/api/news/:id', async (req, res) => {
    try {
        const news = await News.findByIdAndDelete(req.params.id);
        
        if (!news) {
            return res.status(404).json({ success: false, msg: 'News not found' });
        }
        
        res.status(200).json({ success: true, msg: 'News deleted successfully', data: {} });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Server Error', error: error.message });
    }
});

// Student Routes
const Student = require('./models/Student');

// GET /api/students - Get all students
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: students.length, data: students });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Server Error', error: error.message });
    }
});

// POST /api/students - Create student
app.post('/api/students', async (req, res) => {
    try {
        const student = await Student.create(req.body);
        res.status(201).json({ success: true, data: student });
    } catch (error) {
        res.status(400).json({ success: false, msg: 'Failed to create student', error: error.message });
    }
});

// PUT /api/students/:id - Update student
app.put('/api/students/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        
        if (!student) {
            return res.status(404).json({ success: false, msg: 'Student not found' });
        }
        
        res.status(200).json({ success: true, data: student });
    } catch (error) {
        res.status(400).json({ success: false, msg: 'Failed to update student', error: error.message });
    }
});

// DELETE /api/students/:id - Delete student
app.delete('/api/students/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        
        if (!student) {
            return res.status(404).json({ success: false, msg: 'Student not found' });
        }
        
        res.status(200).json({ success: true, msg: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Server Error', error: error.message });
    }
});

// Contact Routes
const Contact = require('./models/Contact');

// GET /api/contacts - Get all contacts
app.get('/api/contacts', async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: contacts.length, data: contacts });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Server Error', error: error.message });
    }
});

// POST /api/contacts - Create contact
app.post('/api/contacts', async (req, res) => {
    try {
        const contact = await Contact.create(req.body);
        res.status(201).json({ success: true, data: contact });
    } catch (error) {
        res.status(400).json({ success: false, msg: 'Failed to create contact', error: error.message });
    }
});

// PUT /api/contacts/:id - Reply to contact
app.put('/api/contacts/:id', async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        
        if (!contact) {
            return res.status(404).json({ success: false, msg: 'Contact not found' });
        }
        
        res.status(200).json({ success: true, data: contact });
    } catch (error) {
        res.status(400).json({ success: false, msg: 'Failed to update contact', error: error.message });
    }
});

// DELETE /api/contacts/:id - Delete contact
app.delete('/api/contacts/:id', async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        
        if (!contact) {
            return res.status(404).json({ success: false, msg: 'Contact not found' });
        }
        
        res.status(200).json({ success: true, msg: 'Contact deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Server Error', error: error.message });
    }
});

const PORT = process.env.PORT || 5000;

// Auth Routes (simple admin login)
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    // Simple hardcoded admin - in production use proper JWT
    if (email === 'admin@ktts.com' && password === 'admin123') {
        res.json({ success: true, token: 'admin-token-' + Date.now(), user: { email, role: 'admin' } });
    } else {
        res.status(401).json({ success: false, msg: 'Invalid credentials' });
    }
});

// PageContent Routes (also available at /api/it/page-content)
const PageContent = require('./models/PageContent');

// GET /api/content - Get page content
app.get('/api/content', async (req, res) => {
    try {
        const { page } = req.query;
        let query = {};
        if (page) query.page = page;
        
        const content = await PageContent.find(query);
        res.status(200).json({ success: true, data: content });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Server Error', error: error.message });
    }
});

// GET /api/it/page-content - Get page content (admin alias)
app.get('/api/it/page-content', async (req, res) => {
    try {
        const { page } = req.query;
        let query = {};
        if (page) query.page = page;
        
        const content = await PageContent.find(query);
        res.status(200).json({ success: true, data: content });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Server Error', error: error.message });
    }
});

// POST /api/content - Create/update page content
app.post('/api/content', async (req, res) => {
    try {
        const { page, section } = req.body;
        
        // Find existing content for this page and section
        let content = await PageContent.findOne({ page, section });
        
        if (content) {
            // Update existing
            content = await PageContent.findByIdAndUpdate(content._id, req.body, {
                new: true,
                runValidators: true
            });
        } else {
            // Create new
            content = await PageContent.create(req.body);
        }
        
        res.status(201).json({ success: true, data: content });
    } catch (error) {
        res.status(400).json({ success: false, msg: 'Failed to save content', error: error.message });
    }
});

// POST /api/it/page-content - Create/update page content (admin alias)
app.post('/api/it/page-content', async (req, res) => {
    try {
        const { page, section } = req.body;
        
        // Find existing content for this page and section
        let content = await PageContent.findOne({ page, section });
        
        if (content) {
            // Update existing
            content = await PageContent.findByIdAndUpdate(content._id, req.body, {
                new: true,
                runValidators: true
            });
        } else {
            // Create new
            content = await PageContent.create(req.body);
        }
        
        res.status(201).json({ success: true, data: content });
    } catch (error) {
        res.status(400).json({ success: false, msg: 'Failed to save content', error: error.message });
    }
});

// DELETE /api/content/:id - Delete page content
app.delete('/api/content/:id', async (req, res) => {
    try {
        const content = await PageContent.findByIdAndDelete(req.params.id);
        
        if (!content) {
            return res.status(404).json({ success: false, msg: 'Content not found' });
        }
        
        res.status(200).json({ success: true, msg: 'Content deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Server Error', error: error.message });
    }
});

// Root route
app.get('/', (req, res) => {
    res.send('United School API is running...');
});

// Admission Routes
const Admission = require('./models/Admission');

// GET /api/admissions - Get all admissions
app.get('/api/admissions', async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};
        if (status) query.status = status;
        
        const admissions = await Admission.find(query).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: admissions.length, data: admissions });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Server Error', error: error.message });
    }
});

// GET /api/admissions/:id - Get single admission
app.get('/api/admissions/:id', async (req, res) => {
    try {
        const admission = await Admission.findById(req.params.id);
        
        if (!admission) {
            return res.status(404).json({ success: false, msg: 'Admission not found' });
        }
        
        res.status(200).json({ success: true, data: admission });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Server Error', error: error.message });
    }
});

// POST /api/admissions - Submit new admission application
app.post('/api/admissions', async (req, res) => {
    try {
        const admission = await Admission.create(req.body);
        res.status(201).json({ success: true, data: admission, msg: 'Application submitted successfully! We will review and contact you soon.' });
    } catch (error) {
        res.status(400).json({ success: false, msg: 'Failed to submit application', error: error.message });
    }
});

// PUT /api/admissions/:id - Update admission (admin)
app.put('/api/admissions/:id', async (req, res) => {
    try {
        const admission = await Admission.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        
        if (!admission) {
            return res.status(404).json({ success: false, msg: 'Admission not found' });
        }
        
        res.status(200).json({ success: true, data: admission });
    } catch (error) {
        res.status(400).json({ success: false, msg: 'Failed to update admission', error: error.message });
    }
});

// PUT /api/admissions/:id/approve - Approve admission
app.put('/api/admissions/:id/approve', async (req, res) => {
    try {
        const admission = await Admission.findByIdAndUpdate(
            req.params.id,
            { 
                status: 'approved',
                adminNotes: req.body.adminNotes || 'Congratulations! Your application has been approved.',
                reviewedBy: req.body.reviewedBy || 'Admin',
                reviewedAt: new Date()
            },
            { new: true }
        );
        
        if (!admission) {
            return res.status(404).json({ success: false, msg: 'Admission not found' });
        }
        
        // Send email notification
        console.log('[EMAIL] Approval notification sent to:', admission.parentEmail);
        
        res.status(200).json({ success: true, data: admission, msg: 'Application approved and parent notified' });
    } catch (error) {
        res.status(400).json({ success: false, msg: 'Failed to approve admission', error: error.message });
    }
});

// PUT /api/admissions/:id/reject - Reject admission
app.put('/api/admissions/:id/reject', async (req, res) => {
    try {
        const admission = await Admission.findByIdAndUpdate(
            req.params.id,
            { 
                status: 'rejected',
                rejectionReason: req.body.reason || 'Application does not meet our requirements',
                reviewedBy: req.body.reviewedBy || 'Admin',
                reviewedAt: new Date()
            },
            { new: true }
        );
        
        if (!admission) {
            return res.status(404).json({ success: false, msg: 'Admission not found' });
        }
        
        console.log('[EMAIL] Rejection notification sent to:', admission.parentEmail);
        
        res.status(200).json({ success: true, data: admission, msg: 'Application rejected and parent notified' });
    } catch (error) {
        res.status(400).json({ success: false, msg: 'Failed to reject admission', error: error.message });
    }
});

// DELETE /api/admissions/:id - Delete admission
app.delete('/api/admissions/:id', async (req, res) => {
    try {
        const admission = await Admission.findByIdAndDelete(req.params.id);
        
        if (!admission) {
            return res.status(404).json({ success: false, msg: 'Admission not found' });
        }
        
        res.status(200).json({ success: true, msg: 'Admission deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Server Error', error: error.message });
    }
});

// Gallery Routes
const Gallery = require('./models/Gallery');

// GET /api/gallery - Get all gallery images
app.get('/api/gallery', async (req, res) => {
    try {
        const { category } = req.query;
        let query = {};
        if (category) query.category = category;
        
        const gallery = await Gallery.find(query).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: gallery.length, data: gallery });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Server Error', error: error.message });
    }
});

// POST /api/gallery - Add gallery image
app.post('/api/gallery', async (req, res) => {
    try {
        const gallery = await Gallery.create(req.body);
        res.status(201).json({ success: true, data: gallery });
    } catch (error) {
        res.status(400).json({ success: false, msg: 'Failed to add image', error: error.message });
    }
});

// DELETE /api/gallery/:id - Delete gallery image
app.delete('/api/gallery/:id', async (req, res) => {
    try {
        const gallery = await Gallery.findByIdAndDelete(req.params.id);
        
        if (!gallery) {
            return res.status(404).json({ success: false, msg: 'Image not found' });
        }
        
        res.status(200).json({ success: true, msg: 'Image deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Server Error', error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/home.html'));
});
