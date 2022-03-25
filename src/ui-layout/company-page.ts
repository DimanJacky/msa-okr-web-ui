import { store } from "../store";

import CompanyObjectives from "../services/company-objectives";
import {
  CompanyObjectiveType, FiltersType, KeyResultListType, ObjectiveType
} from "../interfaces";
import Objectives from "../services/objectives";
import KeyResults from "../services/key-results";
import { SET_ALL, SET_ALL_OBJ } from "../store/newRed/slice";
import getFilters from "../store/filters/selector";

type PoolData = {
  companyObjectives: CompanyObjectiveType[];
  objectives: ObjectiveType[];
  keyResults: KeyResultListType;
};

class CompanyPage {
  companyObjectivesService: CompanyObjectives;

  objectivesService: Objectives;

  keyResultsService: KeyResults;

  filters: FiltersType;

  constructor(unitId: number, unconIds: any) {
    this.companyObjectivesService = new CompanyObjectives();
    this.objectivesService = new Objectives(unitId);
    this.keyResultsService = new KeyResults(unconIds);
    this.filters = getFilters(store.getState());
  }

  getFilteredData(): PoolData {
    const keyResults = this.keyResultsService.getAll(this.filters);
    const objectives = this.objectivesService.getAll(Object.keys(keyResults), this.filters);
    const companyObjectives = this.companyObjectivesService.getAll(
      objectives.map((objective: any) => `${objective.parentId}`),
      this.filters
    );
    return {
      companyObjectives,
      objectives,
      keyResults
    };
  }

  getKeyResultsForTarget(keyResults: any, target: any, propertyName: string) {
    Object.keys(keyResults).forEach((key) => {
      keyResults[key].forEach((keyResult: any) => {
        if (target.id === keyResult.objectiveId) {
          target = {
            ...target,
            [propertyName]: [...(target[propertyName] || []), { ...keyResult }].sort(this.sortNumericAscending).sort(this.sortIdAscending)
          };
        }
      });
    });
    return target;
  }

  formattedData(filteredData: PoolData) {
    const { companyObjectives, objectives, keyResults } = filteredData;
    // тут подготавливаю данные в удобный формат
    const companys = [...companyObjectives];
    const payNoNull = objectives.filter((pay) => pay.parentId !== null);
    const sorted = payNoNull.sort((it, sec) => {
      if (it.parentId !== null && sec.parentId !== null) {
        return it.parentId! - sec.parentId!;
      }
      return it.parentId !== null && sec.parentId !== null ? sec.parentId! - it.parentId! : -1;
    });
    const connectedSortedObjectives = companys.sort(this.sortNumericAscending);
    for (let i = 0; i < connectedSortedObjectives.length; i += 1) {
      for (let k = 0; k < sorted.length; k += 1) {
        if (connectedSortedObjectives[i].id === sorted[k].parentId) {
          connectedSortedObjectives[i] = {
            ...connectedSortedObjectives[i],
            subTasks: sorted
              .filter((it) => it.parentId === connectedSortedObjectives[i].id)
              .sort(this.sortNumericAscending)
              .sort(this.sortIdAscending)
          };
        }
      }
      connectedSortedObjectives[i] = this.getKeyResultsForTarget(keyResults, connectedSortedObjectives[i], "keyResultsCompany");
    }
    connectedSortedObjectives.forEach((objective, i: number) => {
      if (objective.subTasks) {
        objective.subTasks.forEach((subTask: ObjectiveType, j: number) => {
          connectedSortedObjectives[i].subTasks[j] = this.getKeyResultsForTarget(keyResults, connectedSortedObjectives[i].subTasks[j], "objectiveSubTask");
        });
      }
    });

    const unconnectedObjectives = objectives.filter((element) => element.parentId === null);
    // eslint-disable-next-line no-restricted-syntax,guard-for-in
    for (const key in keyResults) {
      const findedTaskIndex = unconnectedObjectives.findIndex((it) => it.id === Number(key));
      if (findedTaskIndex >= 0) {
        unconnectedObjectives[findedTaskIndex] = {
          ...unconnectedObjectives[findedTaskIndex],
          subTasks: keyResults[key]
        };
      }
    }
    return {
      connectedSortedObjectives,
      unconnectedObjectives
    };
  }

  getPage() {
    const filteredData = this.getFilteredData();
    // диспатчу в стор (в новый слайс)
    // потом забирать эти данные из стора selector
    const formattedAllObjectives = this.formattedData(filteredData);

    store.dispatch(SET_ALL_OBJ(formattedAllObjectives.connectedSortedObjectives));
    store.dispatch(SET_ALL(formattedAllObjectives.unconnectedObjectives));
  }

  private sortNumericAscending(a: ObjectiveType, b: ObjectiveType) {
    return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" });
  }

  private sortIdAscending(a: ObjectiveType, b: ObjectiveType) {
    const hasNumeric = /\d/g;
    if (!hasNumeric.test(a.name)) return Number(a.id > b.id);

    return 0;
  }
}

export default CompanyPage;
