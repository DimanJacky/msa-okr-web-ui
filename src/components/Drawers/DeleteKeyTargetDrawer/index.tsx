import React, { FC, useEffect, useState } from "react";
import {
  Button, Checkbox, Col, Drawer, Row, Space, Typography
} from "antd";
import DeleteCustomModal from "../../../modules/DeleteModal";
import { objectiveSubTaskType } from "../../Accordion/actions";
import styles from "../index.module.css";
import "./style.css";
import { StatusEnums } from "../../../store/filters/filters";
import { useAppDispatch, useAppSelector } from "../../../store";
import { helpTypeFacts } from "../ViewingDrawer/reducer";
import { getKeyTargetsFacts } from "../ViewingDrawer/actions";
import checkAccess from "../../../utils/checks";
import { RoleEnums } from "../../../store/User/type";

type PropTypes = {
  visibleDeleteKeyTargetDrawer: boolean;
  keyTargetName: objectiveSubTaskType;
  setVisibleDeleteKeyTargetDrawer: any;
  setCurrentKeyTargetId: any;
  objectiveTitle: string;
  sendDeleteKeyTarget: (keyTargetId: number, isObjective: boolean, isHardDelete: boolean, status: StatusEnums) => void;
  currentKeyTargetId?: any;
};

const DeleteKeyTargetDrawer: FC<PropTypes> = ({
  visibleDeleteKeyTargetDrawer,
  setVisibleDeleteKeyTargetDrawer,
  keyTargetName,
  objectiveTitle,
  setCurrentKeyTargetId,
  sendDeleteKeyTarget,
  currentKeyTargetId
}) => {
  const dispatch = useAppDispatch();
  const { facts } = useAppSelector((state) => state.viewTargets);
  const user = useAppSelector((state) => state.user);
  const [visibleDeleteModal, setVisibleDeleteModal] = useState(false);
  const [isHardDelete, setIsHardDelete] = useState(false);
  const { Text, Title } = Typography;
  const isDraft = keyTargetName.status === StatusEnums.DRAFT;
  const isCorrectStatus = isDraft || keyTargetName.status === StatusEnums.ACTIVE || keyTargetName.status === StatusEnums.REJECTED;
  const isAccess = checkAccess(user.role, [RoleEnums.OKR_MASTER, RoleEnums.OKR_ADMIN]);
  const isDisableDeleteButton = !isCorrectStatus || !isAccess;

  const onClose = () => setVisibleDeleteKeyTargetDrawer(false);
  const handleCheckbox = () => setIsHardDelete(!isHardDelete);
  const hasFacts = facts.some((fact: helpTypeFacts) => fact.keyResultId === keyTargetName.id);
  const hasCheckbox = isDraft && !hasFacts;

  useEffect(() => {
    dispatch(getKeyTargetsFacts(keyTargetName.id));
  }, []);

  return (
    <Drawer
      className="deleteKeyTargetDrawer"
      visible={visibleDeleteKeyTargetDrawer}
      onClose={onClose}
      title="Удаление ключевого результата"
      width={509}
      footer={(
        <Space>
          <Button
            className={styles.btn_agreed}
            size="large"
            onClick={() => {
              setCurrentKeyTargetId(keyTargetName.id, keyTargetName.objectiveId);
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
          <div className="keyTargetNameStyle">
            <Title level={5}>Название ключевого результата</Title>
            <Text className="text">
              <Text>{keyTargetName.name}</Text>
            </Text>
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
      <Row gutter={16}>
        <Col span={24}>
          <div>
            <Title level={5}>Название цели</Title>
            <Text className="text">
              <Text className={styles.target_title}>{objectiveTitle}</Text>
            </Text>
          </div>
        </Col>
      </Row>
      {visibleDeleteModal && (
        <DeleteCustomModal
          setVisibleDeleteKeyTargetDrawer={setVisibleDeleteKeyTargetDrawer}
          sendDeleteKeyTarget={sendDeleteKeyTarget}
          currentKeyTragetId={currentKeyTargetId}
          setVisibleDeleteModal={setVisibleDeleteModal}
          visibleDeleteModal={visibleDeleteModal}
          title="Отправить запрос на удаление?"
          okText="Отправить"
          cancelText="Отменить"
          status={keyTargetName.status}
          isHardDelete={isHardDelete}
        />
      )}
    </Drawer>
  );
};

DeleteKeyTargetDrawer.defaultProps = {
  currentKeyTargetId: undefined
};

export default DeleteKeyTargetDrawer;
