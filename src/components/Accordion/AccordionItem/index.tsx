import React, { Dispatch, SetStateAction, useState } from "react";
import { Button, Collapse, Tooltip } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import classNames from "classnames";
import AccordionItemList from "./AccordionItemList";
import styles from "./index.module.css";
import "../style.css";
import CreateKeyTargetDrawer from "../../Drawers/CreateKeyTargetDrawer";
import CreateTargetDrawer from "../../Drawers/CreateTargetDrawer";
import UpdateTargetDrawer from "../../Drawers/UpdateTargetDrawer";
import AccordionHeader from "../AccordionHeader";
import { IObjectives } from "../reducer";
import { CompanyTargetType } from "../types";
import { StatusEnums } from "../../../store/filters/filters";
import DeleteTargetDrawer from "../../Drawers/DeleteTargetDrawer";
import targetImg from "../../../images/target.svg";
import targetImgKr from "../../../images/target_kr.svg";
import MinusSquare from "../../../images/minus-square-accent.svg";
import PlusC from "../../../images/plus-c.svg";
import DeleteIcon from "../../../images/delete_icon.svg";
import EditIcon from "../../../images/edit_icon.svg";
import PlusSquare from "../../../images/plus-square-accordion.svg";

interface Props {
  item: CompanyTargetType;
  openPanels: string | number[] | string[];
  openPanelsItem: string | number[] | string[];
  setOpenPanels: Dispatch<SetStateAction<string | number[] | string[]>>;
  setOpenPanelsItem: Dispatch<SetStateAction<string | number[] | string[]>>;
  companyTargets: IObjectives[];
  unitId: number;
  checkStatus: any;
  visibleWarningAlert: boolean;
  // eslint-disable-next-line no-unused-vars
  open: (t: any, func: Dispatch<SetStateAction<string | number[] | string[]>>) => ((key: string | string[]) => void) | undefined;
  filters: StatusEnums[];
  sendDeleteTarget: (targetId: number, isObjective: boolean, isHardDelete: boolean, status: StatusEnums) => void;
  isUnitCompany: boolean;
  isActiveStatusPeriod: boolean;
}

