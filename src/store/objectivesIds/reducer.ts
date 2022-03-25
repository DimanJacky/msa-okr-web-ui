import { createSlice } from "@reduxjs/toolkit";
import { getTargetList } from "../../components/Accordion/actions";

const initialState: any = [];

const objectivesReducer = createSlice({
  name: "objectivesReducer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getTargetList.fulfilled, (state, action) => action.payload);
  }
});

export default objectivesReducer.reducer;
