import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CurrentUser } from "../../types/ChatType";

const initialState:CurrentUser = { username: "", id: "", publicKey: "", profilePic:"" };

export const CurrentUserSlice = createSlice({
  name: "currentUserData",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<CurrentUser>) => {
      return action.payload;
    }
  },
});

// Export the actions correctly
export const { setCurrentUser } = CurrentUserSlice.actions;

export default CurrentUserSlice.reducer;
