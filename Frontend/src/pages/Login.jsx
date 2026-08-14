import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setToken } from '../store/cartSlice';
import '../../src/index.css';

export const Login = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isForgot, setIsForgot] = useState(false);
  const [message, setMessage] = useState('');
  const [tokenSent, setTokenSent] = useState(false);
  const dispatch = useDispatch();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await fetch(`${API_URL}api/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (response.ok && data.accessToken) {
        dispatch(setToken(data.accessToken));

        const pendingItem = localStorage.getItem('pendingCartItem');
        if (pendingItem) {
          const parsedItem = JSON.parse(pendingItem);
          await fetch(`${API_URL}api/cart`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${data.accessToken}`
            },
            body: JSON.stringify(parsedItem)
          });
          localStorage.removeItem('pendingCartItem');
          onNavigate('cart');
          return;
        }

        onNavigate('home');
      } else {
        setMessage(data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error(err);
      setMessage('Something went wrong. Please try again.');
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch(`${API_URL}api/forgot-password `, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail })
      });
      const data = await response.json();
      setMessage(data.message || 'If that email exists, a reset link has been prepared.');
      if (data.resetToken) {
        setResetToken(data.resetToken);
        setTokenSent(true);
      }
    } catch (err) {
      console.error(err);
      setMessage('Unable to process password reset right now.');
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch(`${API_URL}api/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken, password: newPassword })
      });
      const data = await response.json();
      setMessage(data.message || 'Password updated successfully.');
      if (response.ok) {
        setResetToken('');
        setNewPassword('');
        setIsForgot(false);
      }
    } catch (err) {
      console.error(err);
      setMessage('Unable to reset password right now.');
    }
  };

  return (
    <div className="bg-lux-bg min-h-screen flex items-center justify-center px-3 py-6 sm:px-4">
      <div className="bg-lux-card border border-lux-gold/20 p-6 sm:p-8 lg:p-10 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-2xl sm:text-3xl font-serif text-center text-lux-gold tracking-widest uppercase mb-6 sm:mb-8">
          {isForgot ? 'Reset Password' : 'Welcome Back'}
        </h2>

        {message && (
          <div className="mb-4 rounded border border-lux-gold/20 bg-lux-bg px-3 py-2 text-sm text-lux-textMain">
            {message}
          </div>
        )}

        {isForgot ? (
          <div className="space-y-4 sm:space-y-6">
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-lux-textMuted text-xs uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full bg-lux-bg border border-lux-gold/20 rounded px-4 py-3 text-lux-textMain focus:outline-none focus:border-lux-gold transition-colors"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-lux-gold hover:bg-lux-goldHover text-lux-bg font-bold py-3 rounded uppercase tracking-widest transition-colors shadow-lg">
                {tokenSent ? 'Resend Reset Token' : 'Send Reset Token'}
              </button>
            </form>

            {tokenSent && (
              <div className="rounded border border-lux-gold/20 bg-lux-bg px-3 py-2 text-sm text-lux-textMain">
                Your reset token has been filled in automatically below.
              </div>
            )}

            <form onSubmit={handleResetPasswordSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-lux-textMuted text-xs uppercase tracking-wider mb-2">Reset Token</label>
                <input
                  type="text"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  className="w-full bg-lux-bg border border-lux-gold/20 rounded px-4 py-3 text-lux-textMain focus:outline-none focus:border-lux-gold transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-lux-textMuted text-xs uppercase tracking-wider mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-lux-bg border border-lux-gold/20 rounded px-4 py-3 text-lux-textMain focus:outline-none focus:border-lux-gold transition-colors"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-lux-gold hover:bg-lux-goldHover text-lux-bg font-bold py-3 rounded uppercase tracking-widest transition-colors shadow-lg">
                Update Password
              </button>
            </form>

            <button onClick={() => {
              setIsForgot(false);
              setTokenSent(false);
              setResetToken('');
              setNewPassword('');
            }} className="text-lux-gold underline text-sm">
              Back to login
            </button>
          </div>
        ) : (
          <form onSubmit={handleLoginSubmit} className="space-y-4 sm:space-y-6">
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
              Sign In
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-lux-textMuted">
          {isForgot ? 'Remembered your password?' : 'New here?'}{' '}
          <button
            onClick={() => {
              setMessage('');
              setIsForgot(!isForgot);
            }}
            className="text-lux-gold underline"
          >
            {isForgot ? 'Back to sign in' : 'Create an account'}
          </button>
        </p>

        {!isForgot && (
          <div className="mt-3 text-center">
            <button onClick={() => setIsForgot(true)} className="text-sm text-lux-gold underline">
              Forgot password?
            </button>
          </div>
        )}
      </div>
    </div>
  );
};