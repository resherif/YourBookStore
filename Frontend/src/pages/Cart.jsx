import React, { useEffect, useState } from 'react';
import Navbar  from '../components/Navbar';
import { useSelector, useDispatch } from 'react-redux';
import { setCartItems } from '../store/cartSlice';
import '../../src/index.css'
export const Cart = ({ onNavigate }) => {
  const token = useSelector((state) => state.cart.token);
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (token) {
      fetch('/api/cart', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(res => { if (res.success) dispatch(setCartItems(res.data)); });
    }
  }, [token, dispatch]);

  const updateQty = async (book_id, currentQty, change) => {
    const newQty = currentQty + change;
    if (newQty <= 0) return; 

    try {
      await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ book_id, quantity: newQty })
      });
      
      const res = await fetch('/api/cart', { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) dispatch(setCartItems(data.data));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckout = async () => {
    if (!address) return alert('Please enter your shipping address.');
    
    const response = await fetch('/api/orders/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ address })
    });
    const data = await response.json();
    if (data.success) {
      alert('Order Placed Successfully! Your transaction is secure.');
      dispatch(setCartItems([]));
      onNavigate('home');
    } else {
      alert(data.message);
    }
  };

  const totalCartPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="bg-lux-bg min-h-screen text-lux-textMain">
      <Navbar onNavigate={onNavigate} />
      <main className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-serif text-lux-gold tracking-wide mb-8 border-b border-lux-gold/10 pb-4">
          Your Luxury Selection
        </h2>
        
        {cartItems.length === 0 ? (
          <p className="text-lux-textMuted italic text-center py-12">Your cart is empty. Begin collecting masterpieces.</p>
        ) : (
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div key={item.book_id} className="bg-lux-card border border-lux-gold/10 p-6 rounded-lg flex justify-between items-center shadow-xl">
                <div>
                  <h4 className="font-serif font-bold text-lg text-lux-textMain">{item.title}</h4>
                  <p className="text-lux-gold font-mono">${item.price} each</p>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => updateQty(item.book_id, item.quantity, -1)} className="bg-lux-bg border border-lux-gold/30 w-8 h-8 rounded text-lux-gold font-bold hover:bg-lux-gold hover:text-lux-bg transition-all">-</button>
                  <span className="font-bold text-lg w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateQty(item.book_id, item.quantity, 1)} className="bg-lux-bg border border-lux-gold/30 w-8 h-8 rounded text-lux-gold font-bold hover:bg-lux-gold hover:text-lux-bg transition-all">+</button>
                </div>
              </div>
            ))}

            <div className="bg-lux-card border border-lux-gold/20 p-8 rounded-lg mt-12 shadow-2xl space-y-6">
              <div className="flex justify-between items-center text-xl font-serif border-b border-lux-gold/10 pb-4">
                <span className="text-lux-textMuted">Total Valuation:</span>
                <span className="text-lux-gold font-bold text-2xl">${totalCartPrice.toFixed(2)}</span>
              </div>
              <div>
                <label className="block text-lux-textMuted text-xs uppercase tracking-wider mb-2">Premium Delivery Address</label>
                <input 
                  type="text" 
                  placeholder="Enter full address details..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-lux-bg border border-lux-gold/20 rounded px-4 py-3 text-lux-textMain focus:outline-none focus:border-lux-gold transition-colors"
                />
              </div>
              <button onClick={handleCheckout} className="w-full bg-lux-gold hover:bg-lux-goldHover text-lux-bg font-bold py-4 rounded uppercase tracking-widest transition-colors font-serif text-lg shadow-xl">
                Authorize Checkout & Place Order
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};