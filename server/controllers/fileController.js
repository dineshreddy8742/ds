import xlsx from 'xlsx';
import * as leadService from '../services/leadService.js';

// Upload and process Excel file
export const uploadLeads = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { college_id } = req.body;

    if (!college_id) {
      return res.status(400).json({ error: 'College ID is required' });
    }

    // Read and parse Excel file (from memory buffer or disk)
    let workbook;
    if (req.file.buffer) {
      // Memory storage (Vercel/serverless)
      workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    } else {
      // Disk storage (local development)
      workbook = xlsx.readFile(req.file.path);
    }
    
    const sheetName = workbook.SheetNames[0];
    const rawData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (rawData.length === 0) {
      return res.status(400).json({ error: 'Excel file is empty' });
    }

    // Transform data with intelligent aliasing - maps ALL Excel columns
    const leadsData = rawData.map(row => {
      // Name mapping
      const student_name = row['Name'] || row['name'] || row['Student Name'] || row['Candidate Name'] || row['Full Name'] || 'Unknown';

      // Phone mapping
      const phone = String(row['Phone'] || row['phone'] || row['Mobile'] || row['Contact Number'] || row['Contact'] || row['Phone Number'] || '');

      // Email mapping
      const email = String(row['Email'] || row['email'] || row['Email ID'] || '');

      // Conversation mapping
      const conversation = String(row['Conversation'] || row['conversation'] || row['Call Notes'] || row['Call Summary'] || row['Notes'] || '');

      // Duration mapping
      const duration = String(row['Duration'] || row['duration'] || row['Call Duration'] || '00m 00s');

      // Status mapping - preserve exact value from Excel
      const status = row['Status'] || row['status'] || 'New';

      // Score mapping
      const ai_score = parseInt(row['Score'] || row['score'] || row['AI Score'] || row['AI Score'] || row['Lead Score'] || '0', 10);

        // Call Start Time mapping
        const call_start_time = row['Call Start Time'] || row['call_start_time'] || row['Call Time'] || row['Start Time'] || null;
  
        // Intent/Interest mapping (keep for backward compatibility)
        const intent = row['Intent'] || row['intent'] || row['Interest'] || row['Interest Level'] || row['Response'] || 'Pending';
  
        // District/Constituency mapping
        const district = row['District'] || row['district'] || row['Constituency'] || row['Area'] || row['Region'] || null;
  
        // Sentiment mapping
        const sentiment = row['Sentiment'] || row['sentiment'] || row['Mood'] || row['Reaction'] || null;
  
        return {
          student_name: String(student_name).slice(0, 200),
          phone: phone.slice(0, 20),
          email: email.slice(0, 100),
          intent: String(intent).slice(0, 100),
          duration: duration.slice(0, 50),
          conversation: conversation.slice(0, 2000),
          status: String(status).slice(0, 50),
          ai_score: isNaN(ai_score) ? 0 : Math.min(100, Math.max(0, ai_score)),
          call_start_time: call_start_time ? String(call_start_time).slice(0, 50) : null,
          district: district ? String(district).slice(0, 100) : null,
          sentiment: sentiment ? String(sentiment).slice(0, 50) : null,
          college_id,
          created_by: req.user.id,
        };
    });

    // Bulk insert leads
    const insertedLeads = await leadService.bulkCreateLeads(leadsData);

    res.json({
      success: true,
      message: `Successfully imported ${insertedLeads.length} leads`,
      count: insertedLeads.length,
    });
  } catch (error) {
    next(error);
  }
};
