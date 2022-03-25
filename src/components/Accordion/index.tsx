import React, {
  Dispatch, SetStateAction, useEffect, useMemo, useState
} from "react";
import {
  Button, Col, Collapse, Row, Tooltip
} from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import { useParams } from "react-router";
import classNames from "classnames";
import styles from "./index.module.css";
import "./style.css";
import AccordionItem from "./AccordionItem";
import FilterUnit from "./FilterUnit";
import {
  ActionsEnums, companyObjectivesType, deleteTarget, entityTypeEnums, getObjectiveKeyResults, getTargetList, objectiveSubTaskType, postToReviewTargets
} from "./actions";
import { store, useAppDispatch, useAppSelector } from "../../store";
import { IObjectives } from "./reducer";
import { checkSTatusReviewType, postAddingTargetObj } from "./types";
import CreateKeyTargetDrawer from "../Drawers/CreateKeyTargetDrawer";
import CreateTargetDrawer from "../Drawers/CreateTargetDrawer";
import UpdateTargetDrawer from "../Drawers/UpdateTargetDrawer";
import UpdateKeyTargetDrawer from "../Drawers/UpdateKeyTargetDrawer";
import CreateCompanyTargetDrawer from "../Drawers/CreateCompanyTarget";
import AgreementOnTargetDrower from "../Drawers/AgreementOnTarget";
import ViewingDrawer from "../Drawers/ViewingDrawer";
import WarningAlert from "../../modules/WarningAlert";
import EmptyObjectivesInformationAlert from "../../modules/InformationAlert";
import NotificationCustomModal from "../../modules/NotificationModal";
import actions from "../ListOfDivisionsPage/actions";
import globalMinus from "../../images/globalMinus.svg";
import globalPlus from "../../images/globalPlus.svg";
import targetImg from "../../images/target.svg";
import targetImgKr from "../../images/target_kr.svg";
import DeleteIcon from "../../images/delete_icon.svg";
import PlusIcon from "../../images/plus-c.svg";
import EditIcon from "../../images/edit_icon.svg";
import PeriodSelection from "./PeriodSelection";
import AccordionHeader from "./AccordionHeader";
import { some } from "../../store/objectivesIds/unConnectedObjectives/reducer";
import CompanyPage from "../../ui-layout/company-page";
import { LoadingAllFulfilled } from "../../store/objectives/selectors";
import { SET_FILTER_FOR_MASTER, StatusEnums } from "../../store/filters/filters";
import DeleteKeyTargetDrawer from "../Drawers/DeleteKeyTargetDrawer";
import DeleteTargetDrawer from "../Drawers/DeleteTargetDrawer";
import CreateFactKeyResult from "../Drawers/CreateFactKeyResult";
import flag from "../../images/flag.svg";
import ToggleTargetsReport from "./ToggleTargetsReport/ToggleTargetsReport";
import MinusSquare from "../../images/minus-square-accent.svg";
import SettingsDevIcon from "./CustomIcons/SettingsDevIcon";
import PlusSquare from "../../images/plus-square-accordion.svg";

import { getActiveStatusPeriod } from "./PeriodSelection/utils";
import { helpTypeFacts } from "../Drawers/ViewingDrawer/reducer";
import EditFact from "../Drawers/CreateFactKeyResult/EditFact";

export type somes = {
  id: number;
  name: string;
  objectiveTypeId: number;
  parentId: number | null;
  status: StatusEnums;
};

