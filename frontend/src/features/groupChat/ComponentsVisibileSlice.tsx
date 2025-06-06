import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  menuVisible: false,
  grpUsersSelectMenuVisible: false,
  grpNameComponentVisible: false,
};

export const CreateGroupSlice = createSlice({
  name: "createGroup",
  initialState,
  reducers: {
    setMenuVisible: (state, action: PayloadAction<boolean>) => {
      state.menuVisible = action.payload;
    },
    setGrpNameComponentVisible: (state, action: PayloadAction<boolean>) => {
      state.grpNameComponentVisible = action.payload;
    },
    setGrpUsersSelectMenuVisible: (state, action: PayloadAction<boolean>) => {
      state.grpUsersSelectMenuVisible = action.payload;
    },
  },
});

export const {
  setMenuVisible,
  setGrpNameComponentVisible,
  setGrpUsersSelectMenuVisible,
} = CreateGroupSlice.actions;
export default CreateGroupSlice.reducer;
