export type FormItemsEditKeyTargetProps = {
  valuePlan: string | undefined;
  valueChallenge: string | undefined;
  valueDescription: string | undefined;
  isInteger: boolean;
  isErrorPlan: boolean;
  isErrorDescription: boolean;
  isErrorChallenge: boolean;
  setValuePlan: (plan: string | undefined) => void;
  setValueChallenge: (challenge: string | undefined) => void;
  setValueDescription: (description: string | undefined) => void;
  setIsErrorPlan: (value: boolean) => void;
  setIsInteger: (value: boolean) => void;
  setIsErrorChallenge: (value: boolean) => void;
  setIsErrorDescription: (value: boolean) => void;
  disabled?: boolean;
};
