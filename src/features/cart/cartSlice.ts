import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Book } from "@/types";

export interface LocalCartItem {
  book: Book;
  days: number;
}

interface CartState {
  items: LocalCartItem[];
  selectedIds: number[];
}

const CART_KEY = "library_cart";

function loadCart(): CartState {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return { items: [], selectedIds: [] };
    const parsed = JSON.parse(raw);
    // Backward compatibility: older versions stored a plain array of items.
    if (Array.isArray(parsed)) {
      return { items: parsed as LocalCartItem[], selectedIds: [] };
    }
    return {
      items: (parsed.items as LocalCartItem[]) ?? [],
      selectedIds: (parsed.selectedIds as number[]) ?? [],
    };
  } catch {
    return { items: [], selectedIds: [] };
  }
}

function persist(state: CartState) {
  localStorage.setItem(
    CART_KEY,
    JSON.stringify({ items: state.items, selectedIds: state.selectedIds }),
  );
}

const initialState: CartState = loadCart();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Book>) => {
      if (!state.items.find((i) => i.book.id === action.payload.id)) {
        state.items.push({ book: action.payload, days: 5 });
        persist(state);
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((i) => i.book.id !== action.payload);
      state.selectedIds = state.selectedIds.filter((id) => id !== action.payload);
      persist(state);
    },
    setItemDays: (state, action: PayloadAction<{ bookId: number; days: number }>) => {
      const item = state.items.find((i) => i.book.id === action.payload.bookId);
      if (item) item.days = action.payload.days;
      persist(state);
    },
    toggleSelect: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      state.selectedIds = state.selectedIds.includes(id)
        ? state.selectedIds.filter((x) => x !== id)
        : [...state.selectedIds, id];
      persist(state);
    },
    toggleSelectAll: (state) => {
      const allIds = state.items.map((i) => i.book.id);
      state.selectedIds =
        state.selectedIds.length === allIds.length ? [] : allIds;
      persist(state);
    },
    clearSelection: (state) => {
      state.selectedIds = [];
      persist(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.selectedIds = [];
      persist(state);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  setItemDays,
  toggleSelect,
  toggleSelectAll,
  clearSelection,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
