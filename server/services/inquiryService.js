import { supabaseServer } from '../supabase.js';

/**
 * Service to handle public inquiries from the landing page
 */

export const createInquiry = async (inquiryData) => {
  const { data, error } = await supabaseServer
    .from('inquiries')
    .insert([{
      email: inquiryData.email,
      industry: inquiryData.industry || 'General Business',
      name: inquiryData.name || 'Anonymous Visitor',
      phone: inquiryData.phone || 'Not Provided',
      message: inquiryData.message || 'Demo request from Landing Page',
      status: 'New'
    }])
    .select();

  if (error) {
    console.error('Inquiry Submission Error:', error);
    throw new Error('Our neural gateway is currently busy. Please try again in a moment.');
  }
  return data && data.length > 0 ? data[0] : null;
};

export const getAllInquiries = async () => {
  const { data, error } = await supabaseServer
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const updateInquiryStatus = async (id, status) => {
  const { data, error } = await supabaseServer
    .from('inquiries')
    .update({ status, updated_at: new Date() })
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
};
