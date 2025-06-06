import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  username: string;
  email: string;
  password: string;
}

const initialState: AuthState = {
  username: "",
  email: "",
  password: "",
};

export const AuthSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
  },
});

export const { setUsername, setEmail, setPassword } = AuthSlice.actions;

export default AuthSlice.reducer;