const Accordion = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const unitId = Number(id);
  const filtersFil = useAppSelector((state) => state.filters);
  const periods = useAppSelector((state) => state.periods);
  const isLoadFilters = LoadingAllFulfilled(store.getState());
  const objectives: IObjectives[] = useAppSelector((state) => state.objectivesIds);
  const objectivesids: number[] = objectives.map((i: IObjectives) => i.id);
  const companyPage = useMemo(() => new CompanyPage(unitId, objectivesids), [filtersFil]);
  const companyTargetsList = useAppSelector((state) => state.companyObjective.companys);
  const keyResults = useAppSelector((state) => state.keyResults);
  const hasAnyObjectives = useAppSelector((state) => state.targets);
  const units = useAppSelector((state) => state.units);
  const [openPanels, setOpenPanels] = useState<number[] | string | string[]>([]);
  const [openPanelsItem, setOpenPanelsItem] = useState<number[] | string | string[]>([]);
  const [unconcOpenPanels, setUnconcOpenPanels] = useState<number[] | string | string[]>([]);
  const [visible22, setVisible22] = useState(false);
  const [visible11, setVisible11] = useState(false);
  const [visibleUpdateTargetDrawer, setVisibleUpdateTargetDrawer] = useState(false);
  const [visibleUpdateKeyTargetDrawer, setVisibleUpdateKeyTargetDrawer] = useState(false);
  const [secondTitle, setSecondTitle] = useState("");
  const [visibleWarningAlert, setVisibleWarningAlert] = useState(false);
  const [visibleCompanyTarget, setVisibleCompanyTarget] = useState(false);
  const [itemTarget, setItemTarget] = useState<somes>({
    id: 0,
    name: "",
    objectiveTypeId: 0,
    parentId: 0,
    status: StatusEnums.DRAFT
  });
  const [unconObjectiveKeyResultIdDrawer, setUnconObjectiveKeyResultIdDrawer] = useState<number>();
  const [keyTarget, setKeyTarget] = useState<objectiveSubTaskType | undefined>();
  const [objectiveStatus, setObjectiveStatus] = useState<string>("");
  const companyTargets: IObjectives[] = useAppSelector((state) => state.filtered.connected);
  const isUnitCompany = unitId === units[0]?.id;
  let yearInSelect = 0;
  if (localStorage.getItem("globalPeriod") !== null) yearInSelect = Number(localStorage.getItem("globalPeriod")!.split(".")[2]);
  const statusPeriod = periods && periods.find((period: { endDate: string }) => Number(period?.endDate?.split(".")[2]) === yearInSelect)?.status;
  const isActiveStatusPeriod = getActiveStatusPeriod(statusPeriod);

  useEffect(() => {
    dispatch(getObjectiveKeyResults(objectivesids));
  }, [objectives]);
  useEffect(() => {
    dispatch(actions.getUnits(null));
    setTimeout(() => {
      dispatch(getTargetList(unitId));
    }, 700);
  }, []);
  const unConnected = useAppSelector((state) => state.filtered.unconnecteds);
  const unconIds: number[] = unConnected.filter((u: some) => u.subTasks && u.subTasks.length > 0).map((i: any) => i.id);
  const [currentTargetId, setCurrentTargetId] = useState<number | undefined>();
  const allIdTarget: number[] = companyTargets.filter((o: any) => o.subTasks && o.subTasks.length > 0).map((i: IObjectives) => i.id);
  const allIdTargetCompany: number[] = companyTargets.filter((o: any) => o.keyResultsCompany && o.keyResultsCompany.length > 0).map((i: IObjectives) => i.id);
  let uniqueArray: any[];
  if (unConnected.length >= 0) {
    uniqueArray = [666999, ...allIdTarget];
  } else {
    uniqueArray = [];
  }
  const [showFilters, setShowFilters] = useState(false);
  const [visibleAgreement, setVisibleAgreement] = useState<boolean>(false);
  const [currentTargetReview, setCurrentTargetReview] = useState<checkSTatusReviewType | null | objectiveSubTaskType>(null);
  const [currentParentTarget, setCurrentParentTarget] = useState<null | postAddingTargetObj | companyObjectivesType | undefined>(null);
  const [currentTargetType, setCurrentTargetType] = useState<null | string>(null);
  const [visibleDeleteKeyTargetDrawer, setVisibleDeleteKeyTargetDrawer] = useState(false);
  const [currentKeyTragetId, setCurrentKeyTargetId] = useState();

  const [visibleViewing, setVisibleViewing] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [visibleKeyResultDrawer, setVisibleKeyResultDrawer] = useState(false);
  const [visibleDeleteTargetDrawer, setVisibleDeleteTargetDrawer] = useState(false);
  const [targetDelete, setTargetDelete] = useState();
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationContent, setNotificationContent] = useState("");

  const [visibleEditFact, setVisibleEditFact] = useState<boolean>(false);
  const [currentFact, setCurrentFact] = useState<helpTypeFacts>();

  let unitTitle = "";
  const unitName = () => {
    const u = units.filter((unit: any) => unit.id === unitId);
    if (u.length > 0) unitTitle = u[0].name;
  };
  if (units) unitName();

  const toggleGlobalAccordion = () => {
    if (openPanels.length > 0) {
      setOpenPanels([]);
    } else if (isUnitCompany) {
      setOpenPanels([...allIdTargetCompany]);
    } else {
      setOpenPanels([...uniqueArray]);
    }
    if (openPanelsItem.length < 0 || openPanels.length >= 1) {
      setOpenPanelsItem([]);
      setUnconcOpenPanels([]);
    } else {
      setOpenPanelsItem([...objectivesids, ...unconIds]);
      setUnconcOpenPanels([...unconIds]);
    }
  };
  const postToReview = (targets: Array<any>) => {
    const targetsToReview = targets.map((item) => {
      if (item.objectiveTypeId) {
        return {
          entityType: "objective",
          entityId: item.id,
          action: "to_review"
        };
      }
      return {
        entityType: "keyresult",
        entityId: item.id,
        action: "to_review"
      };
    });
    dispatch(postToReviewTargets(targetsToReview));
  };

  const filteringArrayTargets = () => {
    const targetsDraftItems: any = [];

    companyTargets.map(
      (item) => item.subTasks
        && item.subTasks.map((it) => it.status === "draft" && targetsDraftItems.push(it))
        && item.subTasks.map((t) => t.objectiveSubTask && t.objectiveSubTask.map((kt) => kt.status === "draft" && targetsDraftItems.push(kt)))
    );
    unConnected.map((unItem: any) => unItem.status === "draft" && targetsDraftItems.push(unItem));
    unConnected.map((un: any) => un.subTasks && un.subTasks.map((st: any) => st.status === "draft" && targetsDraftItems.push(st)));

    return targetsDraftItems;
  };

  const toggleWarningAlert = () => {
    const targetDrafts = filteringArrayTargets();
    if (targetDrafts.length !== 0) dispatch(SET_FILTER_FOR_MASTER());
    setVisibleWarningAlert(!visibleWarningAlert);
  };

  const sendFilteredArray = () => {
    const targetDrafts = filteringArrayTargets();
    if (targetDrafts.length !== 0) {
      postToReview(targetDrafts);
      setNotificationTitle("Успешно отправлено на согласование");
      setNotificationContent("Ваши цели и ключевые результаты успешно отправлены на согласование. Пожалуйста, сообщите об этом ОКР-мастеру.");
    } else {
      setNotificationTitle("Ошибка");
      setNotificationContent("Нет ни одного черновика для согласования");
    }
  };

  const checkVisibleDrawer = (target: checkSTatusReviewType, type: string, isHeader = false) => {
    const isReviewStatus = target?.status === StatusEnums.REVIEW || target.it?.status === StatusEnums.REVIEW;
    const isOutdateStatus = target?.status === StatusEnums.OUTDATE || target.it?.status === StatusEnums.OUTDATE;
    const isRejectStatus = target?.status === StatusEnums.REJECTED || target.it?.status === StatusEnums.REJECTED;
    const isCorrectForVisibleStatus = isReviewStatus || isOutdateStatus || isRejectStatus;
    const isUnConnected = type === "unconnected-target" || type === "unconnected-key-target";
    const isParentTarget = Boolean(!(target.parentId || target.it || isUnConnected));

    if (isHeader && !(!isRejectStatus || (isParentTarget && !(isUnitCompany && isRejectStatus)))) {
      setVisibleViewing(true);
      return;
    }

    if (isParentTarget) {
      setCurrentTargetType(type);

      if (isCorrectForVisibleStatus && isUnitCompany) {
        setVisibleAgreement(true);
      } else {
        setVisibleViewing(true);
      }
    }

    if (!isParentTarget) {
      setCurrentTargetType(type);

      if (isCorrectForVisibleStatus) {
        setVisibleAgreement(true);
      } else {
        setVisibleViewing(true);
      }
    }
  };

  const checkStatus = (target: checkSTatusReviewType, type: string, isHeader?: boolean) => {
    switch (type) {
      case "unconnected-target": {
        const parentTarget = {
          name: "Несвязанные цели",
          status: "active",
          parentId: null,
          objectiveTypeId: 1,
          unitId,
          objectivePeriodId: Number(localStorage.getItem("periodId")),
          period: localStorage.getItem("globalPeriod")!.split(".")[2]
        };
        setCurrentTargetReview(target);
        setCurrentParentTarget(parentTarget);
        break;
      }
      case "unconnected-key-target": {
        const parentTarget = {
          name: "Несвязанные цели",
          status: "active",
          parentId: null,
          objectiveTypeId: 1,
          unitId,
          objectivePeriodId: Number(localStorage.getItem("periodId")),
          period: localStorage.getItem("globalPeriod")!.split(".")[2]
        };
        setCurrentTargetReview(target);
        setCurrentParentTarget(parentTarget);
        break;
      }
      case "target": {
        const parentTarget: companyObjectivesType | undefined = companyTargets.find((e) => e.id === target.parentId);
        setCurrentTargetReview(target);
        setCurrentParentTarget(parentTarget);
        break;
      }

      case "key-target": {
        setCurrentTargetReview(target.it);
        setCurrentParentTarget(target.item);
        break;
      }
      default:
    }

    checkVisibleDrawer(target, type, isHeader);
  };

  const open = (t: any, func: Dispatch<SetStateAction<string | number[] | string[]>>) => {
    if (t && t.length > 0) {
      return func;
    }
    return () => null;
  };
  useEffect(() => {
    companyPage.getPage();
  }, [isLoadFilters, objectives, keyResults, companyTargetsList]);

  const sendDeleteTarget = (targetId: number, isObjective: boolean = false, isHardDelete: boolean = false, status?: StatusEnums) => {
    const isCorrectForSoftDelete = status === StatusEnums.DRAFT || status === StatusEnums.REJECTED;
    let action = ActionsEnums.ASKSOFTDELETE;
    let entityType = entityTypeEnums.KEYRESULT;

    if (isCorrectForSoftDelete) action = ActionsEnums.SOFTDELETE;
    if (isHardDelete) action = ActionsEnums.HARDDELETE;
    if (isObjective) entityType = entityTypeEnums.OBJECTIVE;

    const target = [
      {
        entityType,
        entityId: targetId,
        action
      }
    ];

    dispatch(
      deleteTarget({
        target,
        unitId
      })
    );
  };

  const showModalNotification = () => {
    setIsModalVisible(true);
    sendFilteredArray();
  };

  const handleCancelModalNotification = () => {
    setIsModalVisible(false);
    toggleWarningAlert();
  };

  return (
    <div key={0o0001} className={styles.site_accordion_wrapper}>
      <div className={styles.alert_wrapper}>{visibleWarningAlert && <WarningAlert messageAlert="" textAlert="Все ваши черновики будут отправлены на согласование" />}</div>
      <div className={styles.header_wrapper}>
        <div className={styles.header_wrapper_title}>
          <div className={styles.header}>{unitTitle}</div>
        </div>
        <div className={styles.header_right_panel}>
          <Button onClick={() => setShowFilters(!showFilters)} className="button_filters">
            <SettingsDevIcon />
            <span>{showFilters ? "Скрыть фильтры" : "Фильтры"}</span>
          </Button>
          <PeriodSelection />
          <div className={styles.header_partition} />
          {unitId === units[0]?.id ? (
            <Button type="primary" ghost className="create_target" onClick={() => setVisibleCompanyTarget(true)}>
              Создать цель
            </Button>
          ) : null}
          <div className="approval_button">
            {visibleWarningAlert ? (
              <>
                <Button className="approval_btn" type="primary" onClick={showModalNotification}>
                  Подтвердить отправку
                </Button>
                <NotificationCustomModal isModalVisible={isModalVisible} handleCancel={handleCancelModalNotification} notificationTitle={notificationTitle} notificationContent={notificationContent} />
              </>
            ) : (
              <Button onClick={toggleWarningAlert} className="btn_approval" type="primary">
                Отправить на согласование
              </Button>
            )}

            {visibleWarningAlert && (
              <Button type="primary" className="btn_cancellation" onClick={toggleWarningAlert}>
                Отменить
              </Button>
            )}
          </div>
        </div>
      </div>
      <FilterUnit showFilters={showFilters} />
      <div className={styles.table_header}>
        <div className={styles.table_name}>
          <ToggleTargetsReport nameBtnOne="Дерево целей" nameBtnTwo="Отчёт" />
        </div>
        {(companyTargets.length > 0 || unConnected.length > 0) && (
          <>
            {openPanels.length > 0 ? (
              <div role="button" tabIndex={0} onKeyPress={undefined} className={styles.global_icon_style} onClick={toggleGlobalAccordion}>
                <img src={globalMinus} alt="globalMinus" />
              </div>
            ) : (
              <div role="button" tabIndex={0} onKeyPress={undefined} className={styles.global_icon_style} onClick={toggleGlobalAccordion}>
                <img src={globalPlus} alt="globalPlus" />
              </div>
            )}
          </>
        )}
      </div>
      <Row>
        <Col xs={24}>
          {(companyTargets.length > 0 && filtersFil.length > 0) || (unConnected.length > 0 && filtersFil.length > 0) ? (
            <div>
              {companyTargets
                && companyTargets.map((companyTarget) => (
                  <AccordionItem
                    unitId={unitId}
                    key={companyTarget.id}
                    openPanels={openPanels}
                    setOpenPanels={setOpenPanels}
                    openPanelsItem={openPanelsItem}
                    setOpenPanelsItem={setOpenPanelsItem}
                    open={open}
                    companyTargets={companyTargets}
                    item={companyTarget}
                    checkStatus={checkStatus}
                    filters={filtersFil}
                    visibleWarningAlert={visibleWarningAlert}
                    sendDeleteTarget={sendDeleteTarget}
                    isUnitCompany={isUnitCompany}
                    isActiveStatusPeriod={isActiveStatusPeriod}
                  />
                ))}
              {unConnected.length > 0 && filtersFil.length > 0 && !isUnitCompany && (
                <Collapse
                  expandIconPosition="right"
                  expandIcon={({ isActive }) => (isActive ? unConnected.length > 0 && <img src={MinusSquare} alt="MinusSquare" /> : unConnected.length > 0 && <img src={PlusSquare} alt="PlusSquare" />)}
                  onChange={open(unConnected, setOpenPanels)}
                  activeKey={openPanels}
                  className={styles.accordion}
                >
                  <CreateTargetDrawer
                    openPanels={openPanels}
                    setOpenPanels={setOpenPanels}
                    companyTargets={companyTargets}
                    visibleTarget={visible11}
                    setVisibleTargetFunc={setVisible11}
                    unitId={unitId}
                  />
                  <Collapse.Panel
                    className={classNames(styles.accordion_item, {
                      notIncludeStatus: !filtersFil.includes(StatusEnums.CAN_STYLE)
                    })}
                    header={(
                      <div role="button" tabIndex={0} className={styles.accordion_header_un}>
                        <img className={styles.targetImg} src={targetImg} alt="targetImg" />
                        Несвязанные цели
                      </div>
                    )}
                    extra={
                      isActiveStatusPeriod && (
                        <>
                          <Button
                            className="hidden_icons"
                            type="link"
                            onClick={(event) => {
                              setVisible11(true);
                              event.stopPropagation();
                            }}
                          >
                            <img src={PlusIcon} alt="PlusIcon" className={styles.hidden_icons_style} />
                          </Button>
                        </>
                      )
                    }
                    key={Number(666999)}
                  >
                    <CreateKeyTargetDrawer
                      openPanelsItem={openPanelsItem}
                      setOpenPanelsItem={setOpenPanelsItem}
                      currentTargetId={currentTargetId}
                      visibleTarget={visible22}
                      setVisibleTargetFunc={setVisible22}
                      targetTitle={secondTitle}
                    />
                    {keyTarget && (
                      <UpdateKeyTargetDrawer
                        unitId={unitId}
                        companyTargetStatus="active"
                        objectiveId={unconObjectiveKeyResultIdDrawer!}
                        objectiveTitle={secondTitle}
                        objectiveStatus={objectiveStatus}
                        keyTarget={keyTarget}
                        visibleTarget={visibleUpdateKeyTargetDrawer}
                        setVisibleTargetFunc={setVisibleUpdateKeyTargetDrawer}
                      />
                    )}
                    {keyTarget && (
                      <DeleteKeyTargetDrawer
                        sendDeleteKeyTarget={sendDeleteTarget}
                        setCurrentKeyTargetId={setCurrentKeyTargetId}
                        currentKeyTargetId={currentKeyTragetId}
                        objectiveTitle={secondTitle}
                        keyTargetName={keyTarget}
                        visibleDeleteKeyTargetDrawer={visibleDeleteKeyTargetDrawer}
                        setVisibleDeleteKeyTargetDrawer={setVisibleDeleteKeyTargetDrawer}
                      />
                    )}
                    {targetDelete && (
                      <DeleteTargetDrawer
                        sendDeleteTarget={sendDeleteTarget}
                        target={targetDelete}
                        visibleDeleteTargetDrawer={visibleDeleteTargetDrawer}
                        setVisibleDeleteTargetDrawer={setVisibleDeleteTargetDrawer}
                      />
                    )}
                    {keyTarget && (
                      <CreateFactKeyResult
                        keyResultTarget={keyTarget}
                        visibleCreateKeyResult={visibleKeyResultDrawer}
                        setVisibleKeyResultDrawer={setVisibleKeyResultDrawer}
                        setVisibleEditFact={setVisibleEditFact}
                        setCurrentFact={setCurrentFact}
                      />
                    )}

                    <UpdateTargetDrawer
                      item={itemTarget}
                      parentTargetStatus="active"
                      unitId={unitId}
                      visibleTarget={visibleUpdateTargetDrawer}
                      setVisibleTargetFunc={setVisibleUpdateTargetDrawer}
                      companyTargets={companyTargets}
                      companyTargetName={secondTitle}
                    />
                    {unConnected.map((it: any) => (
                      <div className="accordion_item_list" key={it.id}>
                        <Collapse
                          onChange={open(it.subTasks, setUnconcOpenPanels)}
                          activeKey={unconcOpenPanels}
                          expandIconPosition="right"
                          className={styles.accordion}
                          expandIcon={({ isActive }) => (isActive ? it.subTasks && <img src={MinusSquare} alt="MinusSquare" /> : it.subTasks && <img src={PlusSquare} alt="PlusSquare" />)}
                        >
                          <Collapse.Panel
                            className={classNames({
                              draftSecondStatus: !filtersFil.includes(StatusEnums.CAN_STYLE) && it.status === StatusEnums.DRAFT && filtersFil.includes(it.status),
                              reviewSecondStatus: !filtersFil.includes(StatusEnums.CAN_STYLE) && it.status === StatusEnums.REVIEW && filtersFil.includes(it.status),
                              rejectedSecondStatus: !filtersFil.includes(StatusEnums.CAN_STYLE) && it.status === StatusEnums.REJECTED && filtersFil.includes(it.status),
                              activeSecondStatus: !filtersFil.includes(StatusEnums.CAN_STYLE) && it.status === StatusEnums.ACTIVE && filtersFil.includes(it.status),
                              outdateSecondStatus: !filtersFil.includes(StatusEnums.CAN_STYLE) && it.status === StatusEnums.OUTDATE && filtersFil.includes(it.status),
                              deletedSecondStatus: !filtersFil.includes(StatusEnums.CAN_STYLE) && it.status === StatusEnums.DELETED && filtersFil.includes(it.status),
                              notIncludeSecondStatus: !filtersFil.includes(StatusEnums.CAN_STYLE) && !filtersFil.includes(it.status)
                            })}
                            header={(
                              <AccordionHeader checkStatus={checkStatus} it={it} type="unconnected-target">
                                <div>
                                  {`${it.name}`}
                                  <Tooltip placement="right" title="Цель">
                                    <img className={styles.targetImg} src={targetImg} alt="targetImg" />
                                  </Tooltip>
                                </div>
                              </AccordionHeader>
                            )}
                            extra={
                              isActiveStatusPeriod && (
                                <>
                                  <Tooltip placement="right" title="Создать КР">
                                    <Button
                                      className="hidden_icons"
                                      type="link"
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        setSecondTitle(it.name);
                                        setVisible22(true);
                                        setCurrentTargetId(it.id);
                                      }}
                                    >
                                      <img src={PlusIcon} alt="PlusIcon" className={styles.hidden_icons_style} />
                                    </Button>
                                  </Tooltip>

                                  <Tooltip placement="right" title="Редактировать цель">
                                    <Button
                                      className="hidden_icons"
                                      type="link"
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        setItemTarget(it);
                                        if (it.status !== StatusEnums.REJECTED) setVisibleUpdateTargetDrawer(true);
                                        if (it.status === StatusEnums.REJECTED) checkStatus(it, "unconnected-target");
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
                                          setTargetDelete(it);
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
                            <div className="accordion_item_list unConnectedListItem">
                              <Collapse
                                onChange={setOpenPanelsItem}
                                className={classNames(styles.accordion)}
                                expandIconPosition="right"
                                activeKey={openPanelsItem}
                                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 270 : 90} />}
                              >
                                {it.subTasks
                                  && it.subTasks.map((second: any) => (
                                    <ul key={second.id}>
                                      <>
                                        <li
                                          className={classNames([styles.specialLi], {
                                            draftThirdStatus: !filtersFil.includes(StatusEnums.CAN_STYLE) && second.status === StatusEnums.DRAFT && filtersFil.includes(second.status),
                                            reviewThirdStatus: !filtersFil.includes(StatusEnums.CAN_STYLE) && second.status === StatusEnums.REVIEW && filtersFil.includes(second.status),
                                            rejectedThirdStatus: !filtersFil.includes(StatusEnums.CAN_STYLE) && second.status === StatusEnums.REJECTED && filtersFil.includes(second.status),
                                            activeThirdStatus: !filtersFil.includes(StatusEnums.CAN_STYLE) && second.status === StatusEnums.ACTIVE && filtersFil.includes(second.status),
                                            outdateThirdStatus: !filtersFil.includes(StatusEnums.CAN_STYLE) && second.status === StatusEnums.OUTDATE && filtersFil.includes(second.status),
                                            deletedThirdStatus: !filtersFil.includes(StatusEnums.CAN_STYLE) && second.status === StatusEnums.DELETED && filtersFil.includes(second.status),
                                            notIncludeThirdStatus: !filtersFil.includes(StatusEnums.CAN_STYLE) && !filtersFil.includes(second.status)
                                          })}
                                          style={{ display: "flex" }}
                                        >
                                          <AccordionHeader checkStatus={checkStatus} it={second} thirdLeveLClass type="unconnected-key-target">
                                            {second.name && second.name}
                                            <Tooltip placement="right" title="Цель">
                                              <img className={styles.targetImgKr} src={targetImgKr} alt="targetImgKr" />
                                            </Tooltip>
                                          </AccordionHeader>

                                          {isActiveStatusPeriod && (
                                            <span className={styles.btn_wrapper}>
                                              {second.status !== StatusEnums.ACTIVE ? (
                                                <Button className="hidden_icons" type="link">
                                                  {!visibleWarningAlert && <img src={flag} alt="flag" className={styles.icon_disable} />}
                                                </Button>
                                              ) : (
                                                <Tooltip placement="right" title="Внести факт КР">
                                                  <Button
                                                    onClick={(event) => {
                                                      event.stopPropagation();
                                                      setKeyTarget(second);
                                                      setVisibleKeyResultDrawer(true);
                                                    }}
                                                    className="hidden_icons"
                                                    type="link"
                                                  >
                                                    {!visibleWarningAlert && <img src={flag} alt="flag" className={styles.hidden_icons_style} />}
                                                  </Button>
                                                </Tooltip>
                                              )}
                                              <Tooltip placement="right" title="Редактировать КР">
                                                <Button
                                                  className="hidden_icons"
                                                  type="link"
                                                  onClick={(event) => {
                                                    event.stopPropagation();
                                                    setKeyTarget(second);
                                                    setSecondTitle(it.name);
                                                    setUnconObjectiveKeyResultIdDrawer(Number(second.id));
                                                    setObjectiveStatus(it.status);
                                                    if (it.status !== StatusEnums.REJECTED) setVisibleUpdateKeyTargetDrawer(true);
                                                    if (it.status === StatusEnums.REJECTED) checkStatus(it, "unconnected-key-target");
                                                  }}
                                                >
                                                  <img src={EditIcon} alt="EditIcon" className={styles.hidden_icons_style} />
                                                </Button>
                                              </Tooltip>
                                              <Tooltip placement="right" title="Удалить КР">
                                                <Button
                                                  className="hidden_icons"
                                                  type="link"
                                                  onClick={(event) => {
                                                    event.stopPropagation();
                                                    setKeyTarget(second);
                                                    setSecondTitle(it.name);
                                                    setUnconObjectiveKeyResultIdDrawer(Number(second.id));
                                                    setObjectiveStatus(it.status);
                                                    setVisibleDeleteKeyTargetDrawer(true);
                                                  }}
                                                >
                                                  <img src={DeleteIcon} alt="DeleteIcon" className={styles.hidden_icons_style} />
                                                </Button>
                                              </Tooltip>
                                            </span>
                                          )}
                                        </li>
                                      </>
                                    </ul>
                                  ))}
                              </Collapse>
                            </div>
                          </Collapse.Panel>
                        </Collapse>
                      </div>
                    ))}
                  </Collapse.Panel>
                </Collapse>
              )}
            </div>
          ) : (
            <div>Ничего не найдено - измените фильтры.</div>
          )}
          {!hasAnyObjectives.length && !(unConnected.length > 0) ? (
            <EmptyObjectivesInformationAlert
              messageAlert="Цели и ключевые результаты пока не были добавлены. Вы можете создать цель."
              descriptionAlert=" "
              setVisibleCompanyTarget={setVisibleCompanyTarget}
            />
          ) : null}
          <CreateCompanyTargetDrawer visibleCompanyTarget={visibleCompanyTarget} setVisibleCompanyTarget={setVisibleCompanyTarget} unitId={unitId} isUnitCompany={isUnitCompany} />
          <AgreementOnTargetDrower
            visibleAgreement={visibleAgreement}
            setVisibleAgreement={setVisibleAgreement}
            currentTargetReview={currentTargetReview}
            currentParentTarget={currentParentTarget}
            currentTargetType={currentTargetType}
            unitId={unitId}
            companyTargets={companyTargets}
          />
          <ViewingDrawer
            visibleViewing={visibleViewing}
            setVisibleViewing={setVisibleViewing}
            currentTargetReview={currentTargetReview}
            currentParentTarget={currentParentTarget}
            currentTargetType={currentTargetType}
            companyTargets={companyTargets}
          />
          {keyTarget && <EditFact keyResultTarget={keyTarget} visibleEditFact={visibleEditFact} setVisibleEditFact={setVisibleEditFact} currentFact={currentFact} setCurrentFact={setCurrentFact} />}
        </Col>
      </Row>
    </div>
  );
};

export default Accordion;
