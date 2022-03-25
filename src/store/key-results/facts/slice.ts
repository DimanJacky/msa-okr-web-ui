import { createSlice } from "@reduxjs/toolkit";

import { getAllFacts, getLastFactsPeriod } from "./actions";
import { StatusEnums } from "../../filters/filters";
import { helpTypeFacts } from "../../../components/Drawers/ViewingDrawer/reducer";

const initialState: any = {
  allFacts: [],
  status: null,
  currentFactNoActive: null,
  inputFact: "",
  descriptionKeyResult: "",
  currentFactPeriod: null,
  lastFacts: [],
  lastFactsReverse: [],
  allFactsReverse: [],
  filters: [StatusEnums.DRAFT, StatusEnums.REVIEW, StatusEnums.REJECTED, StatusEnums.ACTIVE]
};

const allKeyTargetFactsSlice = createSlice({
  name: "allKeyTargetFacts",
  initialState,
  reducers: {
    setInputFact: (state, action) => {
      state.inputFact = action.payload;
    },
    setDescriptionNameKeyResult: (state, action) => {
      state.descriptionKeyResult = action.payload;
    },
    resetState: (state) => {
      state.status = null;
      state.allFacts = [];
      state.currentFactNoActive = null;
      state.inputFact = "";
      state.descriptionKeyResult = "";
      state.currentFactPeriod = "";
      state.lastFacts = [];
      state.lastFactsReverse = [];
      state.allFactsReverse = [];
      state.filters = [StatusEnums.DRAFT, StatusEnums.REVIEW, StatusEnums.REJECTED, StatusEnums.ACTIVE];
    },
    setFilters: (state, action) => {
      const isRemove = state.filters.some((item: StatusEnums) => item === action.payload);

      if (isRemove) {
        state.filters = state.filters.filter((item: StatusEnums) => item !== action.payload);
      } else {
        state.filters.push(action.payload);
      }
    }
  },
  extraReducers: (builder) => builder
    .addCase(getAllFacts.pending, (state) => {
      state.status = null;
      state.currentFactNoActive = null;
      state.inputFact = "";
      state.descriptionKeyResult = "";
      state.currentFactPeriod = "";
    })
    .addCase(getAllFacts.fulfilled, (state, action) => {
      const facts = action.payload;
      state.allFacts = facts;
      state.allFactsReverse = facts.slice().reverse();
      state.allFactsReverse = state.allFactsReverse.filter((fact: helpTypeFacts) => state.filters.some((filter: StatusEnums) => filter === fact.status));
      const length = facts.length - 1;

      if (facts.every((e: any) => e.status === StatusEnums.ACTIVE)) {
        state.status = StatusEnums.ACTIVE;
      } else if (facts.some((e: any) => e.status === StatusEnums.DRAFT)) {
        state.status = StatusEnums.DRAFT;
        state.currentFactNoActive = facts.find((e: any) => e.status === StatusEnums.DRAFT);
        state.inputFact = state.currentFactNoActive?.valuePercent;
        state.descriptionKeyResult = state.currentFactNoActive?.description;
        state.currentFactPeriod = state.currentFactNoActive?.fixationPeriodId;
      } else if (facts[length].status === StatusEnums.REVIEW) {
        state.status = StatusEnums.REVIEW;
        state.currentFactNoActive = facts[length];
        state.inputFact = state.currentFactNoActive?.valuePercent;
        state.descriptionKeyResult = state.currentFactNoActive?.description;
        state.currentFactPeriod = state.currentFactNoActive?.fixationPeriodId;
      } else if (facts[length].status === StatusEnums.REJECTED) {
        state.status = StatusEnums.REJECTED;
        state.currentFactNoActive = facts[length];
        state.inputFact = state.currentFactNoActive?.valuePercent;
        state.descriptionKeyResult = state.currentFactNoActive?.description;
        state.currentFactPeriod = state.currentFactNoActive?.fixationPeriodId;
      }
    })
    .addCase(getLastFactsPeriod.fulfilled, (state, action) => {
      state.lastFacts = action.payload;
      state.lastFactsReverse = action.payload.slice().reverse();
    })
});

export const {
  setInputFact, setDescriptionNameKeyResult, resetState, setFilters
} = allKeyTargetFactsSlice.actions;
export default allKeyTargetFactsSlice.reducer;
