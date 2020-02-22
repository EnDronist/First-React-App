type Fields = {
    'username',
    'password',
}
export const verification: { [key in keyof Fields]: RegExp } = {
    username: /^[a-zA-Z]{1}[a-zA-Z0-9-]{3,31}$/, // 4-32 symbols
    password: /^[a-zA-Z0-9_-]{8,32}$/,
};
export type AuthorizationAPI = {
    // Data from client to server
    req: {
        username: string;
        password: string;
    }
    // Data from server to client
    res: {
        // Success (200 OK)
        success?: {
            username: string;
            isModerator: boolean;
        }
        // Error (409 Conflict)
        error?: {
            errorDescription: string;
            fields: { [key in keyof Fields]?: boolean }; // true - incorrect data, undefined - correct data
        }
    }
}
export type AuthorizationCookieAPI = {
    username: string;
    password: string;
}
export type Login1AttemptAPI = {
    res: AuthorizationAPI['res']['success'];
}