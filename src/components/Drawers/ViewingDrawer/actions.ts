import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { TargetListAPI } from "../../../API";
import { openModal } from "../../../modules/ErrorModal/reducer";

export type keyTargetIdType = {
  keyResultIdList: Array<number>;
};

export type targetHistoryType = {
  entityType: string;
  entityId: number | undefined;
};

export const getKeyTargetsFacts = createAsyncThunk("drower/getKeyTargetsFacts", async (id: number, { rejectWithValue, dispatch }) => {
  try {
    const response: AxiosResponse<any> = await TargetListAPI.getKetTargetFact(id);
    const { data } = response;
    const keyResultFacts = data[Object.keys(data)[0]];
    if (keyResultFacts.length > 0) {
      return keyResultFacts;
    }
    return [];
  } catch (err: any) {
    dispatch(openModal(err.response.data.errorDetails));
    return rejectWithValue(err.response.data);
  }
});

export const getHistoryChanges = createAsyncThunk("drower/getHistoryChanges", async (target: targetHistoryType, { rejectWithValue, dispatch }) => {
  try {
    const response: AxiosResponse<any> = await TargetListAPI.getHistoryChanges(target);
    const { data } = response;
    if (data.length) return data;
    return [];
  } catch (err: any) {
    dispatch(openModal(err.response.data.message));
    return rejectWithValue(err.response.data);
  }
});

export const getLastFact = createAsyncThunk("drawer/getLastFact", async (id: number) => {
  const response: AxiosResponse<any> = await TargetListAPI.getLastFact(id);
  const { data } = response;
  const arrayFact = data[Object.keys(data)[0]];
  if (arrayFact) {
    return arrayFact[0];
  }
  return null;
});

export const getFactsComments = createAsyncThunk("drawer/getFactsComments", async (params: any) => {
  const response: AxiosResponse<any> = await TargetListAPI.getFactsComments(params);
  const { data } = response;
  const test = Object.values(data);
  const result: Array<any> = test.flat();

  return result;
});

export const getAllCommentsFacts = createAsyncThunk("drawer/getAllCommentsFacts", async (params: any) => {
  const response: AxiosResponse<any> = await TargetListAPI.getAllFactComments(params);
  const { data } = response;
  const test = Object.values(data);
  const result: Array<any> = test.flat();

  return result;
});
