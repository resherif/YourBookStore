import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  token: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
   setToken: (state, action) => {
      state.token = action.payload;
    },
    setCartItems: (state, action) => {
      state.items = action.payload;
    },
    setPendingItem: (state, action) => {
      localStorage.setItem('pendingCartItem', JSON.stringify(action.payload));
    }
  },
});

export const { setToken, setCartItems, setPendingItem } = cartSlice.actions;
export default cartSlice.reducer;