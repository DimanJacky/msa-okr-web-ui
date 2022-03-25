/**
 * если значения частично или полностью enum, то лучше их абстрагировать и писать так
 */
export type StatusesType = "draft" | "active" | string;

/**
 * типы должны быть с большой буквы
 */
export type CompanyObjectiveType = {
  id: number;
  name: string;
  objectivePeriodId: number;
  objectiveTypeId: number;
  parentId?: number;
  status: StatusesType;
  unitId: number;
  [key: string]: any;
};

export type ObjectiveType = {
  id: number;
  name: string;
  objectivePeriodId: number;
  objectiveTypeId: number;
  parentId?: number | null;
  status: StatusesType;
  unitId: number;
  [key: string]: any;
};

export type KeyResultType = {
  id: number;
  objectiveId: number;
  name: string;
  responsiblePersonId?: number | null;
  status: StatusesType;
  plan: number;
  challenge: number;
  keyResultTypeId: number;
  [key: string]: any;
};

export type KeyResultListType = Record<string, KeyResultType[]>;

export type CompanyObjectivePageDataType = (CompanyObjectiveType & {
  subTasks: (ObjectiveType & {
    objectiveSubTask: KeyResultType[];
  })[];
})[];

export type FiltersType = {
  status?: StatusesType[];
  [key: string]: any;
};
