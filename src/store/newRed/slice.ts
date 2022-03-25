import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  connected: [],
  unconnecteds: []
};

const newRed = createSlice({
  name: "newRed",
  initialState,
  reducers: {
    SET_ALL_OBJ: (state, action) => {
      state.connected = action.payload;
    },
    SET_ALL: (state, action) => {
      state.unconnecteds = action.payload;
    }
  }
});

export const { SET_ALL_OBJ, SET_ALL } = newRed.actions;

export default newRed.reducer;
