import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'; 
import Navbar from '../components/Navbar';
import { BookCard } from '../components/BookCard';
import '../../src/index.css';

export const Home = ({ onNavigate }) => {
  const [books, setBooks] = useState([]);
  const token = useSelector((state) => state.cart.token); 

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const headers = {};
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const res = await fetch('/api/books', { headers });
        const data = await res.json();

        if (res.ok && data.success) {
          setBooks(data.data || []);
        } else {
          console.error(data.message || 'Failed to load books');
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchBooks();
  }, [token]);

  return (
    <div className="bg-lux-bg min-h-screen text-lux-textMain">
      <Navbar onNavigate={onNavigate} />
      
      <header className="py-16 sm:py-24 text-center max-w-4xl mx-auto px-4 border-b border-lux-gold/10">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif tracking-tight text-lux-textMain mb-6 leading-tight">
          Curated Literature For <span className="italic text-lux-gold font-light">The Connoisseur</span>
        </h1>
        <p className="text-lux-textMuted text-base sm:text-lg font-light max-w-2xl mx-auto leading-relaxed">
          Step into a realm of premium knowledge. Explore our masterpieces tailored for fine minds.
        </p>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-16">
        <h2 className="text-xl sm:text-2xl font-serif tracking-widest uppercase text-lux-gold mb-10 text-center">
          The Masterpiece Collection
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {books.map((book) => (
            <BookCard key={book.id} book={book} onNavigate={onNavigate} />
          ))}
        </div>
      </main>
    </div>
  );
};