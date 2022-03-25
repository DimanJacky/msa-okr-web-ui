import React, { FC } from "react";
import { Alert } from "antd";
import "./style.css";

type PropsType = {
  textAlert: string;
  messageAlert: string;
  isStatic?: boolean;
};

const WarningAlert: FC<PropsType> = ({ textAlert, messageAlert, isStatic }) => {
  const onClose = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
  };

  return (
    <div className="warning_message warning_alert_static">
      {isStatic ? (
        <Alert className="warning_alert" showIcon={false} banner message={messageAlert} description={textAlert} type="warning" closable onClose={onClose} />
      ) : (
        <Alert className="warning_alert_static" showIcon={false} banner message={messageAlert} description={textAlert} type="warning" />
      )}
    </div>
  );
};

WarningAlert.defaultProps = {
  isStatic: false
};

export default WarningAlert;
