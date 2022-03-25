import React, { useState } from "react";
import {
  Drawer, Form, Button, Col, Row, Input, Space
} from "antd";
import TitleDrawer from "../TitleDrawer";
import { useAppDispatch, useAppSelector } from "../../../store";
import { postCompanyTarget } from "../../Accordion/actions";
import styles from "../index.module.css";
import checkAccess from "../../../utils/checks";
import { RoleEnums } from "../../../store/User/type";

type PropsType = {
  setVisibleCompanyTarget: any;
  visibleCompanyTarget: boolean;
  unitId: number;
  isUnitCompany: boolean;
};
const CreateCompanyTargetDrawer = ({
  setVisibleCompanyTarget, visibleCompanyTarget, unitId, isUnitCompany
}: PropsType) => {
  const user = useAppSelector((state) => state.user);
  const [totalValue, setTotalValue] = useState("");
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const isEmptyInputs = totalValue === "" && true;
  const isAccess = checkAccess(user.role, [RoleEnums.OKR_MASTER, RoleEnums.OKR_ADMIN]);
  const isDisableCreateButton = isEmptyInputs || !isAccess;

  const onClose = () => {
    setVisibleCompanyTarget(false);
    setTotalValue("");
  };
  const resetValues = () => {
    form.resetFields();
    setTotalValue("");
  };

  const handleChangeValue = (value: string) => {
    setTotalValue(value);
  };
  const configureAddTarget = () => {
    let objectiveTypeId = 1;
    if (isUnitCompany) objectiveTypeId = 2;

    const objParams = {
      name: totalValue,
      status: "draft",
      parentId: null,
      objectiveTypeId,
      unitId,
      objectivePeriodId: Number(localStorage.getItem("periodId")),
      period: localStorage.getItem("globalPeriod")!.split(".")[2]
    };
    dispatch(postCompanyTarget(objParams));
    form.resetFields();
    onClose();
  };

  return (
    <Drawer
      title={<TitleDrawer title="создание цели" />}
      width={509}
      onClose={onClose}
      visible={visibleCompanyTarget}
      footer={(
        <Space>
          <Button disabled={isDisableCreateButton} onClick={configureAddTarget} size="large" className={styles.button_drawer_creature}>
            Сохранить
          </Button>
          <Button onClick={resetValues} size="large" className={styles.button_drawer_creature} disabled={totalValue === "" && true}>
            Очистить
          </Button>
        </Space>
      )}
      footerStyle={{
        background: "#EFEFFE",
        height: "72px"
      }}
    >
      <Form form={form} layout="vertical" hideRequiredMark>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="targetNameCompany"
              label="Название цели"
              rules={[
                {
                  required: true,
                  message: "Введите название цели"
                }
              ]}
            >
              <Input.TextArea style={{ borderRadius: "10px" }} rows={2} placeholder="Введите название цели" onChange={(e) => handleChangeValue(e.currentTarget.value)} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

export default CreateCompanyTargetDrawer;
