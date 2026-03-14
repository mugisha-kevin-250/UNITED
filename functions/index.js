const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// Initialize Firebase Admin
admin.initializeApp();

// Initialize Firestore
const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());

// Auth - Admin Login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    if (email === 'admin@ktts.com' && password === 'admin123') {
        res.json({ success: true, token: 'admin-token-' + Date.now(), user: { email, role: 'admin' } });
    } else {
        res.status(401).json({ success: false, msg: 'Invalid credentials' });
    }
});

// News Routes
app.get('/api/news', async (req, res) => {
    try {
        const { category, all } = req.query;
        let query = db.collection('news');
        
        const snapshot = await query.get();
        let news = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        if (!all) {
            news = news.filter(n => n.published);
        }
        if (category) {
            news = news.filter(n => n.category === category);
        }
        
        res.status(200).json({ success: true, count: news.length, data: news });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Server Error', error: error.message });
    }
});

app.post('/api/news', async (req, res) => {
    try {
        const docRef = await db.collection('news').add({
            ...req.body,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        const doc = await docRef.get();
        res.status(201).json({ success: true, data: { id: doc.id, ...doc.data() } });
    } catch (error) {
        res.status(400).json({ success: false, msg: 'Failed to create news', error: error.message });
    }
});

app.put('/api/news/:id', async (req, res) => {
    try {
        await db.collection('news').doc(req.params.id).update(req.body);
        const doc = await db.collection('news').doc(req.params.id).get();
        res.status(200).json({ success: true, data: { id: doc.id, ...doc.data() } });
    } catch (error) {
        res.status(400).json({ success: false, msg: 'Failed to update news', error: error.message });
    }
});

app.delete('/api/news/:id', async (req, res) => {
    try {
        await db.collection('news').doc(req.params.id).delete();
        res.status(200).json({ success: true, msg: 'News deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Server Error', error: error.message });
    }
});

// Admissions Routes
app.get('/api/admissions', async (req, res) => {
    try {
        const { status } = req.query;
        let query = db.collection('admissions');
        
        const snapshot = await query.get();
        let admissions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        if (status) {
            admissions = admissions.filter(a => a.status === status);
        }
        
        res.status(200).json({ success: true, count: admissions.length, data: admissions });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Server Error', error: error.message });
    }
});

app.post('/api/admissions', async (req, res) => {
    try {
        const docRef = await db.collection('admissions').add({
            ...req.body,
            status: 'pending',
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        const doc = await docRef.get();
        res.status(201).json({ success: true, data: { id: doc.id, ...doc.data() }, msg: 'Application submitted successfully!' });
    } catch (error) {
        res.status(400).json({ success: false, msg: 'Failed to submit application', error: error.message });
    }
});

app.put('/api/admissions/:id/approve', async (req, res) => {
    try {
        await db.collection('admissions').doc(req.params.id).update({
            status: 'approved',
            adminNotes: req.body.adminNotes || 'Congratulations! Your application has been approved.',
            reviewedBy: req.body.reviewedBy || 'Admin',
            reviewedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        const doc = await db.collection('admissions').doc(req.params.id).get();
        res.status(200).json({ success: true, data: { id: doc.id, ...doc.data() }, msg: 'Application approved' });
    } catch (error) {
        res.status(400).json({ success: false, msg: 'Failed to approve', error: error.message });
    }
});

app.put('/api/admissions/:id/reject', async (req, res) => {
    try {
        await db.collection('admissions').doc(req.params.id).update({
            status: 'rejected',
            rejectionReason: req.body.reason || 'Application does not meet requirements',
            reviewedBy: req.body.reviewedBy || 'Admin',
            reviewedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        const doc = await db.collection('admissions').doc(req.params.id).get();
        res.status(200).json({ success: true, data: { id: doc.id, ...doc.data() }, msg: 'Application rejected' });
    } catch (error) {
        res.status(400).json({ success: false, msg: 'Failed to reject', error: error.message });
    }
});

app.delete('/api/admissions/:id', async (req, res) => {
    try {
        await db.collection('admissions').doc(req.params.id).delete();
        res.status(200).json({ success: true, msg: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Server Error', error: error.message });
    }
});

// Contact Routes
app.get('/api/contacts', async (req, res) => {
    try {
        const snapshot = await db.collection('contacts').get();
        const contacts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json({ success: true, count: contacts.length, data: contacts });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Server Error', error: error.message });
    }
});

app.post('/api/contacts', async (req, res) => {
    try {
        const docRef = await db.collection('contacts').add({
            ...req.body,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        const doc = await docRef.get();
        res.status(201).json({ success: true, data: { id: doc.id, ...doc.data() } });
    } catch (error) {
        res.status(400).json({ success: false, msg: 'Failed to submit', error: error.message });
    }
});

app.delete('/api/contacts/:id', async (req, res) => {
    try {
        await db.collection('contacts').doc(req.params.id).delete();
        res.status(200).json({ success: true, msg: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Server Error', error: error.message });
    }
});

// Gallery Routes
app.get('/api/gallery', async (req, res) => {
    try {
        const snapshot = await db.collection('gallery').get();
        const gallery = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json({ success: true, count: gallery.length, data: gallery });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Server Error', error: error.message });
    }
});

app.post('/api/gallery', async (req, res) => {
    try {
        const docRef = await db.collection('gallery').add({
            ...req.body,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        const doc = await docRef.get();
        res.status(201).json({ success: true, data: { id: doc.id, ...doc.data() } });
    } catch (error) {
        res.status(400).json({ success: false, msg: 'Failed to add', error: error.message });
    }
});

app.delete('/api/gallery/:id', async (req, res) => {
    try {
        await db.collection('gallery').doc(req.params.id).delete();
        res.status(200).json({ success: true, msg: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Server Error', error: error.message });
    }
});

// Export as Firebase Cloud Function
exports.api = functions.https.onRequest(app);
