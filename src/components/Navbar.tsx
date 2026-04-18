"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { HiMenu, HiX, HiAcademicCap } from "react-icons/hi";

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const user = session?.user as { name?: string; role?: string } | undefined;

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-md bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600">
            <HiAcademicCap className="text-2xl" />
            Helloworldceo
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/courses" className="text-gray-600 hover:text-indigo-600 transition font-medium">
              Courses
            </Link>
            {session ? (
              <>
                {user?.role === "INSTRUCTOR" && (
                  <Link href="/instructor" className="text-gray-600 hover:text-indigo-600 transition font-medium">
                    Dashboard
                  </Link>
                )}
                <Link href="/my-courses" className="text-gray-600 hover:text-indigo-600 transition font-medium">
                  My Learning
                </Link>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">
                    {user?.name}
                  </span>
                  <button
                    onClick={() => signOut()}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-indigo-600 transition font-medium"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-gray-600"
            onClick={() => setOpen(!open)}
          >
            {open ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/courses" className="block px-3 py-2 rounded-lg hover:bg-gray-50" onClick={() => setOpen(false)}>
              Courses
            </Link>
            {session ? (
              <>
                {user?.role === "INSTRUCTOR" && (
                  <Link href="/instructor" className="block px-3 py-2 rounded-lg hover:bg-gray-50" onClick={() => setOpen(false)}>
                    Dashboard
                  </Link>
                )}
                <Link href="/my-courses" className="block px-3 py-2 rounded-lg hover:bg-gray-50" onClick={() => setOpen(false)}>
                  My Learning
                </Link>
                <button
                  onClick={() => { signOut(); setOpen(false); }}
                  className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-red-600"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-3 py-2 rounded-lg hover:bg-gray-50" onClick={() => setOpen(false)}>
                  Log In
                </Link>
                <Link href="/register" className="block px-3 py-2 rounded-lg bg-indigo-600 text-white text-center" onClick={() => setOpen(false)}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
