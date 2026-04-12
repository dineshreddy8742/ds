import express from 'express';
import * as auditController from '../controllers/auditController.js';
import { verifyAuth } from '../middleware/auth.js';

const router = express.Router();

// Admin only route
router.get('/', verifyAuth, auditController.getAuditLogs);

export default router;
