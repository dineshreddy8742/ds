import * as messageService from '../services/messageService.js';

export const getMessages = async (req, res, next) => {
  try {
    const { college_id } = req.params;
    
    // Security check: Non-admins can only see their own college messages
    if (req.userRole !== 'ADMIN') {
        const { data: college } = await req.supabase
            .from('colleges')
            .select('id')
            .eq('email', req.user.email)
            .single();
        
        if (!college || college.id !== college_id) {
            return res.status(403).json({ error: 'Unauthorized chat access' });
        }
    }

    const messages = await messageService.getChatHistory(college_id);
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

export const createMessage = async (req, res, next) => {
  try {
    const messageData = {
      ...req.body,
      sender_id: req.user.id,
      sender_role: req.userRole
    };
    
    const message = await messageService.sendMessage(messageData);
    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

export const resolveIssue = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await messageService.updateIssueStatus(id, status);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};
