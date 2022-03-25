import React from "react";
import { Button, Checkbox } from "antd";
import styles from "./style.module.css";
import "../style.css";
import { useAppDispatch, useAppSelector } from "../../../store";
import { SET_FILTER, StatusEnums, DROP_FILTERS } from "../../../store/filters/filters";

interface Props {
  showFilters: boolean | undefined;
}

const FilterUnit: React.FC<Props> = ({ showFilters }) => {
  const filtersCkecked = useAppSelector((state) => state.filters);
  const filters = [
    {
      type: StatusEnums.DRAFT,
      name: "Черновики",
      status: filtersCkecked.includes(StatusEnums.DRAFT),
      checkColor: "#625EFF"
    },
    {
      type: StatusEnums.REVIEW,
      name: "Ревью",
      status: filtersCkecked.includes(StatusEnums.REVIEW),
      checkColor: "#F5B53F"
    },
    {
      type: StatusEnums.REJECTED,
      name: "Отклонённые",
      status: filtersCkecked.includes(StatusEnums.REJECTED),
      checkColor: "#D63964"
    },
    {
      type: StatusEnums.ACTIVE,
      name: "Активные",
      status: filtersCkecked.includes(StatusEnums.ACTIVE),
      checkColor: "#4CAF50"
    },
    {
      type: StatusEnums.OUTDATE,
      name: "На удалении",
      status: filtersCkecked.includes(StatusEnums.OUTDATE),
      checkColor: "#607D8B"
    },
    {
      type: StatusEnums.DELETED,
      name: "Удалённые",
      status: filtersCkecked.includes(StatusEnums.DELETED),
      checkColor: "#979797"
    }
  ];

  const getColor = (type: string) => {
    let checkBoxClassName = "";
    switch (type) {
      case StatusEnums.DRAFT:
        checkBoxClassName = "checkBox-draft";
        break;
      case StatusEnums.REVIEW:
        checkBoxClassName = "checkBox-review";
        break;
      case StatusEnums.REJECTED:
        checkBoxClassName = "checkBox-reject";
        break;
      case StatusEnums.ACTIVE:
        checkBoxClassName = "checkBox-active";
        break;
      case StatusEnums.OUTDATE:
        checkBoxClassName = "checkBox-outdate";
        break;
      case StatusEnums.DELETED:
        checkBoxClassName = "checkBox-deleted";
        break;
      default:
        break;
    }
    return checkBoxClassName;
  };

  const dispatch = useAppDispatch();

  if (showFilters) {
    return (
      <div className={styles.unit_filter}>
        <div className={styles.unit_checkBox_list}>
          {filters.map((s) => (
            <Checkbox
              onChange={() => dispatch(SET_FILTER(s.type))}
              key={s.checkColor + s.type}
              className={getColor(s.type)}
              checked={!filtersCkecked.includes(StatusEnums.CAN_STYLE) && filtersCkecked.includes(s.type)}
              defaultChecked={s.status}
            >
              {s.name}
            </Checkbox>
          ))}
        </div>
        <div className={styles.unit_end_part}>
          <div className={styles.unit_partition} />
          <Button style={{ color: "#42436C" }} type="link" onClick={() => dispatch(DROP_FILTERS())}>
            Очистить все фильтры
          </Button>
        </div>
      </div>
    );
  }
  return null;
};

export default FilterUnit;
