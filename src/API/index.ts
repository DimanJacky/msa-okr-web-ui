import axios from "axios";
import { getCompanyTargetsResponseType, objectiveSubTaskType, postParamKeyTargetType } from "../components/Accordion/actions";
import {
  actionsTargetType, FetchingKeyTargetType, FetchingTargetType, ObjectKeyResultType, postAddingTargetObj
} from "../components/Accordion/types";

import { PeriodsListType } from "../components/Accordion/PeriodSelection/action";
import { FixPeriodsArrayType } from "../components/Drawers/CreateFactKeyResult/actions";
import { KeyTargetFactType } from "../components/Drawers/ViewingDrawer/reducer";
import { targetHistoryType } from "../components/Drawers/ViewingDrawer/actions";
import { commentsType } from "../store/commentsReducer/index";

export const instance = axios.create({
  baseURL: "/api",
  headers: {
    "Access-Control-Allow-Origin": "*"
  },
  withCredentials: true
});

export type postReviewTargetType = {
  entityType: string;
  entityId: number | undefined;
  action: string;
};

export type PostReviewKeyTargetResult = {
  objectiveId: number;
  entityType: string;
  entityId: number | undefined;
  action: string;
};

export const UnitsAPI = {
  getUnits(id: number | null) {
    if (id) {
      return instance.get(`/units?unitTypeId=${id}`);
    }
    return instance.get("/units");
  }
};

type keyTargetFactsListType = Array<KeyTargetFactType>;

export const TargetListAPI = {
  getTargetList(id?: number) {
    const period = localStorage.getItem("periodId");
    if (id) {
      return instance.get<getCompanyTargetsResponseType>(`/objectives?unitId=${id}&objectivePeriodId=${period}`);
    }
    return instance.get<getCompanyTargetsResponseType>(`/objectives?unitId=${id}&objectivePeriodId=${period}`);
  },
  getObjectives(period?: string | number) {
    const periodWhat = localStorage.getItem("periodId");
    if (period) {
      return instance.get<getCompanyTargetsResponseType>(`/objectives?companyObjectivesOnly=true&objectivePeriodId=${period}`);
    }
    return instance.get<getCompanyTargetsResponseType>(`/objectives?companyObjectivesOnly=true&objectivePeriodId=${periodWhat}`);
  },
  getObjectivesKeyResults(objectiveId: number[] | undefined) {
    return instance.get<objectiveSubTaskType>(`/keyResults?objectiveIdList=${objectiveId}`);
  },
  postCompanyTarget(obj: postAddingTargetObj) {
    return instance.post<any>("/objectives", obj);
  },
  updateTarget(objectiveId: number, target: FetchingTargetType) {
    return instance.put(`/objectives/${objectiveId}`, target);
  },
  updateKeyTarget(objectiveId: number, keyResultId: number, keyTarget: FetchingKeyTargetType) {
    return instance.put(`/objectives/${objectiveId}/keyResults/${keyResultId}`, keyTarget);
  },
  postKeyResult(postParams: postParamKeyTargetType) {
    const id = postParams.objectiveId;
    return instance.post(`/objectives/${id}/keyResults`, postParams);
  },
  postToReviewTargets(targetsArray: Array<postReviewTargetType>) {
    return instance.post("/actions", targetsArray);
  },
  postFactkeyResult(objectKeyResult: ObjectKeyResultType) {
    return instance.post("/keyResultFacts", objectKeyResult);
  },
  getPeriods() {
    return instance.get<PeriodsListType>("/objectivePeriods");
  },
  getKetTargetFact(id: number) {
    return instance.get<keyTargetFactsListType>(`/keyResultFacts?KeyResultIdList=${id}`);
  },
  getComments(entityType: string, entityIdList: number, last: boolean) {
    return instance.get<commentsType>(`/comments?entityType=${entityType}&entityIdList=${entityIdList}&last=${last}`);
  },
  postActionsTarget(targetsArray: Array<postReviewTargetType>) {
    return instance.post("/actions", targetsArray);
  },
  getFixPeriods(objectivePeriodIdList: number) {
    return instance.get<FixPeriodsArrayType>(`/fixationPeriods?objectivePeriodIdList=${objectivePeriodIdList}`);
  },
  recoverTarget: (target: actionsTargetType[]) => instance.post("/actions", target),
  recoverKeyTarget: (keyTarget: actionsTargetType[]) => instance.post("/actions", keyTarget),
  getHistoryChanges: (target: targetHistoryType) => instance.get<any>(`/audits?entityType=${target.entityType}&entityId=${target.entityId}`),
  deleteTarget: (target: actionsTargetType[]) => instance.post("/actions", target),
  getAllFacts: (id: number) => instance.get(`/keyResultFacts?KeyResultIdList=${id}`),
  updateFact: (params: any) => instance.post("/actions", params),
  getLastFact: (id: number) => instance.get(`/keyResultFacts?keyResultIdList=${id}&last=true`),
  getFactsComments: (params: any) => instance.get(`/comments?entityType=${params.entityType}&entityIdList=${params.factsIds}&last=${params.last}`),
  getAllFactComments: (params: any) => instance.get(`/comments?entityType=${params.entityType}&entityIdList=${params.factsIds}&last=${params.last}`),
  updateKeyResultFacts: (params: any) => instance.put(`/keyResultFacts/${params.id}`, params)
};
