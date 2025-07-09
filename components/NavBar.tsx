'use client'
import React, { useState, useRef, useEffect } from 'react'
// Removed Firebase imports
// import { auth } from "@/lib/firebase.browser";
// import { signOut} from "firebase/auth";

// FIX: Import NavbarLink type from constants
import { navbarLinks, NavbarLink } from '@/constants' 
import { cn } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'

const NavBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // FIX: Updated handleLogout to use a Next.js API route
  const handleLogout = async () => {
    try {
      // Call your logout API route
      const res = await fetch('/api/auth/logout', {
        method: 'POST', // Or DELETE, depending on your API design
        headers: {
          'Content-Type': 'application/json',
          // If your logout API requires a token, include it here
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to log out.');
      }

      // Clear userId from localStorage after successful logout
      localStorage.removeItem('userId'); 
      // Redirect to sign-in after logout
      router.push('/sign-in'); 
    } catch (error) {
      console.error('Logout error:', error);
      // Consider using a more user-friendly notification system instead of alert
      alert('Error logging out. Please try again.'); 
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section className="navigationbar z-50">
      <nav className="flex flex-row gap-4">
        <div className="container mx-auto flex justify-between items-center py-4">
          <div className="text-2xl font-bold font-serif brown-text">myBookSpace</div>
          <div className="space-x-4 flex items-center">
            {navbarLinks.map((item: NavbarLink, idx) => { // Use NavbarLink type here
              if (item.type === "icon") {
                return (
                  <div key={item.label} className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen((open) => !open)}
                      className="p-1 rounded-full hover:bg-gray-100 focus:outline-none"
                      aria-label={item.label}
                    >
                      <Image
                        src={item.imgURL} // item.imgURL is guaranteed to exist here
                        alt={item.label}
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                    </button>
                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border">
                        <ul className="py-2">
                          <li>
                            <Link href="/profile-settings" className="block px-4 py-2 brown-text hover:space-red-text hover:bg-gray-100">
                              Profile Settings
                            </Link>
                          </li>
                          <li>
                            <button
                              className="block w-full text-left px-4 py-2 brown-text hover:space-red-text hover:bg-gray-100"
                              onClick={handleLogout}
                            >
                              Log Out
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                );
              }
              // FIX: TypeScript now knows item.route is a string in this 'else' branch
              const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);
              return (
                <Link
                  href={item.route} // item.route is guaranteed to be string here
                  key={item.label}
                  className={cn(
                    "navbar-link brown-text hover:space-red-text hover:underline underline-offset-4 decoration-space-red font-semibold transition-colors",
                    { "space-red-text underline decoration-space-red": isActive }
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </section>
  )
}
export default NavBar
