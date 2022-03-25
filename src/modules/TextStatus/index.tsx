import React, { FC } from "react";
import classNames from "classnames";

import figureClassnames from "./const";
import { TextStatusProps } from "./type";
import styles from "./index.module.css";
import getClassNameStatus from "../../utils/classname";
import { STATUSES_FACT_TITLE } from "../../components/Drawers/CreateFactKeyResult/constants";

const TextStatus: FC<TextStatusProps> = ({ status }) => {
  const figureThemeClassName = getClassNameStatus(status, figureClassnames);

  return (
    <div className={styles.statusWrapper}>
      <div className={classNames(styles.figure, figureThemeClassName)} />
      <p className={styles.statusText}>{status && STATUSES_FACT_TITLE[status]}</p>
    </div>
  );
};

export default TextStatus;
