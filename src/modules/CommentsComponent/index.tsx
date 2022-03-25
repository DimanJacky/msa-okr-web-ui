import React, { FC } from "react";
import Comments from "./Comments";
import MinusSquare from "../../images/minus-square.svg";
import PlusSquare from "../../images/plus-square.svg";
import "./style.css";

type PropsType = {
  visibleComments: boolean;
  titleComments: string;
  toggleShowComments: () => void;
  changeFiltering: () => void;
  children?: any;
  comments?: any;
  currentId: any;
};

const CommentsComponent: FC<PropsType> = ({
  visibleComments, titleComments, toggleShowComments, children, comments, currentId, changeFiltering
}) => (
  <div className="comments_wrapper">
    <div className="comments_title">
      <h3>{titleComments}</h3>
      {visibleComments ? (
        <input type="image" src={MinusSquare} className="comments_icon" onClick={toggleShowComments} alt="MinusSquare" />
      ) : (
        <input type="image" src={PlusSquare} className="comments_icon" onClick={toggleShowComments} alt="PlusSquare" />
      )}
    </div>
    {visibleComments && <Comments changeFiltering={changeFiltering} currentId={currentId} comments={comments} childrenElement={children} />}
  </div>
);

CommentsComponent.defaultProps = {
  children: undefined,
  comments: undefined
};

export default CommentsComponent;
