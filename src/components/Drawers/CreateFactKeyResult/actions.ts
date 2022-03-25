import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { TargetListAPI } from "../../../API";

export type FixPeriodsType = {
  id: number;
  name: string;
  objectivePeriodIdList: number;
  startDate: number;
  endDate: number;
};

export type FixPeriodsArrayType = Array<FixPeriodsType>;

export const getFixPeriodsArray = createAsyncThunk("drower/getFixPeriods", async (objectivePeriodIdList: number) => {
  const response: AxiosResponse<FixPeriodsArrayType> = await TargetListAPI.getFixPeriods(objectivePeriodIdList);
  const { data } = response;
  return data;
});
