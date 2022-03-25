import { createSlice } from "@reduxjs/toolkit";
import { getTargetList } from "../../components/Accordion/actions";

const initialState: any = {
  objectives: [],
  isLoading: true
};

export const objectivesSlice = createSlice({
  name: "objectives",
  initialState,
  reducers: {},
  extraReducers: (builder) => builder
    .addCase(getTargetList.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getTargetList.fulfilled, (state, action) => {
      state.objectives = action.payload;
      state.isLoading = false;
    })
});

// Action creators are generated for each case reducer function
// export const { increment, decrement, incrementByAmount } = companyObjectiveSlice.actions

export const { reducer: objectiveReducer } = objectivesSlice;
