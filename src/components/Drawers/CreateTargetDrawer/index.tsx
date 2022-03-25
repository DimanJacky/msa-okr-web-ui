import React, { Dispatch, SetStateAction } from "react";
import {
  Drawer, Form, Button, Col, Row, Input, Space, Typography
} from "antd";
import { IObjectives } from "../../Accordion/reducer";
import { useAppDispatch, useAppSelector } from "../../../store";
import { postCompanyTarget } from "../../Accordion/actions";
import "./style.css";
import SelectTarget from "./SelectTarget/index";
import { RoleEnums } from "../../../store/User/type";
import checkAccess from "../../../utils/checks";
import TARGET_SYMBOLS_MAX from "./constants";

type CreateTargetDrawerPropsType = {
  visibleTarget: boolean;
  setVisibleTargetFunc: any;
  companyTargets: IObjectives[];
  titleTarget?: string;
  unitId: number;
  setOpenPanels: Dispatch<SetStateAction<string | number[] | string[]>>;
  openPanels: any;
};

const CreateTargetDrawer = ({
  visibleTarget, setVisibleTargetFunc, companyTargets, titleTarget, unitId, setOpenPanels, openPanels
}: CreateTargetDrawerPropsType) => {
  const user = useAppSelector((state) => state.user);
  const [form] = Form.useForm();
  const [totalValue, setTotalValue] = React.useState("");
  const { Text } = Typography;
  const [currentTargetId, setCurrentTargetId] = React.useState<number | string | null | undefined>(null);
  const dispatch = useAppDispatch();
  const isEmptyTotalValue = totalValue === "" && true;
  const isAccess = checkAccess(user.role, [RoleEnums.OKR_MASTER, RoleEnums.OKR_ADMIN]);
  const isDisableCreateButton = isEmptyTotalValue || !isAccess;

  const onClose = () => {
    setVisibleTargetFunc(false);
  };

  const resetValues = () => {
    form.resetFields();
    setTotalValue("");
  };

  const handleChangeValue = (value: string) => {
    setTotalValue(value);
  };

  const configureAddTarget = () => {
    const currentAddingTarget = companyTargets.find((e) => e.id === currentTargetId);
    if (totalValue === "") {
      return;
    }
    if (typeof currentTargetId === "number") {
      const objParams = {
        name: totalValue,
        status: "draft",
        parentId: currentAddingTarget!.id,
        objectiveTypeId: 1,
        unitId,
        objectivePeriodId: Number(localStorage.getItem("periodId")),
        period: localStorage.getItem("globalPeriod")!.split(".")[2]
      };
      dispatch(postCompanyTarget(objParams));
      onClose();
      const extra = openPanels.includes(currentTargetId);
      if (!extra) {
        setTimeout(() => {
          setOpenPanels((oldValue: any) => [...oldValue, currentTargetId]);
        });
      }
    } else {
      const objParams = {
        name: totalValue,
        status: "draft",
        parentId: null,
        objectiveTypeId: 1,
        unitId,
        objectivePeriodId: Number(localStorage.getItem("periodId")),
        period: localStorage.getItem("globalPeriod")!.split(".")[2]
      };
      dispatch(postCompanyTarget(objParams));
      onClose();
      const extra = openPanels.includes(666999);
      if (!extra) {
        setTimeout(() => {
          setOpenPanels((oldValue: any) => [...oldValue, 666999]);
        });
      }
    }
  };
  return (
    <>
      <Drawer
        className="createTarget"
        title="Создание цели"
        width={509}
        onClose={onClose}
        visible={visibleTarget}
        footer={(
          <Space>
            <Button onClick={configureAddTarget} className={totalValue === "" ? "btn_disabled" : "btn_save"} size="large" disabled={isDisableCreateButton}>
              Создать
            </Button>
            <Button disabled={totalValue === "" && true} onClick={resetValues} className={totalValue === "" ? "btn_disabled" : "btn_clear"} size="large">
              Очистить
            </Button>
          </Space>
        )}
        footerStyle={{
          background: "#EFEFFE",
          height: "72px"
        }}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form form={form} layout="vertical" hideRequiredMark>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="targetName"
                label="Название цели"
                rules={[
                  {
                    required: true,
                    message: "Введите название цели"
                  }
                ]}
              >
                <Input.TextArea
                  style={{ borderRadius: "10px" }}
                  rows={2}
                  placeholder="Введите название цели"
                  onChange={(e) => handleChangeValue(e.currentTarget.value)}
                  maxLength={TARGET_SYMBOLS_MAX}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="target"
                label="Цель компании"
                style={{ borderRadius: "10px" }}
                rules={[
                  {
                    required: true,
                    message: "Выберите цель компании"
                  }
                ]}
              >
                <div>
                  <Text
                    style={{
                      fontSize: "16px",
                      lineHeight: "20px"
                    }}
                  >
                    <SelectTarget titleTarget={titleTarget} companyTargets={companyTargets} setCurrentTargetId={setCurrentTargetId} />
                  </Text>
                </div>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  );
};

CreateTargetDrawer.defaultProps = {
  titleTarget: "Несвязанные цели"
};

export default CreateTargetDrawer;
