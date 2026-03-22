const express = require('express');
const router = express.Router();
const CaseStudyModel = require('../models/caseStudy');

// Get all case studies
router.get('/', async (req, res) => {
  try {
    const caseStudies = await CaseStudyModel.getAll();
    res.json(caseStudies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get case studies' });
  }
});

// Get a single case study by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const caseStudy = await CaseStudyModel.getById(id);
    if (!caseStudy) {
      return res.status(404).json({ error: 'Case study not found' });
    }
    // Increment view count
    await CaseStudyModel.incrementViewCount(id);
    res.json(caseStudy);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get case study' });
  }
});

// Create a new case study
router.post('/', async (req, res) => {
  try {
    const { title, content, image_url: imageUrl, publish_date: publishDate } = req.body;
    const id = await CaseStudyModel.create(title, content, imageUrl, publishDate);
    res.status(201).json({ id });
  } catch (error) {
    console.error('Error creating case study:', error);
    res.status(500).json({ error: 'Failed to create case study' });
  }
});

// Update a case study
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, image_url: imageUrl, publish_date: publishDate } = req.body;
    await CaseStudyModel.update(id, title, content, imageUrl, publishDate);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating case study:', error);
    res.status(500).json({ error: 'Failed to update case study' });
  }
});

// Delete a case study
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await CaseStudyModel.delete(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete case study' });
  }
});

module.exports = router;