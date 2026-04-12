import { Router } from 'express';
import * as collegeController from '../controllers/collegeController.js';
import { verifyAuth, requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { collegeSchema, collegeUpdateSchema } from '../validators.js';

const router = Router();

// All routes require authentication
router.use(verifyAuth);

// GET /api/colleges - Get all colleges (admin only)
router.get('/', requireAdmin, collegeController.getColleges);

// GET /api/colleges/:id - Get single college
router.get('/:id', requireAdmin, collegeController.getCollege);

// POST /api/colleges - Create college (admin only)
router.post('/', requireAdmin, validate(collegeSchema, 'body'), collegeController.createCollege);

// PUT /api/colleges/:id - Update college (admin only)
router.put('/:id', requireAdmin, validate(collegeUpdateSchema, 'body'), collegeController.updateCollege);

// DELETE /api/colleges/:id - Delete college (admin only)
router.delete('/:id', requireAdmin, collegeController.deleteCollege);

// POST /api/colleges/:id/reset-password - Reset college password (admin only)
router.post('/:id/reset-password', requireAdmin, collegeController.resetPassword);

export default router;
