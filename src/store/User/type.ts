export enum RoleEnums {
  DEFAULT_ROLES_OKR = "default-roles-okr",
  OFFLINE_ACCESS = "offline_access",
  UMA_AUTHORIZATION = "uma_authorization",
  OKR_ADMIN = "OKR Admin",
  OKR_MASTER = "OKR Master"
}

type UserState = {
  name: string;
  email: string;
  role: RoleEnums[];
};

export type { UserState };
