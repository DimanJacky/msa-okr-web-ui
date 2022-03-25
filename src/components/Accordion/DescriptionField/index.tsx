import React from "react";
import { Input } from "antd";
import styles from "../index.module.css";

type DescriptionFieldType = {
  handleChangeValueDescription: any;
  defaultValue: string | undefined;
  setIsErrorDescription: any;
};

const DescriptionField = ({ handleChangeValueDescription, defaultValue, setIsErrorDescription }: DescriptionFieldType) => {
  const { TextArea } = Input;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleChangeValueDescription(e.currentTarget.value);
    if (e.currentTarget.value.length > 2000) {
      setIsErrorDescription(true);
    } else {
      setIsErrorDescription(false);
    }
  };

  return <TextArea rows={4} defaultValue={defaultValue} placeholder="Введите алгоритм расчета" maxLength={2000} className={styles.description_field} onChange={handleChange} />;
};

export default DescriptionField;
