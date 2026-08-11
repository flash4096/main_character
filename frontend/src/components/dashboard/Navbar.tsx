"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getStoredToken, removeStoredToken } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";
import { User, LogOut, Settings, User as UserIcon, Compass, Sparkles, Terminal, Moon } from "lucide-react";

interface NavbarProps {
  onOpenManifest?: () => void;
}

export default function Navbar({ onOpenManifest }: NavbarProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const token = getStoredToken();
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    removeStoredToken();
    setIsAuthenticated(false);
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-800/60 bg-black/80 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3 sm:gap-5">
          <Link href="/" className="group flex items-center gap-3 transition">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-800 bg-neutral-950 text-neutral-200 transition group-hover:border-neutral-700">
              <Compass className="h-4 w-4 text-white transition-transform group-hover:rotate-45 duration-300" />
            </div>
            <span className="text-sm font-medium tracking-widest text-neutral-300 uppercase transition group-hover:text-white hidden xs:inline-block">
              Memento Mori
            </span>
          </Link>

          {onOpenManifest && (
            <button
              onClick={onOpenManifest}
              className="flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300 hover:border-amber-500 hover:bg-amber-500/20 hover:text-amber-200 transition shadow-[0_0_15px_rgba(245,158,11,0.15)]"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
              <span className="hidden sm:inline">Who is Main Character?</span>
              <span className="sm:hidden">Manifesto</span>
            </button>
          )}
        </div>

        <nav className="flex items-center gap-2 sm:gap-3 text-xs font-medium tracking-wide">
          {/* Matrix Neo Theme Switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            title={theme === "matrix" ? "Switch to Classic Dark theme" : "Switch to Matrix Neo theme"}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-mono transition border ${
              theme === "matrix"
                ? "border-emerald-500/60 bg-emerald-950/60 text-[#00ff41] shadow-[0_0_15px_rgba(0,255,65,0.25)]"
                : "border-neutral-800 bg-neutral-950 text-neutral-300 hover:border-neutral-700 hover:text-white"
            }`}
          >
            {theme === "matrix" ? (
              <>
                <Terminal className="h-3.5 w-3.5 text-[#00ff41] animate-pulse" />
                <span>Matrix Neo</span>
              </>
            ) : (
              <>
                <Moon className="h-3.5 w-3.5 text-neutral-400" />
                <span>Matrix Theme</span>
              </>
            )}
          </button>
          {isAuthenticated ? (
            <>
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950 px-3.5 py-1.5 text-neutral-300 hover:border-neutral-700 hover:text-white transition"
              >
                <Settings className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Life Expectancy</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-full border border-transparent px-3 py-1.5 text-neutral-400 hover:text-neutral-200 transition"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-neutral-400 hover:text-white transition px-2 py-1"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-white px-4 py-1.5 font-semibold text-black hover:bg-neutral-200 transition"
              >
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
