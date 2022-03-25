import React from "react";
import { Modal } from "antd";
import "./style.css";

type PropTypes = {
  notificationTitle: string;
  notificationContent: string;
  handleCancel: () => void;
  isModalVisible: boolean;
};

const NotificationCustomModal: React.FC<PropTypes> = ({
  notificationTitle, notificationContent, handleCancel, isModalVisible
}) => (
  <>
    <Modal className="approval_modal" title={notificationTitle} visible={isModalVisible} onCancel={handleCancel}>
      <p>{notificationContent}</p>
    </Modal>
  </>
);

export default NotificationCustomModal;
