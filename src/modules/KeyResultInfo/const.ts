import { StatusEnums } from "../../store/filters/filters";

const getCheckboxesList = (type: boolean[]) => [
  {
    type: StatusEnums.DRAFT,
    name: "черновик",
    checked: type[0]
  },
  {
    type: StatusEnums.REVIEW,
    name: "ревью",
    checked: type[1]
  },
  {
    type: StatusEnums.REJECTED,
    name: "отклонено",
    checked: type[2]
  },
  {
    type: StatusEnums.ACTIVE,
    name: "активно",
    checked: type[3]
  }
];

export default getCheckboxesList;
