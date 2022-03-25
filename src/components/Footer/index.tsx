import React from "react";

import styles from "./index.module.css";
import logoFooter from "../../images/logoFooter.svg";

type FooterType = {
  text: string[];
};

const Footer = ({ text }: FooterType) => (
  <footer className={styles.footer}>
    <img className={styles.img} src={logoFooter} alt="logo" />
    <ul>
      {text.map((item) => (
        <li className={styles.wrapperText}>
          <p className={styles.text}>{item}</p>
        </li>
      ))}
    </ul>
  </footer>
);

export default Footer;
