import React, { useEffect } from "react";
import { Select } from "antd";
import { IObjectives } from "../../../Accordion/reducer";
import "./style.css";

type companyTargetsTitlesType = {
  companyTargets: IObjectives[];
  titleTarget?: string;
  setCurrentTargetId: any;
};

const SelectTarget = ({ companyTargets, titleTarget, setCurrentTargetId }: companyTargetsTitlesType) => {
  useEffect(() => {
    const extra = companyTargets.find((e) => e.name === titleTarget);
    setCurrentTargetId(extra?.id);
  }, []);
  return (
    <Select
      defaultValue={titleTarget}
      placeholder="Цели компании"
      onChange={(e) => {
        setCurrentTargetId(e);
      }}
    >
      {companyTargets.map((item) => (
        <Select.Option key={item.id} value={item.id}>
          {item.name}
        </Select.Option>
      ))}
      <Select.Option value="несвязанные цели">Несвязанные цели</Select.Option>
    </Select>
  );
};

SelectTarget.defaultProps = {
  titleTarget: "Несвязанные цели"
};

export default SelectTarget;
