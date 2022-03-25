import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { TargetListAPI } from "../../../API";
import { getCompanyTargets } from "../actions";
import { isNowDateInTwoMonth } from "./utils";

export type PeriodType = {
  id: number;
  startDate: string;
  endDate: string;
  status: string;
};
export type PeriodsListType = Array<PeriodType>;

export const getPeriodsList = createAsyncThunk("periodSelection/getPeriodsList", async (arg, thunkAPI) => {
  const { data }: AxiosResponse<PeriodsListType> = await TargetListAPI.getPeriods();
  if (!localStorage.getItem("periodId")) {
    const isTwoMonthDate = isNowDateInTwoMonth(new Date(), new Date(data[0].startDate));
    const periodData = isTwoMonthDate ? data[1] : data[0];
    localStorage.setItem("globalPeriod", periodData.endDate);
    localStorage.setItem("periodId", String(periodData.id));
    thunkAPI.dispatch(getCompanyTargets(String(periodData.id)));
  } else {
    const periodId = localStorage.getItem("periodId");
    if (periodId !== null) thunkAPI.dispatch(getCompanyTargets(periodId));
  }
  return data;
});
