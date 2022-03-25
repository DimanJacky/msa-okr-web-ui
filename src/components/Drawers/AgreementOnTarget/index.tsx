import React, { useEffect, useState } from "react";
import {
  Button, Col, Drawer, Form, Input, Row, Select, Space
} from "antd";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
  checkSTatusReviewType, FetchingKeyTargetType, FetchingTargetType, postAddingTargetObj
} from "../../Accordion/types";
import {
  ActionsEnums,
  companyObjectivesType,
  entityTypeEnums,
  entityTypeUppercaseEnums,
  getTargetList,
  objectiveSubTaskType,
  postActionsKeyTarget,
  postActionsTarget,
  updateKeyTarget,
  updateTarget
} from "../../Accordion/actions";
import styles from "../index.module.css";
import "../../Accordion/style.css";
import CommentsComponent from "../../../modules/CommentsComponent";
import { StatusEnums } from "../../../store/filters/filters";
import KeyResultInfo from "../../../modules/KeyResultInfo";
import { getCommentsList } from "../../../store/commentsReducer/index";

import checkAccess from "../../../utils/checks";
import { RoleEnums } from "../../../store/User/type";
import { IObjectives } from "../../Accordion/reducer";
import FormItemsEditKeyTarget from "../../../modules/FormItemsEditKeyTarget";
import DrawerHeader from "../../../modules/DrawerHeader";

type PropsType = {
  visibleAgreement: boolean;
  setVisibleAgreement: any;
  currentTargetReview: checkSTatusReviewType | objectiveSubTaskType | null;
  currentParentTarget: postAddingTargetObj | null | companyObjectivesType | undefined;
  currentTargetType: null | string;
  unitId: number;
  companyTargets: IObjectives[];
};

