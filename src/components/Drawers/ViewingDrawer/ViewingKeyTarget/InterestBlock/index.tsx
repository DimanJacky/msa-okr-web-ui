import React from "react";
import styles from "../../../index.module.css";

type PropsType = {
  name: string;
  value: string | undefined | null;
  color: string;
};

const InterestBlock = ({ value, name, color }: PropsType) => (
  <div className={styles.interest_block}>
    <div className={styles.interest_block_heading}>{name}</div>
    <div className={styles.interest_block_value} style={{ color }}>{`${value || 0}%`}</div>
  </div>
);

export default InterestBlock;
