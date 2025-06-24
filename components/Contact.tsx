import React from 'react'

const Contact = () => {
  return (
    <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-6">Get in Touch</h2>
        <p className="text-lg opacity-90 max-w-2xl mx-auto mb-12">
            Have questions, suggestions, or just want to chat about books? 
            I'd love to hear from you!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white bg-opacity-10 p-6 rounded-xl backdrop-blur-sm">
                <div className="text-3xl mb-4">📧</div>
                <h3 className="text-xl font-bold mb-2">Email</h3>
                <p className="opacity-90">jennifernwachinaemere@gmail.com</p>
            </div>
            
            <div className="bg-white bg-opacity-10 p-6 rounded-xl backdrop-blur-sm">
                <div className="text-3xl mb-4">📱</div>
                <a href="https://www.instagram.com/jenniferrnw/" target="_blank" rel="noopener noreferrer">
                <h3 className="text-xl font-bold mb-2">Instagram</h3>
                <p className="opacity-90">@jenniferrnw</p>
                </a>
            </div>
        </div>
    </div>
  )
}

export default Contact