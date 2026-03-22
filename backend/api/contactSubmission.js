const express = require('express');
const router = express.Router();
const ContactSubmissionModel = require('../models/contactSubmission');

// Create a new contact submission
router.post('/', async (req, res) => {
  try {
    const { name, birthday, intendedPrograms, highestEducation } = req.body;
    const id = await ContactSubmissionModel.create(name, birthday, intendedPrograms, highestEducation);
    res.status(201).json({ id, message: 'Form submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit form' });
  }
});

// Get all contact submissions (admin only)
router.get('/', async (req, res) => {
  try {
    const submissions = await ContactSubmissionModel.getAll();
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get contact submissions' });
  }
});

module.exports = router;