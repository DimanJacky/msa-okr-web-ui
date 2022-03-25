import { StatusEnums } from "../store/filters/filters";
import { statusClassNames } from "../modules/DrawerHeader/type";

const getClassNameStatus = (type: StatusEnums | string | undefined, classnames: statusClassNames) => {
  let className: string | undefined = "";

  switch (type) {
    case StatusEnums.DRAFT:
      className = classnames.draft;
      break;
    case StatusEnums.REVIEW:
      className = classnames.review;
      break;
    case StatusEnums.REJECTED:
      className = classnames.rejected;
      break;
    case StatusEnums.ACTIVE:
      className = classnames.active;
      break;
    case StatusEnums.OUTDATE:
      className = classnames.outdate;
      break;
    case StatusEnums.DELETED:
      className = classnames.deleted;
      break;
    default:
      break;
  }

  return className;
};

export default getClassNameStatus;
