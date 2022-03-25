import React, { useState } from "react";
import { Button, Tooltip } from "antd";
import classNames from "classnames";
import styles from "../index.module.css";
import flag from "../../../../images/flag.svg";
import EditIcon from "../../../../images/edit_icon.svg";
import DeleteIcon from "../../../../images/delete_icon.svg";
import UpdateKeyTargetDrawer from "../../../Drawers/UpdateKeyTargetDrawer";
import AccordionHeader from "../../AccordionHeader";
import { objectiveSubTaskType } from "../../actions";
import CreateFactKeyResult from "../../../Drawers/CreateFactKeyResult";
import DeleteKeyTargetDrawer from "../../../Drawers/DeleteKeyTargetDrawer";
import { StatusEnums } from "../../../../store/filters/filters";
import { helpTypeFacts } from "../../../Drawers/ViewingDrawer/reducer";
import EditFact from "../../../Drawers/CreateFactKeyResult/EditFact";

interface Props {
  secondaryItems: Array<objectiveSubTaskType>;
  companyTargetStatus: string;
  objectiveStatus: string;
  objectiveId: number;
  objectiveTitle: string;
  unitId: number;
  item: any;
  checkStatus: any;
  filters: StatusEnums[];
  visibleWarningAlert: boolean;
  sendDeleteKeyTarget: (keyTargetId: number, isObjective: boolean, isHardDelete: boolean, status: StatusEnums) => void;
  isActiveStatusPeriod: boolean;
}

