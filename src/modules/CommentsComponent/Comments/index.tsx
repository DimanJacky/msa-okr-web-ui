import React, { FC, ReactElement } from "react";
import { Col, Row } from "antd";
import CommentsTabs from "./CommentsTabs";

type PropsType = {
  childrenElement: ReactElement;
  comments?: any;
  currentId: any;
  changeFiltering: () => void;
};

const Comments: FC<PropsType> = ({
  childrenElement, comments, currentId, changeFiltering
}) => (
  <Row gutter={16}>
    <Col span={24}>
      <CommentsTabs changeFiltering={changeFiltering} currentId={currentId} comments={comments} />
      {childrenElement}
    </Col>
  </Row>
);

Comments.defaultProps = {
  comments: undefined
};

export default Comments;
