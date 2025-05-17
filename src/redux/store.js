import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice"; // Ensure the correct path
import locationReducer from './slice/locationSlice'

const store = configureStore({
  reducer: {
    cart: cartReducer,
    location:locationReducer,

  },
  devTools: process.env.NODE_ENV !== "production", // Enable Redux DevTools in development
});

export default store;
