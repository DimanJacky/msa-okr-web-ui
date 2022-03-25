import { createSelector } from "reselect";
import { getDomain } from "../index";
import { KeyResultListType } from "../../interfaces";

const getKeyResults = createSelector(getDomain("keyResults"), (data): KeyResultListType => data.keyResults || {});

export default getKeyResults;
