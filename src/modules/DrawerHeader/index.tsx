import React, { FC } from "react";
import classNames from "classnames";

import drawerHeaderClassnames from "./const";
import { DrawerHeaderProps } from "./type";
import styles from "./index.module.css";
import TextStatus from "../TextStatus";
import getClassNameStatus from "../../utils/classname";

const DrawerHeader: FC<DrawerHeaderProps> = ({
  children, title, status = "", additionalName
}) => {
  const drawerHeaderThemeClassName = getClassNameStatus(status, drawerHeaderClassnames);

  return (
    <div className={classNames(styles.drawerHeader, drawerHeaderThemeClassName)}>
      <div className={styles.textStatusWrapper}>
        <TextStatus status={status} />
      </div>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.iconsWrapper}>{children}</div>
      <h3>{additionalName}</h3>
    </div>
  );
};

export default DrawerHeader;
