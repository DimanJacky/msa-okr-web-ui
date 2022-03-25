import { createSlice } from "@reduxjs/toolkit";
import {
  companyObjectivesType, getCompanyTargets, getObjectiveKeyResults, getTargetList
} from "./actions";

export interface IObjectives extends companyObjectivesType {
  subTasks?: companyObjectivesType[];
  unitObjectivesIds?: number[];
}

const initialState: IObjectives[] = [];

const accordionTargetReducer = createSlice({
  name: "accordionTargetReducer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCompanyTargets.fulfilled, (state, action) => action.payload)
      .addCase(getTargetList.fulfilled, (state, action) => {
        const payNoNull = action.payload.filter((pay) => pay.parentId !== null);
        const sorted = payNoNull.sort((it, sec) => {
          if (it.parentId !== null && sec.parentId !== null) {
            return it.parentId - sec.parentId;
          }
          return it.parentId !== null && sec.parentId !== null ? sec.parentId - it.parentId : -1;
        });
        const sortedState = state.sort((st1, st2) => st1.id - st2.id);
        for (let i = 0; i < sortedState.length; i += 1) {
          for (let k = 0; k < sorted.length; k += 1) {
            if (sortedState[i].id === sorted[k].parentId) {
              sortedState[i].subTasks = sorted.filter((it) => it.parentId === sortedState[i].id);
            }
          }
        }
      })
      .addCase(getObjectiveKeyResults.fulfilled, (state, action) => {
        const sortedState = state.sort((st1, st2) => st1.id - st2.id);
        for (let i = 0; i < sortedState.length; i += 1) {
          if (sortedState[i].subTasks) {
            for (let k = 0; k < sortedState[i].subTasks!.length; k += 1) {
              // eslint-disable-next-line no-restricted-syntax
              for (const key in action.payload) {
                if (action.payload[key]) {
                  for (let j = 0; j < action.payload[key].length; j += 1) {
                    if (sortedState[i].subTasks![k].id === action.payload[key][j].objectiveId) {
                      if (j === 0) {
                        sortedState[i].subTasks![k].objectiveSubTask = [{ ...action.payload[key][j] }];
                      } else {
                        sortedState[i].subTasks![k].objectiveSubTask = [...(sortedState[i].subTasks![k].objectiveSubTask || []), { ...action.payload[key][j] }];
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });
  }
});

export default accordionTargetReducer.reducer;
