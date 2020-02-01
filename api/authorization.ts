type Fields = {
    'login',
    'password',
}
export const verification: { [key in keyof Fields]: RegExp } = {
    login: /^[a-zA-Z]{1}[a-zA-Z0-9-]{3,31}$/, // 4-32 symbols
    password: /^[a-zA-Z0-9_-]{8,32}$/,
};
export type AuthorizationCookie = {
    username: string;
    password: string;
}
export type LoginAttempt = {
    res: {
        username: string;
    }
}