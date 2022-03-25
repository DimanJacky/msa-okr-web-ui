import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { get } from "lodash";
import unitsReducer from "../components/ListOfDivisionsPage/reducer";
import accordionTargetReducer from "../components/Accordion/reducer";
import userReducers from "../store/User/reducer";
import objectivesReducer from "../store/objectivesIds/reducer";
import unConnectedObjectives from "../store/objectivesIds/unConnectedObjectives/reducer";
import periodsReducer from "../components/Accordion/PeriodSelection/reducer";
import { companyObjectiveReducer } from "./company-objective/slice";
import { objectiveReducer } from "./objectives/slice";
import { keyResultsReducer } from "./key-results/slice";
import filterReducer from "./filters/filters";
import newRed from "./newRed/slice";
import keyTargetFactReucer from "../components/Drawers/ViewingDrawer/reducer";
import fixPeriodsReducer from "../components/Drawers/CreateFactKeyResult/reducer";
import errorNotificationReducer from "../modules/ErrorModal/reducer";
import commentsReducer from "./commentsReducer";
import keyResultFacts from "./key-results/facts/slice";

const rootReducer = combineReducers({
  units: unitsReducer,
  targets: accordionTargetReducer,
  objectivesIds: objectivesReducer,
  unConnectedObjectives,
  user: userReducers,
  periods: periodsReducer,
  companyObjective: companyObjectiveReducer,
  objective: objectiveReducer,
  keyResults: keyResultsReducer,
  filters: filterReducer,
  filtered: newRed,
  viewTargets: keyTargetFactReucer,
  fixPeriods: fixPeriodsReducer,
  errorNotification: errorNotificationReducer,
  commentsReducer,
  keyResultFacts
});
export const getDomain = (storeKey: string) => (store: AppRootStateType) => get(store, storeKey);

export const store = configureStore({
  reducer: rootReducer
});

export type AppRootStateType = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector;
