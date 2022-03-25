import { createSelector } from "reselect";
import { getDomain } from "../index";
// import { CompanyObjectiveType } from "../../interfaces";

const getCompanyObjectives = createSelector(getDomain("companyObjective"), (data: any) => data.companys || []);

export default getCompanyObjectives;
