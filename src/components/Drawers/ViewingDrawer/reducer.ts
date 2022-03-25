import { createSlice } from "@reduxjs/toolkit";
import {
  getAllCommentsFacts, getFactsComments, getHistoryChanges, getKeyTargetsFacts, getLastFact
} from "./actions";

export type KeyTargetFactType = {
  id: number;
  keyResultId: number;
  valuePercent: string;
  valueNumber: string;
  resultDate: string;
  status: string;
  description: string;
};

export type helpTypeFacts = {
  id: number;
  keyResultId: number;
  valuePercent: number;
  valueNumber: null | number;
  resultDate: string;
  status: string;
  description: string;
  fixationPeriodId: number;
  username?: string;
};
export type helpTypeHistory = {
  id: number;
  username: string;
  eventName: string;
  eventDate: string;
  entityType: string;
  entityId: number;
};

export type commentType = {
  commentDate: string;
  entityId: number;
  entityType: string;
  eventName: string;
  fixationPeriodId: number;
  id: number;
  username: string;
  valueComment: string;
};

export interface IViewingTargets {
  facts: helpTypeFacts[];
  historyChanges: helpTypeHistory[];
  lastFact?: helpTypeFacts;
  lastFactComment?: commentType[];
  allFactsComments?: commentType[];
}

const initialState: IViewingTargets = {
  facts: [],
  historyChanges: []
};

const keyTargetFactReucer = createSlice({
  name: "keyTargetFactReucer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getKeyTargetsFacts.pending, (state) => {
        state.facts = [];
      })
      .addCase(getKeyTargetsFacts.fulfilled, (state, action) => {
        state.facts = action.payload;
      })
      .addCase(getHistoryChanges.fulfilled, (state, action) => {
        state.historyChanges = action.payload;
      })
      .addCase(getLastFact.fulfilled, (state, action) => {
        state.lastFact = action.payload;
      })
      .addCase(getFactsComments.fulfilled, (state, action) => {
        state.lastFactComment = action.payload;
      })
      .addCase(getAllCommentsFacts.fulfilled, (state, action) => {
        state.allFactsComments = action.payload;
      });
  }
});

export default keyTargetFactReucer.reducer;
