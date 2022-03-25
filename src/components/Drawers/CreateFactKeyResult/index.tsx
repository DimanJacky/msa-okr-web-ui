import React, {
  useState, useEffect, Dispatch, SetStateAction, ChangeEvent
} from "react";
import {
  Drawer, Form, Button, Col, Row, Input, Space, Typography
} from "antd";
import SelectKeyResult from "./SelectKeyResult";
import "./style.css";
import { objectiveSubTaskType, postFactkeyResult } from "../../Accordion/actions";
import { getFixPeriodsArray } from "./actions";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
  getAllFacts, getLastFactsPeriod, updateFact, updateKeyResultFacts
} from "../../../store/key-results/facts/actions";
import { StatusEnums } from "../../../store/filters/filters";
import { setInputFact, setDescriptionNameKeyResult, resetState } from "../../../store/key-results/facts/slice";
import checkAccess from "../../../utils/checks";
import { RoleEnums } from "../../../store/User/type";
import { validateNumberInputMax } from "../../../utils/validate";
import { FACT_MAX, FACT_MIN } from "./constants";
import { helpTypeFacts } from "../ViewingDrawer/reducer";
import FactCard from "./FactCard";

type CreateKeyResultTargetType = {
  visibleCreateKeyResult: boolean;
  setVisibleKeyResultDrawer: any;
  keyResultTarget: objectiveSubTaskType;
  setVisibleEditFact: Dispatch<SetStateAction<boolean>>;
  setCurrentFact: Dispatch<SetStateAction<helpTypeFacts | undefined>>;
};

