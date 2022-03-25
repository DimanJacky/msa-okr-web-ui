import { store } from "../store";
import { CompanyObjectiveType, FiltersType } from "../interfaces";
import { getCompanyTargets } from "../components/Accordion/actions";
import getCompanyObjectives from "../store/company-objective/selectors";

class CompanyObjectives {
  constructor() {
    store.dispatch(getCompanyTargets());
  }

  private compareCompanyObjectiveWithFilter(companyObjective: CompanyObjectiveType, hasObjectiveIds: string[], filters: FiltersType) {
    if (hasObjectiveIds.includes(`${companyObjective.id}`)) return true;
    return filters!.some((key: any) => companyObjective.status === key);
  }

  private filterData(companyObjectives: CompanyObjectiveType[], hasObjectiveIds: string[], filters?: FiltersType): CompanyObjectiveType[] {
    if (!filters?.length) return companyObjectives;
    return companyObjectives.filter((companyObjective) => this.compareCompanyObjectiveWithFilter(companyObjective, hasObjectiveIds, filters));
  }

  getAll(hasObjectiveIds: string[], filters?: FiltersType): CompanyObjectiveType[] {
    const data = getCompanyObjectives(store.getState());
    return this.filterData(data, hasObjectiveIds, filters);
  }
}

export default CompanyObjectives;
