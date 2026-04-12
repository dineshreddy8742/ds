import { Router } from 'express';
import * as inquiryController from '../controllers/inquiryController.js';
import { verifyAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

// PUBLIC: Submit an inquiry from landing page
router.post('/submit', inquiryController.submitInquiry);

// PROTECTED: Admin manage inquiries
router.get('/', verifyAuth, requireAdmin, inquiryController.getInquiries);
router.patch('/:id/status', verifyAuth, requireAdmin, inquiryController.updateStatus);

export default router;
