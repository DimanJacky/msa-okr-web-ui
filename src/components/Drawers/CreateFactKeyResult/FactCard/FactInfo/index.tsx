import React from "react";
import classNames from "classnames";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { StatusEnums } from "../../../../../store/filters/filters";
import styles from "../../styles.module.css";
import "../../style.css";
import ellipses from "../../../../../images/ellipses.svg";
import pipette from "../../../../../images/pipette.svg";
import { helpTypeFacts } from "../../../ViewingDrawer/reducer";

type propsType = {
  fact: helpTypeFacts;
  handleEditFact: (fact: helpTypeFacts) => void;
};

const FactInfo = ({ fact, handleEditFact }: propsType) => {
  const [showDescription, setShowDescription] = React.useState(false);
  return (
    <div>
      <div className={styles.fact_info}>
        <div className={styles.fact_info_detailed}>
          <div
            className={classNames([styles.fact_logo], {
              fact_logo_active: fact.status === StatusEnums.ACTIVE,
              fact_logo_reject: fact.status === StatusEnums.REJECTED,
              fact_logo_review: fact.status === StatusEnums.REVIEW,
              fact_logo_draft: fact.status === StatusEnums.DRAFT,
              fact_logo_deleted: fact.status === StatusEnums.DELETED,
              fact_logo_outdate: fact.status === StatusEnums.OUTDATE
            })}
          />
          <div className={styles.fact_value}>{`Факт: ${fact.valuePercent}%`}</div>
          <div className={styles.author_name}>{fact.username}</div>
        </div>
        <div className={styles.fact_info_additional}>
          <div className={styles.fact_info_period}>{`${fact.fixationPeriodId} квартал`}</div>
          <div role="button" tabIndex={0} onKeyDown={() => null} className={styles.fact_info_icon} onClick={() => handleEditFact(fact)}>
            <img src={fact.status === StatusEnums.ACTIVE ? ellipses : pipette} alt="loading.." />
          </div>
        </div>
      </div>
      <div
        className={classNames([styles.fact_info_description], {
          hide_fact_description: !showDescription
        })}
      >
        {fact.description}
      </div>
      <div className={styles.fact_info_data}>
        <div>{showDescription ? <UpOutlined onClick={() => setShowDescription(!showDescription)} /> : <DownOutlined onClick={() => setShowDescription(!showDescription)} />}</div>
        <div>{fact.resultDate}</div>
      </div>
    </div>
  );
};

export default FactInfo;
