import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CurrentGroup } from "../../types/ChatType";

const initialState:CurrentGroup = { id: "", groupName: "", encryptionKey: "" };

export const CurrentGroupSlice = createSlice({
  name: "currentGroupData",
  initialState,
  reducers: {
    setCurrentGroup: (state, action: PayloadAction<CurrentGroup>) => {
      return action.payload;
    }
  },
});

// Export the actions correctly
export const { setCurrentGroup } = CurrentGroupSlice.actions;

export default CurrentGroupSlice.reducer;
