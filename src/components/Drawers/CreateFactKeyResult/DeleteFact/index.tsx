import React from "react";
import {
  Button, Checkbox, Col, Drawer, Form, Input, Row, Typography
} from "antd";
import { DeleteFactProps } from "../types";
import DrawerHeader from "../../../../modules/DrawerHeader";
import styles from "../styles.module.css";
import WarningAlert from "../../../../modules/WarningAlert";

const DeleteFact = ({
  visibleDeleteFact, setVisibleDeleteFact, keyResultName, onCloseEditFact
}: DeleteFactProps) => {
  const { Text } = Typography;

  const [form] = Form.useForm();

  const onClose = () => {
    setVisibleDeleteFact(false);
  };

  const deleteFactKr = () => {
    // TODO: не реализован метод удаления
    onClose();
    onCloseEditFact();
  };

  const renderTitle = () => <DrawerHeader title="Удаление Факта КР" additionalName="" />;

  const renderFooter = () => (
    <div className={styles.footer_container}>
      <Row gutter={16} className={styles.footer_comments}>
        <Col span={24}>
          <div className={styles.footer_buttons}>
            <div>
              <Button size="large" className="btn_key_result_save" onClick={deleteFactKr} style={{ marginLeft: "10px" }}>
                Удалить
              </Button>
              <Button size="large" className="btn_key_result_clear" onClick={onClose} style={{ marginLeft: "20px" }}>
                Отменить
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );

  return (
    <Drawer
      onClose={onClose}
      visible={visibleDeleteFact}
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
            <WarningAlert messageAlert="" textAlert="Факт ключевого результата удалится без возможности восстановления." />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name="targetName" label={<div className={styles.lable_article}>Название ключевого результата</div>}>
              <Text>
                <Input className="dis_input" disabled value={keyResultName} />
              </Text>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <div className={styles.checkbox_wrapper}>
              <Checkbox name="hard_delete" defaultChecked disabled>
                Удалить без возможности восстановления
              </Checkbox>
            </div>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

export default DeleteFact;
