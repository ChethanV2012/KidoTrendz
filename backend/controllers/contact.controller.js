// controllers/contact.controller.js
import ContactMessage from '../models/ContactMessage.js';
import nodemailer from 'nodemailer';

// Transporter setup for emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Validate email utility
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Submit message (public)
export const submitMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Save to MongoDB
    const newMessage = new ContactMessage({ name, email, subject, message });
    await newMessage.save();

    // Send email notification to admin (non-blocking)
    (async () => {
      try {
        await transporter.sendMail({
          from: `"KidoTrendz" <${process.env.EMAIL_USER}>`,
          to: process.env.ADMIN_EMAIL,
          subject: `New Contact Form Submission: ${subject}`,
          text: `New message received!\n\nFrom: ${name} (${email})\nSubject: ${subject}\nMessage: ${message}\n\n---\nSubmitted on: ${new Date().toLocaleString()}`,
        });
        console.log('Email notification sent successfully');
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
      }
    })();

    res.status(201).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
};

// Fetch all messages (admin only)
export const getMessages = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const messages = await ContactMessage.find()
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json({ success: true, messages });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete message (admin only)
export const deleteMessage = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    const message = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Delete failed' });
  }
};