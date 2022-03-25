import STATUS_PERIODS from "./constants";

export const getActiveStatusPeriod = (period: string) => period === STATUS_PERIODS.ACTIVE;

export const isNowDateInTwoMonth = (nowDate: Date, startDate: Date) => startDate.setMonth(startDate.getMonth() + 2) - Number(nowDate) > 0;
