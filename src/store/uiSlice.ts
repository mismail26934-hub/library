import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  search: string;
  category: number | null;
  rating: number | null;
}

const initialState: UiState = {
  search: "",
  category: null,
  rating: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setCategory: (state, action: PayloadAction<number | null>) => {
      state.category = action.payload;
    },
    setRating: (state, action: PayloadAction<number | null>) => {
      state.rating = action.payload;
    },
    resetFilters: (state) => {
      state.search = "";
      state.category = null;
      state.rating = null;
    },
  },
});

export const { setSearch, setCategory, setRating, resetFilters } = uiSlice.actions;
export default uiSlice.reducer;