const AccordionItemList: React.FC<Props> = ({
  secondaryItems,
  objectiveId,
  objectiveTitle,
  unitId,
  companyTargetStatus,
  objectiveStatus,
  item,
  checkStatus,
  visibleWarningAlert,
  filters,
  sendDeleteKeyTarget,
  isActiveStatusPeriod
}) => {
  const [visibleUpdateKeyTargetDrawer, setVisibleUpdateKeyTargetDrawer] = useState(false);
  const [visibleDeleteKeyTargetDrawer, setVisibleDeleteKeyTargetDrawer] = useState(false);
  const [currentKeyTragetId, setCurrentKeyTargetId] = useState();
  const [visibleKeyResultDrawer, setVisibleKeyResultDrawer] = useState(false);

  const [visibleEditFact, setVisibleEditFact] = useState<boolean>(false);
  const [currentFact, setCurrentFact] = useState<helpTypeFacts>();

  const [keyTarget, setKeyTarget] = useState<objectiveSubTaskType | undefined>();

  return (
    <div>
      {keyTarget && (
        <>
          <UpdateKeyTargetDrawer
            unitId={unitId}
            companyTargetStatus={companyTargetStatus}
            objectiveId={objectiveId}
            objectiveTitle={objectiveTitle}
            objectiveStatus={objectiveStatus}
            keyTarget={keyTarget}
            visibleTarget={visibleUpdateKeyTargetDrawer}
            setVisibleTargetFunc={setVisibleUpdateKeyTargetDrawer}
          />
          <CreateFactKeyResult
            keyResultTarget={keyTarget}
            visibleCreateKeyResult={visibleKeyResultDrawer}
            setVisibleKeyResultDrawer={setVisibleKeyResultDrawer}
            setVisibleEditFact={setVisibleEditFact}
            setCurrentFact={setCurrentFact}
          />
          <EditFact keyResultTarget={keyTarget} visibleEditFact={visibleEditFact} setVisibleEditFact={setVisibleEditFact} currentFact={currentFact} setCurrentFact={setCurrentFact} />
          <DeleteKeyTargetDrawer
            sendDeleteKeyTarget={sendDeleteKeyTarget}
            setCurrentKeyTargetId={setCurrentKeyTargetId}
            currentKeyTargetId={currentKeyTragetId}
            objectiveTitle={objectiveTitle}
            keyTargetName={keyTarget}
            visibleDeleteKeyTargetDrawer={visibleDeleteKeyTargetDrawer}
            setVisibleDeleteKeyTargetDrawer={setVisibleDeleteKeyTargetDrawer}
          />
        </>
      )}
      {secondaryItems
        && secondaryItems.map((it) => (
          <li
            className={classNames([styles.specialLi], {
              draftThirdStatus: !filters.includes(StatusEnums.CAN_STYLE) && it.status === StatusEnums.DRAFT && filters.includes(it.status),
              reviewThirdStatus: !filters.includes(StatusEnums.CAN_STYLE) && it.status === StatusEnums.REVIEW && filters.includes(it.status),
              rejectedThirdStatus: !filters.includes(StatusEnums.CAN_STYLE) && it.status === StatusEnums.REJECTED && filters.includes(it.status),
              activeThirdStatus: !filters.includes(StatusEnums.CAN_STYLE) && it.status === StatusEnums.ACTIVE && filters.includes(it.status),
              outdateThirdStatus: !filters.includes(StatusEnums.CAN_STYLE) && it.status === StatusEnums.OUTDATE && filters.includes(it.status),
              deletedThirdStatus: !filters.includes(StatusEnums.CAN_STYLE) && it.status === StatusEnums.DELETED && filters.includes(it.status),
              notIncludeThirdStatus: !filters.includes(StatusEnums.CAN_STYLE) && !filters.includes(it.status)
            })}
            key={it.id + it.name}
            style={{ display: "flex" }}
          >
            <AccordionHeader
              checkStatus={checkStatus}
              thirdLeveLClass
              it={{
                it,
                item,
                status: it.status
              }}
              type="key-target"
            >
              <div className={styles.key_target_label}>
                <Tooltip placement="right" title="Ключевой результат">
                  <img src={flag} alt="flag" className={styles.icons_flag_style} />
                </Tooltip>
                {it && it.name}
              </div>
            </AccordionHeader>
            <span className={styles.btn_wrapper}>
              {it.status !== StatusEnums.ACTIVE ? (
                <Button className="hidden_icons" type="link">
                  {!visibleWarningAlert && isActiveStatusPeriod && <img src={flag} alt="flag" className={styles.icon_disable} />}
                </Button>
              ) : (
                <Tooltip placement="right" title="Внести факт КР">
                  <Button
                    onClick={(event) => {
                      event.stopPropagation();
                      setKeyTarget(it);
                      setVisibleKeyResultDrawer(true);
                    }}
                    className="hidden_icons"
                    type="link"
                  >
                    {!visibleWarningAlert && isActiveStatusPeriod && <img src={flag} alt="flag" className={styles.hidden_icons_style} />}
                  </Button>
                </Tooltip>
              )}

              <Tooltip placement="right" title="Редактировать КР">
                <Button
                  className="hidden_icons"
                  type="link"
                  onClick={(event) => {
                    event.stopPropagation();
                    setKeyTarget(it);
                    if (it.status !== StatusEnums.REJECTED) setVisibleUpdateKeyTargetDrawer(true);
                    if (it.status === StatusEnums.REJECTED) checkStatus({ it, item }, "key-target");
                  }}
                >
                  {!visibleWarningAlert && isActiveStatusPeriod && <img src={EditIcon} alt="EditIcon" className={styles.hidden_icons_style} />}
                </Button>
              </Tooltip>

              {!visibleWarningAlert && isActiveStatusPeriod && it.status !== StatusEnums.DELETED && (
                <Tooltip placement="right" title="Удалить КР">
                  <Button
                    className="hidden_icons"
                    type="link"
                    onClick={(event) => {
                      event.stopPropagation();
                      setKeyTarget(it);
                      setVisibleDeleteKeyTargetDrawer(true);
                    }}
                  >
                    <img src={DeleteIcon} alt="DeleteIcon" className={styles.hidden_icons_style} />
                  </Button>
                </Tooltip>
              )}
            </span>
          </li>
        ))}
    </div>
  );
};

export default AccordionItemList;
