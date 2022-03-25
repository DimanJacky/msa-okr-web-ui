import { isEmpty } from "lodash";
import { store } from "../store";
import getKeyResults from "../store/key-results/selectors";
import { FiltersType, KeyResultListType, KeyResultType } from "../interfaces";
import { getObjectiveKeyResults } from "../components/Accordion/actions";

class KeyResults {
  constructor(unconIds: any) {
    store.dispatch(getObjectiveKeyResults(unconIds));
  }

  private compareKeyResultWithFilter(keyResult: KeyResultType, filters: FiltersType): boolean {
    return filters!.some((key: any) => keyResult.status === key);
  }

  private filterData(data: KeyResultListType, filters?: FiltersType): KeyResultListType {
    if (!filters?.length) {
      return data;
    }

    return Object.keys(data).reduce((res: KeyResultListType, key: string) => {
      const keyResults = data[key];
      const filteredKeyResults = keyResults.filter((keyResult) => this.compareKeyResultWithFilter(keyResult, filters));
      if (!isEmpty(filteredKeyResults)) {
        res[key] = filteredKeyResults;
      }
      return res;
    }, {});
  }

  getAll(filter?: FiltersType): KeyResultListType {
    const data = getKeyResults(store.getState());
    return this.filterData(data, filter);
  }
}

export default KeyResults;
