import React, { useCallback } from "react";
import { NavLink } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import chevronDown from "../../images/chevron-down.svg";
import styles from "./style.module.css";
import logo from "../../images/logo.svg";
import exit from "../../images/exit.svg";
import profile from "../../images/profile.svg";
import { useAppSelector } from "../../store";
import URL_LINKS_UNITS from "../../constants/URL/links";
import IconQuestion from "../../images/icon_question.svg";
import IconSearch from "../../images/icon_search.svg";

const Header = () => {
  const fullname = useAppSelector((state) => state.user);
  const { keycloak } = useKeycloak();

  const logout = useCallback(() => {
    keycloak?.logout();
  }, [keycloak]);

  const renderUnitLinks = () => URL_LINKS_UNITS.map((link) => (
    <NavLink to={link.to} exact={link.exact}>
      {link.label}
    </NavLink>
  ));

  return (
    <div className={styles.navbar}>
      <div className={styles.logo}>
        <img src={logo} alt="Logo" />
      </div>
      <div className={styles.navbar_wrapper}>
        <div className={styles.main_nav}>
          <NavLink to="/">Все</NavLink>
          {renderUnitLinks()}
        </div>
        <div className={styles.right_block}>
          <div className={styles.icons_block}>
            <NavLink to="/">
              <img src={IconSearch} alt="IconSearch" />
            </NavLink>
            <NavLink to="/">
              <img src={IconQuestion} alt="IconQuestion" />
            </NavLink>
          </div>
          <span className={styles.btn_language}>
            RU
            <img className={styles.chevron_down} src={chevronDown} alt="ChevronDown" />
          </span>
          <NavLink to="/">
            <img src={profile} className={styles.profile_icon} alt="profile" />
          </NavLink>
          <NavLink to="/">
            <span className={styles.profile_name}>{fullname.name}</span>
          </NavLink>
          <NavLink onClick={logout} to="/login">
            <img src={exit} className={styles.exit_icon} alt="exit" />
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Header;
