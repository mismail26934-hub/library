import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Book, CartItem } from "@/types";

export interface LocalCartItem {
  id: number;
  book: Book;
  days: number;
}

interface CartState {
  items: LocalCartItem[];
  selectedIds: number[];
}

const initialState: CartState = {
  items: [],
  selectedIds: [],
};

function mapCartItems(items: CartItem[]): LocalCartItem[] {
  return items.map((item) => ({
    id: item.id,
    book: item.book,
    days: 5,
  }));
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = mapCartItems(action.payload);
      const bookIds = new Set(state.items.map((i) => i.book.id));
      state.selectedIds = state.selectedIds.filter((id) => bookIds.has(id));
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((i) => i.book.id !== action.payload);
      state.selectedIds = state.selectedIds.filter((id) => id !== action.payload);
    },
    setItemDays: (state, action: PayloadAction<{ bookId: number; days: number }>) => {
      const item = state.items.find((i) => i.book.id === action.payload.bookId);
      if (item) item.days = action.payload.days;
    },
    toggleSelect: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      state.selectedIds = state.selectedIds.includes(id)
        ? state.selectedIds.filter((x) => x !== id)
        : [...state.selectedIds, id];
    },
    toggleSelectAll: (state) => {
      const allIds = state.items.map((i) => i.book.id);
      state.selectedIds =
        state.selectedIds.length === allIds.length ? [] : allIds;
    },
    clearSelection: (state) => {
      state.selectedIds = [];
    },
    clearCart: (state) => {
      state.items = [];
      state.selectedIds = [];
    },
  },
});

export const {
  setCartItems,
  removeFromCart,
  setItemDays,
  toggleSelect,
  toggleSelectAll,
  clearSelection,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
