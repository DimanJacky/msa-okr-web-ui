import { createSlice } from "@reduxjs/toolkit";
import { getObjectiveKeyResults, getTargetList, objectiveSubTaskType } from "../../../components/Accordion/actions";

export interface some {
  id: number;
  name: string;
  objectivePeriodId: number;
  objectiveTypeId: number;
  parentId: null | number;
  status: string;
  unitId: number;
  subTasks?: objectiveSubTaskType[];
}

const initialState: some[] = [];

const unConnectedObjectives = createSlice({
  name: "unConnectedObjectives",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTargetList.fulfilled, (state, action) => action.payload.filter((it) => it.parentId === null))
      .addCase(getObjectiveKeyResults.fulfilled, (state, action) => {
        // eslint-disable-next-line guard-for-in,no-restricted-syntax
        for (const key in action.payload) {
          const findedTaskIndex = state.findIndex((it) => it.id === Number(key));
          if (findedTaskIndex >= 0) state[findedTaskIndex].subTasks = action.payload[key];
        }
      });
  }
});

export default unConnectedObjectives.reducer;
