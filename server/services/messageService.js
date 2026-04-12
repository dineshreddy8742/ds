import { supabaseServer } from '../supabase.js';

export const getChatHistory = async (college_id) => {
  const { data, error } = await supabaseServer
    .from('support_messages')
    .select('*')
    .eq('college_id', college_id)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
};

export const sendMessage = async (messageData) => {
  const { data, error } = await supabaseServer
    .from('support_messages')
    .insert([messageData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateIssueStatus = async (id, status) => {
  const { data, error } = await supabaseServer
    .from('support_messages')
    .update({ issue_status: status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};
