import React, { FC, useEffect, useState } from "react";
import {
  Button, Checkbox, Col, Drawer, Row, Space, Typography
} from "antd";
import DeleteCustomModal from "../../../modules/DeleteModal";
import { CompanyTargetType } from "../../Accordion/types";
import WarningAlert from "../../../modules/WarningAlert";
import styles from "../index.module.css";
import "../index.css";
import "./style.css";
import { StatusEnums } from "../../../store/filters/filters";
import { helpTypeFacts } from "../ViewingDrawer/reducer";
import { useAppDispatch, useAppSelector } from "../../../store";
import { objectiveSubTaskType } from "../../Accordion/actions";
import { getKeyTargetsFacts } from "../ViewingDrawer/actions";
import checkAccess from "../../../utils/checks";
import { RoleEnums } from "../../../store/User/type";

type PropTypes = {
  visibleDeleteTargetDrawer: boolean;
  target: CompanyTargetType;
  setVisibleDeleteTargetDrawer: any;
  sendDeleteTarget: (targetId: number, isObjective: boolean, isHardDelete: boolean, status: StatusEnums) => void;
};

const DeleteTargetDrawer: FC<PropTypes> = ({
  visibleDeleteTargetDrawer, setVisibleDeleteTargetDrawer, target, sendDeleteTarget
}) => {
  const dispatch = useAppDispatch();
  const { facts } = useAppSelector((state) => state.viewTargets);
  const user = useAppSelector((state) => state.user);
  const [visibleDeleteModal, setVisibleDeleteModal] = useState(false);
  const [isHardDelete, setIsHardDelete] = useState(false);
  const { Text, Title } = Typography;
  const isDraft = target.status === StatusEnums.DRAFT;
  const isCorrectStatus = isDraft || target.status === StatusEnums.ACTIVE || target.status === StatusEnums.REJECTED;
  const isAccess = checkAccess(user.role, [RoleEnums.OKR_MASTER, RoleEnums.OKR_ADMIN]);
  const isDisableDeleteButton = !isCorrectStatus || !isAccess;

  const onClose = () => setVisibleDeleteTargetDrawer(false);
  const handleCheckbox = () => setIsHardDelete(!isHardDelete);
  const hasFacts = facts.some((fact: helpTypeFacts) => target.objectiveSubTask?.some((item: objectiveSubTaskType) => item.id === fact.keyResultId));
  const hasCheckbox = isDraft && !hasFacts;

  useEffect(() => {
    target.objectiveSubTask?.map((item: objectiveSubTaskType) => dispatch(getKeyTargetsFacts(item.id)));
  }, [target.objectiveSubTask]);

  return (
    <>
      <Drawer
        className="deleteTargetDrawer"
        visible={visibleDeleteTargetDrawer}
        onClose={onClose}
        title="Удаление цели"
        width={509}
        footer={(
          <Space>
            <Button
              className={styles.btn_agreed}
              size="large"
              onClick={() => {
                onClose();
                setVisibleDeleteModal(true);
              }}
              disabled={isDisableDeleteButton}
            >
              Удалить
            </Button>
            <Button className={styles.btn_cancel} size="large" onClick={onClose}>
              Отменить
            </Button>
          </Space>
        )}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Row gutter={16}>
          <Col span={24}>
            <WarningAlert messageAlert="" textAlert="Удаляя цель, вы удаляете все связанные с ней ключевые результаты." />
            <div>
              <Title level={5}>Название цели</Title>
              <Text className="text">{target.name}</Text>
            </div>
            {hasCheckbox && (
              <div className={styles.checkbox_wrapper}>
                <Checkbox className="checkbox-drawer" onChange={handleCheckbox} name="hard_delete">
                  Удалить без возможности восстановления
                </Checkbox>
              </div>
            )}
          </Col>
        </Row>
        {visibleDeleteModal && (
          <DeleteCustomModal
            setVisibleDeleteKeyTargetDrawer={setVisibleDeleteTargetDrawer}
            sendDeleteKeyTarget={sendDeleteTarget}
            currentKeyTragetId={target.id}
            setVisibleDeleteModal={setVisibleDeleteModal}
            visibleDeleteModal={visibleDeleteModal}
            title="Отправить запрос на удаление?"
            okText="Отправить"
            cancelText="Отменить"
            isObjective
            isHardDelete={isHardDelete}
            status={target.status}
          />
        )}
      </Drawer>
    </>
  );
};

export default DeleteTargetDrawer;
