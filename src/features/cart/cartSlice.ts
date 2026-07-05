import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Book } from "@/types";

export interface LocalCartItem {
  book: Book;
  days: number;
}

interface CartState {
  items: LocalCartItem[];
}

const CART_KEY = "library_cart";

function loadCart(): LocalCartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as LocalCartItem[]) : [];
  } catch {
    return [];
  }
}

function persist(items: LocalCartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

const initialState: CartState = {
  items: loadCart(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Book>) => {
      if (!state.items.find((i) => i.book.id === action.payload.id)) {
        state.items.push({ book: action.payload, days: 5 });
        persist(state.items);
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((i) => i.book.id !== action.payload);
      persist(state.items);
    },
    setItemDays: (state, action: PayloadAction<{ bookId: number; days: number }>) => {
      const item = state.items.find((i) => i.book.id === action.payload.bookId);
      if (item) item.days = action.payload.days;
      persist(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      persist(state.items);
    },
  },
});

export const { addToCart, removeFromCart, setItemDays, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
