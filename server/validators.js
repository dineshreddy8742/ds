import { z } from 'zod';

// Login validation
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// College validation
export const collegeSchema = z.object({
  name: z.string().min(2, 'College name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// College update validation
export const collegeUpdateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  google_sheet_id: z.string().optional().nullable(),
  google_sheet_sync_enabled: z.boolean().optional(),
  is_active: z.boolean().optional(),
});

// Lead validation
export const leadSchema = z.object({
  student_name: z.string().min(1, 'Student name is required').max(200),
  phone: z.string().max(20).optional(),
  email: z.string().email().optional().or(z.literal('')),
  intent: z.string().max(100).optional(),
  duration: z.string().max(50).optional(),
  summary: z.string().optional(),
  ai_summary: z.string().optional(),
  transcript: z.string().optional(),
  recording_url: z.string().url().optional().or(z.literal('')),
  ai_score: z.number().int().min(0).max(100).optional(),
  status: z.string().max(50).optional(),
  notes: z.string().optional(),
  college_id: z.string().uuid('Valid college ID is required'),
});

// Lead update validation
export const leadUpdateSchema = z.object({
  student_name: z.string().min(1).max(200).optional(),
  phone: z.string().max(20).optional(),
  email: z.string().email().optional().or(z.literal('')).optional(),
  intent: z.string().max(100).optional(),
  duration: z.string().max(50).optional(),
  summary: z.string().optional(),
  ai_summary: z.string().optional(),
  transcript: z.string().optional(),
  recording_url: z.string().url().optional().or(z.literal('')),
  ai_score: z.number().int().min(0).max(100).optional(),
  status: z.string().max(50).optional(),
  notes: z.string().optional(),
});

// Profile update validation
export const profileUpdateSchema = z.object({
  full_name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
});

// Pagination schema
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(1000).default(20),
  search: z.string().optional(),
  status: z.string().optional(),
  college_id: z.string().uuid().optional(),
  dateFilter: z.string().optional(),
  industry: z.string().optional(),
}).passthrough();
