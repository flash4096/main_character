"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/dashboard/Navbar";
import Footer from "@/components/dashboard/Footer";
import { getCurrentUser, updateProfile } from "@/lib/api";
import { 
  setCachedBirthDate, 
  setCachedLifeExpectancy, 
  getCachedCustomLifeExpectancyEnabled, 
  setCachedCustomLifeExpectancyEnabled,
  DEFAULT_LIFE_EXPECTANCY 
} from "@/lib/calculations";
import { User } from "@/types";
import { Calendar, HeartPulse, Save, User as UserIcon } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [expectedLifeYears, setExpectedLifeYears] = useState<number>(DEFAULT_LIFE_EXPECTANCY);
  const [isCustomExpectancyEnabled, setIsCustomExpectancyEnabled] = useState<boolean>(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const u = await getCurrentUser();
        setUser(u);
        setFullName(u.full_name || "");
        setBirthDate(u.birth_date || "1998-01-01");
        setExpectedLifeYears(u.expected_life_years || DEFAULT_LIFE_EXPECTANCY);
        setIsCustomExpectancyEnabled(getCachedCustomLifeExpectancyEnabled());
      } catch (err) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setSaving(true);

    try {
      const targetExpectancy = isCustomExpectancyEnabled ? Number(expectedLifeYears) : DEFAULT_LIFE_EXPECTANCY;
      const updated = await updateProfile({
        full_name: fullName || undefined,
        birth_date: birthDate,
        expected_life_years: targetExpectancy,
      });
      setCachedBirthDate(birthDate);
      setCachedLifeExpectancy(targetExpectancy);
      setCachedCustomLifeExpectancyEnabled(isCustomExpectancyEnabled);
      setUser(updated);
      setMessage("Timeline configuration updated successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-black text-white">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="h-6 w-6 rounded-full border-2 border-white border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-lg space-y-8 rounded-2xl border border-neutral-800 bg-surface/60 p-8 sm:p-10 backdrop-blur-xs">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-light tracking-tight text-white">
              Life Expectancy & Parameters
            </h1>
            <p className="text-xs text-neutral-400 font-light">
              Customize your birth date and target life horizon.
            </p>
          </div>

          {message && (
            <div className="rounded-lg border border-emerald-900/50 bg-emerald-950/40 p-3 text-xs text-emerald-400 text-center font-mono">
              {message}
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-900/50 bg-red-950/40 p-3 text-xs text-red-400 text-center font-mono">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-neutral-400 font-mono">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ""}
                className="w-full rounded-xl border border-neutral-900 bg-neutral-950 py-2.5 px-4 text-sm text-neutral-500 cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-neutral-400 font-mono">
                Full Name
              </label>
              <div className="relative flex items-center">
                <UserIcon className="absolute left-3.5 h-4 w-4 text-neutral-500" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full rounded-xl border border-neutral-800 bg-black py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-600 focus:border-white focus:outline-none transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-neutral-400 font-mono">
                Date of Birth
              </label>
              <div className="relative flex items-center">
                <Calendar className="absolute left-3.5 h-4 w-4 text-neutral-500" />
                <input
                  type="date"
                  required
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-black py-2.5 pl-10 pr-4 text-sm text-white focus:border-white focus:outline-none transition"
                />
              </div>
            </div>

            <div className="space-y-3 rounded-xl border border-neutral-800/80 bg-neutral-950 p-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HeartPulse className="h-4 w-4 text-rose-400" />
                  <label className="text-xs uppercase tracking-wider text-neutral-300 font-mono cursor-pointer" onClick={() => setIsCustomExpectancyEnabled(!isCustomExpectancyEnabled)}>
                    Customize Life Expectancy
                  </label>
                </div>

                {/* Toggle switch */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={isCustomExpectancyEnabled}
                  onClick={() => setIsCustomExpectancyEnabled(!isCustomExpectancyEnabled)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isCustomExpectancyEnabled ? "bg-rose-500" : "bg-neutral-800"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      isCustomExpectancyEnabled ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {!isCustomExpectancyEnabled ? (
                <div className="text-[11px] text-neutral-400 font-light">
                  Standard global benchmark ({DEFAULT_LIFE_EXPECTANCY} years) is active. Toggle switch to set a custom target.
                </div>
              ) : (
                <div className="space-y-1.5 pt-1">
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      required
                      min={1}
                      max={150}
                      value={expectedLifeYears}
                      onChange={(e) => setExpectedLifeYears(Number(e.target.value))}
                      className="w-full rounded-xl border border-neutral-800 bg-black py-2.5 px-4 text-sm text-white focus:border-white focus:outline-none transition font-ticker"
                    />
                  </div>
                  <p className="text-[10px] text-neutral-400 font-light">
                    Global average default is 73 years. Adjust to your country or personal estimate.
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-semibold text-black hover:bg-neutral-200 transition disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? "Saving Changes..." : "Save Settings"}</span>
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
