import { supabaseServer } from '../supabase.js';
import { createLead } from './leadService.js';

// Get all colleges
export const getColleges = async () => {
  const { data, error } = await supabaseServer
    .from('colleges')
    .select('id, name, email, is_active, created_at')
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
};

// Get college by ID
export const getCollegeById = async (id) => {
  const { data, error } = await supabaseServer
    .from('colleges')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

// Create college with Supabase Auth user
export const createCollege = async ({ name, email, password }) => {
  // Create user in Supabase Auth
  const { data: authData, error: authError } = await supabaseServer.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Auto-confirm for admin-created users
    user_metadata: {
      role: 'COLLEGE',
      college_name: name,
    },
  });

  if (authError) throw authError;

  // The trigger will automatically create the college entry
  // Wait a moment for the trigger to execute
  await new Promise(resolve => setTimeout(resolve, 500));

  // Get the created college
  const { data: college, error: collegeError } = await supabaseServer
    .from('colleges')
    .select('*')
    .eq('email', email)
    .single();

  if (collegeError) throw collegeError;

  return {
    user: authData.user,
    college,
  };
};

// Update college
export const updateCollege = async (id, updates) => {
  const { data, error } = await supabaseServer
    .from('colleges')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating college:', error);
    throw new Error(`Failed to update college: ${error.message}`);
  }
  return data;
};

// Delete college (also deletes associated leads via CASCADE)
export const deleteCollege = async (id) => {
  // Get college email to find associated user
  const { data: college } = await supabaseServer
    .from('colleges')
    .select('email')
    .eq('id', id)
    .single();

  if (!college) throw new Error('College not found');

  // Find the user by email
  const { data: userList, error: listError } = await supabaseServer.auth.admin.listUsers();
  
  if (listError) throw listError;
  
  const user = userList.users?.find(u => u.email === college.email);
  
  if (!user) {
    // If no auth user found, just delete the college record directly
    const { error: deleteError } = await supabaseServer
      .from('colleges')
      .delete()
      .eq('id', id);
    
    if (deleteError) throw deleteError;
    return { success: true };
  }

  // Delete the user from auth (this will cascade delete the college via trigger)
  const { error } = await supabaseServer.auth.admin.deleteUser(user.id);

  if (error) throw error;
  return { success: true };
};

// Reset college password (admin override)
export const resetPassword = async (id, newPassword) => {
  // Get college email
  const { data: college } = await supabaseServer
    .from('colleges')
    .select('email')
    .eq('id', id)
    .single();

  if (!college) throw new Error('Organization not found');

  // Find the user by email
  const { data: userList, error: listError } = await supabaseServer.auth.admin.listUsers();
  if (listError) throw listError;
  
  const user = userList.users?.find(u => u.email === college.email);
  if (!user) throw new Error('Security identity not found for this organization');

  // Update password via admin API
  const { error } = await supabaseServer.auth.admin.updateUserById(user.id, {
    password: newPassword
  });

  if (error) throw error;
  return { success: true, message: 'Neural credentials recalibrated successfully' };
};

// Get college stats
export const getCollegeStats = async (collegeId) => {
  const { data: leadsCount, error: leadsError } = await supabaseServer
    .from('leads')
    .select('id', { count: 'exact', head: true })
    .eq('college_id', collegeId);

  if (leadsError) throw leadsError;

  return {
    total_leads: leadsCount,
  };
};
