import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Messages } from "../../types/ChatType";

const initialState: Messages[] = [];

// Create the slice
// In your Redux slice
export const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<Messages[]>) => {
      return action.payload; 
    },
    addMessage: (state, action: PayloadAction<Messages>) => {
      return [action.payload, ...state];
    }
  },
});

export const { setMessages, addMessage } = messageSlice.actions;

// Export the reducer
export default messageSlice.reducer;
