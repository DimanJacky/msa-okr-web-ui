import React, { useEffect } from "react";
import {
  Button, Col, Drawer, Form, Input, Row, Select, Space, Typography
} from "antd";
import { IObjectives } from "../../Accordion/reducer";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
  getCompanyTargets, getTargetList, recoverTarget, updateTarget
} from "../../Accordion/actions";
import { actionsTargetType, CompanyTargetType, FetchingTargetType } from "../../Accordion/types";
import "./style.css";
import { getPeriodsList } from "../../Accordion/PeriodSelection/action";
import checkAccess from "../../../utils/checks";
import { RoleEnums } from "../../../store/User/type";

type UpdateTargetDrawerPropsType = {
  item: CompanyTargetType;
  companyTargetName: string;
  unitId: number;
  visibleTarget: boolean;
  setVisibleTargetFunc: React.Dispatch<React.SetStateAction<boolean>>;
  companyTargets: IObjectives[] | null;
  parentTargetStatus: string;
};

const UpdateTargetDrawer = ({
  item, companyTargetName, visibleTarget, companyTargets, parentTargetStatus, setVisibleTargetFunc, unitId
}: UpdateTargetDrawerPropsType) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const [form] = Form.useForm();
  const resetValues = () => {
    form.resetFields();
  };
  const getTargetData = () => {
    resetValues();
    dispatch(getTargetList(unitId));
    dispatch(getPeriodsList());
    dispatch(getCompanyTargets());
  };

  useEffect(() => {
    resetValues();
  }, [item]);
  const onClose = () => {
    setVisibleTargetFunc(false);
  };

  const { Text } = Typography;
  const isAccess = checkAccess(user.role, [RoleEnums.OKR_MASTER, RoleEnums.OKR_ADMIN]);
  const isDisableSaveButton = !isAccess;

  const checkChangeInput = (formData: any) => formData.targetName !== item.name;
  const sendForm = (status: string) => {
    const formData = form.getFieldsValue(true);
    let parentId = null;
    const parentObjective = companyTargets?.find((it) => it.name === formData.target);
    if (parentObjective) {
      parentId = parentObjective.id;
    }
    const target: FetchingTargetType = {
      id: item.id,
      name: formData.targetName,
      status,
      parentId,
      objectiveTypeId: item.objectiveTypeId,
      unitId,
      objectivePeriodId: Number(localStorage.getItem("periodId"))
    };
    const targetFetchData = {
      objectiveId: item.id,
      target
    };
    const recoverTargetData: actionsTargetType[] = [
      {
        entityType: "objective",
        entityId: item.id,
        action: "recover"
      }
    ];

    if (status === "recover") {
      dispatch(recoverTarget(recoverTargetData));
      getTargetData();
    } else if (checkChangeInput(formData)) {
      dispatch(updateTarget(targetFetchData));
      getTargetData();
    }
    setVisibleTargetFunc(false);
  };

  return (
    <>
      <Drawer
        className="editingAgoal"
        title="Редактирование цели"
        width={509}
        onClose={onClose}
        visible={visibleTarget}
        footer={(
          <Space>
            {parentTargetStatus !== "deleted" && item.status !== "deleted" && (
              <>
                <Button onClick={() => sendForm("draft")} size="large" className="btn_save" disabled={isDisableSaveButton}>
                  Сохранить
                </Button>
                <Button onClick={resetValues} size="large" className="btn_clear">
                  Очистить
                </Button>
              </>
            )}
            {parentTargetStatus !== "deleted" && item.status === "deleted" && (
              <Button onClick={() => sendForm("recover")} size="large" className="btn_save" disabled={isDisableSaveButton}>
                Восстановить
              </Button>
            )}
          </Space>
        )}
        footerStyle={{
          background: "#EFEFFE",
          height: "72px"
        }}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form
          form={form}
          layout="vertical"
          hideRequiredMark
          initialValues={{
            targetName: item.name,
            target: companyTargetName
          }}
        >
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
                {parentTargetStatus !== "deleted" && item.status !== "deleted" ? (
                  <Input.TextArea style={{ borderRadius: "10px" }} rows={2} placeholder="Введите название цели" />
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
                      {item.name}
                    </Text>
                  </div>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              {parentTargetStatus !== "deleted" && item.status !== "deleted" && !!companyTargets && (
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
                  <Select placeholder="Цели компании">
                    {companyTargets.map((i) => (
                      <Select.Option key={i.id} value={i.name}>
                        {i.name}
                      </Select.Option>
                    ))}
                    <Select.Option value="Несвязанные цели">Несвязанные цели</Select.Option>
                  </Select>
                </Form.Item>
              )}
              {item.status === "deleted" && !!companyTargets && (
                <Form.Item
                  name="target"
                  label="Цель компании"
                  style={{ borderRadius: "10px" }}
                  rules={[
                    {
                      required: true
                    }
                  ]}
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
                      {companyTargetName}
                    </Text>
                  </div>
                </Form.Item>
              )}
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  );
};

export default UpdateTargetDrawer;
