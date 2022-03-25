import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Button, Checkbox, Col, Drawer, Form, Input, Row, Select, Space, Typography
} from "antd";
import styles from "../index.module.css";
import DescriptionField from "../../Accordion/DescriptionField";
import { useAppDispatch, useAppSelector } from "../../../store";
import { postKeyTarget } from "../../Accordion/actions";
import { validateNumberInputMax } from "../../../utils/validate";
import keyTargetData from "../../../constants/KeyTarget/const";
import checkAccess from "../../../utils/checks";
import { RoleEnums } from "../../../store/User/type";
import {
  CHALLENGE_MAX, CHALLENGE_MIN, KEY_TARGET_SYMBOLS_MAX, PLAN_MAX, PLAN_MIN
} from "./constants";

type CreateKeyTargetDrawerPropsType = {
  targetTitle: string;
  visibleTarget: boolean;
  setVisibleTargetFunc: Dispatch<SetStateAction<boolean>>;
  currentTargetId: number | undefined;
  setOpenPanelsItem: Dispatch<SetStateAction<string | number[] | string[]>>;
  openPanelsItem: any;
};

type ErrorStatusType = {
  validateStatus: "" | "error" | "success" | "warning" | "validating" | undefined;
  help: string;
};

export type KeyTargetDataType = {
  selectTypes: { id: number; type: string; text: string }[];
  errorEmpty: ErrorStatusType;
  errorInteger: ErrorStatusType;
  errorDescription: ErrorStatusType;
};

