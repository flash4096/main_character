import Navbar from "@/components/dashboard/Navbar";
import DashboardWrapper from "@/components/dashboard/DashboardWrapper";
import Footer from "@/components/dashboard/Footer";
import { DashboardData } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://backend:8000";

async function fetchDashboardServer(): Promise<DashboardData> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/dashboard`, {
      cache: "no-store",
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.error("Server fetch dashboard error:", error);
  }

  // Fallback default structure if backend service is connecting client-side
  const now = new Date();
  const birthDateIso = "1998-01-01";
  
  return {
    birth_date: birthDateIso,
    expected_life_years: 73,
    current_age: {
      years: 28,
      months: 0,
      days: 0,
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: now.getSeconds(),
      total_seconds: 28 * 365.25 * 86400,
      total_years: 28.0,
    },
    remaining_life: {
      years: 45,
      months: 0,
      days: 0,
      total_days: 45 * 365,
    },
    remaining_seconds: 45 * 365.2425 * 86400,
    is_gift: false,
    gift_message: "Every new day is a gift.",
    progress: {
      year: now.getFullYear(),
      year_progress_percent: 56.0,
      month_name: "July",
      month_progress_percent: 83.0,
      day_progress_percent: 45.0,
    },
    question: {
      id: 1,
      text: "If you had only one year left, what would you stop postponing today?",
      category: "existential",
    },
    quote: {
      id: 1,
      quote: "You could leave life right now. Let that determine what you do and say and think.",
      author: "Marcus Aurelius",
      source: "Meditations",
    },
  };
}

export default async function HomePage() {
  const data = await fetchDashboardServer();

  return (
    <div className="flex min-h-screen flex-col bg-black text-white selection:bg-neutral-800">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <DashboardWrapper initialData={data} />
      </main>

      <Footer />
    </div>
  );
}
