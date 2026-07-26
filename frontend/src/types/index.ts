export interface CurrentAge {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total_seconds: number;
  total_years: number;
}

export interface RemainingLife {
  years: number;
  months: number;
  days: number;
  total_days: number;
}

export interface ProgressMetrics {
  year: number;
  year_progress_percent: number;
  month_name: string;
  month_progress_percent: number;
  day_progress_percent: number;
}

export interface Question {
  id: number;
  text: string;
  category?: string;
}

export interface Quote {
  id: number;
  quote: string;
  author: string;
  source?: string;
}

export interface DashboardData {
  birth_date: string;
  expected_life_years: number;
  current_age: CurrentAge;
  remaining_life: RemainingLife;
  remaining_seconds: number;
  is_gift: boolean;
  gift_message: string;
  progress: ProgressMetrics;
  question: Question | null;
  quote: Quote | null;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  birth_date: string;
  expected_life_years: number;
  is_active: boolean;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
}
