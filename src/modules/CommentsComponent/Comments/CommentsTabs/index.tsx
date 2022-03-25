import React, { FC } from "react";
import { Tabs } from "antd";
import CommentsList from "../CommentsList";

type PropsType = {
  comments?: any;
  currentId: any;
  changeFiltering: () => void;
};

const CommentsTabs: FC<PropsType> = ({ comments, currentId, changeFiltering }) => {
  const { TabPane } = Tabs;
  return (
    <Tabs defaultActiveKey="1" onChange={changeFiltering}>
      <TabPane tab="По результатам" key="1">
        <CommentsList currentId={currentId} comments={comments} />
      </TabPane>
      <TabPane tab="Все" key="2">
        <CommentsList currentId={currentId} comments={comments} />
      </TabPane>
    </Tabs>
  );
};

CommentsTabs.defaultProps = {
  comments: undefined
};

export default CommentsTabs;
