// Values
export type ValueOf<T> = T[keyof T];

export type ValuesOf<T> = keyof T[keyof T];

export type ArrayValue<T extends Array<any>> = T extends (infer U)[] ? U : never;

// Validation
export type Validation<T> = { [key in keyof T]: (value: T[key]) => boolean };

// Keys
export type RequiredKeys<T> = { [K in keyof T]-?:
    string extends K ? never : number extends K ? never : {} extends Pick<T, K> ? never : K
} extends { [_ in keyof T]-?: infer U } ? U extends keyof T ? U : never : never;

export type WithRequiredKeys<T> = { [key in RequiredKeys<T>]: T[key] };

export type OptionalKeys<T> = { [K in keyof T]-?:
    string extends K ? never : number extends K ? never : {} extends Pick<T, K> ? K : never
} extends { [_ in keyof T]-?: infer U } ? U extends keyof T ? U : never : never;

export type WithOptionalKeys<T> = { [key in OptionalKeys<T>]: T[key] };