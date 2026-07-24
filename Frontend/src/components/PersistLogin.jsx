import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setToken } from '../store/cartSlice';

export default function PersistLogin({ children }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.cart.token);

  useEffect(() => {
    if (!token) {
      dispatch(setToken(null));
    }
  }, [token, dispatch]);

  return children;
}