import { StatusEnums } from "../../store/filters/filters";

type CheckboxesListProps = {
  type: StatusEnums;
  name: string;
  checked: boolean;
};

type FilterCheckboxesProps = {
  list: CheckboxesListProps[];
};

export type { CheckboxesListProps, FilterCheckboxesProps };
