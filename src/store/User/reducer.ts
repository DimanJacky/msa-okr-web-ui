import { createSlice } from "@reduxjs/toolkit";
import { UserState } from "./type";

const initialState: UserState = {
  name: "",
  email: "",
  role: []
};

const userReducers = createSlice({
  name: "userReducers",
  initialState,
  reducers: {
    saveUser: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    }
  }
});

export const { saveUser, setRole } = userReducers.actions;
export default userReducers.reducer;
