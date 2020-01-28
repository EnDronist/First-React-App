export type ValueOf<T> = T[keyof T];
export type ValuesOf<T> = keyof T[keyof T];
export type ArrayValue<T extends Array<any>> = T extends (infer U)[] ? U : never;
export type Validation<T> = { [key in keyof T]: (value: T[key]) => boolean };