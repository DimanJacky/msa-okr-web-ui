import React, { FC } from "react";
import {
  Col, Form, Input, Row, Select, Typography
} from "antd";

import keyTargetData from "../../constants/KeyTarget/const";
import { FormItemsEditKeyTargetProps } from "./type";
import styles from "./index.module.css";
import DescriptionField from "../../components/Accordion/DescriptionField";
import { validateInput } from "../../utils/validate";

const FormItemsEditKeyTarget: FC<FormItemsEditKeyTargetProps> = (props) => {
  const {
    valuePlan,
    setValuePlan,
    valueChallenge,
    setValueChallenge,
    valueDescription,
    setValueDescription,
    disabled = false,
    isInteger,
    setIsInteger,
    isErrorPlan,
    setIsErrorPlan,
    isErrorChallenge,
    setIsErrorChallenge,
    isErrorDescription,
    setIsErrorDescription
  } = props;
  const { Text } = Typography;
  let descriptionStatus = keyTargetData.errorEmpty;
  let planStatus = keyTargetData.errorEmpty;
  let challengeStatus = keyTargetData.errorEmpty;

  if (isErrorDescription) descriptionStatus = keyTargetData.errorDescription;
  if (isInteger && isErrorPlan) planStatus = keyTargetData.errorInteger;
  if (isInteger && isErrorChallenge) challengeStatus = keyTargetData.errorInteger;

  const handleChangeSelect = (option: string) => {
    const isIntegerCondition = option === "pieces" || option === "people" || option === "certificates";
    setIsInteger(false);
    if (isIntegerCondition) setIsInteger(true);
  };

  const handleChangeChallengeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = validateInput(event.target.value);
    setValueChallenge(value);
    setIsErrorChallenge(false);
    if (Number(value) % 1 !== 0) setIsErrorChallenge(true);
  };

  const handleChangePlanInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = validateInput(event.target.value);
    setValuePlan(value);
    setIsErrorPlan(false);
    if (Number(value) % 1 !== 0) setIsErrorPlan(true);
  };

  const handleChangeValueDescription = (value: string) => {
    setValueDescription(value);
  };

  return (
    <>
      <Row gutter={[24, 0]}>
        <Col span={24}>
          <Form.Item
            name="description"
            label="????????????????"
            validateStatus={descriptionStatus.validateStatus}
            help={descriptionStatus.help}
            style={{ marginBottom: "0" }}
            rules={[
              {
                required: true,
                message: "??????????????????????"
              }
            ]}
          >
            <DescriptionField handleChangeValueDescription={handleChangeValueDescription} defaultValue={valueDescription} setIsErrorDescription={setIsErrorDescription} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <div className="select-wrapper">
            <Text className={styles.select_title}>???????????????? ?????????????? ??????????????????</Text>
            <Select onSelect={handleChangeSelect} className={styles.select_types} placeholder="???????????????? ???? ????????????">
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
            label="????????"
            style={{
              marginBottom: "0",
              borderRadius: "10px"
            }}
            validateStatus={planStatus.validateStatus}
            help={planStatus.help}
            rules={[
              {
                required: true,
                message: "????????"
              },
              {
                validator(_, value) {
                  if (value >= 0) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("?????????????? ?????????????????????????? ????????????????"));
                }
              }
            ]}
          >
            <Input
              type="number"
              style={{
                marginTop: "8px",
                borderRadius: "10px"
              }}
              placeholder="?????????????? ????????????????"
              value={valuePlan}
              onChange={handleChangePlanInput}
              maxLength={10}
              disabled={disabled}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[24, 0]} style={{ marginTop: "16px" }}>
        <Col span={24}>
          <Form.Item
            name="challenge"
            validateStatus={challengeStatus.validateStatus}
            help={challengeStatus.help}
            label="??????????"
            style={{ marginBottom: "0" }}
            rules={[
              {
                required: true,
                message: "??????????"
              },
              {
                validator(_, value) {
                  if (value >= 0) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("?????????????? ?????????????????????????? ????????????????"));
                }
              }
            ]}
          >
            <Input
              type="number"
              style={{
                marginTop: "8px",
                borderRadius: "10px"
              }}
              placeholder="?????????????? ????????????????"
              value={valueChallenge}
              onChange={handleChangeChallengeInput}
              maxLength={10}
              disabled={disabled}
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default FormItemsEditKeyTarget;
