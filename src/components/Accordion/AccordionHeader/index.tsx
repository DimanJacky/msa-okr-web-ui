import React, { ReactElement } from "react";
import { JsxChild } from "typescript";
import styles from "../index.module.css";
import { somes } from "../index";
import { objectiveSubTaskType } from "../actions";

type ItemStatusType = {
  it: objectiveSubTaskType;
  item: any;
  status?: any;
};

interface Props {
  children: JsxChild | string | string[] | ReactElement;
  checkStatus: any;
  it: somes | ItemStatusType | objectiveSubTaskType;
  type: string;
  thirdLeveLClass?: boolean;
}

const AccordionHeader: React.FC<Props> = ({
  children, checkStatus, it, type, thirdLeveLClass = false
}) => (
  <div
    role="button"
    tabIndex={0}
    onKeyDown={() => null}
    onClick={(e) => {
      e.stopPropagation();
      const isHeader = true;
      checkStatus(it, type, isHeader);
    }}
    className={thirdLeveLClass ? styles.thirdLevel : styles.accordion_header_block}
  >
    {children}
  </div>
);

AccordionHeader.defaultProps = {
  thirdLeveLClass: false
};
export default AccordionHeader;
