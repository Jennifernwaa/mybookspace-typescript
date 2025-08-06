'use client'
import React, { useState, useRef, useEffect } from 'react'
import { navbarLinks, NavbarLink } from '@/constants'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'

const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

const NavBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  // State to track which dropdown is open
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      const res = await fetch(`/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to log out.');
      }

      localStorage.removeItem('userId');
      router.push('/sign-in');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Error logging out. Please try again.');
    } finally {
      setOpenDropdown(null); // Close dropdown after logout attempt
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
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
            {navbarLinks.map((item: NavbarLink, idx) => {
              if (item.type) { // If the item is an icon
                const isDropdownOpen = openDropdown === item.label;
                
               // use a single ref but handle the logic carefully
                const currentDropdownRef = isDropdownOpen ? dropdownRef : null;

                return (
                  <div key={item.label} className="relative" ref={currentDropdownRef}>
                    <button
                      onClick={() => setOpenDropdown(isDropdownOpen ? null : item.label)}
                      className="p-1 rounded-full hover:bg-gray-100 focus:outline-none"
                      aria-label={item.label}
                    >
                      <Image
                        src={item.imgURL}
                        alt={item.label}
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                    </button>
                    {isDropdownOpen && item.type === "settings" && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border">
                        <ul className="py-2">
                          <li>
                            <Link 
                              href={userId ? `/profile/${userId}` : "/profile"}
                              className="block px-4 py-2 brown-text hover:space-red-text hover:bg-gray-100"
                              onClick={() => setOpenDropdown(null)} // Close dropdown on link click
                            >
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
                    {isDropdownOpen && item.type === "notifications" && (
                      <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-50 border">
                        <ul className="py-2">
                          <li>
                            <div className="px-4 py-2 text-sm text-gray-500">
                                You have no new notifications.
                            </div>
                          </li>
                          <li>
                            <Link 
                              href="/notifications"
                              className="block px-4 py-2 brown-text hover:space-red-text hover:bg-gray-100"
                              onClick={() => setOpenDropdown(null)}
                            >
                                View all notifications
                            </Link>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                );
              }
              const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);
              return (
                <Link
                  href={item.route}
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
export default NavBar;