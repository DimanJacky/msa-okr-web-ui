import { createSlice } from "@reduxjs/toolkit";

export enum StatusEnums {
  DRAFT = "draft",
  REJECTED = "rejected",
  REVIEW = "review",
  ACTIVE = "active",
  OUTDATE = "outdate",
  DELETED = "deleted",
  CAN_STYLE = "canStyle"
}

const initialState: StatusEnums[] = [StatusEnums.DRAFT, StatusEnums.REJECTED, StatusEnums.REVIEW, StatusEnums.ACTIVE, StatusEnums.OUTDATE];
const filterReducer = createSlice({
  name: "filterReducer",
  initialState,
  reducers: {
    SET_FILTER: (state, action) => {
      if (state.length > 0) {
        const deleteIndex = state.findIndex((element) => element === action.payload);
        if (deleteIndex >= 0 && state.length > 0) {
          if (state.includes(StatusEnums.CAN_STYLE)) {
            state.splice(0);
            state.push(action.payload);
          } else {
            state.splice(deleteIndex, 1);
            if (state.length === 0) {
              state.push(StatusEnums.CAN_STYLE, StatusEnums.DRAFT, StatusEnums.REJECTED, StatusEnums.REVIEW, StatusEnums.ACTIVE, StatusEnums.OUTDATE);
            }
          }
        } else {
          if (state.includes(StatusEnums.CAN_STYLE) && action.payload === StatusEnums.DELETED) {
            state.splice(0);
            state.push(action.payload);
            return;
          }
          state.push(action.payload);
        }
      }
    },
    SET_FILTER_FOR_MASTER: (state) => {
      state.splice(0);
      state.push(StatusEnums.DRAFT);
    },
    DROP_FILTERS: (state) => {
      state.splice(0);
      state.push(StatusEnums.CAN_STYLE, StatusEnums.DRAFT, StatusEnums.REJECTED, StatusEnums.REVIEW, StatusEnums.ACTIVE, StatusEnums.OUTDATE);
    }
  }
});
export const { SET_FILTER, SET_FILTER_FOR_MASTER, DROP_FILTERS } = filterReducer.actions;

export default filterReducer.reducer;
