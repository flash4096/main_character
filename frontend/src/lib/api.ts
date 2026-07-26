import { DashboardData, User, Question } from "@/types";
import { getStoredToken } from "@/lib/utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

async function fetcher<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "An error occurred" }));
    throw new Error(errorData.detail || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export async function getDashboardData(birthDate?: string, expectedLifeYears?: number): Promise<DashboardData> {
  let url = "/api/v1/dashboard";
  const params = new URLSearchParams();
  if (birthDate) params.append("birth_date", birthDate);
  if (expectedLifeYears) params.append("expected_life_years", expectedLifeYears.toString());
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  return fetcher<DashboardData>(url);
}

export async function getRandomQuestion(): Promise<Question> {
  return fetcher<Question>("/api/v1/questions/random");
}

export async function getAllQuestions(): Promise<Question[]> {
  return fetcher<Question[]>("/api/v1/questions");
}

export async function getCurrentUser(): Promise<User> {
  return fetcher<User>("/api/v1/auth/me");
}

export async function registerUser(data: {
  email: string;
  password: string;
  full_name?: string;
  birth_date?: string;
  expected_life_years?: number;
}): Promise<{ access_token: string; user: User }> {
  return fetcher<{ access_token: string; user: User }>("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function loginUser(email: string, password: string): Promise<{ access_token: string; user: User }> {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Invalid credentials" }));
    throw new Error(errorData.detail || "Login failed");
  }

  return response.json();
}

export async function updateProfile(data: {
  full_name?: string;
  birth_date?: string;
  expected_life_years?: number;
}): Promise<User> {
  return fetcher<User>("/api/v1/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
