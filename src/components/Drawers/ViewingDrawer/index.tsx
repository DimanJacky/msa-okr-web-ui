import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Button, Drawer, Form, Space, Tooltip
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import styles from "../index.module.css";
import ViewingKeyTarget from "./ViewingKeyTarget";
import ViewingTarget from "./ViewingTarget";
import { postAddingTargetObj, checkSTatusReviewType } from "../../Accordion/types";
import { companyObjectivesType, objectiveSubTaskType } from "../../Accordion/actions";
import { getHistoryChanges } from "./actions";
import nextDrower from "../../../images/nextDrawer.svg";
import NestedChanges from "./NestedChanges";
import { useAppDispatch } from "../../../store";
import DrawerHeader from "../../../modules/DrawerHeader";
import { IObjectives } from "../../Accordion/reducer";

type PropsType = {
  visibleViewing: boolean;
  setVisibleViewing: Dispatch<SetStateAction<boolean>>;
  currentTargetReview: checkSTatusReviewType | objectiveSubTaskType | null;
  currentParentTarget: postAddingTargetObj | null | companyObjectivesType | undefined;
  currentTargetType: null | string;
  companyTargets: IObjectives[];
};
const ViewingDrawer = ({
  visibleViewing, setVisibleViewing, currentTargetReview, currentParentTarget, currentTargetType, companyTargets
}: PropsType) => {
  const [visibleNested, setVisibleNested] = useState(false);
  const [toggleFiltering, setToggleFiltering] = useState(true);
  const isParentTarget = companyTargets.some((item) => item.id === currentTargetReview?.id);
  const changeFiltering = () => setToggleFiltering(!toggleFiltering);

  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const openNested = () => {
    if (currentTargetType === "target" || currentTargetType === "unconnected-target") {
      const target = {
        entityType: "OBJECTIVE",
        entityId: currentTargetReview?.id
      };
      dispatch(getHistoryChanges(target));
    } else {
      const target = {
        entityType: "KEYRESULT",
        entityId: currentTargetReview?.id
      };
      dispatch(getHistoryChanges(target));
    }
    setVisibleNested(true);
  };
  const onClose = () => {
    setVisibleViewing(false);
    setToggleFiltering(true);
  };
  const renderBlockViewing = () => {
    const UNC_KEY_TARGET = "unconnected-key-target";
    const KEY_TAGERT = "key-target";
    if (currentTargetType === UNC_KEY_TARGET || currentTargetType === KEY_TAGERT) {
      return <ViewingKeyTarget currentTargetReview={currentTargetReview} />;
    }
    return (
      <ViewingTarget
        changeFiltering={changeFiltering}
        currentParentTarget={currentParentTarget}
        currentTargetReview={currentTargetReview}
        currentTargetType={currentTargetType}
        isParentTarget={isParentTarget}
      />
    );
  };
  const renderTitle = () => {
    if (currentTargetReview) {
      return (
        <DrawerHeader status={currentTargetReview.status} title={currentTargetReview?.name}>
          <div role="button" tabIndex={0} onKeyPress={undefined} className={styles.title_button} onClick={openNested}>
            <Tooltip placement="right" title="История изменений">
              <img src={nextDrower} alt="nextDrawer" />
            </Tooltip>
          </div>
          <CloseOutlined className={styles.close_button} onClick={onClose} />
        </DrawerHeader>
      );
    }
    return null;
  };

  const renderFooter = () => (
    <Space>
      <Button onClick={onClose} size="large" className={styles.btn_agreed}>
        Закрыть
      </Button>
    </Space>
  );

  return (
    <>
      <Drawer
        title={renderTitle()}
        width={509}
        onClose={onClose}
        destroyOnClose
        closable={false}
        visible={visibleViewing}
        footer={renderFooter()}
        bodyStyle={{
          paddingBottom: 0,
          paddingTop: 24
        }}
        headerStyle={{ padding: 0 }}
      >
        <Form form={form} layout="vertical" hideRequiredMark>
          <Space className={styles.space} size={24} direction="vertical">
            {renderBlockViewing()}
          </Space>
        </Form>
      </Drawer>
      <NestedChanges visibleNested={visibleNested} setVisibleNested={setVisibleNested} currentTargetReview={currentTargetReview} setVisibleViewing={setVisibleViewing} />
    </>
  );
};

export default ViewingDrawer;
