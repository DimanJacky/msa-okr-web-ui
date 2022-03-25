import React, { useEffect } from "react";
import {
  Checkbox, Col, Form, Row, Table, Tabs
} from "antd";
import MinusSquare from "../../images/minus-square.svg";
import PlusSquare from "../../images/plus-square.svg";
import { checkSTatusReviewType } from "../../components/Accordion/types";
import { objectiveSubTaskType } from "../../components/Accordion/actions";
import { useAppDispatch, useAppSelector } from "../../store";
import {
  getAllCommentsFacts, getFactsComments, getKeyTargetsFacts, getLastFact
} from "../../components/Drawers/ViewingDrawer/actions";
import TextDrawer from "../../components/Accordion/TextDrawer";
import InterestBlock from "../../components/Drawers/ViewingDrawer/ViewingKeyTarget/InterestBlock";
import styles from "./styles.module.css";
import { helpTypeFacts } from "../../components/Drawers/ViewingDrawer/reducer";
import { StatusEnums } from "../../store/filters/filters";
import CommentFact from "./CommentFact";

type PropsType = {
  currentTargetReview: checkSTatusReviewType | objectiveSubTaskType | null;
};

const KeyResultInfo = ({ currentTargetReview }: PropsType) => {
  const plan = currentTargetReview?.plan;
  const challenge = currentTargetReview?.challenge;
  const description = currentTargetReview?.description;

  const [isTabsOpen, setIsTabsOpen] = React.useState(false);
  const [isShowAllFacts, setIsShowAllFacts] = React.useState(false);
  const [isShowAllComments, setIsShowAllComments] = React.useState(false);

  const {
    lastFact, facts, lastFactComment, allFactsComments
  } = useAppSelector((state) => state.viewTargets);

  const fact = lastFact ? String(lastFact?.valuePercent) : "";
  const factsIds = facts.map((e: helpTypeFacts) => e.id);
  const isFactActive = facts.some((e: helpTypeFacts) => e.status === StatusEnums.ACTIVE);

  const allPeriods = facts
    .map((e: helpTypeFacts) => e.fixationPeriodId)
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort((a, b) => b - a);

  const tableColumns = [
    {
      title: "Факт",
      dataIndex: "fact",
      key: "fact"
    },
    {
      title: "Дата",
      dataIndex: "data",
      key: "data"
    },
    {
      title: "Описание",
      dataIndex: "description",
      key: "description"
    }
  ];

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (currentTargetReview) {
      const { id } = currentTargetReview;
      dispatch(getKeyTargetsFacts(id));
      dispatch(getLastFact(currentTargetReview.id));
    }
  }, []);

  const renderDescription = () => {
    if (description) {
      return (
        <>
          <Col span={24}>
            <Form.Item className={styles.element_drawer}>
              <div className={styles.text_column_drawer} style={{ marginTop: "20px" }}>
                <TextDrawer color="#6F6F8B">Описание</TextDrawer>
                <h3 color="#333">{description}</h3>
              </div>
            </Form.Item>
          </Col>
        </>
      );
    }
    return null;
  };

  const getTableFacts = () => {
    if (isFactActive && !isShowAllFacts) {
      const activeFacts = facts.filter((e: helpTypeFacts) => e.status === StatusEnums.ACTIVE);
      const lastActive = activeFacts[activeFacts.length - 1];
      const tableData = [lastActive].map((e) => ({
        key: "1",
        fact: e.valuePercent,
        data: e.resultDate,
        description: e.description
      }));
      return <Table columns={tableColumns} dataSource={tableData} pagination={false} />;
    }
    if (isShowAllFacts) {
      const tableData = facts.map((e, index) => ({
        key: index + 1,
        fact: e.valuePercent,
        data: e.resultDate,
        description: e.description
      }));
      return <Table columns={tableColumns} dataSource={tableData} pagination={false} />;
    }
    return <div>За текущий период нет активного факта</div>;
  };

  const getLastAllComments = () => {
    const paramsForCommentsLast = {
      entityType: "KEYRESULTFACT",
      factsIds,
      last: true
    };
    const paramsForAllComments = {
      entityType: "KEYRESULTFACT",
      factsIds,
      last: false
    };
    dispatch(getFactsComments(paramsForCommentsLast));
    dispatch(getAllCommentsFacts(paramsForAllComments));
  };

  const renderActivity = () => (
    <>
      <div style={{ marginTop: "20px", minWidth: "450px" }}>
        <div className={styles.styleActivityTitle} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3>Активность</h3>
          {isTabsOpen ? (
            <input type="image" alt="MinusSquare" src={MinusSquare} className={styles.icon_minus} onClick={() => setIsTabsOpen(!isTabsOpen)} />
          ) : (
            <input type="image" alt="PlusSquare" src={PlusSquare} className={styles.icon_plus} onClick={() => setIsTabsOpen(!isTabsOpen)} />
          )}
        </div>
        {isTabsOpen && (
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <Tabs defaultActiveKey="1" style={{ flex: 8 }}>
              <Tabs.TabPane tab={<div>Факты</div>} key="1">
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Checkbox onChange={() => setIsShowAllFacts(!isShowAllFacts)}>Все</Checkbox>
                </div>
                {allPeriods.map((e) => (
                  <div key={`${e + e}tableFacts`}>
                    <div style={{ fontWeight: "bold" }}>
                      {e}
                      {" "}
                      квартал
                    </div>
                    {getTableFacts()}
                  </div>
                ))}
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={(
                  <div role="button" tabIndex={0} onKeyPress={() => null} onClick={getLastAllComments}>
                    Процесс по фактам
                  </div>
                )}
                key="2"
              >
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Checkbox onChange={() => setIsShowAllComments(!isShowAllComments)}>Все</Checkbox>
                </div>
                {!isShowAllComments ? (
                  <div>
                    {lastFactComment?.map((el) => (
                      <div key={el.username + el.entityId + el.fixationPeriodId} style={{ marginTop: "15px" }}>
                        <CommentFact username={el.username} fixationPeriodId={el.fixationPeriodId} valueComment={el.valueComment} eventName={el.eventName} commentDate={el.commentDate} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    {allFactsComments?.map((element) => (
                      <div key={element.username + element.entityId + element.fixationPeriodId + Math.random()} style={{ marginTop: "15px" }}>
                        <CommentFact
                          username={element.username}
                          fixationPeriodId={element.fixationPeriodId}
                          valueComment={element.valueComment}
                          eventName={element.eventName}
                          commentDate={element.commentDate}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </Tabs.TabPane>
            </Tabs>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      <Row gutter={[24, 0]}>
        <Col span={24}>
          <Form.Item className={styles.element_drawer}>
            <div style={{ display: "flex" }}>
              <InterestBlock name="Факт" value={fact} color="#4CAF50" />
              <InterestBlock name="План" value={plan} color="#FF881A" />
              <InterestBlock name="Вызов" value={challenge} color="#4627C2" />
            </div>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[24, 0]}>{renderDescription()}</Row>
      <Row gutter={[24, 0]}>
        <Col span={24}>
          <Form.Item className={styles.element_drawer}>{renderActivity()}</Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default KeyResultInfo;
