'use client'
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/lib/firebase.browser";
import { useRouter } from "next/navigation";

const DashboardPage = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      const auth = getAuth(app);
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {// add email is verified later && user.emailVerified
          setUser(user);
          setLoading(false);
        } else {
          router.push("/sign-in");
        }
      });
      return () => unsubscribe();
    }, [router]);

    if (loading) return <div>Loading...</div>;

  return (
    <>
      <div className="hero-gradient-bg rounded-3xl p-8 md:p-12 mb-12 animate-fade-in-up">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4 font-serif animate-float">
          </h1>
          <p className="text-warm-brown text-lg md:text-xl opacity-90 mb-6 max-w-2xl mx-auto">
            Ready to dive into your next literary adventure? Your books are waiting for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-space-red text-white px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-all transform hover:scale-105 shadow-lg animate-glow">
              Continue Reading
            </button>
            <button className="bg-white text-space-red px-8 py-3 rounded-full font-semibold border-2 border-space-red hover:bg-cream-light transition-all transform hover:scale-105 shadow-lg">
              Add New Book
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mb-12 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        <h2 className="text-3xl font-semibold text-space-brown mb-8 font-serif text-center">Your Reading Journey</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Books Read */}
          <div className="stat-card rounded-3xl p-8 text-center group">
            <div className="text-5xl mb-4 animate-float">📚</div>
            <div className="text-4xl font-bold text-space-brown mb-2"></div>
            <div className="text-warm-brown font-medium text-lg">Books Read</div>
          </div>
          
          {/* Currently Reading */}
          <div className="stat-card rounded-3xl p-8 text-center group">
            <div className="text-5xl mb-4 animate-float-delayed">📖</div>
            <div className="text-4xl font-bold text-space-brown mb-2"></div>
            <div className="text-warm-brown font-medium text-lg">Currently Reading</div>
            <div className="mt-4 text-xs text-warm-brown opacity-70">Making great progress!</div>
          </div>
          
          {/* Want to Read */}
          <div className="stat-card rounded-3xl p-8 text-center group sm:col-span-2 lg:col-span-1">
            <div className="text-5xl mb-4 animate-float-delayed-2">⭐</div>
            <div className="text-4xl font-bold text-space-brown mb-2"></div>
            <div className="text-warm-brown font-medium text-lg">Want to Read</div>
            <div className="mt-4 text-xs text-warm-brown opacity-70">So many adventures await</div>
          </div>
        </div>
      </div>

        
          {/* Quick Actions Section */}
          <div className="mb-12 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <h2 className="text-3xl font-semibold text-space-brown mb-8 font-serif text-center">Quick Actions</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Add Book */}
              <a href="#" className="action-button rounded-3xl p-8 text-center group">
                <div className="text-4xl mb- group-hover:scale-110 transition-transform duration-300">➕</div>
                <div className="text-space-brown font-semibold text-lg button-text transition-colors">Add Book</div>
              </a>
              
              {/* My Books */}
              <a href="#" className="action-button rounded-3xl p-8 text-center group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">📚</div>
                <div className="text-space-brown font-semibold text-lg button-text transition-colors">My Books</div>
              </a>
              
              {/* Recommendations */}
              <a href="#" className="action-button rounded-3xl p-8 text-center group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🌟</div>
                <div className="text-space-brown font-semibold text-lg button-text transition-colors">Book Recs</div>
              </a>
            </div>
          </div>
        {/* Currently Reading Section */}
        <div className="animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            <div className="glass-card rounded-3xl p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-semibold text-space-brown font-serif">Continue Your Journey</h2>
                <a href="mybooks.html" className="text-salmon hover:text-rose-red transition-colors font-medium text-lg flex items-center">
                  View All Books 
                  <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Book 1 */}
                <div className="book-preview-card rounded-2xl p-6 group">
                  <div className="h-40 bg-gradient-to-br from-peach to-salmon rounded-xl mb-4 flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-2xl">📖</span>
                  </div>
                  <h3 className="font-bold text-space-brown mb-2 text-lg">The Seven Husbands of Evelyn Hugo</h3>
                  <p className="text-warm-brown text-sm opacity-75 mb-3">by Taylor Jenkins Reid</p>
                  <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-warm-brown">Progress</span>
                      <span className="text-space-red font-semibold">68%</span>
                    </div>
                    <div className="w-full bg-cream-medium rounded-full h-2">
                      <div className="progress-bar rounded-full" style={{ width: "68%" }}></div>
                    </div>
                  </div>
                </div>
                
                {/* Book 2 */}
                <div className="book-preview-card rounded-2xl p-6 group">
                  <div className="h-40 bg-gradient-to-br from-salmon to-rose-red rounded-xl mb-4 flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-2xl">📚</span>
                  </div>
                  <h3 className="font-bold text-space-brown mb-2 text-lg">Atomic Habits</h3>
                  <p className="text-warm-brown text-sm opacity-75 mb-3">by James Clear</p>
                  <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-warm-brown">Progress</span>
                      <span className="text-space-red font-semibold">34%</span>
                    </div>
                    <div className="w-full bg-cream-medium rounded-full h-2">
                      <div className="progress-bar rounded-full" style={{ width: "34%" }}></div>
                    </div>
                  </div>
                </div>
                
                {/* Book 3 */}
                <div className="book-preview-card rounded-2xl p-6 group md:col-span-2 lg:col-span-1">
                  <div className="h-40 bg-gradient-to-br from-space-pink-dark to-space-red rounded-xl mb-4 flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-2xl">✨</span>
                  </div>
                  <h3 className="font-bold text-space-brown mb-2 text-lg">The Midnight Library</h3>
                  <p className="text-warm-brown text-sm opacity-75 mb-3">by Matt Haig</p>
                  <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-warm-brown">Progress</span>
                      <span className="text-space-red font-semibold">91%</span>
                    </div>
                    <div className="w-full bg-cream-medium rounded-full h-2">
                      <div className="progress-bar rounded-full" style={{ width: "91%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      {/* Currently Reading Edit Modal */}
      <div id="reading-modal" className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm hidden z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-cream-light to-ivory rounded-3xl p-8 max-w-md w-full shadow-2xl border border-salmon/20">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-space-brown font-serif mb-2">Update Reading Progress</h3>
            <p className="text-warm-brown opacity-75">Track your current reading progress</p>
          </div>
          
          <form className="space-y-6">
            <div>
              <label className="block text-warm-brown font-medium mb-2">Book Title</label>
              <input type="text" id="reading-title" className="w-full px-4 py-3 rounded-xl border border-salmon/20 bg-white/70 focus:border-salmon focus:outline-none transition-colors" placeholder="Enter book title" readOnly />
            </div>
            
            <div>
              <label className="block text-warm-brown font-medium mb-2">Author</label>
              <input type="text" id="reading-author" className="w-full px-4 py-3 rounded-xl border border-salmon/20 bg-white/70 focus:border-salmon focus:outline-none transition-colors" placeholder="Enter author name" readOnly />
            </div>
            
            <div>
              <label className="block text-warm-brown font-medium mb-2">Reading Progress</label>
              <div className="space-y-3">
                <input type="range" id="reading-progress" min="0" max="100" defaultValue="50" className="w-full h-2 bg-cream-medium rounded-lg appearance-none cursor-pointer" />
                <div className="flex justify-between text-sm text-warm-brown">
                  <span>0%</span>
                  <span id="progress-display" className="font-semibold text-salmon">50%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-warm-brown font-medium mb-2">Reading Status</label>
              <select id="reading-status" className="w-full px-4 py-3 rounded-xl border border-salmon/20 bg-white/70 focus:border-salmon focus:outline-none transition-colors" defaultValue="reading">
                <option value="wantToRead">Want to Read</option>
                <option value="reading">Currently Reading</option>
                <option value="finished">Finished</option>
              </select>
            </div>
            
            <div className="flex gap-4 mt-8">
              <button type="button" /* onClick={() => closeReadingModal('reading-modal')} */ className="flex-1 py-3 px-4 rounded-xl border border-warm-brown/20 text-warm-brown hover:bg-cream-medium transition-colors">
                Cancel
              </button>
              <button type="submit" className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-peach to-salmon text-white font-semibold hover:from-salmon hover:to-rose-red transition-all">
                Update Progress
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* Reading Goal Section */}
      <div className="mt-12 animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
        <div className="glass-card rounded-3xl p-8 text-center">
          <h3 className="text-2xl font-bold text-space-brown mb-4 font-serif">2025 Reading Goal</h3>
          <div className="flex items-center justify-center mb-6">
            <div className="text-5xl font-bold text-space-red">47</div>
            <div className="mx-4 text-2xl text-warm-brown">/</div>
            <div className="text-3xl font-semibold text-warm-brown opacity-75">60</div>
          </div>
          <div className="max-w-md mx-auto mb-4">
            <div className="w-full bg-cream-medium rounded-full h-3">
              <div className="progress-bar rounded-full h-3" style={{ width: "78%" }}></div>
            </div>
          </div>
          <p className="text-warm-brown text-sm">You're 78% of the way to your goal! Keep it up! 🎉</p>
        </div>
      </div>
    </>
  )
}

export default DashboardPage