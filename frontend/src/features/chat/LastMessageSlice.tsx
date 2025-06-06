import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Messages } from "../../types/ChatType";

const initialState: Messages[] = [];

// Create the slice
export const lastMessageSlice = createSlice({
  name: "lastMessages",
  initialState,
  reducers: {
    setLastMessage: (state, action: PayloadAction<Messages[]>) => {
      return action.payload; 
    },
  },
});

// Export the actions
export const { setLastMessage } = lastMessageSlice.actions;

// Export the reducer
export default lastMessageSlice.reducer;
