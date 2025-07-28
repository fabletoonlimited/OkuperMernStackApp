import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userAuthSlice";
import cartReducer from "./cartSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer
  },
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
