import { createSlice } from "@reduxjs/toolkit";
import { getCompanyTargets } from "../../components/Accordion/actions";

const initialState: any = {
  companys: [],
  isLoading: true
};

export const companyObjectiveSlice = createSlice({
  name: "companyObjective",
  initialState,
  reducers: {},
  extraReducers: (builder) => builder
    .addCase(getCompanyTargets.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getCompanyTargets.fulfilled, (state, action) => {
      state.companys = action.payload;
      state.isLoading = false;
    })
});

export const { reducer: companyObjectiveReducer } = companyObjectiveSlice;
