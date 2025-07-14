'use client';

import React, { useEffect, useState } from 'react';

interface BookResult {
  key?: string;
  title: string;
  author_name?: string[];
  publisher?: string[];
  first_publish_year?: number;
  isbn?: string[];
  cover_i?: number;
  subject?: string[];
  number_of_pages_median?: number;
  language?: string[];
  description?: string;
  subjects?: string[];
  rating?: number;
}

const getCoverUrl = (book: BookResult) => {
  if (book.isbn?.[0]) {
    return `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-L.jpg`;
  }
  if (book.cover_i) {
    return `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`;
  }
  return `https://via.placeholder.com/300x450/EAB996/FFFFFF?text=${encodeURIComponent(book.title)}`;
};

const generateStars = (rating?: number) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={`rating-star ${i <= (rating ?? 0) ? 'filled' : ''}`}>
        ★
      </span>
    );
  }
  return stars;
};

const BookDetailPage: React.FC = () => {
  const [book, setBook] = useState<BookResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);


  useEffect(() => {
    const fetchBookDetails = async () => {
      setLoading(true); // Start loading
      setFetchError(false);

      const stored = sessionStorage.getItem('selectedBook');
      if (!stored) {
        setFetchError(true);
        setLoading(false);
        return;
      }

      const parsed: BookResult = JSON.parse(stored);

      try {
        const searchRes = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(parsed.title)}`);
        const searchData = await searchRes.json();
        console.log(searchData);

        const firstMatch = searchData.docs?.[0];
        if (firstMatch && firstMatch.key) {
          const workKey = firstMatch.key;
          const workRes = await fetch(`https://openlibrary.org${workKey}.json`);
          const workData = await workRes.json();

          let description = 'No description available.';
          if (typeof workData.description === 'string') {
            description = workData.description;
          } else if (workData.description?.value) {
            description = workData.description.value;
          }

          const subjects = workData.subjects || [];
          const rating = workData.rating || 0;

          setBook({ ...parsed, description, subjects });
        } else {
          // fallback but not error
          setBook({
            ...parsed,
            description: `Discover the captivating world of "${parsed.title}" by ${parsed.author_name?.[0]}.`,
            subjects: [],
          });
        }
      } catch (error) {
        console.error('Error fetching book details:', error);
        setFetchError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, []);



  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="loading-spinner mx-auto mb-4"></div>
        <p className="text-warm-brown">Loading book details...</p>
      </div>
    );
  }

  if (fetchError || !book) {
    return (
      <div id="errorState" className="text-center py-20">
        <div className="text-6xl mb-4">😔</div>
        <h2 className="text-2xl font-bold text-space-brown mb-2">Book Not Found</h2>
        <p className="text-warm-brown mb-6">Sorry, we couldn't load the book details.</p>
        <button
          onClick={() => history.back()}
          className="back-button text-white px-6 py-3 rounded-lg font-medium"
        >
          Go Back
        </button>
      </div>
    );
  }



  const {
    title,
    author_name,
    first_publish_year,
    publisher,
    number_of_pages_median,
    language,
    isbn,
    subjects,
    description,
    rating,
  } = book;

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      <div className="flex items-center space-x-4">
        <button 
        onClick={() => history.back()}
        className="back-button text-white hover:text-cream-light transition-colors font-medium px-6 py-2 rounded-lg flex items-center space-x-2">
            <span>←</span>
            <span>Back</span>
        </button>
      </div>
      {/* Hero */}
      <div className="page-gradient-bg rounded-3xl p-8 mb-12 text-center relative">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-serif animate-scale-in">
          {title}
        </h1>
        <p className="text-white text-xl opacity-90 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          by {author_name?.[0] || 'Unknown Author'}
        </p>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Cover + Buttons */}
        <div className="lg:col-span-1">
          <div className="a-book-card rounded-3xl p-6 text-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="w-48 h-72 mx-auto mb-6 bg-gradient-to-br from-peach to-salmon rounded-2xl shadow-2xl overflow-hidden">
              <img
                src={getCoverUrl(book)}
                alt={`Cover for ${title}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-4">
              <button className="action-button w-full text-white px-6 py-3 rounded-xl font-semibold text-lg flex items-center justify-center space-x-2">
                <span>📚</span>
                <span>Add to Library</span>
              </button>
              <div className="flex space-x-2">
                <button className="action-button flex-1 text-white px-4 py-2 rounded-lg font-medium text-sm">
                  Want to Read
                </button>
                <button className="action-button flex-1 text-white px-4 py-2 rounded-lg font-medium text-sm">
                  Currently Reading
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ratings + Basic Info */}
          <div className="detail-card rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {generateStars(rating)}
                <span className="text-warm-brown font-medium">({rating ?? 'Not rated'}/5)</span>
              </div>
              <div className="text-sm text-warm-brown opacity-75">Published: {first_publish_year || 'Unknown'}</div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <InfoCard icon="📄" label="Pages" value={number_of_pages_median ?? 'Unknown'} />
              <InfoCard icon="🏢" label="Publisher" value={publisher?.[0] ?? 'Unknown'} />
              <InfoCard icon="🌍" label="Language" value={language?.[0] ?? 'Unknown'} />
              <InfoCard icon="🔢" label="ISBN" value={isbn?.[0]?.slice(0, 10) + '...'} />
            </div>
          </div>

          {/* Description */}
          <div className="detail-card rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <h3 className="text-xl font-bold text-space-brown mb-3 flex items-center">
              <span className="text-2xl mr-2">About</span>
            </h3>
            <p className="text-warm-brown leading-relaxed">
              {description ||
                `Discover the captivating world of "${title}" by ${author_name?.[0]}. This ${
                  subjects?.[0] ?? 'remarkable'
                } book offers readers an engaging journey through its pages, published in ${first_publish_year}.`}
            </p>
          </div>

          {/* Tags */}
          <div className="detail-card rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <h3 className="text-xl font-bold text-space-brown mb-3 flex items-center">
              <span className="mr-2 inline-block w-6 h-6 text-[#72130d]">
                <svg viewBox="0 0 45.998 45.998" className="w-full h-full fill-current" xmlns="http://www.w3.org/2000/svg">
                <path id="_06.Tags" data-name="06.Tags" d="M47,24.983V25a.981.981,0,0,1-.4.776L27.662,44.719a.977.977,0,0,1-1.381-1.381L45,24.623V18a1,1,0,0,1,2,0v6.973S47,24.98,47,24.983ZM19.806,46.575a.854.854,0,0,1-.095.144,1.05,1.05,0,0,1-1.43,0,.919.919,0,0,1-.095-.144L1.425,29.813a.9.9,0,0,1-.144-.095,1.049,1.049,0,0,1,0-1.429.968.968,0,0,1,.144-.095l22.8-22.8A.982.982,0,0,1,25,5h4.056a5.711,5.711,0,0,1,1.67-3.683l.016.018A1.039,1.039,0,0,1,31.5,1a1.109,1.109,0,0,1,1.072,1.143,1.143,1.143,0,0,1-.441.9A3.27,3.27,0,0,0,31.193,5H36a.977.977,0,0,1,.775.395l5.83,5.83A.984.984,0,0,1,43,12V23a.978.978,0,0,1-.4.775ZM41,12.385,35.615,7H31.4a2.988,2.988,0,0,0,.725,1.1h0a.98.98,0,0,1,.127.092l.018-.018A5.817,5.817,0,0,1,34,12.432c0,.042-.01.079-.012.12a3.993,3.993,0,1,1-2.168-.53A3.34,3.34,0,0,0,30.868,9.9a1.162,1.162,0,0,1-.129-.092l-.016.018A5.537,5.537,0,0,1,29.17,7H25.377l-22,22L19,44.623l22-22V12.385ZM30.867,14.961a2.9,2.9,0,0,0,.617-.883,2.006,2.006,0,1,0,2.067.681,3.682,3.682,0,0,1-1.3,1.909A1.032,1.032,0,0,1,31.5,17a1.108,1.108,0,0,1-1.07-1.143A1.142,1.142,0,0,1,30.867,14.961ZM12.282,27.289a.977.977,0,0,1,1.381,0l7.049,7.049a.977.977,0,0,1-1.381,1.381L12.282,28.67A.977.977,0,0,1,12.282,27.289Zm4-4a.977.977,0,0,1,1.381,0l7.049,7.049a.977.977,0,0,1-1.381,1.381L16.282,24.67A.977.977,0,0,1,16.282,23.289Z" fill-rule="evenodd"></path>
                </svg>
                </span> Genres & Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {(subjects?.length ? subjects : ['General']).map((subject, i) => (
                <span key={i} className="tag">
                  {subject}
                </span>
              ))}
            </div>
          </div>

          {/* Book Info */}
          <div className="detail-card rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
            <h3 className="text-xl font-bold text-space-brown mb-3 flex items-center">
              <span className="mr-2 inline-block w-6 h-6 text-[#72130d]">
                <svg viewBox="0 0 24 24" className="w-full h-full fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path clipRule="evenodd" fillRule="evenodd" d="M12 3.75c-4.55635 0-8.25 3.69365-8.25 8.25 0 4.5563 3.69365 8.25 8.25 8.25 4.5563 0 8.25-3.6937 8.25-8.25 0-4.55635-3.6937-8.25-8.25-8.25zm-9.75 8.25c0-5.38478 4.36522-9.75 9.75-9.75 5.3848 0 9.75 4.36522 9.75 9.75 0 5.3848-4.3652 9.75-9.75 9.75-5.38478 0-9.75-4.3652-9.75-9.75zm9.75-.75c.4142 0 .75.3358.75.75v3.5c0 .4142-.3358.75-.75.75s-.75-.3358-.75-.75v-3.5c0-.4142.3358-.75.75-.75zm0-3.25c-.5523 0-1 .44772-1 1s.4477 1 1 1h.01c.5523 0 1-.44772 1-1s-.4477-1-1-1z" />
                </svg>
              </span> Book Information
            </h3>
            <div className="space-y-2 text-warm-brown">
              <InfoRow label="Full Title" value={title} />
              <InfoRow label="Author" value={author_name?.[0]} />
              <InfoRow label="First Published" value={first_publish_year?.toString()} />
              <InfoRow label="ISBN" value={isbn?.[0]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ icon, label, value }: { icon: string; label: string; value?: string | number }) => (
  <div className="bg-cream-light rounded-lg p-3">
    <div className="text-2xl mb-1">{icon}</div>
    <div className="text-sm text-warm-brown opacity-75">{label}</div>
    <div className="font-semibold text-space-brown text-sm">{value}</div>
  </div>
);

const InfoRow = ({ label, value }: { label: string; value?: string }) => (
  <div className="flex justify-between">
    <span className="font-medium">{label}:</span>
    <span className="text-right max-w-md">{value ?? 'Unknown'}</span>
  </div>
);

export default BookDetailPage;
