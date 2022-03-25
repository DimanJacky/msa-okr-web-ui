import { StatusEnums } from "../../store/filters/filters";

export type DrawerHeaderProps = {
  title: string;
  status?: StatusEnums | string | undefined;
  additionalName?: string;
};

export type statusClassNames = {
  draft?: string;
  review?: string;
  rejected?: string;
  active?: string;
  outdate?: string;
  deleted?: string;
};
