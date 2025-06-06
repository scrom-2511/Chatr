import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GroupMessages } from "../../types/ChatType";

const initialState: GroupMessages[] = [];

// Create the slice
export const groupMessageSlice = createSlice({
  name: "groupMessages",
  initialState,
  reducers: {
    setGroupMessages: (state, action: PayloadAction<GroupMessages[]>) => {
      return action.payload; 
    },
    addGroupMessage: (state, action: PayloadAction<GroupMessages>) => {
      return [action.payload, ...state];
    }
  },
});

// Export the actions
export const { setGroupMessages, addGroupMessage } = groupMessageSlice.actions;

// Export the reducer
export default groupMessageSlice.reducer;
