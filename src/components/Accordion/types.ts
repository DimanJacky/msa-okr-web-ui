import { companyObjectivesType, objectiveSubTaskType } from "./actions";
import { StatusEnums } from "../../store/filters/filters";

export type FetchingTargetType = {
  id: number;
  name: string;
  status: string;
  parentId: number | null;
  objectiveTypeId: number;
  unitId: number;
  objectivePeriodId: number;
};

export type actionsTargetType = {
  entityType: string;
  entityId: number;
  action: string;
};

export type FetchingKeyTargetType = {
  id: number;
  objectiveId: number;
  name: string;
  responsiblePersonId: number;
  status: string;
  plan: string | null;
  challenge: string | null;
  keyResultTypeId: number;
  description: string | null | undefined;
};

export type CompanyTargetType = {
  id: number;
  name: string;
  objectivePeriodId?: number | null;
  objectiveTypeId: number;
  parentId: number | null;
  status: StatusEnums;
  subTasks?: companyObjectivesType[];
  objectiveSubTask?: objectiveSubTaskType[];
  keyResultsCompany?: any;
};

export type postAddingTargetObj = {
  name: string | undefined;
  status: string;
  parentId: number | null;
  objectiveTypeId: number;
  unitId: number;
  objectivePeriodId: number;
  period: string;
  id?: number;
};

export type checkSTatusReviewType = {
  status: StatusEnums;
  parentId: number;
  it: objectiveSubTaskType;
  item: any;
  name: string;
  id: number;
  objectiveTypeId: number;
  unitId: number;
  objectivePeriodId: number;
  objectiveId: number;
  plan: string | null;
  challenge: string | null;
  description: string | null;
};

export type ObjectKeyResultType = {
  description: string;
  keyResultId: number;
  valuePercent: number;
};
