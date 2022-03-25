import { createSelector } from "@reduxjs/toolkit";
import { getDomain } from "../index";

const getFilters = createSelector(getDomain("filters"), (data): any => data || []);

export default getFilters;
