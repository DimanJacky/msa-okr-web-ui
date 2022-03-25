import { KeyTargetDataType } from "../../components/Drawers/CreateKeyTargetDrawer";

const keyTargetData: KeyTargetDataType = {
  selectTypes: [
    { id: 1, type: "percentage", text: "%" },
    { id: 2, type: "money", text: "деньги" },
    { id: 3, type: "pieces", text: "штуки" },
    { id: 4, type: "people", text: "люди" },
    { id: 5, type: "certificates", text: "сертификаты" }
  ],
  errorEmpty: {
    validateStatus: "",
    help: ""
  },
  errorInteger: {
    validateStatus: "error",
    help: "Введите целое значение для факта КР"
  },
  errorDescription: {
    validateStatus: "error",
    help: "Превышение количества символов"
  }
};

export default keyTargetData;
