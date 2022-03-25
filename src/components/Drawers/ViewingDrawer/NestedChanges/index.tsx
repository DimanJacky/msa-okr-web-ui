import React, { Dispatch, SetStateAction } from "react";
import { Drawer } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { checkSTatusReviewType } from "../../../Accordion/types";
import { objectiveSubTaskType } from "../../../Accordion/actions";
import styles from "../../index.module.css";
import nextDrower from "../../../../images/nextDrawer.svg";
import historyIcons from "../../../../images/history_icons.svg";
import { useAppSelector } from "../../../../store";
import { helpTypeHistory } from "../reducer";

type PropsType = {
  visibleNested: boolean;
  setVisibleNested: Dispatch<SetStateAction<boolean>>;
  currentTargetReview: checkSTatusReviewType | objectiveSubTaskType | null;
  setVisibleViewing: Dispatch<SetStateAction<boolean>>;
};

const NestedChanges = ({
  visibleNested, setVisibleNested, currentTargetReview, setVisibleViewing
}: PropsType) => {
  const { historyChanges } = useAppSelector((state) => state.viewTargets);
  const getTime = (str: string) => str.split("T")[1];
  const getData = (str: string) => str.split("T")[0];
  const onClose = () => {
    setVisibleNested(false);
  };
  const onCloseAll = () => {
    setVisibleViewing(false);
    setVisibleNested(false);
  };
  const renderTitle = () => {
    if (currentTargetReview) {
      return (
        <div className={styles.title}>
          <div className={styles.title_text}>{currentTargetReview.name}</div>
          <div className={styles.title_button}>{visibleNested ? <img src={historyIcons} alt="historyIcons" /> : <img src={nextDrower} alt="nextDrawer" />}</div>
          <CloseOutlined className={styles.close_button} onClick={onClose} />
        </div>
      );
    }
    return null;
  };
  const renderHistory = () => {
    if (historyChanges.length) {
      return (
        <>
          {historyChanges.map((e: helpTypeHistory) => (
            <div className={styles.history_element} key={e.eventDate + e.entityId}>
              <div className={styles.history_author}>{e.username}</div>
              <div className={styles.history_changes}>
                <div className={styles.history_action}>{e.eventName}</div>
                <div className={styles.history_time_data}>
                  <div className={styles.history_data}>{getData(e.eventDate)}</div>
                  <div>{getTime(e.eventDate)}</div>
                </div>
              </div>
            </div>
          ))}
        </>
      );
    }
    return null;
  };

  return (
    <Drawer
      title={renderTitle()}
      width={509}
      onClose={onCloseAll}
      closable={false}
      destroyOnClose
      visible={visibleNested}
      bodyStyle={{
        paddingBottom: 0,
        paddingTop: 24
      }}
    >
      {renderHistory()}
    </Drawer>
  );
};

export default NestedChanges;
