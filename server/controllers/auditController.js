import * as auditService from '../services/auditService.js';

export const getAuditLogs = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    
    // Admin only check
    if (req.userRole !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const result = await auditService.getAuditLogs({ page, limit });
    res.json(result);
  } catch (error) {
    next(error);
  }
};
