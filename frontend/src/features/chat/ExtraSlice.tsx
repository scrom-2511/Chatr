import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  text: "",
  myUserId: "",
  selectedTab: "direct",
};

export const ExtraSlice = createSlice({
  name: "extra",
  initialState,
  reducers: {
    setText: (state, action: PayloadAction<string>) => {
      state.text = action.payload;
    },
    setMyUserId:(state,action:PayloadAction<string>)=>{
      state.myUserId = action.payload;
    },
    setSelectedTab: (state, action: PayloadAction<string>) => {
      state.selectedTab = action.payload;
    }
  },
});

export const { setText, setMyUserId, setSelectedTab } = ExtraSlice.actions;
export default ExtraSlice.reducer;
