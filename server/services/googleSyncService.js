import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Sync a lead back to its college's Google Sheet
 */
export const syncLeadToGoogleSheet = async (college, lead) => {
  try {
    if (!college.google_sheet_id || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
      return { success: false, message: 'Google Sheets sync not configured' };
    }

    // Initialize auth
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_SERVICE_ACCOUNT_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(college.google_sheet_id, serviceAccountAuth);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];

    // Find row or append
    const rows = await sheet.getRows();
    const existingRow = rows.find(r => r.get('Phone') === lead.phone || r.get('Email') === lead.email);

    const leadData = {
      'Student Name': lead.student_name,
      'Phone': lead.phone,
      'Email': lead.email,
      'Status': lead.status,
      'Intent': lead.intent,
      'AI Score': lead.ai_score,
      'AI Summary': lead.ai_summary,
      'Notes': lead.notes,
      'Last Updated': new Date().toLocaleString(),
    };

    if (existingRow) {
      Object.assign(existingRow, leadData);
      await existingRow.save();
    } else {
      await sheet.addRow(leadData);
    }

    return { success: true };
  } catch (error) {
    console.error('Google Sheets Sync Error:', error);
    return { success: false, error: error.message };
  }
};
