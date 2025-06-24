'use client';
import Image from "next/image";
import { useEffect, useRef } from "react";
import LandingBar from "@/components/LandingBar";
import About from "@/components/About";
import Contact from "@/components/Contact";

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

      <main>
          {/* Hero Section */}
          <section className="relative text-center min-h-screen flex items-center justify-center">
              <div className="container mx-auto px-6 z-10">
                  <div className="animate-fade-in-up">
                      <h1 className="brown-text hero-text text-5xl md:text-7xl font-bold text-space-brown leading-tight mb-6">
                          Where stories find their  
                          <span className="text-space-red"> space</span>.
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
            <About></About>
          </section>

        {/* <!-- Features Section -->
          <section id="features" className="py-20 bg-gradient-to-br from-(--cream-light) to-(--cream-medium)">

          </section> */}

          {/* <!-- Contact Section --> */}
          <section id="contact" className="py-20 bg-gradient-to-br from-(--space-red) to-(--salmon) text-white">
            <Contact></Contact>
          </section>

          {/* <!-- CTA Section --> */}
          <section className="cta-section  bg-white mx-auto py-20">
              <div className="container mx-auto px-6 text-center">
                  <h2 className="text-4xl font-bold text-(--space-brown) mb-4">Join the Community of Readers</h2>
                  <p className="text-lg text-gray-700 max-w-xl mx-auto mb-8">Start building your personal book space today. It's free and easy to get started.</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <a href="login-signup/register.html" className="bg-(--space-red) text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-opacity-90 transition-all transform hover:scale-105 shadow-lg">
                          Sign Up Now
                      </a>
                      <a href="#recommendations" className="bg-white text-(--space-red) px-8 py-4 rounded-lg font-semibold text-lg border-2 border-(--space-red) hover:bg-(--cream-light) transition-all transform hover:scale-105 shadow-lg">
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
