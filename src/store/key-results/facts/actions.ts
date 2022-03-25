import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { TargetListAPI } from "../../../API";
import { helpTypeFacts } from "../../../components/Drawers/ViewingDrawer/reducer";

type FactParamsType = {
  id: number;
  keyResultId: number;
  valuePercent: number;
  description: string;
  fixationPeriodId: number;
};

type FactStatusParamsType = {
  entityType: string;
  entityId: number;
  action: string;
  comment?: string;
};

type changeStatusFactType = {
  changeStatusParam: FactStatusParamsType;
  factParams: FactParamsType;
};

// eslint-disable-next-line import/prefer-default-export
export const getAllFacts = createAsyncThunk("drawer/getAllFacts", async (id: number) => {
  const response: AxiosResponse<any> = await TargetListAPI.getAllFacts(id);
  const { data } = response;
  const facts: Array<any> = data[Object.keys(data)[0]];
  if (facts.length > 0) {
    return facts;
  }
  return [];
});

export const updateFact = createAsyncThunk("drawer/updateFact", async (params: any) => {
  const { data }: AxiosResponse<any> = await TargetListAPI.updateFact(params);
  return data;
});

export const updateKeyResultFacts = createAsyncThunk("drawer/updateKeyResultFacts", async (params: any) => {
  const { data }: AxiosResponse<any> = await TargetListAPI.updateKeyResultFacts(params);
  return data;
});

export const getLastFactsPeriod = createAsyncThunk("drawer/getLastFactsPeriod", async (id: number) => {
  const response: AxiosResponse<any> = await TargetListAPI.getLastFact(id);
  const { data } = response;
  const lastFacts: Array<helpTypeFacts> = data[Object.keys(data)[0]];
  if (lastFacts.length > 0) {
    return lastFacts;
  }
  return [];
});

export const putFactGetFacts = createAsyncThunk("drawer/putFactGetFacts", async (params: FactParamsType, { dispatch }) => {
  const { data }: AxiosResponse<any> = await TargetListAPI.updateKeyResultFacts(params);
  await dispatch(getAllFacts(params.keyResultId));
  await dispatch(getLastFactsPeriod(params.keyResultId));
  return data;
});

export const changeFactStatusUpdate = createAsyncThunk("drawer/changeFactStatus", async (params: changeStatusFactType, { dispatch }) => {
  const { changeStatusParam } = params;
  const { factParams } = params;
  const toChangeStatus = [changeStatusParam];
  await dispatch(updateFact(toChangeStatus));
  dispatch(putFactGetFacts(factParams));
});
