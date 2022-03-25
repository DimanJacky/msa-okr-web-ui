import React, { useEffect, useState } from "react";
import {
  Button, Col, Drawer, Form, Input, Row, Select, Space, Typography
} from "antd";
import DescriptionField from "../../Accordion/DescriptionField";
import { actionsTargetType, FetchingKeyTargetType } from "../../Accordion/types";
import {
  getTargetList, objectiveSubTaskType, recoverKeyTarget, updateKeyTarget
} from "../../Accordion/actions";
import { useAppDispatch, useAppSelector } from "../../../store";
import "./style.css";
import keyTargetData from "../../../constants/KeyTarget/const";
import styles from "../index.module.css";
import checkAccess from "../../../utils/checks";
import { RoleEnums } from "../../../store/User/type";
import { validateInput } from "../../../utils/validate";

type CreateKeyTargetDrawerPropsType = {
  unitId: number;
  companyTargetStatus: string;
  objectiveId: number;
  objectiveTitle: string;
  objectiveStatus: string;
  keyTarget: objectiveSubTaskType;
  visibleTarget: boolean;
  setVisibleTargetFunc: React.Dispatch<React.SetStateAction<boolean>>;
};

const UpdateKeyTargetDrawer = ({
  unitId, keyTarget, objectiveId, visibleTarget, setVisibleTargetFunc, objectiveTitle, companyTargetStatus, objectiveStatus
}: CreateKeyTargetDrawerPropsType) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const resetValues = () => {
    form.resetFields();
  };
  const getKeyTargetData = () => {
    resetValues();
    dispatch(getTargetList(unitId));
  };

  useEffect(() => {
    resetValues();
  }, [keyTarget]);

  const { Text } = Typography;
  const user = useAppSelector((state) => state.user);
  const [valuePlan, setValuePlan] = useState<string | undefined>();
  const [valueChallenge, setValueChallenge] = useState<string | undefined>();
  const [isInteger, setIsInteger] = useState<boolean>(false);
  const [isErrorDescription, setIsErrorDescription] = useState<boolean>(false);
  const [isErrorPlan, setIsErrorPlan] = useState<boolean>(false);
  const [isErrorChallenge, setIsErrorChallenge] = useState<boolean>(false);

  let descriptionStatus = keyTargetData.errorEmpty;
  let planStatus = keyTargetData.errorEmpty;
  let challengeStatus = keyTargetData.errorEmpty;

  if (isErrorDescription) {
    descriptionStatus = {
      validateStatus: "error",
      help: "Превышение количества символов"
    };
  }
  if (isInteger && isErrorPlan) planStatus = keyTargetData.errorInteger;
  if (isInteger && isErrorChallenge) challengeStatus = keyTargetData.errorInteger;

  const handleChangeSelect = (option: string) => {
    const isIntegerCondition = option === "pieces" || option === "people" || option === "certificates";
    setIsInteger(false);
    if (isIntegerCondition) setIsInteger(true);
  };

  const onClose = () => {
    setVisibleTargetFunc(false);
  };

  let totalValueDescription = keyTarget.description;
  const handleChangeValueDescription = (value: string) => {
    totalValueDescription = value;
  };

  const handleChangePlanInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = validateInput(event.target.value);
    setValuePlan(value);
    setIsErrorPlan(false);
    if (Number(value) % 1 !== 0) setIsErrorPlan(true);
  };

  const handleChangeChallengeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = validateInput(event.target.value);
    setValueChallenge(value);
    setIsErrorChallenge(false);
    if (Number(value) % 1 !== 0) setIsErrorChallenge(true);
  };

  const checkChangeInput = (formData: any) => {
    let isChange = false;

    if (formData.keyTargetName !== keyTarget.name) isChange = true;
    if (formData.plan !== keyTarget.plan) isChange = true;
    if (formData.challenge !== keyTarget.challenge) isChange = true;
    if (totalValueDescription !== keyTarget.description) isChange = true;

    return isChange;
  };

  const sendForm = (status: string) => {
    const formData = form.getFieldsValue(true);
    const changedKeyTarget: FetchingKeyTargetType = {
      id: keyTarget.id,
      objectiveId,
      name: formData.keyTargetName,
      responsiblePersonId: 1,
      status,
      plan: formData.plan,
      challenge: formData.challenge,
      keyResultTypeId: 2,
      description: totalValueDescription
    };
    const keyTargetFetchData = {
      objectiveId,
      keyResultId: keyTarget.id,
      keyTarget: changedKeyTarget
    };
    const recoverKeyTargetData: actionsTargetType[] = [
      {
        entityType: "keyresult",
        entityId: keyTarget.id,
        action: "recover"
      }
    ];

    if (status === "recover") {
      dispatch(recoverKeyTarget(recoverKeyTargetData));
      getKeyTargetData();
    } else if (checkChangeInput(formData)) {
      dispatch(updateKeyTarget(keyTargetFetchData));
      getKeyTargetData();
    }
    setVisibleTargetFunc(false);
  };

  const isPositiveNumber = (value: any) => +value >= 0 || value === undefined;
  const isAccess = checkAccess(user.role, [RoleEnums.OKR_MASTER, RoleEnums.OKR_ADMIN]);
  const isDisabledButtonSave = () => !isPositiveNumber(valuePlan) || !isPositiveNumber(valueChallenge) || (isInteger && isErrorPlan) || (isInteger && isErrorChallenge) || !isAccess;

  return (
    <>
      <Drawer
        title="Редактирование КР"
        className="editingKeyresult"
        width={509}
        onClose={onClose}
        visible={visibleTarget}
        footer={(
          <Space>
            {companyTargetStatus !== "deleted" && objectiveStatus !== "deleted" && keyTarget.status !== "deleted" && (
              <>
                <Button onClick={() => sendForm("draft")} size="large" className="btn_save" disabled={isDisabledButtonSave()}>
                  Сохранить
                </Button>
                <Button onClick={resetValues} size="large" className="btn_clear">
                  Очистить
                </Button>
              </>
            )}
            {companyTargetStatus !== "deleted" && objectiveStatus !== "deleted" && keyTarget.status === "deleted" && (
              <Button onClick={() => sendForm("recover")} size="large" className="btn_save" disabled={isDisabledButtonSave()}>
                Восстановить
              </Button>
            )}
          </Space>
        )}
        footerStyle={{
          background: "#EFEFFE",
          height: "72px"
        }}
        bodyStyle={{
          paddingBottom: 0,
          paddingTop: 24
        }}
      >
        <Form
          form={form}
          layout="vertical"
          hideRequiredMark
          initialValues={{
            targetName: objectiveTitle,
            keyTargetName: keyTarget.name,
            comment: "Поле пока не используется",
            plan: keyTarget.plan,
            challenge: keyTarget.challenge,
            description: keyTarget.description
          }}
        >
          <Space style={{ width: "100%" }} size={24} direction="vertical">
            <Row gutter={[24, 0]}>
              <Col span={24}>
                <Form.Item
                  name="keyTargetName"
                  label="Название ключевого результата"
                  rules={[
                    {
                      required: true,
                      message: "Введите название ключевого результата"
                    }
                  ]}
                >
                  {companyTargetStatus !== "deleted" && objectiveStatus !== "deleted" && keyTarget.status !== "deleted" ? (
                    <Input.TextArea style={{ borderRadius: "10px" }} rows={2} placeholder="Введите название ключевого результата" />
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column"
                      }}
                    >
                      <Text
                        style={{
                          fontSize: "16px",
                          lineHeight: "20px"
                        }}
                      >
                        {keyTarget.name}
                      </Text>
                    </div>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[24, 0]}>
              <Col span={24}>
                <Form.Item
                  name="targetName"
                  label="Название цели"
                  style={{
                    marginBottom: "0"
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column"
                    }}
                  >
                    <Text
                      style={{
                        fontSize: "16px",
                        lineHeight: "20px"
                      }}
                    >
                      {objectiveTitle}
                    </Text>
                  </div>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[24, 0]}>
              <Col span={24}>
                <Form.Item
                  name="description"
                  label="Описание"
                  validateStatus={descriptionStatus.validateStatus}
                  help={descriptionStatus.help}
                  style={{ marginBottom: "0" }}
                  rules={[
                    {
                      required: true,
                      message: "Комментарий"
                    }
                  ]}
                >
                  <DescriptionField handleChangeValueDescription={handleChangeValueDescription} defaultValue={keyTarget.description} setIsErrorDescription={setIsErrorDescription} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <div className="select-wrapper">
                  <Text className={styles.select_title}>Выберите единицы измерения</Text>
                  <Select onSelect={handleChangeSelect} className={styles.select_types} placeholder="Выберите из списка">
                    {keyTargetData.selectTypes.map((item) => (
                      <Select.Option key={item.id} value={item.type}>
                        {item.text}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
              </Col>
            </Row>
            <Row gutter={[24, 24]} style={{ marginTop: "24px" }}>
              <Col span={24}>
                <Form.Item
                  name="plan"
                  label="План"
                  style={{
                    marginBottom: "0",
                    borderRadius: "10px"
                  }}
                  validateStatus={planStatus.validateStatus}
                  help={planStatus.help}
                  rules={[
                    {
                      required: true,
                      message: "План"
                    },
                    {
                      validator(_, value) {
                        if (value >= 0) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error("Введите положительное значение"));
                      }
                    }
                  ]}
                >
                  {companyTargetStatus !== "deleted" && objectiveStatus !== "deleted" && keyTarget.status !== "deleted" ? (
                    <Input
                      type="number"
                      style={{
                        marginTop: "8px",
                        borderRadius: "10px"
                      }}
                      placeholder="Введите значение"
                      value={valuePlan}
                      onChange={handleChangePlanInput}
                      maxLength={10}
                    />
                  ) : (
                    <Input
                      disabled
                      style={{
                        marginTop: "8px",
                        borderRadius: "10px"
                      }}
                      placeholder="Введите значение"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[24, 0]} style={{ marginTop: "16px" }}>
              <Col span={24}>
                <Form.Item
                  name="challenge"
                  validateStatus={challengeStatus.validateStatus}
                  help={challengeStatus.help}
                  label="Вызов"
                  style={{ marginBottom: "0" }}
                  rules={[
                    {
                      required: true,
                      message: "Вызов"
                    },
                    {
                      validator(_, value) {
                        if (value >= 0) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error("Введите положительное значение"));
                      }
                    }
                  ]}
                >
                  {companyTargetStatus !== "deleted" && objectiveStatus !== "deleted" && keyTarget.status !== "deleted" ? (
                    <Input
                      type="number"
                      style={{
                        marginTop: "8px",
                        borderRadius: "10px"
                      }}
                      placeholder="Введите значение"
                      value={valueChallenge}
                      onChange={handleChangeChallengeInput}
                      maxLength={10}
                    />
                  ) : (
                    <Input
                      disabled
                      style={{
                        marginTop: "8px",
                        borderRadius: "10px"
                      }}
                      placeholder="Введите значение"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Space>
        </Form>
      </Drawer>
    </>
  );
};

export default UpdateKeyTargetDrawer;
