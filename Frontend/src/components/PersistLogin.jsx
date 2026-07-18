import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setToken } from '../store/cartSlice'; // 

export default function PersistLogin({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.cart.token);

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {

        const response = await fetch('/api/refresh', {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          dispatch(setToken(data.accessToken));
        }
      } catch (err) {
        console.error("Failed to refresh token:", err);
      } finally {
        setIsLoading(false);
      }
    };
    if (!token) {
      verifyRefreshToken();
    } else {
      setIsLoading(false);
    }
  }, [token, dispatch]);
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0B0B0F] text-[#D4AF37]">
        <p className="text-xl animate-pulse">Loading...</p>
      </div>
    );
  }

  return children;
}