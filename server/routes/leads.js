import { Router } from 'express';
import * as leadController from '../controllers/leadController.js';
import { verifyAuth, requireAdmin, requireCollege } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { leadSchema, leadUpdateSchema, paginationSchema } from '../validators.js';

const router = Router();

// All routes require authentication
router.use(verifyAuth);

// GET /api/leads - Get all leads (with pagination & filters)
router.get('/', validate(paginationSchema, 'query'), leadController.getLeads);

// GET /api/leads/stats - Get lead statistics
router.get('/stats', leadController.getLeadStats);

// GET /api/leads/:id - Get single lead
router.get('/:id', leadController.getLead);

// GET /api/leads/:id/activity - Get lead activity logs
router.get('/:id/activity', leadController.getLeadActivity);

// POST /api/leads - Create lead (admin only)
router.post('/', requireAdmin, validate(leadSchema, 'body'), leadController.createLead);

// PUT /api/leads/:id - Update lead (admin only)
router.put('/:id', requireAdmin, validate(leadUpdateSchema, 'body'), leadController.updateLead);

// DELETE /api/leads/:id - Delete lead (admin only)
router.delete('/:id', requireAdmin, leadController.deleteLead);

// Surgical purge (admin only)
router.post('/purge', requireAdmin, leadController.purgeLeads);

// Global admin routes
router.get('/global/stats', requireAdmin, leadController.getGlobalStats);
router.get('/global/search', requireAdmin, validate(paginationSchema, 'query'), leadController.getGlobalLeads);

// Intelligence route
router.get('/intelligence', requireAdmin, leadController.getGlobalIntelligence);

export default router;
