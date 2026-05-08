import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yyyvrdfmgoqcatszfscd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5eXZyZGZtZ29xY2F0c3pmc2NkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyNTM4MjcsImV4cCI6MjA5MzgyOTgyN30.JNzPbYMDxpFnNdHLMpJUa7XPo1PrNGLfPXeeSZcgy7M'

export const supabase = createClient(supabaseUrl, supabaseKey)