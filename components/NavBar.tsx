'use client'
import React, { useState, useRef, useEffect } from 'react'
import { navbarLinks } from '@/constants'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const NavBar = () => {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
            {navbarLinks.map((item, idx) => {
              if (item.type === "icon") {
                return (
                  <div key={item.label} className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen((open) => !open)}
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
                              onClick={() => {/* handle logout here */}}
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

export default NavBar