import React from "react";
import styles from "../index.module.css";

type PropsType = {
  title: string;
};

const TitleDrawer = ({ title }: PropsType) => <div className={styles.title_drawer}>{title}</div>;

export default TitleDrawer;
