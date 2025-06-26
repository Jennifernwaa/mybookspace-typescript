'use client'
import ManualBookForm from '@/components/ManualBookForm'
import SearchBook from '@/components/SearchBook'
import React from 'react'

const page = () => {
  return (
    <main className="container mx-auto px-6 py-8 max-w-4xl">
      {/* Page Header */}
      <div className="hero-section-bg rounded-3xl p-8 mb-12 animate-fade-in-up text-center">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4 font-serif">
              Add a New Book 📖
          </h1>
          <p className="text-warm-brown text-lg opacity-90 max-w-2xl mx-auto">
              Discover your next great read by searching our library, or add your own personal collection manually.
          </p>
      </div>
      <SearchBook/>

      {/* Divider */}
      <div className="flex items-center my-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <div className="flex-1 divider-line"></div>
        <span className="px-6 text-warm-brown font-medium bg-cream-light rounded-full py-2">or add manually</span>
        <div className="flex-1 divider-line"></div>
      </div>

      <ManualBookForm/>

    </main>
  )
}

export default page