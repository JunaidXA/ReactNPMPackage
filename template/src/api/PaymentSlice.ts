import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface paymentState {
  id: string | null;
  paymentActiveTabIndex: number;  // <-- Add this line
}

const initialState: paymentState = {
  id: null,
  paymentActiveTabIndex: 0,       // <-- Default to first tab
};

const paymentSlice = createSlice({
  name: "venue",   // optional, used in devtools
  initialState,
  reducers: {
    setId(state, action: PayloadAction<string>) {
      state.id = action.payload;
    },
    setPaymentActiveTabIndex(state, action: PayloadAction<number>) {
      state.paymentActiveTabIndex = action.payload;
    },
  },
});

export const { setId, setPaymentActiveTabIndex } = paymentSlice.actions;
export default paymentSlice.reducer;
