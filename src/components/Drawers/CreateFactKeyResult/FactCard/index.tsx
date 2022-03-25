import React, {
  Dispatch, SetStateAction, useCallback, useEffect, useRef, useState
} from "react";
import { Radio, RadioChangeEvent } from "antd";
import {
  DownOutlined, MinusSquareOutlined, PlusSquareOutlined, UpOutlined
} from "@ant-design/icons";

import FactInfo from "./FactInfo";
import styles from "../styles.module.css";
import { helpTypeFacts } from "../../ViewingDrawer/reducer";
import { useAppSelector } from "../../../../store";
import { StatusEnums } from "../../../../store/filters/filters";
import getCheckboxesList from "../../../../modules/KeyResultInfo/const";
import FilterCheckboxes from "../../../../modules/FilterCheckboxes";

type PropsType = {
  openFacts: boolean;
  setOpenFacts: Dispatch<SetStateAction<boolean>>;
  allFactsReverse: Array<helpTypeFacts>;
  lastFactsReverse: Array<helpTypeFacts>;
  handleEditFact: (fact: helpTypeFacts) => void;
};

const FactCard = ({
  openFacts, setOpenFacts, allFactsReverse, lastFactsReverse, handleEditFact
}: PropsType) => {
  const { filters } = useAppSelector((state) => state.keyResultFacts);
  const [radioValue, setRadioValue] = useState<number>(1);
  const [showDescription, setShowDescription] = useState(false);
  const filterRef = useRef(null);

  const isDraftStatus = filters.some((item: StatusEnums) => item === StatusEnums.DRAFT);
  const isReviewStatus = filters.some((item: StatusEnums) => item === StatusEnums.REVIEW);
  const isRejectedStatus = filters.some((item: StatusEnums) => item === StatusEnums.REJECTED);
  const isActiveStatus = filters.some((item: StatusEnums) => item === StatusEnums.ACTIVE);
  const isLabelAll = radioValue === 2;
  const filterStatusList = [isDraftStatus, isReviewStatus, isRejectedStatus, isActiveStatus];
  const textNotFound = "Ничего не найдено - измените фильтры.";

  const handleChangeRadio = (e: RadioChangeEvent) => setRadioValue(e.target.value);
  const handleOpenFilter = () => {
    const valueLabelAll = 2;
    setShowDescription(!showDescription);
    setRadioValue(valueLabelAll);
  };
  const handlerDocument = useCallback((e: MouseEvent) => {
    let isHave = false;

    if (filterRef.current) isHave = e.composedPath().includes(filterRef.current);
    if (!isHave) setShowDescription(false);
  }, []);

  useEffect(() => {
    document.addEventListener("click", handlerDocument);
    return () => document.removeEventListener("click", handlerDocument);
  }, [handlerDocument]);

  return (
    <div className={styles.collapse}>
      <div className={styles.collapse_list_facts}>
        <div>Факты</div>
        <div>
          {openFacts ? (
            <MinusSquareOutlined className={styles.icon_minus} onClick={() => setOpenFacts(!openFacts)} />
          ) : (
            <PlusSquareOutlined className={styles.icon_plus} onClick={() => setOpenFacts(!openFacts)} />
          )}
        </div>
      </div>
      {openFacts && (
        <>
          <div className={styles.radio_block}>
            <Radio.Group onChange={handleChangeRadio} value={radioValue}>
              <Radio value={1}>Последние</Radio>
              <Radio value={2}>Все</Radio>
            </Radio.Group>
            <div ref={filterRef}>
              <div>{showDescription ? <UpOutlined className={styles.iconOutlined} onClick={handleOpenFilter} /> : <DownOutlined className={styles.iconOutlined} onClick={handleOpenFilter} />}</div>
              {showDescription && (
                <div className={styles.filterWrapper}>
                  <FilterCheckboxes list={getCheckboxesList(filterStatusList)} />
                </div>
              )}
            </div>
          </div>
          <div className={styles.facts_list}>
            {isLabelAll
              ? allFactsReverse.map((item: any) => <FactInfo key={item.id + item.status + item.fixationPeriodId} fact={item} handleEditFact={handleEditFact} />)
              : lastFactsReverse.map((e: any) => <FactInfo key={e.id + e.status + e.fixationPeriodId} fact={e} handleEditFact={handleEditFact} />)}
            {isLabelAll && !(allFactsReverse.length > 0) && <p className={styles.textNotFound}>{textNotFound}</p>}
          </div>
        </>
      )}
    </div>
  );
};

export default FactCard;
