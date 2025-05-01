require('dotenv').config();
const express = require('express');
const cors = require('cors');
const webpush = require('web-push');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configure Web Push (will use Vercel env vars)
webpush.setVapidDetails(
  'mailto:admin@example.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// API Endpoint
app.post('/api/withdraw', async (req, res) => {
  try {
    const { subscription } = req.body;
    
    // Process withdrawal here...
    
    // Send notification
    if (subscription) {
      const payload = JSON.stringify({
        title: 'Withdrawal Successful',
        body: 'Your withdrawal has been processed!'
      });
      
      await webpush.sendNotification(subscription, payload);
    }

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Service Worker route
app.get('/sw.js', (req, res) => {
  res.sendFile(__dirname + '/sw.js');
});

module.exports = app;