import React from 'react'

const About = () => {
  return (
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-(--space-brown) mb-4">All Your Books, Perfectly Organized</h2>
            <p className="text-lg mt-2 text-gray-600 mb-12">Everything you need to enhance your reading life.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="feature-card p-8 rounded-lg shadow-lg">
                    <div className="text-4xl mb-4">📖</div>
                    <h3 className="text-2xl font-bold text-(--space-red) mb-4">Track Your Progress</h3>
                    <p className="text-space-brown">Log the books you're currently reading, want to read, and have finished. Never lose your page again.</p>
                </div>
                <div className="feature-card p-8 rounded-lg shadow-lg">
                    <div className="text-4xl mb-4">📚</div>
                    <h3 className="text-2xl font-bold text-(--space-red) mb-4">Organize Your Shelves</h3>
                    <p className="text-space-brown">Create custom virtual shelves to categorize your books exactly how you like them. Your library, your rules.</p>
                </div>
                <div className="feature-card p-8 rounded-lg shadow-lg">
                    <div className="text-4xl mb-4">🤖</div>
                    <h3 className="text-2xl font-bold text-(--space-red) mb-4">Get AI Recommendations</h3>
                    <p className="text-space-brown">Tell us your favorite genres or authors, and let our smart AI find hidden gems you're sure to love.</p>
                </div>
            </div>

        {/* Creator Section */}
        <div className="bg-gradient-to-r from-(--space-red) to-(--salmon) p-8 rounded-xl text-white text-center mt-12">
            <h3 className="text-2xl font-bold mb-4">Meet the Creator</h3>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
                Hi, I'm Jennifer! As a passionate reader and developer, I created <strong>myBookSpace</strong> to solve my own reading organization challenges. 
                I'm excited to share this with fellow book lovers.
            </p>
        </div>
    </div>
  )
}

export default About