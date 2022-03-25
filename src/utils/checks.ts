import { RoleEnums } from "../store/User/type";

const checkAccess = (user: RoleEnums[], access: RoleEnums[]) => user.some((userRole) => access.some((accessRole) => accessRole === userRole));

export default checkAccess;
