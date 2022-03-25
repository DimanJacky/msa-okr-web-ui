import { createSlice } from "@reduxjs/toolkit";
import { getPeriodsList } from "./action";

const initialState: any = [];

const periodsReducer = createSlice({
  name: "periodsReducer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPeriodsList.fulfilled, (state, action) => action.payload);
  }
});

export default periodsReducer.reducer;
