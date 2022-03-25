import { createSlice } from "@reduxjs/toolkit";
import { getObjectiveKeyResults } from "../../components/Accordion/actions";

const initialState: any = {
  keyResults: {},
  isLoading: true
};

export const keyResultsSlice = createSlice({
  name: "keyResults",
  initialState,
  reducers: {},
  extraReducers: (builder) => builder
    .addCase(getObjectiveKeyResults.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getObjectiveKeyResults.fulfilled, (state, action) => {
      state.keyResults = { ...state.keyResults, ...action.payload };
      state.isLoading = false;
    })
});

// Action creators are generated for each case reducer function
// export const { increment, decrement, incrementByAmount } = companyObjectiveSlice.actions

export const { reducer: keyResultsReducer } = keyResultsSlice;
