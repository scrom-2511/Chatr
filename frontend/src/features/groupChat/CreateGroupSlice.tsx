import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  groupName: "",
  selectedUsers: [{}],
  selectedUsersPublicKey: [{}]
};

export const CreateGroupSlice = createSlice({
  name: "createGroup",
  initialState,
  reducers: {
    setGroupName: (state, action: PayloadAction<string>) => {
      state.groupName = action.payload;
    },
    setSelectedUsers: (state, action: PayloadAction<string[]>) => {
      state.selectedUsers = action.payload;
    },
    setSelectedUsersPublicKey: (state, action: PayloadAction<string[]>) => {
      state.selectedUsersPublicKey = action.payload;
    }
  },
});

export const { setGroupName, setSelectedUsers, setSelectedUsersPublicKey } = CreateGroupSlice.actions;
export default CreateGroupSlice.reducer;
