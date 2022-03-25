import React from "react";

type propsType = {
  username: string;
  fixationPeriodId: number;
  valueComment: string;
  eventName: string;
  commentDate: string;
};

const CommentFact = ({
  username, fixationPeriodId, valueComment, eventName, commentDate
}: propsType) => (
  <>
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div>{username}</div>
      <div>{`${fixationPeriodId} квартал`}</div>
    </div>
    <div>{valueComment}</div>
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div>{eventName}</div>
      <div>{commentDate}</div>
    </div>
  </>
);

export default CommentFact;
