// Database Types for Supabase

export interface User {
  id: string;
  clerk_id: string;
  name: string;
  email: string;
  image?: string;
  bio?: string;
  resume_url?: string;
  default_difficulty: 'easy' | 'medium' | 'hard';
  default_duration: number;
  total_interviews: number;
  average_score: number;
  focus_areas?: string[];
  notification_reminders: boolean;
  notification_score_updates: boolean;
  notification_new_features: boolean;
  notification_tips: boolean;
  voice_speed: number;
  strict_mode: boolean;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  text: string;
  category: 'technical' | 'behavioral' | 'system-design' | 'coding';
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  company?: string;
  role?: string;
  sample_answer?: string;
  created_at: string;
  updated_at: string;
}

export interface Interview {
  id: string;
  user_id: string;
  type: 'technical' | 'behavioral' | 'system-design' | 'mixed';
  difficulty: 'easy' | 'medium' | 'hard';
  role?: string;
  company?: string;
  job_description?: string;
  duration?: number;
  status: 'in-progress' | 'completed' | 'abandoned';
  resume_url?: string;
  resume_text?: string;
  overall_score?: number;
  overall_feedback?: string;
  started_at: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Answer {
  id: string;
  interview_id: string;
  question_id?: string;
  question_text: string;
  user_answer: string;
  ai_response?: string;
  score?: number;
  feedback?: string;
  strengths: string[];
  improvements: string[];
  timestamp: string;
  created_at: string;
}

// Insert types (without auto-generated fields)
export type UserInsert = Omit<User, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type QuestionInsert = Omit<Question, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type InterviewInsert = Omit<Interview, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type AnswerInsert = Omit<Answer, 'id' | 'created_at'> & {
  id?: string;
  created_at?: string;
};

// Update types (all fields optional except id)
export type UserUpdate = Partial<Omit<User, 'id' | 'clerk_id' | 'created_at' | 'updated_at'>>;
export type QuestionUpdate = Partial<Omit<Question, 'id' | 'created_at' | 'updated_at'>>;
export type InterviewUpdate = Partial<Omit<Interview, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
export type AnswerUpdate = Partial<Omit<Answer, 'id' | 'interview_id' | 'created_at'>>;

// Extended types with relations
export interface InterviewWithAnswers extends Interview {
  answers: Answer[];
}

export interface InterviewWithUser extends Interview {
  user: User;
}
