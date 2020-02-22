import Server from '@server/Server';
import Express, { NextFunction, Response, Request } from 'express';
import mysql from 'promise-mysql';
import asyncHandler from 'express-async-handler';
import { verification, AuthorizationCookieAPI, LoginAttemptAPI, AuthorizationAPI } from '@api/authorization';
import 'colors';
import { PostsAPI } from '@api/content/content';

export default function(app: Express.Application): void {
    var database = app.get('database') as mysql.Connection;
    var handler = app.get('handler') as typeof asyncHandler;

    // Authorization check [IMPORTANT]
    app.use(/.*/, handler(async (req: Request, res: Response, next: NextFunction) => {
        // Initialization
        if (req.session.authorization == undefined) {
            req.session.authorization = {
                username: '',
                password: '',
                isModerator: false,
                loggedIn: false,
            }
        }
        // Checking
        const authorization = req.session.authorization;
        if (!authorization.loggedIn && 'authorization' in req.cookies) {
            let cookieBody = JSON.parse(req.cookies['authorization']) as AuthorizationCookieAPI;
            let responce = await database.query(`select count(*), is_moderator from users
                where username = '${cookieBody.username}' and password = '${cookieBody.password}';`);
            // If account exists and cookie body is valid
            if (responce[0]['count(*)'] != 0) {
                // Logging in
                Object.assign(authorization, {
                    username: cookieBody.username,
                    password: cookieBody.password,
                    isModerator: responce[0]['is_moderator'],
                    loggedIn: true,
                });
            }
            // If cookie body is not valid
            else {
                // Removing cookie
                res.cookie('authorization', '', { maxAge: -1 });
                authorization.loggedIn = false;
                // console.log('Cookie ' + 'authorization'.yellow + ' was removed');
                console.log(`User ${req.socket.remoteAddress}[${authorization.username}] logged out due invalid cookie`);
            }
        }
        console.log(' by ' + (authorization.loggedIn ? authorization.username.green : 'Guest'.yellow));
        next();
    }));

    // When react app is started
    app.get('/authorization', handler(async (req: Request, res: Response, next: NextFunction) => {
        if (req.session.authorization.loggedIn) {
            let responceBody: LoginAttemptAPI['res'] = {
                username: req.session.authorization.username,
                isModerator: req.session.authorization.isModerator,
            };
            res.send(responceBody);
            Server.runtimeInfo[req.id].isSending = true;
            return next();
        }
        res.sendStatus(401 /* Unauthorized */);
        Server.runtimeInfo[req.id].isSending = true;
        next();
    }));

    app.get('/log-out', handler(async (req: Request, res: Response, next: NextFunction) => {
        // If cookie already removed
        if (!('authorization' in req.cookies)) {
            res.sendStatus(200 /* OK */);
            Server.runtimeInfo[req.id].isSending = true;
            return next();
        }
        // Removing cookie
        res.cookie('authorization', '', { maxAge: -1 });
        req.session.authorization.loggedIn = false;
        // console.log('Cookie ' + 'authorization'.yellow + ' was removed');
        console.log(`User ${req.socket.remoteAddress.magenta}[${req.session.authorization.username.green}] logged out`);
        res.sendStatus(200 /* OK */);
        Server.runtimeInfo[req.id].isSending = true;
        next();
    }));

    app.post(['/sign-in', '/sign-up'], handler(async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
        // Checking request body
        const reqData = req.body as AuthorizationAPI['req'];
        var resData: AuthorizationAPI['res'] = {};
        var isCorrectForm = true;
        var cancelForm = (field: keyof typeof verification | null, errorDescription: string) => {
            res.status(409 /* Conflict */);
            resData.error = {
                errorDescription: errorDescription,
                fields: field ? { [field]: true } : {},
            };
            res.send(resData);
            Server.runtimeInfo[req.id].isSending = true;
            return next();
        }
        if (reqData.username == undefined)
            return cancelForm('username', 'Login not received');
        if (!verification.username.test(reqData.username))
            return cancelForm('username', 'Login don\'t match');
        if (reqData.password == undefined)
            return cancelForm('password', 'Password not received');
        if (!/^.{64}$/.test(reqData.password))
            return cancelForm('password', 'Password don\'t match');
        // Adding cookie to responce
        if (req.url === '/sign-in') {
            let result = await database.query(`select count(*), is_moderator from users
                where username = '${reqData.username}' and password = '${reqData.password}';`);
            if (result[0]['count(*)'] == 0)
                return cancelForm(null, 'Invalid username or password');
            resData.success = {
                username: reqData.username,
                isModerator: result[0]['is_moderator'],
            };
        }
        else if (req.url === '/sign-up') {
            let result = await database.query(`select count(*), is_moderator from users where username = '${reqData.username}';`);
            if (result[0]['count(*)'] != 0)
                return cancelForm(null, 'This username is already taken');
            await database.query(`insert users(username, password)
                values('${reqData.username}', '${reqData.password}');`);
            resData.success = {
                username: reqData.username,
                isModerator: result[0]['is_moderator'],
            };
        }
        // Setting cookie
        let cookieBody: AuthorizationCookieAPI = {
            username: reqData.username,
            password: reqData.password,
        }
        res.cookie('authorization', JSON.stringify(cookieBody), {
            maxAge: 10 * 60 * 1000,
            httpOnly: true,
            secure: true,
        });
        // Authorization
        // console.log('Cookie ' + 'authorization'.yellow + ' was set');
        console.log(`User ${req.socket.remoteAddress.magenta} logged in as ${cookieBody.username.green}`);
        res.send(resData);
        Server.runtimeInfo[req.id].isSending = true;
        next();
    }));
}