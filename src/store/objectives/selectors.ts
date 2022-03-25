import { createSelector } from "reselect";
import { get } from "lodash";
import { getDomain } from "../index";
// import { ObjectiveType } from "../../interfaces";

const getObjectives = createSelector(getDomain("objective"), (data: any) => data.objectives || []);

export const LoadingAllFulfilled = createSelector(
  (store: any) => get(store, ["companyObjective", "isLoading"], true),
  (store: any) => get(store, ["objective", "isLoading"], true),
  (store: any) => get(store, ["keyResults", "isLoading"], true),
  (companyObjectiveIsLoad, objectiveIsLoad, keyResultIsLoad) => !companyObjectiveIsLoad && !objectiveIsLoad! && !keyResultIsLoad
);

export default getObjectives;
