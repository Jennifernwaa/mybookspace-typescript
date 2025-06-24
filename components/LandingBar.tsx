'use client'
import React from 'react'
import Link from 'next/link'

const LandingBar = () => {
  return (
    <section className="navigationbar z-50">
      <nav className="flex flex-row gap-4">
        <div className="container mx-auto flex justify-between items-center py-4">
          <div className="text-2xl font-bold font-serif text-(--space-brown)">myBookSpace</div>
          <div className="space-x-4">
            <a href="#about" className="text-(--space-brown) hover:text-[#ae094b] hover:underline transition-all">About</a>
            <a href="#features" className="text-(--space-brown) hover:text-(--space-red) hover:underline transition-all">Features</a>
            <a href="#contact" className="text-(--space-brown) hover:text-(--space-red) hover:underline transition-all">Contact</a>
            <Link href="/sign-in" className="bg-white text-(--space-red) px-4 py-2 rounded-md font-semibold border border-space-red hover:bg-cream-medium hover:text-space-red transition-colors">Log In</Link>
            <Link href="/sign-up" className="bg-(--space-red) text-white px-4 py-2 rounded-md font-semibold hover:bg-opacity-90 hover:text-white transition-opacity">Sign Up</Link>
          </div>
        </div>
      </nav>
    </section>
  )
}

export default LandingBar