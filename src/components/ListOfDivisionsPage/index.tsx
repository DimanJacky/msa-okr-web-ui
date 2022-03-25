import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router";
import { Col, Row } from "antd";
import styles from "./style.module.css";
import { useAppDispatch, useAppSelector } from "../../store";
import actions from "./actions";
import URL_LINKS_UNITS from "../../constants/URL/links";

const ListOfDivisionsPage: React.FC = () => {
  const { id } = useParams<{ id: any }>();
  const { push } = useHistory();
  const nameUnit = URL_LINKS_UNITS.find((link) => link.id === +id);
  if (id && !nameUnit) {
    push("/");
  }
  const name = !id ? "Все" : nameUnit?.label;
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.units);
  useEffect(() => {
    dispatch(actions.getUnits(id));
  }, [id]);
  const switchToAccordion = (unitId: number) => {
    push(`/units_targets/${unitId}`);
  };

  return (
    <div className={styles.site_card_wrapper}>
      <div className={styles.page_name}>{name}</div>
      <Row gutter={[16, 16]}>
        {data.map((item: any) => (
          <Col className="gutter-row" sm={24} md={12} lg={8} xl={6} key={item.id} onClick={() => switchToAccordion(item.id)}>
            <div role="button" tabIndex={0} onKeyDown={() => null} onClick={() => {}} className={styles.site_card}>
              <h3 className={styles.name_division}>{item.name}</h3>
              <h4 className={styles.name_of_the_head}>{item.supervisor}</h4>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ListOfDivisionsPage;
