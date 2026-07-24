import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPendingItem } from '../store/cartSlice';
import '../../src/index.css'

export const BookCard = ({ book, onNavigate }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.cart.token);
  
  const defaultCover = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&q=80";

  const handleAddToCart = async () => {
    if (!token) {
      dispatch(setPendingItem({ book_id: book.id, quantity: 1 }));
      onNavigate('login');
      return;
    }

    try {
      await fetch('/api/cart', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ book_id: book.id, quantity: 1 })
      });
      alert('Added to your luxury collection!');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-lux-card border border-lux-gold/10 hover:border-lux-gold/40 p-4 sm:p-5 rounded-lg shadow-2xl flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-2 group">
      <div className="relative overflow-hidden rounded-md mb-4 aspect-[2/3]">
        <img 
          src={book.image_url || defaultCover} 
          alt={book.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-lux-bg via-transparent to-transparent opacity-60"></div>
      </div>
      
      <div>
        <h3 className="font-serif font-bold text-xl text-lux-textMain tracking-wide mb-1 group-hover:text-lux-gold transition-colors">
          {book.title}
        </h3>
        <p className="text-lux-textMuted text-xs line-clamp-2 mb-3">
          {book.description || "An exquisite piece of literature tailored for fine minds."}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-4">
        <span className="text-lux-gold font-serif font-bold text-lg">${book.price}</span>
        <button 
          onClick={handleAddToCart}
          className="bg-transparent border border-lux-gold text-lux-gold hover:bg-lux-gold hover:text-lux-bg px-4 py-2 text-xs font-bold uppercase tracking-widest rounded transition-all duration-300 shadow-md"
        >
          Add To Cart
        </button>
      </div>
    </div>
  );
};