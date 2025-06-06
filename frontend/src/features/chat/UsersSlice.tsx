import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Users } from "../../types/ChatType";

// Initial state should be an empty array of Users
const initialState: Users[] = [];

export const UserSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    // This reducer will set the users array to the payload
    setUsers: (state, action: PayloadAction<Users[]>) => {
      return action.payload;
    }
  },
});

// Export the actions correctly
export const { setUsers } = UserSlice.actions;

export default UserSlice.reducer;
