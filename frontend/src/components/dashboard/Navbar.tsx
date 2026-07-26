"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getStoredToken, removeStoredToken } from "@/lib/utils";
import { User, LogOut, Settings, User as UserIcon, Compass } from "lucide-react";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

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
    <header className="sticky top-0 z-50 w-full border-b border-surface-border/40 bg-black/80 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-3 transition">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-800 bg-neutral-950 text-neutral-200 transition group-hover:border-neutral-700">
            <Compass className="h-4 w-4 text-white transition-transform group-hover:rotate-45 duration-300" />
          </div>
          <span className="text-sm font-medium tracking-widest text-neutral-300 uppercase transition group-hover:text-white">
            Memento Mori
          </span>
        </Link>

        <nav className="flex items-center gap-4 text-xs font-medium tracking-wide">
          {isAuthenticated ? (
            <>
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950 px-3.5 py-1.5 text-neutral-300 hover:border-neutral-700 hover:text-white transition"
              >
                <Settings className="h-3.5 w-3.5" />
                <span>Life Expectancy</span>
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
