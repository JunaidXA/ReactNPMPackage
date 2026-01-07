import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

export interface InitialState {
  userData: {
    "tms-accessToken": string;
    email: string;
    name: string;
    role: string;
    accounts: { AccountId: number; Name: string }[];
  };
  userCreds: {
    email: string;
    password: string;
    rememberMe: boolean;
  };

  errorPopup: boolean;
  error: ErrorState | null;
  tokenExpiry: boolean;
  welcomePopup: boolean;
}
export interface ErrorState {
  status: number | null;
  message: string;
  returnKey?: boolean;
}

const initialState: InitialState = {
  userData: {
    "tms-accessToken": "",
    email: "",
    name: "",
    role: "",
    accounts: [],
  },
  userCreds: {
    email: "",
    password: "",
    rememberMe: false,
  },
  errorPopup: false,
  error: null,
  tokenExpiry: false,
  welcomePopup: false,
};

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setErrorPopup: (state, action) => {
      state.errorPopup = action.payload;
    },

    setErrorObject: (state, action) => {
      state.error = action.payload;
    },
    ChecktokenExpire: (state, action) => {
      state.tokenExpiry = action.payload;
    },
    setUserCreds: (state, action) => {
      state.userCreds = action.payload;
    },
    setWelcomePopup: (state, action) => {
      state.welcomePopup = action.payload;
    },
    logout: (state) => {
      const { userCreds } = state; // keep userCreds
      return {
        ...initialState,
        userCreds, // restore it after spreading initialState
      };
    },
  },
});

export const {
  setUserData,
  logout,
  setErrorPopup,
  setErrorObject,
  ChecktokenExpire,
  setUserCreds,
  setWelcomePopup,
} = AuthSlice.actions;
export const getuserData = (state: RootState) => state.auth.userData;
export default AuthSlice.reducer;
