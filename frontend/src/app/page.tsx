import DashboardWrapper from "@/components/dashboard/DashboardWrapper";
import Footer from "@/components/dashboard/Footer";
import { DashboardData } from "@/types";
import { computeFullDashboard, DEFAULT_BIRTH_DATE, DEFAULT_LIFE_EXPECTANCY } from "@/lib/calculations";

export const dynamic = "force-dynamic";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://backend:8000";

async function fetchDashboardServer(): Promise<DashboardData> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/dashboard`, {
      cache: "no-store",
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Graceful fallback on client-side calculation
  }

  // Pre-calculated fallback default structure
  return computeFullDashboard(DEFAULT_BIRTH_DATE, DEFAULT_LIFE_EXPECTANCY);
}

export default async function HomePage() {
  const data = await fetchDashboardServer();

  return (
    <div className="flex min-h-screen flex-col bg-black text-white selection:bg-neutral-800">
      <DashboardWrapper initialData={data} />
      <Footer />
    </div>
  );
}
