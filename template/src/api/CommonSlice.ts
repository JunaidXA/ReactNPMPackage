import { createSlice } from "@reduxjs/toolkit";

export interface InitialState {
  isOpen: boolean;
  id: string;
  isNavbarVisible: boolean;
  relatedProductVenueId: string;
}

const initialState: InitialState = {
  isOpen: true,
  id: "",
  isNavbarVisible: true,
  relatedProductVenueId: "",
};

const CommonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    toggleSidebar: (state, action) => {
      state.isOpen = action.payload;
    },
    navigatingId: (state, action) => {
      state.id = action.payload;
    },
    toggleNavbar: (state, action) => {
      state.isNavbarVisible = action.payload;
    },
    relatedProductVenueId: (state, action) => {
      state.relatedProductVenueId = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  navigatingId,
  toggleNavbar,
  relatedProductVenueId,
} = CommonSlice.actions;
export default CommonSlice.reducer;