const AgreementOnTargetDrower = ({
  visibleAgreement, setVisibleAgreement, currentTargetReview, currentParentTarget, currentTargetType, unitId, companyTargets
}: PropsType) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const [visibleComments, setVisibleComments] = useState(false);
  const [toggleFiltering, setToggleFiltering] = useState(true);
  const [commentsValue, setCommentsValue] = useState("");
  const [nameValue, setNameValue] = useState("");
  const [companyValue, setCompanyValue] = useState("");
  const [valuePlan, setValuePlan] = useState<string | undefined>();
  const [valueChallenge, setValueChallenge] = useState<string | undefined>();
  const [valueDescription, setValueDescription] = useState<string | undefined>();
  const [isInteger, setIsInteger] = useState<boolean>(false);
  const [isErrorDescription, setIsErrorDescription] = useState<boolean>(false);
  const [isErrorPlan, setIsErrorPlan] = useState<boolean>(false);
  const [isErrorChallenge, setIsErrorChallenge] = useState<boolean>(false);
  const [savedToSending, setSavedToSending] = useState<boolean>(false);

  const comments = useAppSelector((state) => state.commentsReducer.comments);
  const isEmptyComments = !commentsValue.length || commentsValue.length === 0;
  const isKeyTarget = currentTargetType === "key-target" || currentTargetType === "unconnected-key-target";
  const isAccess = checkAccess(user.role, [RoleEnums.OKR_MASTER, RoleEnums.OKR_ADMIN]);
  const isRejectStatus = currentTargetReview?.status === StatusEnums.REJECTED;
  const isDisableApproveButton = !isAccess || isRejectStatus;
  const isDisableDeviationButton = (isEmptyComments && !isKeyTarget) || !isAccess || (isKeyTarget && !isEmptyComments);
  const isParentTarget = companyTargets.some((item) => item.id === currentTargetReview?.id);
  const isUnConnected = currentTargetType === "unconnected-target" || currentTargetType === "unconnected-key-target";
  const changeFiltering = () => setToggleFiltering(!toggleFiltering);
  const [isChangeInputs, setIsChangeInputs] = useState(isDisableApproveButton);
  const defaultDescription = currentTargetReview?.description ? currentTargetReview.description : valueDescription;
  const textButtonApprove = isRejectStatus ? "Отправить на согласование" : "Согласовать";

  let initialValues: any = {
    targetName: currentTargetReview?.name,
    targetNameCompany: currentParentTarget?.name
  };

  if (isKeyTarget) {
    initialValues = {
      targetNameCompany: currentParentTarget?.name,
      targetName: currentTargetReview?.name,
      plan: currentTargetReview?.plan,
      challenge: currentTargetReview?.challenge,
      description: currentTargetReview?.description
    };
  }

  let nameData = {
    name: "Название цели",
    placeholder: "Введите название цели"
  };

  if (isParentTarget && !isUnConnected) {
    nameData = {
      name: "Цель компании",
      placeholder: "Введите название цели"
    };
  }

  if (isKeyTarget) {
    nameData = {
      name: "Название ключевого результата",
      placeholder: "Введите название ключевого результата"
    };
  }

  const checkChangeInput = (formData: any) => {
    let isChange = false;

    if (!valueDescription) setValueDescription(formData.description);
    if (formData.targetNameCompany !== currentParentTarget?.name) isChange = true;
    if (formData.targetName !== currentTargetReview?.name) isChange = true;
    if (isKeyTarget) {
      if (String(formData.plan) !== String(currentTargetReview?.plan)) isChange = true;
      if (String(formData.challenge) !== String(currentTargetReview?.challenge)) isChange = true;
      if (valueDescription !== currentTargetReview?.description) isChange = true;
    }

    return isChange;
  };

  const onClose = () => {
    setVisibleAgreement(false);
    setVisibleComments(false);
    setToggleFiltering(true);
    setCommentsValue("");
    form.resetFields();
  };

  const getFullComments = () => {
    const entityType = entityTypeUppercaseEnums[0];
    if (currentTargetReview) dispatch(getCommentsList({ entityType, entityIdList: currentTargetReview.id, last: toggleFiltering }));
  };

  const createTargets = (action: ActionsEnums, id: number) => {
    const entityType = entityTypeEnums.OBJECTIVE;
    const target = [
      {
        entityType,
        entityId: id,
        action,
        comment: commentsValue
      }
    ];
    return { target, unitId };
  };

  const createKeyTargets = (action: ActionsEnums, id: number, objectiveId: number) => {
    const entityType = entityTypeEnums.KEYRESULT;
    const target = [
      {
        entityType,
        entityId: id,
        action,
        comment: commentsValue
      }
    ];

    return { target, objectiveId };
  };

  const changeTargetAgreement = (action: ActionsEnums, isSave?: boolean) => {
    const formData = form.getFieldsValue(true);
    let parentId = currentTargetReview?.parentId ? currentTargetReview.parentId : null;
    const parentObjective = companyTargets?.find((it) => it.name === formData.targetNameCompany);
    let status = StatusEnums.REVIEW;

    if (isSave && isRejectStatus) status = StatusEnums.REJECTED;
    if (parentObjective) parentId = parentObjective.id;
    if (currentTargetReview && !isRejectStatus) dispatch(postActionsTarget(createTargets(action, currentTargetReview.id)));
    if (currentTargetReview && isRejectStatus) {
      const target: FetchingTargetType = {
        id: currentTargetReview.id,
        name: formData.targetName,
        parentId,
        status,
        objectiveTypeId: currentTargetReview.objectiveTypeId,
        unitId,
        objectivePeriodId: Number(localStorage.getItem("periodId"))
      };

      dispatch(updateTarget({ objectiveId: currentTargetReview.id, target }));
      form.resetFields();
    }
  };

  const changeKeyTargetAgreement = (action: ActionsEnums, isSave?: boolean) => {
    const formData = form.getFieldsValue(true);
    let status = StatusEnums.REVIEW;

    if (isSave && isRejectStatus) status = StatusEnums.REJECTED;
    if (currentTargetReview && !isRejectStatus) dispatch(postActionsKeyTarget(createKeyTargets(action, currentTargetReview.id, currentTargetReview.objectiveId)));
    if (currentTargetReview && isRejectStatus) {
      const keyTarget: FetchingKeyTargetType = {
        id: currentTargetReview.id,
        objectiveId: currentTargetReview.objectiveId,
        name: formData.targetName,
        responsiblePersonId: 1,
        status,
        plan: formData.plan,
        challenge: formData.challenge,
        keyResultTypeId: 2,
        description: valueDescription
      };

      const keyTargetFetchData = {
        objectiveId: currentTargetReview.objectiveId,
        keyResultId: keyTarget.id,
        keyTarget
      };

      dispatch(updateKeyTarget(keyTargetFetchData));
      form.resetFields();
      dispatch(getTargetList(unitId));
    }
  };

  const agreementProgress = (type: string, isSave?: boolean) => {
    if (type === "agreement" && currentTargetReview?.status === StatusEnums.OUTDATE) {
      const action = ActionsEnums.APPROVESOFTDELETE;
      switch (currentTargetType) {
        case "target": {
          changeTargetAgreement(action);
          break;
        }
        case "unconnected-target": {
          changeTargetAgreement(action);
          break;
        }
        case "key-target": {
          changeKeyTargetAgreement(action);
          break;
        }
        case "unconnected-key-target": {
          changeKeyTargetAgreement(action);
          break;
        }
        default:
          break;
      }
      onClose();
    } else if (type === "agreement" && currentTargetReview?.status === StatusEnums.REJECTED) {
      const action = ActionsEnums.REVIEW;
      setSavedToSending(true);
      switch (currentTargetType) {
        case "target": {
          changeTargetAgreement(action, isSave);
          break;
        }
        case "unconnected-target": {
          changeTargetAgreement(action, isSave);
          break;
        }
        case "key-target": {
          changeKeyTargetAgreement(action, isSave);
          break;
        }
        case "unconnected-key-target": {
          changeKeyTargetAgreement(action, isSave);
          break;
        }
        default:
          break;
      }
      onClose();
    } else if (type === "agreement") {
      const action = ActionsEnums.APPROVE;
      switch (currentTargetType) {
        case "target": {
          changeTargetAgreement(action);
          break;
        }
        case "unconnected-target": {
          changeTargetAgreement(action, isSave);
          break;
        }
        case "key-target": {
          changeKeyTargetAgreement(action, isSave);
          break;
        }
        case "unconnected-key-target": {
          changeKeyTargetAgreement(action, isSave);
          break;
        }
        default:
          break;
      }
      onClose();
    } else if (type === "deviation" && currentTargetReview?.status === StatusEnums.OUTDATE) {
      const action = ActionsEnums.REJECTSOFTDELETE;
      switch (currentTargetType) {
        case "target": {
          changeTargetAgreement(action);
          break;
        }
        case "unconnected-target": {
          changeTargetAgreement(action);
          break;
        }
        case "key-target": {
          changeKeyTargetAgreement(action);
          break;
        }
        case "unconnected-key-target": {
          changeKeyTargetAgreement(action);
          break;
        }
        default:
          break;
      }
      onClose();
    } else if (type === "deviation" && currentTargetReview?.status === StatusEnums.REVIEW) {
      const action = ActionsEnums.REJECT;
      setSavedToSending(false);
      switch (currentTargetType) {
        case "target": {
          changeTargetAgreement(action);
          break;
        }
        case "unconnected-target": {
          changeTargetAgreement(action);
          break;
        }
        case "key-target": {
          changeKeyTargetAgreement(action);
          break;
        }
        case "unconnected-key-target": {
          changeKeyTargetAgreement(action);
          break;
        }
        default:
          break;
      }
      onClose();
    } else if (type === "deviation") {
      const action = ActionsEnums.REJECT;
      switch (currentTargetType) {
        case "target": {
          changeTargetAgreement(action);
          break;
        }
        case "unconnected-target": {
          changeTargetAgreement(action);
          break;
        }
        case "key-target": {
          changeKeyTargetAgreement(action);
          break;
        }
        case "unconnected-key-target": {
          changeKeyTargetAgreement(action);
          break;
        }
        default:
          break;
      }
      onClose();
    }
  };

  const handleChangeName = (e: React.ChangeEvent<HTMLTextAreaElement>) => setNameValue(e.currentTarget.value);
  const handleChangeComment = (e: React.ChangeEvent<HTMLTextAreaElement>) => setCommentsValue(e.currentTarget.value);
  const handleSelect = (option: string) => setCompanyValue(option);
  const toggleShowComments = () => setVisibleComments(!visibleComments);

  useEffect(() => {
    form.resetFields();
  }, [currentTargetReview]);

  useEffect(() => {
    if (comments) getFullComments();
    if (!isRejectStatus) setIsChangeInputs(false);
    if (isRejectStatus) {
      const formData = form.getFieldsValue(true);
      setIsChangeInputs(!checkChangeInput(formData));
    }
  }, [valuePlan, valueChallenge, valueDescription, nameValue, companyValue, currentTargetReview]);

  return (
    <div className="agreement_drower">
      <Drawer
        title={currentTargetReview && <DrawerHeader status={currentTargetReview.status} title={currentTargetReview?.name} />}
        width={509}
        onClose={onClose}
        visible={visibleAgreement}
        footer={(
          <Space>
            <Button onClick={() => agreementProgress("agreement")} size="large" className={styles.button_drawer_creature} disabled={isChangeInputs && !savedToSending}>
              {textButtonApprove}
            </Button>
            {!isRejectStatus && (
              <Button onClick={() => agreementProgress("deviation")} size="large" className={styles.btn_cancel} disabled={isDisableDeviationButton}>
                Отклонить
              </Button>
            )}
            {isRejectStatus && (
              <>
                <Button onClick={() => agreementProgress("agreement", true)} size="large" className={styles.button_drawer_creature} disabled={isChangeInputs}>
                  Сохранить
                </Button>
                <Button onClick={onClose} size="large" className={styles.button_drawer_clear}>
                  Отменить
                </Button>
              </>
            )}
          </Space>
        )}
        footerStyle={{
          background: "#EFEFFE",
          height: "72px"
        }}
        headerStyle={{ padding: 0 }}
      >
        <Form form={form} layout="vertical" hideRequiredMark initialValues={initialValues}>
          {isKeyTarget && !isRejectStatus && <KeyResultInfo currentTargetReview={currentTargetReview} />}
          {!isParentTarget && !(!isRejectStatus && isKeyTarget) && (
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="targetNameCompany"
                  label="Цель компании"
                  rules={[
                    {
                      required: true,
                      message: "Введите название цели"
                    }
                  ]}
                >
                  {currentTargetReview?.status === StatusEnums.REJECTED && !isKeyTarget ? (
                    <Select placeholder="Цели компании" onSelect={handleSelect}>
                      {companyTargets.map((i) => (
                        <Select.Option key={i.id} value={i.name}>
                          {i.name}
                        </Select.Option>
                      ))}
                      <Select.Option value="Несвязанные цели">Несвязанные цели</Select.Option>
                    </Select>
                  ) : (
                    <div>
                      <span>{currentParentTarget ? currentParentTarget.name : null}</span>
                    </div>
                  )}
                </Form.Item>
              </Col>
            </Row>
          )}
          {(isRejectStatus || !isKeyTarget) && (
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="targetName"
                  label={nameData.name}
                  rules={[
                    {
                      required: true,
                      message: nameData.name
                    }
                  ]}
                >
                  {currentTargetReview?.status === StatusEnums.REJECTED ? (
                    <Input.TextArea style={{ borderRadius: "10px" }} onChange={handleChangeName} rows={2} placeholder={nameData.placeholder} />
                  ) : (
                    <div>{currentTargetReview ? currentTargetReview.name : null}</div>
                  )}
                </Form.Item>
              </Col>
            </Row>
          )}

          <Row gutter={16}>
            <Col span={24}>
              {currentTargetReview?.status === StatusEnums.REJECTED && isKeyTarget && (
                <FormItemsEditKeyTarget
                  valueDescription={defaultDescription}
                  setValueDescription={setValueDescription}
                  valuePlan={valuePlan}
                  setValuePlan={setValuePlan}
                  valueChallenge={valueChallenge}
                  setValueChallenge={setValueChallenge}
                  isErrorChallenge={isErrorChallenge}
                  setIsErrorChallenge={setIsErrorChallenge}
                  isInteger={isInteger}
                  setIsInteger={setIsInteger}
                  isErrorPlan={isErrorPlan}
                  setIsErrorPlan={setIsErrorPlan}
                  isErrorDescription={isErrorDescription}
                  setIsErrorDescription={setIsErrorDescription}
                />
              )}
              {!isKeyTarget && (
                <Form.Item name="reviewComment">
                  <CommentsComponent
                    changeFiltering={changeFiltering}
                    currentId={currentTargetReview?.id}
                    comments={comments}
                    titleComments="Комментарии"
                    visibleComments={visibleComments}
                    toggleShowComments={toggleShowComments}
                  >
                    <Input.TextArea value={commentsValue} style={{ borderRadius: "10px" }} rows={2} placeholder="Введите комментарий..." maxLength={2000} onChange={handleChangeComment} />
                  </CommentsComponent>
                </Form.Item>
              )}
            </Col>
          </Row>
        </Form>
      </Drawer>
    </div>
  );
};

export default AgreementOnTargetDrower;
