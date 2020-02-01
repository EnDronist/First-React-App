import Server from '@server/Server';
import Express, { NextFunction, Response, Request } from 'express';
import mysql from 'promise-mysql';
import asyncHandler from 'express-async-handler';
import { verification, AuthorizationCookie, LoginAttempt } from '@api/authorization';
import 'colors';

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
                loggedIn: false,
            }
        }
        // Checking
        const authorization = req.session.authorization;
        if (!authorization.loggedIn && 'authorization' in req.cookies) {
            let cookieBody = JSON.parse(req.cookies['authorization']) as AuthorizationCookie;
            let responce = await database.query(`select count(*) from users
                where username = '${cookieBody.username}' and password = '${cookieBody.password}';`);
            // If account exists and cookie body is valid
            if (responce[0]['count(*)'] != 0) {
                // Logging in
                Object.assign(authorization, {
                    username: cookieBody.username,
                    password: cookieBody.password,
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
            let responceBody: LoginAttempt['res'] = {
                username: req.session.authorization.username
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
        req.body.isCorrectForm = true;
        var cancelForm = (field: keyof typeof verification | null, errorDescription: string) => {
            req.body = {};
            req.body.errorDescription = errorDescription;
            if (field != null) req.body[field] = true;
            res.status(409 /* Conflict */);
            res.send(req.body);
            Server.runtimeInfo[req.id].isSending = true;
            return next();
        }
        if (req.body.login == undefined)
            return cancelForm('login', 'Login not received');
        if (!verification.login.test(req.body.login))
            return cancelForm('login', 'Login don\'t match');
        if (req.body.password == undefined)
            return cancelForm('password', 'Password not received');
        if (!/^.{64}$/.test(req.body.password))
            return cancelForm('password', 'Password don\'t match');
        // Adding cookie to responce
        if (req.url === '/sign-in') {
            let kek = await database.query(`select count(*) from users
                where username = '${req.body.login}' and password = '${req.body.password}';`);
            if (kek[0]['count(*)'] == 0)
                return cancelForm(null, 'Invalid username or password');
        }
        else if (req.url === '/sign-up') {
            let kek = await database.query(`select count(*) from users where username = '${req.body.login}';`);
            if (kek[0]['count(*)'] != 0)
                return cancelForm(null, 'This username is already taken');
            await database.query(`insert users(username, password)
                values('${req.body.login}', '${req.body.password}');`);
        }
        // Setting cookie
        let cookieBody: AuthorizationCookie = {
            username: req.body.login,
            password: req.body.password,
        }
        res.cookie('authorization', JSON.stringify(cookieBody), {
            maxAge: 10 * 60 * 1000,
            httpOnly: true,
            secure: true,
        });
        // Authorization
        // console.log('Cookie ' + 'authorization'.yellow + ' was set');
        console.log(`User ${req.socket.remoteAddress.magenta} logged in as ${cookieBody.username.green}`);
        res.sendStatus(200);
        Server.runtimeInfo[req.id].isSending = true;
        next();
    }));
}