import React from "react";
import { JsxChild } from "typescript";
import { Typography } from "antd";

type PropsType = {
  children: JsxChild | string | string[] | undefined | null;
  color: string;
};

const TextDrawer = ({ children, color }: PropsType) => {
  const { Text } = Typography;
  return (
    <Text
      style={{
        fontSize: "14px",
        marginBottom: "8px",
        wordBreak: "break-word",
        color
      }}
    >
      {children}
    </Text>
  );
};

export default TextDrawer;
