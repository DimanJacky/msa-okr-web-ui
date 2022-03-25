import React, { FC } from "react";
import { Alert, Button } from "antd";
import "./style.css";

type PropsType = {
  messageAlert: string;
  descriptionAlert: string;
  setVisibleCompanyTarget: any;
};

const EmptyObjectivesInformationAlert: FC<PropsType> = ({ messageAlert, descriptionAlert, setVisibleCompanyTarget }) => (
  <div className="information_message">
    <Alert
      action={(
        <Button className="btn_info" size="small" onClick={() => setVisibleCompanyTarget(true)}>
          Создать цель
        </Button>
      )}
      className="information_alert"
      message={messageAlert}
      description={descriptionAlert}
      type="info"
      showIcon
    />
  </div>
);

export default EmptyObjectivesInformationAlert;
