import React, { FC } from "react";
import { Radio } from "antd";
import IconDocument from "./iconsSvg/IconDocument";
import IconUnion from "./iconsSvg/IconUnion";
import "./style.css";

type PropsType = {
  nameBtnOne: string;
  nameBtnTwo: string;
};

const ToggleTargetsReport: FC<PropsType> = ({ nameBtnOne, nameBtnTwo }) => (
  <div className="wrapperTargetsReport">
    <Radio.Group defaultValue={nameBtnOne} buttonStyle="solid">
      <Radio.Button className="btnOne" value={nameBtnOne}>
        <IconDocument />
        {nameBtnOne}
      </Radio.Button>
      <Radio.Button className="btnTwo" value={nameBtnTwo}>
        <IconUnion />
        {nameBtnTwo}
      </Radio.Button>
    </Radio.Group>
  </div>
);

export default ToggleTargetsReport;
