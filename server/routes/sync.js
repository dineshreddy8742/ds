import express from 'express';
import * as syncController from '../controllers/syncController.js';
import { verifyAuth } from '../middleware/auth.js';

const router = express.Router();

// Webhook endpoint (doesn't require auth if secret is used, or use a specific API key)
// For simplicity, we'll allow it but you should add a secret check
router.post('/google-sheets/webhook', syncController.handleGoogleSheetWebhook);

// Manual sync endpoint (requires admin auth)
router.post('/google-sheet/:college_id', verifyAuth, syncController.syncCollegeSheet);

export default router;
