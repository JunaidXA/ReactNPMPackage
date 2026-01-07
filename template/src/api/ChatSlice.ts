import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface chatState {
  id: string | null;
  name: string | null;
  email: string | null;
  createdBy: string | null;
  templateId: number | null;
}

const initialState: chatState = {
  id: null,
  name: null,
  email: null,
  createdBy: null,
  templateId: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setId(state, action: PayloadAction<string>) {
      state.id = action.payload;
    },
    setName(state, action: PayloadAction<string>) {
      state.name = action.payload;
    },
    setEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
    },
    setCreatedBy(state, action: PayloadAction<string>) {
      state.createdBy = action.payload;
    },
    setTemplateId(state, action: PayloadAction<number>) {
      state.templateId = action.payload;
    },
  },
});

export const { setId, setName, setEmail, setCreatedBy, setTemplateId } =
  chatSlice.actions;
export default chatSlice.reducer;
