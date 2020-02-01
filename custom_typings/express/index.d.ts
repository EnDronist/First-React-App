declare namespace Express {
    interface Request {
        id: string;
    }
    interface Session extends SessionData {
        authorization: {
            username: string;
            password: string;
            loggedIn: boolean;
        }
    }
}