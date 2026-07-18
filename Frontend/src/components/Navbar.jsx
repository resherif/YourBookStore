import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setToken } from '../store/cartSlice';
import '../../src/index.css'

 const Navbar = ({ onNavigate }) => {
  const { items, token } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const totalQty = Array.isArray(items)
    ? items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
    : 0;

  const handleNavigate = (page) => {
    onNavigate(page);
  };

  return (
    <nav className="bg-lux-card border-b border-lux-gold/20 px-4 py-4 sm:px-8 sticky top-0 z-50 shadow-2xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div 
          onClick={() => handleNavigate('home')} 
          className="text-xl sm:text-2xl font-serif font-bold tracking-widest text-lux-gold cursor-pointer text-center sm:text-left"
        >
          THE <span className="text-lux-textMain">REGAL</span> BIND
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-8 text-lux-textMain font-medium text-sm sm:text-base">
          <button onClick={() => handleNavigate('home')} className="hover:text-lux-gold transition-colors">Home</button>
          <button 
            onClick={() => handleNavigate('cart')} 
            className="relative hover:text-lux-gold transition-colors flex items-center gap-1"
          >
            Cart
            {totalQty > 0 && (
              <span className="absolute -top-3 -right-4 bg-lux-gold text-lux-bg font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-lg border border-lux-bg">
                {totalQty}
              </span>
            )}
          </button>
          {token ? (
            <button 
              onClick={() => dispatch(setToken(null))}
              className="border border-lux-gold text-lux-gold hover:bg-lux-gold hover:text-lux-bg px-4 py-1.5 rounded transition-all font-semibold"
            >
              Logout
            </button>
          ) : (
            <button 
              onClick={() => handleNavigate('login')} 
              className="bg-lux-gold text-lux-bg hover:bg-lux-goldHover px-5 py-1.5 rounded font-bold transition-colors"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
export default Navbar