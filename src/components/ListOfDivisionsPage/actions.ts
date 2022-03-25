import { createAsyncThunk } from "@reduxjs/toolkit";
import { UnitsAPI } from "../../API";
import { InitialStateType } from "./reducer";

const getUnits = createAsyncThunk(
  "units/getUnits",
  async (id: number | null) => {
    const response = await UnitsAPI.getUnits(id);
    return response.data as InitialStateType;
  }
);

export default { getUnits };
