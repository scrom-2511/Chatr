import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Users } from "../../types/ChatType";

const initialState: string[] = [];

// Create the slice
// In your Redux slice
export const CurrentGroupUsersSlice = createSlice({
  name: "currentGroupUsers",
  initialState,
  reducers: {
    setCurrentGroupUsers: (state, action: PayloadAction<string[]>) => {
      return action.payload; 
    },
  },
});

export const { setCurrentGroupUsers } = CurrentGroupUsersSlice.actions;

// Export the reducer
export default CurrentGroupUsersSlice.reducer;