const AccordionItem: React.FC<Props> = ({
  item,
  unitId,
  openPanels,
  setOpenPanels,
  openPanelsItem,
  setOpenPanelsItem,
  companyTargets,
  checkStatus,
  open,
  filters,
  visibleWarningAlert,
  sendDeleteTarget,
  isUnitCompany,
  isActiveStatusPeriod
}) => {
  const [visibleUpdateCompanyTarget, setVisibleUpdateCompanyTarget] = useState(false);
  const [visibleTarget, setVisibleTarget] = useState(false);
  const [visibleKeyTarget, setVisibleKeyTarget] = useState(false);
  const [visibleKeyTargetCompany, setVisibleKeyTargetCompany] = useState(false);
  const [visibleUpdateTargetDrawer, setVisibleUpdateTargetDrawer] = useState(false);
  const [secondTitle, setSecondTitle] = useState("");
  const [visibleDeleteTargetDrawer, setVisibleDeleteTargetDrawer] = useState(false);
  const [target, setTarget] = useState(item);

  const [targetTwoLevel, setTargetTwoLevel] = useState({
    id: 0,
    name: "",
    objectivePeriodId: 0,
    objectiveTypeId: 0,
    parentId: 0,
    status: StatusEnums.DRAFT,
    subTasks: [],
    objectiveSubTask: []
  });
  const [currentTargetId, setCurrentTargetId] = useState<number | undefined>();

  return (
    <div key={0o1120}>
      {isUnitCompany ? (
        <CreateKeyTargetDrawer
          openPanelsItem={openPanelsItem}
          setOpenPanelsItem={setOpenPanelsItem}
          visibleTarget={visibleKeyTargetCompany}
          setVisibleTargetFunc={setVisibleKeyTargetCompany}
          targetTitle={item.name}
          currentTargetId={item.id}
        />
      ) : (
        <CreateTargetDrawer
          openPanels={openPanels}
          setOpenPanels={setOpenPanels}
          titleTarget={item.name}
          companyTargets={companyTargets}
          visibleTarget={visibleTarget}
          setVisibleTargetFunc={setVisibleTarget}
          unitId={unitId}
        />
      )}
      <UpdateTargetDrawer
        item={item}
        parentTargetStatus="active"
        unitId={unitId}
        visibleTarget={visibleUpdateCompanyTarget}
        setVisibleTargetFunc={setVisibleUpdateCompanyTarget}
        companyTargets={null}
        companyTargetName={item.name}
      />
      <DeleteTargetDrawer sendDeleteTarget={sendDeleteTarget} target={target} visibleDeleteTargetDrawer={visibleDeleteTargetDrawer} setVisibleDeleteTargetDrawer={setVisibleDeleteTargetDrawer} />
      <Collapse
        expandIconPosition="right"
        expandIcon={({ isActive }) => {
          if (isUnitCompany) {
            return isActive
              ? item.keyResultsCompany && item.keyResultsCompany.length > 0 && <img src={MinusSquare} alt="MinusSquare" />
              : item.keyResultsCompany && item.keyResultsCompany.length > 0 && <img src={PlusSquare} alt="MinusSquare" />;
          }
          return isActive
            ? item.subTasks && item.subTasks.length > 0 && <img src={MinusSquare} alt="MinusSquare" />
            : item.subTasks && item.subTasks.length > 0 && <img src={PlusSquare} alt="MinusSquare" />;
        }}
        onChange={isUnitCompany ? open(item.keyResultsCompany, setOpenPanels) : open(item.subTasks, setOpenPanels)}
        activeKey={openPanels}
        className={styles.accordion}
      >
        <Collapse.Panel
          className={classNames(styles.accordion_item, {
            draftStatus: !filters.includes(StatusEnums.CAN_STYLE) && item.status === StatusEnums.DRAFT && filters.includes(item.status),
            reviewStatus: !filters.includes(StatusEnums.CAN_STYLE) && item.status === StatusEnums.REVIEW && filters.includes(item.status),
            rejectedStatus: !filters.includes(StatusEnums.CAN_STYLE) && item.status === StatusEnums.REJECTED && filters.includes(item.status),
            activeStatus: !filters.includes(StatusEnums.CAN_STYLE) && item.status === StatusEnums.ACTIVE && filters.includes(item.status),
            outdateStatus: !filters.includes(StatusEnums.CAN_STYLE) && item.status === StatusEnums.OUTDATE && filters.includes(item.status),
            deletedStatus: !filters.includes(StatusEnums.CAN_STYLE) && item.status === StatusEnums.DELETED && filters.includes(item.status),
            notIncludeStatus: !filters.includes(StatusEnums.CAN_STYLE) && !filters.includes(item.status)
          })}
          header={(
            <AccordionHeader checkStatus={checkStatus} it={item} type="target">
              <div>
                <Tooltip placement="right" title="Цель компании">
                  <img className={styles.targetImg} src={targetImg} alt="targetImg" />
                </Tooltip>
                {`${item.name}`}
              </div>
            </AccordionHeader>
          )}
          extra={(
            <>
              {!visibleWarningAlert && isActiveStatusPeriod && (
                <>
                  {isUnitCompany ? (
                    <Tooltip placement="right" title="Создать КР">
                      <Button
                        className="hidden_icons"
                        type="link"
                        onClick={(event) => {
                          if (isUnitCompany) {
                            setVisibleKeyTargetCompany(true);
                          } else {
                            setVisibleTarget(true);
                          }
                          event.stopPropagation();
                        }}
                      >
                        <img src={PlusC} alt="PlusC" className={styles.hidden_icons_style} />
                      </Button>
                    </Tooltip>
                  ) : (
                    <Button
                      className="hidden_icons"
                      type="link"
                      onClick={(event) => {
                        if (isUnitCompany) {
                          setVisibleKeyTargetCompany(true);
                        } else {
                          setVisibleTarget(true);
                        }
                        event.stopPropagation();
                      }}
                    >
                      <img src={PlusC} alt="PlusC" className={styles.hidden_icons_style} />
                    </Button>
                  )}
                  {isUnitCompany && (
                    <Tooltip placement="right" title="Редактировать цель">
                      <Button
                        className="hidden_icons"
                        type="link"
                        onClick={(event) => {
                          event.stopPropagation();
                          if (item.status !== StatusEnums.REJECTED) setVisibleUpdateCompanyTarget(true);
                          if (item.status === StatusEnums.REJECTED) checkStatus(item, "target");
                        }}
                      >
                        <img src={EditIcon} alt="EditIcon" className={styles.hidden_icons_style} />
                      </Button>
                    </Tooltip>
                  )}
                  {item.status !== StatusEnums.DELETED && isUnitCompany && (
                    <Tooltip placement="right" title="Удалить цель">
                      <Button
                        className="hidden_icons"
                        type="link"
                        onClick={(event) => {
                          event.stopPropagation();
                          setTarget(item);
                          setVisibleDeleteTargetDrawer(true);
                        }}
                      >
                        <img src={DeleteIcon} alt="DeleteIcon" className={styles.hidden_icons_style} />
                      </Button>
                    </Tooltip>
                  )}
                </>
              )}
            </>
          )}
          key={item.id}
        >
          <div className="accordion_item_list connectedListItem">
            {!isUnitCompany ? (
              <>
                <CreateKeyTargetDrawer
                  openPanelsItem={openPanelsItem}
                  setOpenPanelsItem={setOpenPanelsItem}
                  visibleTarget={visibleKeyTarget}
                  setVisibleTargetFunc={setVisibleKeyTarget}
                  targetTitle={secondTitle}
                  currentTargetId={currentTargetId}
                />
                <UpdateTargetDrawer
                  item={targetTwoLevel}
                  parentTargetStatus={item.status}
                  unitId={unitId}
                  visibleTarget={visibleUpdateTargetDrawer}
                  setVisibleTargetFunc={setVisibleUpdateTargetDrawer}
                  companyTargets={companyTargets}
                  companyTargetName={item.name}
                />
                {item.subTasks
                  && item.subTasks.map((it: any) => (
                    <Collapse
                      key={it.id}
                      onChange={open(it.objectiveSubTask, setOpenPanelsItem)}
                      className={styles.accordion}
                      expandIconPosition="right"
                      activeKey={openPanelsItem}
                      expandIcon={({ isActive }) => it.objectiveSubTask && it.objectiveSubTask.length > 0 && <CaretRightOutlined className={isActive ? styles.active_triangle_color : ""} rotate={isActive ? 270 : 90} />}
                    >
                      <Collapse.Panel
                        className={classNames({
                          draftSecondStatus: !filters.includes(StatusEnums.CAN_STYLE) && it.status === StatusEnums.DRAFT && filters.includes(it.status),
                          reviewSecondStatus: !filters.includes(StatusEnums.CAN_STYLE) && it.status === StatusEnums.REVIEW && filters.includes(it.status),
                          rejectedSecondStatus: !filters.includes(StatusEnums.CAN_STYLE) && it.status === StatusEnums.REJECTED && filters.includes(it.status),
                          activeSecondStatus: !filters.includes(StatusEnums.CAN_STYLE) && it.status === StatusEnums.ACTIVE && filters.includes(it.status),
                          outdateSecondStatus: !filters.includes(StatusEnums.CAN_STYLE) && it.status === StatusEnums.OUTDATE && filters.includes(it.status),
                          deletedSecondStatus: !filters.includes(StatusEnums.CAN_STYLE) && it.status === StatusEnums.DELETED && filters.includes(it.status),
                          notIncludeSecondStatus: !filters.includes(StatusEnums.CAN_STYLE) && !filters.includes(it.status)
                        })}
                        header={(
                          <AccordionHeader checkStatus={checkStatus} it={it} type="target">
                            <div className={styles.target_label}>
                              <Tooltip placement="right" title="Цель">
                                <img className={styles.targetImgKr} src={targetImgKr} alt="targetImgKr" />
                              </Tooltip>
                              {it.name}
                            </div>
                          </AccordionHeader>
                        )}
                        extra={
                          !visibleWarningAlert
                          && isActiveStatusPeriod && (
                            <>
                              <Tooltip placement="right" title="Создать КР">
                                <Button
                                  className="hidden_icons"
                                  type="link"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    setVisibleKeyTarget(true);
                                    setSecondTitle(it.name);
                                    setCurrentTargetId(it.id);
                                  }}
                                >
                                  <img src={PlusC} alt="PlusC" className={styles.hidden_icons_style} />
                                </Button>
                              </Tooltip>

                              <Tooltip placement="right" title="Редактировать цель">
                                <Button
                                  className="hidden_icons"
                                  type="link"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    setTargetTwoLevel(() => it);
                                    if (it.status !== StatusEnums.REJECTED) setVisibleUpdateTargetDrawer(true);
                                    if (it.status === StatusEnums.REJECTED) checkStatus(it, "target");
                                  }}
                                >
                                  <img src={EditIcon} alt="EditIcon" className={styles.hidden_icons_style} />
                                </Button>
                              </Tooltip>
                              {it.status !== StatusEnums.DELETED && (
                                <Tooltip placement="right" title="Удалить цель">
                                  <Button
                                    className="hidden_icons"
                                    type="link"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      setTarget(it);
                                      setVisibleDeleteTargetDrawer(true);
                                    }}
                                  >
                                    <img src={DeleteIcon} alt="DeleteIcon" className={styles.hidden_icons_style} />
                                  </Button>
                                </Tooltip>
                              )}
                            </>
                          )
                        }
                        key={it.id}
                      >
                        {it.objectiveSubTask && (
                          <ul style={{ margin: "0" }} key={item.id}>
                            <AccordionItemList
                              unitId={unitId}
                              companyTargetStatus={item.status}
                              objectiveTitle={it.name}
                              objectiveId={it.id}
                              objectiveStatus={it.status}
                              secondaryItems={it.objectiveSubTask}
                              item={item}
                              checkStatus={checkStatus}
                              filters={filters}
                              visibleWarningAlert={visibleWarningAlert}
                              isActiveStatusPeriod={isActiveStatusPeriod}
                              sendDeleteKeyTarget={sendDeleteTarget}
                            />
                          </ul>
                        )}
                      </Collapse.Panel>
                    </Collapse>
                  ))}
              </>
            ) : (
              item.keyResultsCompany && (
                <ul style={{ margin: "0" }} key={item.id}>
                  <AccordionItemList
                    unitId={unitId}
                    companyTargetStatus={item.status}
                    objectiveTitle={item.name}
                    objectiveId={item.id}
                    objectiveStatus={item.status}
                    secondaryItems={item.keyResultsCompany}
                    item={item}
                    checkStatus={checkStatus}
                    filters={filters}
                    visibleWarningAlert={visibleWarningAlert}
                    isActiveStatusPeriod={isActiveStatusPeriod}
                    sendDeleteKeyTarget={sendDeleteTarget}
                  />
                </ul>
              )
            )}
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

export default AccordionItem;
