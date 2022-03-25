import { createSlice } from "@reduxjs/toolkit";
import { getFixPeriodsArray } from "./actions";

const initialState: any = [];

const fixPeriodsReducer = createSlice({
  name: "FixPeriodsArray",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getFixPeriodsArray.fulfilled, (state, action) => action.payload);
  }
});

export default fixPeriodsReducer.reducer;
