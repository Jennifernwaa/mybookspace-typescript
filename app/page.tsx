'use client';
import Image from "next/image";
import { useEffect, useRef } from "react";
import LandingBar from "@/components/LandingBar";
import "./globals.css";

export default function Home() {
  const starsRef = useRef<HTMLDivElement>(null);
  const nebulaRef = useRef<HTMLDivElement>(null);
  const planetRefs = useRef<(HTMLDivElement | null)[]>([]);
  const floatingBookRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mainBookRef = useRef<HTMLDivElement>(null);

  // Generate stars effect
  useEffect(() => {
    const starsContainer = starsRef.current;
    if (starsContainer) {
      starsContainer.innerHTML = "";
      for (let i = 0; i < 100; i++) {
        const star = document.createElement("div");
        star.className = "star";
        star.style.position = "absolute";
        star.style.left = Math.random() * 100 + "%";
        star.style.top = Math.random() * 100 + "%";
        const size = Math.random() * 3 + 1;
        star.style.width = size + "px";
        star.style.height = size + "px";
        star.style.background = "white";
        star.style.borderRadius = "50%";
        star.style.opacity = String(Math.random());
        star.style.animationDelay = Math.random() * 2 + "s";
        starsContainer.appendChild(star);
      }
    }
  }, []);

  // Parallax scroll effect
  useEffect(() => {
    function parallaxScroll() {
      const scrolled = window.pageYOffset;
      if (nebulaRef.current) {
        nebulaRef.current.style.transform = `rotate(${scrolled * 0.1}deg)`;
      }
      planetRefs.current.forEach((planet, index) => {
        if (planet) {
          const speed = 0.5 + index * 0.2;
          planet.style.transform = `translateY(${scrolled * speed}px)`;
        }
      });
      floatingBookRefs.current.forEach((book, index) => {
        if (book) {
          const speed = 0.3 + index * 0.1;
          book.style.transform = `translateY(${scrolled * speed}px)`;
        }
      });
    }
    window.addEventListener("scroll", parallaxScroll);
    return () => window.removeEventListener("scroll", parallaxScroll);
  }, []);

  // Book hover effect
  useEffect(() => {
    const mainBook = mainBookRef.current;
    if (!mainBook) return;
    const handleEnter = () => {
      mainBook.style.transform = "rotateY(15deg) rotateX(5deg) scale(1.05)";
    };
    const handleLeave = () => {
      mainBook.style.transform = "rotateY(0deg) rotateX(0deg) scale(1)";
    };
    mainBook.addEventListener("mouseenter", handleEnter);
    mainBook.addEventListener("mouseleave", handleLeave);
    return () => {
      mainBook.removeEventListener("mouseenter", handleEnter);
      mainBook.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br space-bg">
      {/* Background Elements */}
      <div className="stars" ref={starsRef}></div>
      <div className="nebula" ref={nebulaRef}></div>
        
      {/* <!-- Floating Planets --> */}
      <div className="planet planet-1" ref={el => { planetRefs.current[0] = el; }}></div>
      <div className="planet planet-2" ref={el => { planetRefs.current[1] = el; }}></div>
      <div className="planet planet-3" ref={el => { planetRefs.current[2] = el; }}></div>

      {/* <!-- Floating Books --> */}
      <div
        className="floating-book book-1"
        style={{ ['--url-1' as any]: 'url(../public/images/botw1.jpg)' }}
        ref={el => { floatingBookRefs.current[0] = el; }}
      ></div>
      <div
        className="floating-book book-2"
        style={{ ['--url-2' as any]: 'url(../public/images/crescent_city_botw.jpg)' }}
        ref={el => { floatingBookRefs.current[1] = el; }}
      ></div>
      <div
        className="floating-book book-3"
        style={{ ['--url-3' as any]: 'url(../public/images/botw1.jpg)' }}
        ref={el => { floatingBookRefs.current[2] = el; }}
      ></div>
      <div
        className="floating-book book-4"
        style={{ ['--url-2' as any]: 'url(../public/images/botw1.jpg)' }}
        ref={el => { floatingBookRefs.current[3] = el; }}
      ></div>

      <LandingBar />
    {/* Mobile Navigation
    <div className="md:hidden bg-cream-light bg-opacity-95 backdrop-blur-md border-t border-cream-medium shadow-lg">
        <div className="flex justify-around py-3">
            <a href="#" className="flex flex-col items-center p-2 text-rose-red animate-pulse-gentle">
                <span className="text-xl mb-1"></span>
                <span className="text-xs font-medium">Dashboard</span>
            </a>
            <a href="#" className="flex flex-col items-center p-2 text-warm-brown hover:text-rose-red transition-colors">
                <span className="text-xl mb-1"></span>
                <span className="text-xs">Friends & Feed</span>
            </a>
            <a href="#" className="flex flex-col items-center p-2 text-warm-brown hover:text-rose-red transition-colors">
                <span className="text-xl mb-1"></span>
                <span className="text-xs">Recommendations</span>
            </a>
        </div>
    </div> */}


      <main>
          {/* Hero Section */}
          <section className="relative text-center min-h-screen flex items-center justify-center">
              <div className="container mx-auto px-6 z-10">
                  <div className="animate-fade-in-up">
                      <h1 className="hero-text text-5xl md:text-7xl font-bold text-space-brown leading-tight mb-6">
                          Where stories find their 
                          <span className="text-space-red">space</span>.
                      </h1>
                      <p className="text-lg md:text-xl mt-4 max-w-2xl mx-auto text-gray-700 mb-8">
                          Track your reading, organize your digital shelves, and discover your next great read, all in one beautiful app.
                      </p>
                  </div>     
                  
                  {/* Book Showcase */}
                  <div className="book-showcase fade-in-up" style={{ animationDelay: "0.6s" }}>
                      <div className="main-book">
                          <div className="book-cover">
                          </div>
                          <div className="book-spine"></div>
                      </div>
                  </div>

                  <div className="mt-8 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
                      <a href="/login-signup/register.html" className="bg-space-red text-white px-10 py-5 rounded-lg font-semibold text-lg hover:bg-opacity-90 transition-all transform hover:scale-105 shadow-lg">
                          Start Reading Now!
                      </a>
                  </div>
              </div>
          </section>

          {/* About Section */}
          <section id="about" className="py-20 bg-white">
              <div className="container mx-auto px-6">
                  <div className="text-center mb-16">
                      <h2 className="text-4xl md:text-5xl font-bold text-space-brown mb-6">About <strong>myBookSpace</strong></h2>
                      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                          Born from a love of reading and the need for better book organization, <strong>myBookSpace</strong> is where your literary journey finds its perfect home.
                      </p>
                  </div>
                  {/* Story Timeline */}
                  <div className="timeline max-w-4xl mx-auto mb-16">
                      <div className="timeline-item">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                              <div className="bg-cream-light p-8 rounded-xl shadow-lg">
                                  <h3 className="text-2xl font-bold text-space-red mb-4">The Problem</h3>
                                  <p className="text-gray-700">
                                      Scattered bookmarks, forgotten recommendations, and the eternal question: "What should I read next?" 
                                      We've all been there, drowning in our own reading aspirations.
                                  </p>
                              </div>
                              <div className="order-first md:order-last">
                                  <div className="text-6xl text-center">📚</div>
                              </div>
                          </div>
                      </div>

                      <div className="timeline-item">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                              <div className="text-6xl text-center">💡</div>
                              <div className="bg-cream-light p-8 rounded-xl shadow-lg">
                                  <h3 className="text-2xl font-bold text-space-red mb-4">The Vision</h3>
                                  <p className="text-gray-700">
                                      What if there was a space that understood your reading habits, organized your books beautifully, 
                                      and introduced you to stories you never knew you needed?
                                  </p>
                              </div>
                          </div>
                      </div>

                      <div className="timeline-item">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                              <div className="bg-cream-light p-8 rounded-xl shadow-lg">
                                  <h3 className="text-2xl font-bold text-space-red mb-4">The Solution</h3>
                                  <p className="text-gray-700">
                                        <strong>myBookSpace</strong> combines the warmth of a personal library with the intelligence of AI recommendations, 
                                      creating your perfect reading companion.
                                  </p>
                              </div>
                              <div className="order-first md:order-last">
                                  <div className="text-6xl text-center">🚀</div>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Creator Section */}
                  <div className="bg-gradient-to-r from-space-red to-salmon p-8 rounded-xl text-white text-center">
                      <h3 className="text-2xl font-bold mb-4">Meet the Creator</h3>
                      <p className="text-lg opacity-90 max-w-2xl mx-auto">
                          Hi, I'm Jennifer! As a passionate reader and developer, I created <strong>myBookSpace</strong> to solve my own reading organization challenges. 
                          I'm excited to share this with fellow book lovers.
                      </p>
                  </div>
              </div>
          </section>

                   {/* <!-- Features Section --> */}
          <section id="features" className="py-20 bg-gradient-to-br from-cream-light to-cream-medium">
              <div className="container mx-auto px-6 text-center">
                  <h2 className="text-4xl font-bold text-space-brown mb-4">All Your Books, Perfectly Organized</h2>
                  <p className="text-lg mt-2 text-gray-600 mb-12">Everything you need to enhance your reading life.</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                      <div className="feature-card p-8 rounded-lg shadow-lg">
                          <div className="text-4xl mb-4">📖</div>
                          <h3 className="text-2xl font-bold text-space-red mb-4">Track Your Progress</h3>
                          <p className="text-space-brown">Log the books you're currently reading, want to read, and have finished. Never lose your page again.</p>
                      </div>
                      <div className="feature-card p-8 rounded-lg shadow-lg">
                          <div className="text-4xl mb-4">📚</div>
                          <h3 className="text-2xl font-bold text-space-red mb-4">Organize Your Shelves</h3>
                          <p className="text-space-brown">Create custom virtual shelves to categorize your books exactly how you like them. Your library, your rules.</p>
                      </div>
                      <div className="feature-card p-8 rounded-lg shadow-lg">
                          <div className="text-4xl mb-4">🤖</div>
                          <h3 className="text-2xl font-bold text-space-red mb-4">Get AI Recommendations</h3>
                          <p className="text-space-brown">Tell us your favorite genres or authors, and let our smart AI find hidden gems you're sure to love.</p>
                      </div>
                  </div>
              </div>
          </section>

          {/* <!-- Contact Section --> */}
          <section id="contact" className="py-20 bg-gradient-to-br from-space-red to-salmon text-white">
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
          </section>

          {/* <!-- CTA Section --> */}
          <section className="cta-section py-20 bg-white">
              <div className="container mx-auto px-6 text-center">
                  <h2 className="text-4xl font-bold text-space-brown mb-4">Join the Community of Readers</h2>
                  <p className="text-lg text-gray-700 max-w-xl mx-auto mb-8">Start building your personal book space today. It's free and easy to get started.</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <a href="login-signup/register.html" className="bg-space-red text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-opacity-90 transition-all transform hover:scale-105 shadow-lg">
                          Sign Up Now
                      </a>
                      <a href="#recommendations" className="bg-white text-space-red px-8 py-4 rounded-lg font-semibold text-lg border-2 border-space-red hover:bg-cream-light transition-all transform hover:scale-105 shadow-lg">
                          Try AI Recommendations
                      </a>
                  </div>
              </div>
          </section>
        
          {/* Features Section */}
        <div className="slider w-[100px] h-[50px]" style={{ "--quantity": 10 } as React.CSSProperties}>
            <div className="list">
                <div className="item" style={{ "--position": 1 } as React.CSSProperties}>Join Now</div>
                <div className="item" style={{ "--position": 2 } as React.CSSProperties}>Read</div>
                <div className="item" style={{ "--position": 3 } as React.CSSProperties}>Fun</div>
                <div className="item" style={{ "--position": 4 } as React.CSSProperties}>Happy</div>
                <div className="item" style={{ "--position": 5 } as React.CSSProperties}>Jennifer</div>
                <div className="item" style={{ "--position": 6 } as React.CSSProperties}>Portfolio</div>
                <div className="item" style={{ "--position": 7 } as React.CSSProperties}>Read</div>
                <div className="item" style={{ "--position": 8 } as React.CSSProperties}>Please</div>
                <div className="item" style={{ "--position": 9 } as React.CSSProperties}>Its</div>
                <div className="item" style={{ "--position": 10 } as React.CSSProperties}>Fun</div>
            </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-space-brown text-white py-8">
          <div className="container mx-auto px-6 text-center">
              <p>&copy; 2025 My Book Space. All Rights Reserved to Jennifer :).</p>
          </div>
      </footer>
    </div>
  );
}
