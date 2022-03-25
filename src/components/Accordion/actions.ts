import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { postReviewTargetType, TargetListAPI } from "../../API";
import {
  actionsTargetType, FetchingKeyTargetType, FetchingTargetType, ObjectKeyResultType
} from "./types";
import { StatusEnums } from "../../store/filters/filters";
import { openModal } from "../../modules/ErrorModal/reducer";

export enum ActionsEnums {
  REVIEW = "to_review",
  REJECT = "reject",
  APPROVE = "approve",
  RECOVER = "recover",
  SOFTDELETE = "soft_delete",
  ASKSOFTDELETE = "ask_soft_delete",
  APPROVESOFTDELETE = "approve_soft_delete",
  REJECTSOFTDELETE = "reject_soft_delete",
  HARDDELETE = "hard_delete"
}

export enum entityTypeEnums {
  KEYRESULT = "keyresult",
  OBJECTIVE = "objective"
}

export enum entityTypeUppercaseEnums {
  OBJECTIVE,
  KEYRESULT,
  KEYRESULTFACT
}

export type companyObjectivesType = {
  id: number;
  name: string;
  objectivePeriodId: number;
  objectiveTypeId: number;
  parentId: null | number;
  status: StatusEnums;
  unitId: number;
  objectiveSubTask?: objectiveSubTaskType[];
};

export type objectiveSubTaskType = {
  challenge: string;
  id: number;
  keyResultTypeId: number;
  name: string;
  objectiveId: number;
  plan: string;
  responsiblePersonId: null | number;
  status: StatusEnums;
  description?: string;
  parentId: number;
  objectiveTypeId: number;
  unitId: number;
  objectivePeriodId: number;
};

export type getCompanyTargetsResponseType = Array<companyObjectivesType>;
type postParamCompanyTargetType = {
  name: string | undefined;
  status: string;
  parentId: number | null;
  objectiveTypeId: number;
  unitId: number;
  objectivePeriodId: number;
  period: string;
};

type getObjectiveKeyResultsType = {
  [key: number]: objectiveSubTaskType[];
};
export type deleteArgType = { target: actionsTargetType[]; unitId: number };
export type postArgKeyTargetType = { target: actionsTargetType[]; objectiveId: number };
export type postParamKeyTargetType = {
  objectiveId: number | undefined;
  name: string;
  status: string;
  description?: string;
  plan?: string;
  challenge?: string;
  keyResultTypeId: number;
};

export const getTargetList = createAsyncThunk("accordion/getTargetList", async (id: number) => {
  const { data }: AxiosResponse<getCompanyTargetsResponseType> = await TargetListAPI.getTargetList(id);
  return data;
});

export const getCompanyTargets = createAsyncThunk("accordion/getCompanyTargets", async (period?: string | number) => {
  const { data }: AxiosResponse<getCompanyTargetsResponseType> = await TargetListAPI.getObjectives(period);
  return data;
});

export const getObjectiveKeyResults = createAsyncThunk("accordion/getObjectivesKeyResults", async (ids: number[] | undefined) => {
  const { data }: AxiosResponse<getObjectiveKeyResultsType> = await TargetListAPI.getObjectivesKeyResults(ids);
  return data;
});

export const updateTarget = createAsyncThunk("accordion/updateTarget", async ({ objectiveId, target }: { objectiveId: number; target: FetchingTargetType }, thunkAPI) => {
  const { data }: AxiosResponse<any> = await TargetListAPI.updateTarget(objectiveId, target);
  thunkAPI.dispatch(getTargetList(data.unitId));
  thunkAPI.dispatch(getCompanyTargets());
  thunkAPI.dispatch(getTargetList(data.unitId));

  return data;
});

export const recoverTarget = createAsyncThunk("accordion/recoverTarget", async (target: actionsTargetType[], { dispatch }) => {
  const { data }: AxiosResponse<any> = await TargetListAPI.recoverTarget(target);
  dispatch(getCompanyTargets());

  return data;
});

export const updateKeyTarget = createAsyncThunk(
  "accordion/updateKeyTarget",
  async ({ objectiveId, keyResultId, keyTarget }: { objectiveId: number; keyResultId: number; keyTarget: FetchingKeyTargetType }) => {
    const { data }: AxiosResponse<any> = await TargetListAPI.updateKeyTarget(objectiveId, keyResultId, keyTarget);
    return data;
  }
);

export const recoverKeyTarget = createAsyncThunk("accordion/recoverKeyTarget", async (keyTarget: actionsTargetType[]) => {
  const { data }: AxiosResponse<any> = await TargetListAPI.recoverTarget(keyTarget);
  return data;
});

export const deleteTarget = createAsyncThunk("accordion/deleteTarget", async ({ target, unitId }: deleteArgType, { rejectWithValue, dispatch }) => {
  try {
    const { data } = await TargetListAPI.deleteTarget(target);
    dispatch(getTargetList(unitId));
    dispatch(getCompanyTargets());
    return data;
  } catch (error: any) {
    dispatch(openModal(error.response.data.errorDetails));
    return rejectWithValue(error.response.data);
  }
});

export const postCompanyTarget = createAsyncThunk("accordion/postCompanyTarget", async (postParams: postParamCompanyTargetType, thunkAPI) => {
  const response: AxiosResponse<postParamCompanyTargetType> = await TargetListAPI.postCompanyTarget(postParams);
  thunkAPI.dispatch(getTargetList(response.data.unitId));
  thunkAPI.dispatch(getCompanyTargets());
  thunkAPI.dispatch(getTargetList(postParams.unitId));
  return response.data;
});

export const postKeyTarget = createAsyncThunk("accordion/postKeyTarget", async (postParams: postParamKeyTargetType, thunkAPI) => {
  const response: AxiosResponse<any> = await TargetListAPI.postKeyResult(postParams);
  thunkAPI.dispatch(getObjectiveKeyResults([postParams.objectiveId!]));
  return response.data;
});

export const postToReviewTargets = createAsyncThunk("accordion/postToReviewTargets", async (targetsArray: Array<postReviewTargetType>) => {
  const { data }: AxiosResponse<any> = await TargetListAPI.postToReviewTargets(targetsArray);
  return data;
});

export const postActionsKeyTarget = createAsyncThunk("accordion/postActionsKeyTarget", async ({ target, objectiveId }: postArgKeyTargetType, { rejectWithValue, dispatch }) => {
  try {
    const { data }: AxiosResponse<any> = await TargetListAPI.postActionsTarget(target);
    dispatch(getObjectiveKeyResults([objectiveId]));
    return data;
  } catch (err: any) {
    dispatch(openModal(err.response.data.errorDetails));
    return rejectWithValue(err.response.data);
  }
});

export const postActionsTarget = createAsyncThunk("accordion/postActionsTarget", async ({ target, unitId }: deleteArgType, { rejectWithValue, dispatch }) => {
  try {
    const { data }: AxiosResponse<any> = await TargetListAPI.postActionsTarget(target);
    dispatch(getTargetList(unitId));
    dispatch(getCompanyTargets());
    return data;
  } catch (err: any) {
    dispatch(openModal(err.response.data.errorDetails));
    return rejectWithValue(err.response.data);
  }
});

export const postFactkeyResult = createAsyncThunk("accordion/keyResultFacts", async (objectKeyResult: ObjectKeyResultType) => {
  const { data }: AxiosResponse<any> = await TargetListAPI.postFactkeyResult(objectKeyResult);
  return data;
});
