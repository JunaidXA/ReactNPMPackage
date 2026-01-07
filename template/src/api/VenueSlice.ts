import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface VenueState {
  id: string | null;
  venueActiveTabIndex: number;  
}

const initialState: VenueState = {
  id: null,
  venueActiveTabIndex: 0,
};

const venueSlice = createSlice({
  name: "venue",
  initialState,
  reducers: {
    setId(state, action: PayloadAction<string>) {
      state.id = action.payload;
    },
    setVenueActiveTabIndex(state, action: PayloadAction<number>) {
      state.venueActiveTabIndex = action.payload;
    },
  },
});

export const { setId, setVenueActiveTabIndex } = venueSlice.actions;
export default venueSlice.reducer;
