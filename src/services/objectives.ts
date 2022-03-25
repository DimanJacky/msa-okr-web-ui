import getObjectives from "../store/objectives/selectors";
import { FiltersType, ObjectiveType } from "../interfaces";
import { store } from "../store";
import { getTargetList } from "../components/Accordion/actions";

class Objectives {
  constructor(unitId: number) {
    store.dispatch(getTargetList(unitId));
  }

  private compareObjectiveWithFilter(objective: ObjectiveType, hasKeyResultIds: string[], filters: FiltersType): boolean {
    if (hasKeyResultIds.includes(`${objective.id}`)) return true;
    return filters.some((key: any) => objective.status === key);
    // return !Object.keys(filters).some(filterKey => {
    //   const filterValue = filters[filterKey];
    //
    //   return objective[filterKey] !== filterValue;
    // })
  }

  private filterData(objectives: ObjectiveType[], hasKeyResultIds: string[], filters?: FiltersType) {
    if (!filters?.length) {
      return objectives;
    }

    return objectives.filter((objective) => this.compareObjectiveWithFilter(objective, hasKeyResultIds, filters));
  }

  getAll(hasKeyResultIds: string[], filter?: FiltersType): ObjectiveType[] {
    const data = getObjectives(store.getState());
    return this.filterData(data, hasKeyResultIds, filter);
  }
}

export default Objectives;