const CreateKeyTargetDrawer = ({
  targetTitle, visibleTarget, setVisibleTargetFunc, currentTargetId, setOpenPanelsItem, openPanelsItem
}: CreateKeyTargetDrawerPropsType) => {
  const [form] = Form.useForm();
  const { Text } = Typography;

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const [valuePlan, setValuePlan] = useState<string | undefined>();
  const [valueChallenge, setValueChallenge] = useState<string | undefined>();
  const [unitTitle, setUnitTitle] = useState<string>("");
  const [isAdditionalKeyTarget, setIsAdditionalKeyTarget] = useState(false);
  const [unitDescriptios, setUnitDescriptios] = useState<string>("");
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

  const handleChangeValueName = (value: string) => {
    setUnitTitle(value);
  };

  const handleChangeValueDescription = (value: string) => {
    setUnitDescriptios(value);
  };

  const handleCheckbox = () => setIsAdditionalKeyTarget(!isAdditionalKeyTarget);
  const onClose = () => {
    setVisibleTargetFunc(false);
  };

  const handleChangeSelect = (option: string) => {
    const isIntegerCondition = option === "pieces" || option === "people" || option === "certificates";
    setIsInteger(false);
    if (isIntegerCondition) setIsInteger(true);
  };

  const resetValues = () => {
    form.resetFields();
    setValueChallenge("");
    setValuePlan("");
    setUnitDescriptios("");
    setUnitTitle("");
  };

  const handleChangePlanInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = validateNumberInputMax(event.target.value);
    setValuePlan(value);
    setIsErrorPlan(false);
    if (Number(value) % 1 !== 0) setIsErrorPlan(true);
  };

  const handleChangeChallengeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = validateNumberInputMax(event.target.value);
    setValueChallenge(value);
    setIsErrorChallenge(false);
    if (Number(value) % 1 !== 0) setIsErrorChallenge(true);
  };

  const isPositiveNumber = (value: any) => +value >= 0 || value === undefined;
  const isAccess = checkAccess(user.role, [RoleEnums.OKR_MASTER, RoleEnums.OKR_ADMIN]);
  const isDisabledButtonSave = () => !isPositiveNumber(valuePlan) || !isPositiveNumber(valueChallenge) || (isInteger && isErrorPlan) || (isInteger && isErrorChallenge) || !isAccess;

  const configureAddingKeyResult = () => {
    const params = {
      objectiveId: currentTargetId,
      name: unitTitle,
      status: "draft",
      description: unitDescriptios,
      plan: valuePlan,
      challenge: valueChallenge,
      keyResultTypeId: 2
    };
    dispatch(postKeyTarget(params));
    onClose();
    form.resetFields();
    setValueChallenge("");
    setValuePlan("");
    setUnitDescriptios("");
    setUnitTitle("");
    const extra = openPanelsItem.find((id: any) => id === currentTargetId);
    if (!extra) {
      setTimeout(() => {
        setOpenPanelsItem((oldValue: any) => [...oldValue, currentTargetId]);
      });
    }
    if (isAdditionalKeyTarget) setTimeout(() => setVisibleTargetFunc(true), 500);
  };

  return (
    <>
      <Drawer
        className="createFactkeyresult"
        title="Создание ключевого результата"
        width={509}
        onClose={onClose}
        visible={visibleTarget}
        footer={(
          <Space>
            <Button onClick={configureAddingKeyResult} size="large" className={styles.button_drawer_creature} disabled={isDisabledButtonSave()}>
              Создать
            </Button>
            <Button onClick={resetValues} size="large" className={styles.button_drawer_clear}>
              Очистить
            </Button>
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
        <Form form={form} layout="vertical" hideRequiredMark>
          <Space className={styles.space} size={24} direction="vertical">
            <Row gutter={[24, 0]}>
              <Col span={24}>
                <Form.Item
                  name="targetName"
                  className={styles.element_drawer}
                  rules={[
                    {
                      required: true,
                      message: "Введите название ключевого результата"
                    }
                  ]}
                >
                  <div>
                    <Text
                      style={{
                        fontSize: "14px",
                        marginBottom: "8px",
                        color: "#7B7B98"
                      }}
                    >
                      Название ключевого результата
                    </Text>
                    <Input.TextArea
                      onChange={(e) => handleChangeValueName(e.currentTarget.value)}
                      style={{
                        marginTop: "8px",
                        borderRadius: "10px"
                      }}
                      rows={3}
                      placeholder="Введите название ключевого результата"
                      maxLength={KEY_TARGET_SYMBOLS_MAX}
                    />
                  </div>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[24, 0]}>
              <Col span={24}>
                <Form.Item name="target" className={styles.element_drawer}>
                  <div className={styles.text_column_drawer}>
                    <Text
                      style={{
                        fontSize: "14px",
                        marginBottom: "8px",
                        color: "#7B7B98"
                      }}
                    >
                      Название цели
                    </Text>
                    <Text
                      style={{
                        fontSize: "16px",
                        lineHeight: "20px"
                      }}
                    >
                      {targetTitle}
                    </Text>
                  </div>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[24, 0]}>
              <Col span={24}>
                <Form.Item
                  name="targetDescription"
                  className={styles.element_drawer}
                  validateStatus={descriptionStatus.validateStatus}
                  help={descriptionStatus.help}
                  rules={[
                    {
                      required: true,
                      message: "Введите описание"
                    }
                  ]}
                >
                  <div>
                    <Text
                      style={{
                        fontSize: "14px",
                        marginBottom: "8px",
                        color: "#7B7B98"
                      }}
                    >
                      Описание
                    </Text>
                    <DescriptionField handleChangeValueDescription={handleChangeValueDescription} defaultValue="" setIsErrorDescription={setIsErrorDescription} />
                  </div>
                </Form.Item>
              </Col>
            </Row>
          </Space>
          <Row gutter={[24, 24]}>
            <Col span={24} className="select-wrapper">
              <Text className={styles.select_title}>Выберите единицы измерения</Text>
              <Select onSelect={handleChangeSelect} className={styles.select_types} placeholder="Выберите из списка">
                {keyTargetData.selectTypes.map((item) => (
                  <Select.Option key={item.id} value={item.type}>
                    {item.text}
                  </Select.Option>
                ))}
              </Select>
            </Col>
          </Row>
          <Row gutter={[24, 24]} style={{ marginTop: "24px" }}>
            <Col span={24}>
              <Form.Item
                name="targetPlan"
                validateStatus={planStatus.validateStatus}
                help={planStatus.help}
                style={{
                  marginBottom: "0",
                  borderRadius: "10px"
                }}
                rules={[
                  {
                    required: true,
                    message: "Введите значения плана"
                  }
                ]}
              >
                <div>
                  <Text
                    style={{
                      fontSize: "14px",
                      marginBottom: "8px",
                      color: "#7B7B98"
                    }}
                  >
                    План
                  </Text>
                  <Input
                    type="number"
                    style={{
                      marginTop: "8px",
                      borderRadius: "10px"
                    }}
                    placeholder="Введите значение"
                    value={valuePlan}
                    onChange={handleChangePlanInput}
                    min={PLAN_MIN}
                    max={PLAN_MAX}
                  />
                </div>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]} style={{ marginTop: "16px" }}>
            <Col span={24}>
              <Form.Item
                name="targetChallenge"
                validateStatus={challengeStatus.validateStatus}
                help={challengeStatus.help}
                style={{ marginBottom: "0" }}
                rules={[
                  {
                    required: true,
                    message: "Введите значения вызова"
                  }
                ]}
              >
                <div>
                  <Text
                    style={{
                      fontSize: "14px",
                      marginBottom: "8px",
                      color: "#7B7B98"
                    }}
                  >
                    Вызов
                  </Text>
                  <Input
                    type="number"
                    style={{
                      marginTop: "8px",
                      borderRadius: "10px"
                    }}
                    placeholder="Введите значение"
                    value={valueChallenge}
                    onChange={handleChangeChallengeInput}
                    min={CHALLENGE_MIN}
                    max={CHALLENGE_MAX}
                  />
                </div>
              </Form.Item>
              <div className={styles.checkbox_wrapper}>
                <Checkbox className="checkbox-drawer" onChange={handleCheckbox} name="additional_key_target">
                  Ещё один ключевой результат
                </Checkbox>
              </div>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  );
};

export default CreateKeyTargetDrawer;
