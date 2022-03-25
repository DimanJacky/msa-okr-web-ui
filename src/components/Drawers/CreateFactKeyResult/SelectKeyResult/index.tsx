import React, { FC } from "react";
import { Select } from "antd";
import "./style.css";
import { STATUS_FIXATION_PERIODS } from "../constants";

export interface fixPeriodsType {
  id: number;
  name: string;
  objectivePeriodId: number;
  startDate: string;
  endDate: string;
  status: string;
}

type PropTypes = {
  fixationPeriods: Array<fixPeriodsType>;
  placeholder: string;
  setPeriodId: any;
  periodId: number | undefined;
  disabled: boolean;
};

const SelectKeyResult: FC<PropTypes> = ({
  fixationPeriods, periodId, placeholder, setPeriodId, disabled
}) => (
  <Select onSelect={setPeriodId} value={periodId || undefined} placeholder={placeholder} disabled={disabled}>
    {fixationPeriods
      .filter((fixPeriod) => fixPeriod?.status === STATUS_FIXATION_PERIODS.ACTIVE)
      .map((period) => (
        <Select.Option key={period.id} value={period.id}>
          {period.name}
        </Select.Option>
      ))}
  </Select>
);

export default SelectKeyResult;
