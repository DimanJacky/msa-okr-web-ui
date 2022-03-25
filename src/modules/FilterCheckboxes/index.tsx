import React, { FC } from "react";
import { FilterCheckboxesProps } from "./types";
import getClassNameStatus from "../../utils/classname";
import filterCheckboxesClassName from "./const";
import styles from "./index.module.css";
import FilterCheckbox from "../FilterCheckbox";
import { useAppDispatch } from "../../store";
import { setFilters } from "../../store/key-results/facts/slice";

const FilterCheckboxes: FC<FilterCheckboxesProps> = ({ list }) => {
  const dispatch = useAppDispatch();

  return (
    <ul className={styles.checkboxes}>
      {list.map((item) => {
        const checkboxTheme = getClassNameStatus(item.type, filterCheckboxesClassName);
        const onChange = () => dispatch(setFilters(item.type));

        return (
          <li key={item.type} className={styles.checkboxWrapper}>
            <FilterCheckbox name={item.name} checked={item.checked} theme={checkboxTheme} onChange={onChange} />
          </li>
        );
      })}
    </ul>
  );
};

export default FilterCheckboxes;
