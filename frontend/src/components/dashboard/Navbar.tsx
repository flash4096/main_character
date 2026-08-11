"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getStoredToken, removeStoredToken } from "@/lib/utils";
import { User, LogOut, Settings, User as UserIcon, Compass, Sparkles } from "lucide-react";

interface NavbarProps {
  onOpenManifest?: () => void;
}

export default function Navbar({ onOpenManifest }: NavbarProps) {
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
    <header className="sticky top-0 z-50 w-full border-b border-neutral-800/60 bg-black/80 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-14 max-w-[1536px] 2xl:max-w-[1640px] items-center justify-between px-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 sm:gap-5">
          <Link href="/" className="group flex items-center gap-2.5 transition">
            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-800 bg-neutral-950 text-neutral-200 transition group-hover:border-neutral-700">
              <Compass className="h-3.5 w-3.5 text-white transition-transform group-hover:rotate-45 duration-300" />
            </div>
            <span className="text-xs font-semibold tracking-widest text-neutral-300 uppercase transition group-hover:text-white hidden xs:inline-block">
              Memento Mori
            </span>
          </Link>

          {onOpenManifest && (
            <button
              onClick={onOpenManifest}
              className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-300 hover:border-amber-500/60 hover:bg-amber-500/20 transition shadow-[0_0_12px_rgba(245,158,11,0.12)]"
            >
              <Sparkles className="h-3 w-3 text-amber-400 animate-pulse" />
              <span className="hidden sm:inline">Who is Main Character?</span>
              <span className="sm:hidden">Manifesto</span>
            </button>
          )}
        </div>

        <nav className="flex items-center gap-2 sm:gap-3 text-xs font-medium tracking-wide">
          {isAuthenticated ? (
            <>
              <Link
                href="/profile"
                className="flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-950 px-3 py-1 text-neutral-300 hover:border-neutral-700 hover:text-white transition text-xs"
              >
                <Settings className="h-3 w-3" />
                <span className="hidden sm:inline">Settings</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-full border border-transparent px-2.5 py-1 text-neutral-400 hover:text-neutral-200 transition text-xs"
              >
                <LogOut className="h-3 w-3" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-neutral-400 hover:text-white transition px-2 py-1 text-xs"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-white px-3.5 py-1 text-xs font-bold text-black hover:bg-neutral-200 transition"
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
