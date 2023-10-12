import { createSlice } from "@reduxjs/toolkit";

// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  user: null,
  count: 0,
  currency: "USD",
  symbol: "US$",
  unitRate: null,
  mode: "light",
  language: "en",
  isInitialized: false,
  cartItems: [],
  shipping: 0,
  subtotal: 0,
  total: 0,
  amcsItems: [],
};

const slice = createSlice({
  name: "settings",
  initialState,

  reducers: {
    setLogin(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setLogout(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
    setCurrency(state, action) {
      state.currency = action.payload.prefix;
      state.symbol = action.payload.symbol;
    },
    setInitialize(state) {
      state.isInitialized = true;
    },

    setUnitRate(state, action) {
      state.unitRate = action.payload;
    },
    setCount(state) {
      state.count = state.count + 1;
    },
    setThemeMode(state, action) {
      state.mode = action.payload;
    },
    setLanguage(state, action) {
      state.language = action.payload;
    },
    setCartItems(state, action) {
      state.cartItems = action.payload
    },
    setShipping(state, action) {
      state.shipping = action.payload
    },
    setSubtotal(state, action) {
      state.subtotal = action.payload
    },
    setTotalCart(state, action) {
      state.total = action.payload
    },
    setAmcItems(state, action) {
      state.amcsItems = action.payload
    }
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  setLogin,
  setLogout,
  setCount,
  setCurrency,
  setUnitRate,
  setInitialize,
  setThemeMode,
  setCartItems,
  setShipping,
  setSubtotal,
  setTotalCart,
  setAmcItems,
} = slice.actions;

// ----------------------------------------------------------------------