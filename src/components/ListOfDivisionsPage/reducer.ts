import { createSlice } from "@reduxjs/toolkit";
import actions from "./actions";

const initialState: any = [];

export type InitialStateType = typeof initialState;

const unitsReducer = createSlice({
  name: "unitsReducer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(actions.getUnits.fulfilled, (state, action) => action.payload.sort((a: any, b: any) => (a.unitTypeId > b.unitTypeId ? 1 : -1)));
  }
});

export default unitsReducer.reducer;
