import React, { FC } from "react";
import classNames from "classnames";
import { Checkbox } from "antd";

import styles from "./index.module.css";
import { FilterCheckboxProps } from "./types";

const FilterCheckbox: FC<FilterCheckboxProps> = ({
  checked = false, name, theme = "", onChange
}) => (
  <Checkbox className={classNames("checkboxDrawerFilter", styles.checkbox, theme)} checked={checked} onChange={onChange}>
    {name}
  </Checkbox>
);

export default FilterCheckbox;
