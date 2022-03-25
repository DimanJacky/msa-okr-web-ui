import {
  Button, Col, Drawer, Form, Input, Row, Typography
} from "antd";
import React, { ChangeEvent, useEffect, useState } from "react";
import { helpTypeFacts } from "../../ViewingDrawer/reducer";
import { FACT_MAX, FACT_MIN, STATUSES_FACT } from "../constants";
import SelectKeyResult from "../SelectKeyResult";
import styles from "../styles.module.css";
import "../style.css";
import FactCard from "../FactCard";
import DrawerHeader from "../../../../modules/DrawerHeader";
import { StatusEnums } from "../../../../store/filters/filters";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { changeFactStatusUpdate, putFactGetFacts } from "../../../../store/key-results/facts/actions";
import { EditFactProps } from "../types";
import DeleteFact from "../DeleteFact";

const EditFact = ({
  keyResultTarget, visibleEditFact, setVisibleEditFact, currentFact, setCurrentFact
}: EditFactProps) => {
  const { Text } = Typography;

  const dispatch = useAppDispatch();

  const fixationPeriods = useAppSelector((state) => state.fixPeriods);

  const { lastFactsReverse, allFactsReverse, allFacts } = useAppSelector((state) => state.keyResultFacts);

  const [factPercent, setFactPercent] = useState<number>(0);
  const [factDescription, setFactDescription] = useState<string>("");
  const [periodId, setPeriodId] = useState<number>();
  const [comment, setComment] = useState<string>("");
  const isNotComment = !comment.trim();
  const [form] = Form.useForm();

  const [openFacts, setOpenFacts] = useState<boolean>(true);

  const [visibleDeleteFact, setVisibleDeleteFact] = useState<boolean>(false);

  useEffect(() => {
    if (currentFact) {
      setFactPercent(currentFact.valuePercent);
      setFactDescription(currentFact.description);
      setPeriodId(currentFact.fixationPeriodId);
      setComment("");
    }
  }, [currentFact]);

  useEffect(() => {
    setOpenFacts(true);
  }, [visibleEditFact]);

  const handleEditFact = (fact: helpTypeFacts) => {
    if (fact.status === StatusEnums.REVIEW) {
      setCurrentFact(fact);
      setVisibleEditFact(true);
    }
  };

  const handleChangeFactPercent = (e: ChangeEvent<HTMLInputElement>) => {
    setFactPercent(Number(e.currentTarget.value));
  };

  const handleChangeDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setFactDescription(e.currentTarget.value);
  };

  const handleChangeComment = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.currentTarget.value);
  };

  const onClose = () => {
    setVisibleEditFact(false);
  };

  const updateFactInfo = () => {
    if (currentFact && periodId) {
      const factParams = {
        id: currentFact.id,
        keyResultId: keyResultTarget.id,
        valuePercent: factPercent,
        description: factDescription,
        fixationPeriodId: periodId
      };
      dispatch(putFactGetFacts(factParams));
    }
    onClose();
  };

  const changeFactStatus = (toStatus: string) => {
    let factParams;
    if (currentFact && periodId) {
      factParams = {
        id: currentFact.id,
        keyResultId: keyResultTarget.id,
        valuePercent: factPercent,
        description: factDescription,
        fixationPeriodId: periodId
      };
    }
    if (currentFact && factParams) {
      let changeStatusParam;
      if (!isNotComment) {
        changeStatusParam = {
          entityType: "keyresultfact",
          entityId: currentFact.id,
          action: toStatus,
          comment
        };
      } else {
        changeStatusParam = {
          entityType: "keyresultfact",
          entityId: currentFact.id,
          action: toStatus
        };
      }
      dispatch(changeFactStatusUpdate({ changeStatusParam, factParams }));
      onClose();
    }
  };

  const renderTitle = () => {
    const currentFactStatus = currentFact?.status;
    if (!currentFactStatus) {
      return null;
    }
    if (currentFact) {
      return <DrawerHeader title="Редактирование Факта КР" status={currentFactStatus} additionalName={keyResultTarget.name} />;
    }
    return null;
  };

  const FACT_BUTTONS_CONTENT = {
    [STATUSES_FACT.REVIEW]: {
      COORDINATE: [
        {
          text: "Согласовать",
          className: "btn_key_result_save",
          onClick: () => changeFactStatus("approve")
        },
        {
          text: "Сохранить",
          className: "btn_key_result_save",
          onClick: updateFactInfo,
          style: { marginLeft: "10px" }
        }
      ],
      REJECT: [
        {
          text: "Отклонить",
          className: "btn_key_result_clear",
          onClick: () => changeFactStatus("reject"),
          disabled: isNotComment
        }
      ]
    },
    [STATUSES_FACT.DRAFT]: {
      COORDINATE: [
        {
          text: "Отправить на согласование",
          className: "btn_key_result_save",
          onClick: () => changeFactStatus("to_review")
        },
        {
          text: "Сохранить",
          className: "btn_key_result_save",
          onClick: updateFactInfo,
          style: { marginLeft: "10px" }
        }
      ],
      REJECT: [
        {
          text: "Удалить",
          className: "btn_key_result_clear",
          onClick: () => setVisibleDeleteFact(true),
          disabled: false
        }
      ]
    }
  };

  const renderButtons = (status: string | undefined) => {
    if (!status) return null;
    return (
      <div className={styles.footer_buttons}>
        <div>
          {FACT_BUTTONS_CONTENT[status].COORDINATE.map((button) => (
            <Button size="large" className={button.className} onClick={button.onClick} style={button.style}>
              {button.text}
            </Button>
          ))}
        </div>
        {FACT_BUTTONS_CONTENT[status].REJECT.map((button) => (
          <Button size="large" className={button.className} onClick={button.onClick} disabled={button.disabled}>
            {button.text}
          </Button>
        ))}
      </div>
    );
  };

  const renderFooter = () => (
    <div className={styles.footer_container}>
      {currentFact?.status === StatusEnums.REVIEW && (
        <Row gutter={16} className={styles.footer_comments}>
          <Col span={24}>
            <Text className={styles.label_article}>Комментарий</Text>
            <Input.TextArea onChange={handleChangeComment} value={comment} className="style_form" style={{ marginTop: "8px" }} rows={2} placeholder="Введите комментарий" />
          </Col>
        </Row>
      )}
      {renderButtons(currentFact?.status)}
    </div>
  );

  const renderFactList = () => {
    if (allFacts.length > 0) {
      return <FactCard openFacts={openFacts} setOpenFacts={setOpenFacts} lastFactsReverse={lastFactsReverse} allFactsReverse={allFactsReverse} handleEditFact={handleEditFact} />;
    }
    return null;
  };

  return (
    <>
      <DeleteFact setVisibleDeleteFact={setVisibleDeleteFact} visibleDeleteFact={visibleDeleteFact} keyResultName={keyResultTarget.name} onCloseEditFact={onClose} />
      <Drawer
        onClose={onClose}
        visible={visibleEditFact}
        destroyOnClose
        title={renderTitle()}
        footer={renderFooter()}
        footerStyle={{ backgroundColor: "#EFEFFE" }}
        width={509}
        headerStyle={{ padding: 0 }}
      >
        <Form form={form} layout="vertical" hideRequiredMark>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="keyResult"
                label={<div className={styles.lable_article}>Период</div>}
                className="style_form"
                rules={[
                  {
                    required: true,
                    message: "Введите ключевой результат"
                  }
                ]}
              >
                <SelectKeyResult disabled={false} periodId={periodId} setPeriodId={setPeriodId} placeholder="Выберите период" fixationPeriods={fixationPeriods} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="targetName"
                label={<div className={styles.lable_article}>Название ключевого результата</div>}
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
              <Text className="fields_for_values">
                <span>
                  Факт, %
                  <Input onChange={handleChangeFactPercent} type="number" name="Факт" value={factPercent} placeholder="Введите значение" max={FACT_MAX} min={FACT_MIN} />
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
            </Col>
          </Row>
          <Row gutter={16} className={styles.fact_description_container}>
            <Col span={24}>
              <Text className={styles.lable_article}>Описание</Text>
              <Input.TextArea
                onChange={handleChangeDescription}
                className="style_form"
                style={{ marginTop: "8px" }}
                value={factDescription}
                rows={2}
                placeholder="Описание к фактическому результату"
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

export default EditFact;
