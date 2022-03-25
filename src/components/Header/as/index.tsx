import React from "react";
import { Collapse } from "antd";

interface Props {
  id: number;
  title: string;
  titleTwo: string;
  secondary: string;
}

const AccordionItem: React.FC<Props> = ({
  title, id, titleTwo, secondary
}) => (
  <Collapse accordion expandIconPosition="right">
    <Collapse.Panel header={title} key={id}>
      <div className="accordion_item_list">
        <Collapse accordion expandIconPosition="right">
          <Collapse.Panel header={titleTwo} key={`${id}_${title}`}>
            <ul>
              <li>{secondary}</li>
              <li>{secondary}</li>
              <li>{secondary}</li>
            </ul>
          </Collapse.Panel>
        </Collapse>
      </div>
    </Collapse.Panel>
  </Collapse>
);

export default AccordionItem;
