import * as collegeService from '../services/collegeService.js';

// Get all colleges (admin only)
export const getColleges = async (req, res, next) => {
  try {
    const colleges = await collegeService.getColleges();
    res.json(colleges);
  } catch (error) {
    next(error);
  }
};

// Get college by ID
export const getCollege = async (req, res, next) => {
  try {
    const { id } = req.params;
    const college = await collegeService.getCollegeById(id);
    res.json(college);
  } catch (error) {
    next(error);
  }
};

// Create college (admin only)
export const createCollege = async (req, res, next) => {
  try {
    const { name, email, password, industry, credits, category, district, state } = req.body;
    
    const result = await collegeService.createCollege({
      name,
      email,
      password,
      industry,
      credits,
      category,
      district,
      state
    });

    res.status(201).json({
      success: true,
      college: result.college,
    });
  } catch (error) {
    next(error);
  }
};

// Update college (admin only)
export const updateCollege = async (req, res, next) => {
  try {
    const { id } = req.params;
    const college = await collegeService.updateCollege(id, req.body);
    res.json(college);
  } catch (error) {
    next(error);
  }
};

// Delete college (admin only)
export const deleteCollege = async (req, res, next) => {
  try {
    const { id } = req.params;
    await collegeService.deleteCollege(id);
    res.json({ success: true, message: 'College deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Reset password (admin only)
export const resetPassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Signal strength too low: Password must be at least 6 characters.' });
    }

    const result = await collegeService.resetPassword(id, password);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
