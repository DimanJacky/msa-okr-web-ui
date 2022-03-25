import React from "react";
import { Modal } from "antd";
import { useAppSelector, useAppDispatch } from "../../store";
import { closeModal } from "./reducer";
import "./style.css";

const ErrorModal = () => {
  const { errorMessage, isOpen } = useAppSelector((state) => state.errorNotification);
  const dispatch = useAppDispatch();

  const onClose = () => {
    dispatch(closeModal(""));
  };

  return (
    <Modal className="approval_modal" title="Ошибка" visible={isOpen} onCancel={onClose}>
      <p>{errorMessage}</p>
    </Modal>
  );
};

export default ErrorModal;
