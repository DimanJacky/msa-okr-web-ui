import React, { FC } from "react";
import { List } from "antd";
import IconChevronUp from "./IconChevronUp";
import { CommentOgj } from "../../../../store/commentsReducer/index";
import ActiveStatus from "../../../../images/activeStatus.svg";
import RejectedStatus from "../../../../images/rejectedStatus.svg";
import IconChat from "../../../../images/icon_chat.svg";

type PropsType = {
  comments?: any;
  currentId: any;
};

const CommentsList: FC<PropsType> = ({ comments, currentId }) => (
  <List
    itemLayout="horizontal"
    dataSource={comments[currentId]}
    renderItem={(comment: CommentOgj) => (
      <List.Item key={comment.id}>
        <img className="IconChat" src={IconChat} alt="IconChat" />
        <List.Item.Meta title={comment.username} description={comment.valueComment} />
        <span className="date">{comment.commentDate}</span>
        <span className="IconChevronUpStyle">
          <IconChevronUp />
        </span>
        <p className="translatedStatus">
          Переведено на статус:
          {comment.eventName === "changed the status to \"Rejected\"" ? (
            <span className="commentStatusStyle">
              <img src={RejectedStatus} alt="RejectedStatus" />
              Rejected
            </span>
          ) : (
            <span className="commentStatusStyle">
              <img src={ActiveStatus} alt="ActiveStatus" />
              Active
            </span>
          )}
        </p>
      </List.Item>
    )}
  />
);

CommentsList.defaultProps = {
  comments: undefined
};

export default CommentsList;
