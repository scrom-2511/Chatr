import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Groups } from "../../types/ChatType";

// Initial state should be an empty array of Users
const initialState: Groups[] = [];

export const GroupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    // This reducer will set the users array to the payload
    setGroups: (state, action: PayloadAction<Groups[]>) => {
      return action.payload;
    }
  },
});

// Export the actions correctly
export const { setGroups } = GroupsSlice.actions;

export default GroupsSlice.reducer;