const CreateFactKeyResult = ({
  visibleCreateKeyResult, setVisibleKeyResultDrawer, keyResultTarget, setVisibleEditFact, setCurrentFact
}: CreateKeyResultTargetType) => {
  const [periodId, setPeriodId] = useState<number>();
  const [openFacts, setOpenFacts] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const { Text } = Typography;
  const [form] = Form.useForm();
  const fixPeriods = useAppSelector((state) => state.fixPeriods);
  const user = useAppSelector((state) => state.user);
  const objectivePeriodIdList = Number(localStorage.getItem("periodId"));

  const {
    status, currentFactNoActive, inputFact, allFacts, descriptionKeyResult, lastFactsReverse, allFactsReverse, filters
  } = useAppSelector((state) => state.keyResultFacts);

  const isRenderInput = [StatusEnums.DRAFT, StatusEnums.REVIEW, StatusEnums.REJECTED].includes(status) || StatusEnums.ACTIVE;
  const isEmptyInputs = descriptionKeyResult === "" || inputFact === "" || periodId === undefined;
  const isAccess = checkAccess(user.role, [RoleEnums.OKR_MASTER, RoleEnums.OKR_ADMIN]);
  const isDisableCreateButton = isEmptyInputs || !isAccess;
  const isRevievStatus = status === StatusEnums.REVIEW;
  const isRejectStatus = status === StatusEnums.REJECTED;

  const initialValues = {
    keyResult: ""
  };

  useEffect(() => {
    if (visibleCreateKeyResult) {
      dispatch(getAllFacts(keyResultTarget.id));
      dispatch(getFixPeriodsArray(objectivePeriodIdList));
      dispatch(getLastFactsPeriod(keyResultTarget.id));
    }
  }, [visibleCreateKeyResult]);

  useEffect(() => {
    if (status !== StatusEnums.ACTIVE && currentFactNoActive) {
      setPeriodId(currentFactNoActive.fixationPeriodId);
    }
  }, [status]);

  useEffect(() => {
    if (visibleCreateKeyResult) dispatch(getAllFacts(keyResultTarget.id));
  }, [filters]);

  const changeInputFact = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setInputFact(validateNumberInputMax(e.currentTarget.value)));
  };

  const handleChangeDescKeyResult = (e: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setDescriptionNameKeyResult(e.currentTarget.value));
  };

  const resetValues = () => {
    if (isRejectStatus) {
      form.resetFields();
      dispatch(setDescriptionNameKeyResult(""));
      dispatch(setInputFact(""));
    } else {
      form.resetFields();
      dispatch(setDescriptionNameKeyResult(""));
      dispatch(setInputFact(""));
      setPeriodId(undefined);
    }
  };

  const onClose = () => {
    setVisibleKeyResultDrawer(false);
    resetValues();
    setOpenFacts(true);
    dispatch(resetState());
  };

  const handleEditFact = (fact: helpTypeFacts) => {
    if (fact.status === StatusEnums.REVIEW || fact.status === StatusEnums.DRAFT) {
      setCurrentFact(fact);
      setVisibleEditFact(true);
    }
  };

  const sendIndicatorsKeyResult = () => {
    const paramsKeyResult = {
      keyResultId: keyResultTarget.id,
      valuePercent: Number(inputFact),
      description: descriptionKeyResult,
      fixationPeriodId: periodId
    };
    dispatch(postFactkeyResult(paramsKeyResult));
    setVisibleKeyResultDrawer(false);
    resetValues();
  };

  const updateFactKr = (toStatus: string) => {
    const updateParam = {
      entityType: "keyresultfact",
      entityId: currentFactNoActive.id,
      action: toStatus
    };

    const paramsKeyResultFact = {
      id: currentFactNoActive.id,
      keyResultId: keyResultTarget.id,
      valuePercent: Number(inputFact),
      description: descriptionKeyResult,
      fixationPeriodId: periodId
    };

    const toUpdate = [updateParam];
    dispatch(updateFact(toUpdate));
    dispatch(updateKeyResultFacts(paramsKeyResultFact));
  };

  const classSubmitButton = descriptionKeyResult === "" || inputFact === "" ? "btn_disabled" : "btn_key_result_save";
  const isEmptyKeyDescriptionFact = descriptionKeyResult === "" && inputFact === "";
  const classCancelButton = isEmptyKeyDescriptionFact ? "btn_disabled" : "btn_key_result_clear";

  const renderFooter = () => {
    if (status === StatusEnums.DRAFT) {
      return (
        <>
          <Button
            disabled={isEmptyInputs}
            onClick={() => {
              updateFactKr("to_review");
              onClose();
            }}
            size="large"
            className={classSubmitButton}
          >
            Отправить на согласование
          </Button>
          <Button disabled={isEmptyKeyDescriptionFact} onClick={resetValues} size="large" className={classCancelButton}>
            Очистить
          </Button>
        </>
      );
    }
    if (status === StatusEnums.REVIEW) {
      return (
        <>
          <Button
            onClick={() => {
              updateFactKr("approve");
              onClose();
            }}
            size="large"
            className={classSubmitButton}
          >
            Согласовать
          </Button>
          <Button
            disabled={isEmptyKeyDescriptionFact}
            onClick={() => {
              updateFactKr("reject");
              onClose();
            }}
            size="large"
            className={classCancelButton}
          >
            Отклонить
          </Button>
        </>
      );
    }
    if (status === StatusEnums.REJECTED) {
      return (
        <>
          <Button
            disabled={isEmptyInputs}
            onClick={() => {
              updateFactKr("to_review");
              onClose();
            }}
            size="large"
            className={classSubmitButton}
          >
            Отправить на согласование
          </Button>
          <Button disabled={isEmptyKeyDescriptionFact} onClick={resetValues} size="large" className={classCancelButton}>
            Очистить
          </Button>
        </>
      );
    }
    if (status === StatusEnums.ACTIVE || allFacts) {
      return (
        <>
          <Button
            disabled={isDisableCreateButton}
            onClick={() => {
              sendIndicatorsKeyResult();
              onClose();
            }}
            size="large"
            className={classSubmitButton}
          >
            Внести
          </Button>
          <Button disabled={isEmptyKeyDescriptionFact} onClick={resetValues} size="large" className={classCancelButton}>
            Очистить
          </Button>
        </>
      );
    }
    return null;
  };
  const renderFactList = () => {
    if (allFacts.length > 0) {
      return <FactCard openFacts={openFacts} setOpenFacts={setOpenFacts} lastFactsReverse={lastFactsReverse} allFactsReverse={allFactsReverse} handleEditFact={handleEditFact} />;
    }
    return null;
  };

  return (
    <>
      <Drawer
        onClose={onClose}
        destroyOnClose
        visible={visibleCreateKeyResult}
        title={status === StatusEnums.ACTIVE || status === null ? "Внесение факта КР" : "Редактирование факта КР"}
        width={509}
        footer={<Space>{renderFooter()}</Space>}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form form={form} layout="vertical" hideRequiredMark initialValues={initialValues}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="targetName"
                label="Название ключевого результата"
                rules={[
                  {
                    required: true,
                    message: "Введите ключевой результат"
                  }
                ]}
              >
                <Text>
                  <Input className="dis_input" disabled value={keyResultTarget.name} placeholder="Введите название ключевого результата" />
                </Text>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="keyResult"
                label="Период"
                className="style_form"
                rules={[
                  {
                    required: true,
                    message: "Введите ключевой результат"
                  }
                ]}
              >
                <SelectKeyResult disabled={isRevievStatus || isRejectStatus} periodId={periodId} setPeriodId={setPeriodId} placeholder="Выберите период" fixationPeriods={fixPeriods} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="result"
                label=""
                rules={[
                  {
                    required: true,
                    message: "Заполните поле"
                  }
                ]}
              >
                <Text className="fields_for_values">
                  <span>
                    Факт, %
                    <Input
                      type="number"
                      value={isRenderInput ? inputFact : ""}
                      name="Факт"
                      placeholder="Введите значение"
                      onChange={changeInputFact}
                      max={FACT_MAX}
                      min={FACT_MIN}
                      disabled={isRevievStatus}
                    />
                  </span>
                  <span>
                    План, %
                    <Input disabled className="plan_and_challenge" type="text" name="План" value={keyResultTarget.plan} />
                  </span>
                  <span>
                    Вызов, %
                    <Input disabled className="plan_and_challenge" type="text" name="Вызов" value={keyResultTarget.challenge} />
                  </span>
                </Text>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Input.TextArea
                className="style_form"
                value={isRenderInput ? descriptionKeyResult : ""}
                onChange={handleChangeDescKeyResult}
                rows={2}
                placeholder="Описание к фактическому результату"
                disabled={isRevievStatus}
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>{renderFactList()}</Col>
          </Row>
        </Form>
      </Drawer>
    </>
  );
};

export default CreateFactKeyResult;
