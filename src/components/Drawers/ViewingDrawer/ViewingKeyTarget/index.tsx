import React from "react";
import KeyResultInfo from "../../../../modules/KeyResultInfo";
import { checkSTatusReviewType } from "../../../Accordion/types";
import { objectiveSubTaskType } from "../../../Accordion/actions";

type PropsType = {
  currentTargetReview: checkSTatusReviewType | objectiveSubTaskType | null;
};
const ViewingKeyTarget = ({ currentTargetReview }: PropsType) => (
  <>
    <KeyResultInfo currentTargetReview={currentTargetReview} />
  </>
);

export default ViewingKeyTarget;
