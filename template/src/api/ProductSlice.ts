import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProductState {
  id: string | null;
  productActiveTabIndex: number; // <-- Add this line
}

const initialState: ProductState = {
  id: null,
  productActiveTabIndex: 0, // <-- Default to first tab
};

const productSlice = createSlice({
  name: "product", // optional, used in devtools
  initialState,
  reducers: {
    setId(state, action: PayloadAction<string>) {
      state.id = action.payload;
    },
    setProductActiveTabIndex(state, action: PayloadAction<number>) {
      state.productActiveTabIndex = action.payload;
    },
  },
});

export const { setId, setProductActiveTabIndex } = productSlice.actions;
export default productSlice.reducer;
