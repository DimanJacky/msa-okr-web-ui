import React, { useState } from "react";
import { Button, Modal } from "antd";
import "./style.css";
import { DeleteOutlined } from "@ant-design/icons";
import styles from "../../components/Accordion/AccordionItem/index.module.css";
import { StatusEnums } from "../../store/filters/filters";

type PropsType = {
  title: string;
  okText: string;
  cancelText: string;
  status: StatusEnums;
  visibleDeleteModal?: boolean;
  setVisibleDeleteModal?: any;
  sendDeleteKeyTarget?: any;
  setVisibleDeleteKeyTargetDrawer?: any;
  currentKeyTragetId?: any;
  isObjective?: boolean;
  isHardDelete?: boolean;
};

const DeleteCustomModal: React.FC<PropsType> = ({
  title,
  okText,
  cancelText,
  visibleDeleteModal,
  setVisibleDeleteModal,
  sendDeleteKeyTarget,
  setVisibleDeleteKeyTargetDrawer,
  currentKeyTragetId,
  isObjective,
  isHardDelete,
  status
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button
        className="hidden_icons"
        type="link"
        onClick={(event) => {
          setVisible(true);
          event.stopPropagation();
        }}
      >
        <DeleteOutlined className={styles.hidden_icons_style} />
      </Button>
      <Modal
        title={title}
        centered={false}
        visible={visible || visibleDeleteModal}
        onOk={(event) => {
          setVisible(false);
          setVisibleDeleteModal(false);
          setVisibleDeleteKeyTargetDrawer(false);
          event.stopPropagation();
        }}
        onCancel={(event) => {
          setVisible(false);
          setVisibleDeleteModal(false);
          sendDeleteKeyTarget(currentKeyTragetId, isObjective, isHardDelete, status);
          setVisibleDeleteKeyTargetDrawer(false);
          event.stopPropagation();
        }}
        okText={cancelText}
        cancelText={okText}
        width={422}
        keyboard
      />
    </>
  );
};

DeleteCustomModal.defaultProps = {
  visibleDeleteModal: undefined,
  setVisibleDeleteModal: () => undefined,
  sendDeleteKeyTarget: () => undefined,
  setVisibleDeleteKeyTargetDrawer: () => undefined,
  currentKeyTragetId: undefined,
  isObjective: false,
  isHardDelete: false
};

export default DeleteCustomModal;
