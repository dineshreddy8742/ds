import { Router } from 'express';
import * as messageController from '../controllers/messageController.js';
import { verifyAuth } from '../middleware/auth.js';

const router = Router();

router.use(verifyAuth);

router.get('/:college_id', messageController.getMessages);
router.post('/', messageController.createMessage);
router.patch('/:id/issue', messageController.resolveIssue);

export default router;
