export const validateInput = (value: string) => value.replace(/[^0-9.]*/g, "");

export const validateNumberInputMax = (value: string) => (value.length > 20 ? value.slice(0, 20) : value);
