import React, { useEffect } from "react";
import { Form, Select } from "antd";
import { useParams } from "react-router";
import styles from "./style.module.css";

import { getPeriodsList } from "./action";
import "./style.css";
import { getCompanyTargets, getObjectiveKeyResults, getTargetList } from "../actions";
import { useAppDispatch, useAppSelector } from "../../../store";
import { IObjectives } from "../reducer";

const PeriodSelection = () => {
  const periods = useAppSelector((state) => state.periods);
  const [form] = Form.useForm();
  const { id } = useParams<{ id: string }>();
  const unitId = Number(id);
  const dispatch = useAppDispatch();
  const objectives: IObjectives[] = useAppSelector((state) => state.objectivesIds);
  const objectivesids: number[] = objectives.map((i: IObjectives) => i.id);
  const savedPeriodId = localStorage.getItem("periodId");
  const savedValuePeriod = localStorage.getItem("globalPeriod");
  useEffect(() => {
    dispatch(getPeriodsList());
    if (savedPeriodId) {
      dispatch(getCompanyTargets(savedPeriodId));
      dispatch(getTargetList(unitId));
    } else {
      dispatch(getCompanyTargets(periods[0]?.id));
    }
  }, []);
  return (
    <div className={styles.select_wrapper}>
      {periods.length > 0 && (
        <Form
          className="select_periods"
          form={form}
          layout="vertical"
          hideRequiredMark
          initialValues={{
            period: savedValuePeriod ? savedValuePeriod?.split(".")[2] : periods[0]?.endDate.split(".")[2]
          }}
        >
          <Form.Item name="period">
            <Select
              onSelect={(value, option) => {
                if (option.key) {
                  localStorage.setItem("periodId", String(option.key));
                  localStorage.setItem("globalPeriod", option.value);
                  dispatch(getCompanyTargets(option.key));
                  setTimeout(() => {
                    dispatch(getTargetList(unitId));
                    dispatch(getObjectiveKeyResults(objectivesids));
                  }, 700);
                }
              }}
            >
              {periods.map((p: any) => (
                <Select.Option key={p.id} value={p.endDate}>
                  {p.endDate.split(".")[2]}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};
export default React.memo(PeriodSelection);
