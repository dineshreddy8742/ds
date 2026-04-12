import { supabaseServer } from '../supabase.js';
import * as leadService from '../services/leadService.js';

/**
 * Handle incoming data from Google Sheets Webhook
 * This is the "Advanced" way of directly reflecting data
 */
export const handleGoogleSheetWebhook = async (req, res, next) => {
  try {
    const { 
      college_id, 
      student_name, 
      phone, 
      email, 
      status, 
      intent, 
      transcript, 
      ai_summary, 
      recording_url,
      ai_score 
    } = req.body;

    if (!college_id || !student_name) {
      return res.status(400).json({ error: 'Missing required fields: college_id and student_name' });
    }

    // Check if college exists
    const { data: college, error: collegeError } = await supabaseServer
      .from('colleges')
      .select('id')
      .eq('id', college_id)
      .single();

    if (collegeError || !college) {
      return res.status(404).json({ error: 'College not found' });
    }

    // Prepare lead data
    const leadData = {
      college_id,
      student_name,
      phone: phone || null,
      email: email || null,
      status: status || 'New',
      intent: intent || 'Pending',
      transcript: transcript || null,
      ai_summary: ai_summary || null,
      recording_url: recording_url || null,
      ai_score: ai_score ? parseInt(ai_score) : 0,
    };

    // Upsert lead based on phone number or create new
    let result;
    if (phone) {
      const { data: existingLead } = await supabaseServer
        .from('leads')
        .select('id')
        .eq('phone', phone)
        .eq('college_id', college_id)
        .single();

      if (existingLead) {
        result = await leadService.updateLead(existingLead.id, leadData);
      } else {
        result = await leadService.createLead(leadData);
      }
    } else {
      result = await leadService.createLead(leadData);
    }

    res.json({ success: true, lead: result });
  } catch (error) {
    console.error('Webhook error:', error);
    next(error);
  }
};

/**
 * Trigger a manual sync for a college sheet
 * (Placeholder for full Google Sheets API integration)
 */
export const syncCollegeSheet = async (req, res, next) => {
  try {
    const { college_id } = req.params;
    
    // Get college sheet ID
    const { data: college } = await supabaseServer
      .from('colleges')
      .select('google_sheet_id')
      .eq('id', college_id)
      .single();

    if (!college?.google_sheet_id) {
      return res.status(400).json({ error: 'No Google Sheet connected for this college' });
    }

    // In a real scenario, you'd use the Google Sheets API here
    // For now, we return a message that the webhook is the primary sync method
    res.json({ 
      success: true, 
      message: 'Sync signal received. Please ensure your Google Sheet has the DialSmart Apps Script enabled to push updates real-time.' 
    });
  } catch (error) {
    next(error);
  }
};
