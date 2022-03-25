import React, { useState } from "react";
import { Form, Col, Row } from "antd";
import styles from "../../index.module.css";
import TextDrawer from "../../../Accordion/TextDrawer";
import { checkSTatusReviewType, postAddingTargetObj } from "../../../Accordion/types";
import { companyObjectivesType, objectiveSubTaskType } from "../../../Accordion/actions";
import { useAppSelector } from "../../../../store";
import CommentsComponent from "../../../../modules/CommentsComponent";

type PropsType = {
  currentParentTarget: postAddingTargetObj | null | companyObjectivesType | undefined;
  currentTargetReview: checkSTatusReviewType | objectiveSubTaskType | null;
  changeFiltering: () => void;
  currentTargetType: null | string;
  isParentTarget: boolean;
};

const ViewingTarget = ({
  currentParentTarget, currentTargetReview, changeFiltering, currentTargetType, isParentTarget
}: PropsType) => {
  const [visibleComments, setVisibleComments] = useState(false);
  const toggleShowComments = () => setVisibleComments(!visibleComments);
  const comments = useAppSelector((state) => state.commentsReducer.comments);
  const isUnConnected = currentTargetType === "unconnected-target" || currentTargetType === "unconnected-key-target";
  let textName = "Название цели";
  if (isParentTarget && !isUnConnected) textName = "Цель компании";

  return (
    <>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            className={styles.element_drawer}
            rules={[
              {
                required: true,
                message: ""
              }
            ]}
          >
            <div className={styles.text_column_drawer} style={{ marginTop: "7px" }}>
              <TextDrawer color="#6F6F8B">{textName}</TextDrawer>
              <h3 color="#333">{currentTargetReview && currentTargetReview.name}</h3>
            </div>
          </Form.Item>
        </Col>
      </Row>
      {currentParentTarget?.name && (
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item className={styles.element_drawer}>
              <div className={styles.text_column_drawer}>
                <TextDrawer color="#6F6F8B">Цель компании</TextDrawer>
                <h3 color="#333333">{currentParentTarget && currentParentTarget.name}</h3>
              </div>
            </Form.Item>
          </Col>
        </Row>
      )}
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name="reviewComment" className={styles.element_drawer}>
            <CommentsComponent
              changeFiltering={changeFiltering}
              currentId={currentTargetReview?.id}
              comments={comments}
              titleComments="Комментарии"
              visibleComments={visibleComments}
              toggleShowComments={toggleShowComments}
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default ViewingTarget;
