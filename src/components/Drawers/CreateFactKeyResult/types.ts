import { Dispatch, SetStateAction } from "react";
import { objectiveSubTaskType } from "../../Accordion/actions";
import { helpTypeFacts } from "../ViewingDrawer/reducer";

export type EditFactProps = {
  keyResultTarget: objectiveSubTaskType;
  visibleEditFact: boolean;
  setVisibleEditFact: Dispatch<SetStateAction<boolean>>;
  currentFact: helpTypeFacts | undefined;
  setCurrentFact: Dispatch<SetStateAction<helpTypeFacts | undefined>>;
};

export type DeleteFactProps = {
  visibleDeleteFact: boolean;
  setVisibleDeleteFact: Dispatch<SetStateAction<boolean>>;
  keyResultName: string;
  onCloseEditFact: Function;
};
