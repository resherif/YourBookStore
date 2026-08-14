import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setToken } from '../store/cartSlice';
import '../../src/index.css';

export const Signup = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch(`${API_URL}api/register`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await response.json();

      if (response.ok && data.accessToken) {
        dispatch(setToken(data.accessToken));
        setMessage('Account created successfully!');
        onNavigate('home');
      } else {
        setMessage(data.message || 'Signup failed');
      }
    } catch (err) {
      console.error(err);
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="bg-lux-bg min-h-screen flex items-center justify-center px-3 py-6 sm:px-4">
      <div className="bg-lux-card border border-lux-gold/20 p-6 sm:p-8 lg:p-10 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-2xl sm:text-3xl font-serif text-center text-lux-gold tracking-widest uppercase mb-6 sm:mb-8">
          Create Account
        </h2>
        <form onSubmit={handleSignupSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-lux-textMuted text-xs uppercase tracking-wider mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-lux-bg border border-lux-gold/20 rounded px-4 py-3 text-lux-textMain focus:outline-none focus:border-lux-gold transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-lux-textMuted text-xs uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-lux-bg border border-lux-gold/20 rounded px-4 py-3 text-lux-textMain focus:outline-none focus:border-lux-gold transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-lux-textMuted text-xs uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-lux-bg border border-lux-gold/20 rounded px-4 py-3 text-lux-textMain focus:outline-none focus:border-lux-gold transition-colors"
              required
            />
          </div>
          <button type="submit" className="w-full bg-lux-gold hover:bg-lux-goldHover text-lux-bg font-bold py-3 rounded uppercase tracking-widest transition-colors shadow-lg">
            Sign Up
          </button>
        </form>

        {message && <p className="mt-4 text-center text-sm text-lux-textMain">{message}</p>}

        <p className="mt-6 text-center text-sm text-lux-textMuted">
          Already have an account?{' '}
          <button onClick={() => onNavigate('login')} className="text-lux-gold underline">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};
