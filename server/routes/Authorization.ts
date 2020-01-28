import Server from '@server/Server';
import Express from 'express';
import mysql from 'promise-mysql';
import asyncHandler from 'express-async-handler';
import colors from 'colors';

type Fields = (
    'login' |
    'password'
);
const verification: { [key in Fields]: RegExp } = {
    login: /^[a-zA-Z][a-zA-Z0-9-]{3,31}$/,
    password: /^.{64}$/,
};

export default function(app: Express.Application): void {
    var database = app.get('database') as mysql.Connection;
    var handler = app.get('handler') as typeof asyncHandler;
    app.get('/log-out', handler(async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
        // req.session.
        // If cookie already removed
        if (!('authorization' in req.cookies)) {
            res.sendStatus(200 /* OK */);
            Server.runtimeInfo[req.id].isSending = true;
            return next();
        }
        // Removing cookie
        res.cookie('authorization', '', { maxAge: -1 });
        console.log('Cookie ' + 'authorization'.yellow + ' was removed');
        res.sendStatus(200 /* OK */);
        Server.runtimeInfo[req.id].isSending = true;
        next();
    }));
    app.post(['/sign-in', '/sign-up'], handler(async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
        // Checking request body
        req.body.isCorrectForm = true;
        var cancelForm = (field: Fields | null, errorDescription: string) => {
            req.body = {};
            req.body.errorDescription = errorDescription;
            if (field != null) req.body[field] = true;
            res.status(409 /* Conflict */);
            res.send(req.body);
            Server.runtimeInfo[req.id].isSending = true;
            return next();
        }
        if (!req.body.login)
            return cancelForm('login', 'Login not received');
        if (!req.body.login.match(verification.login))
            return cancelForm('login', 'Login don\'t match');
        if (!req.body.password)
            return cancelForm('password', 'Password not received');
        if (!req.body.password.match(verification.password))
            return cancelForm('password', 'Password don\'t match');
        // Adding cookie to responce
        if (req.url === '/sign-in') {
            var kek = await database.query(`select count(*) from users
                where username = '${req.body.login}' and password = '${req.body.password}';`);
            if (kek[0]['count(*)'] == 0)
                return cancelForm(null, 'Invalid username or password');
        }
        else if (req.url === '/sign-up') {
            var kek = await database.query(`select count(*) from users where username = '${req.body.login}';`);
            if (kek[0]['count(*)'] != 0)
                return cancelForm(null, 'This username is already taken');
            await database.query(`insert users(username, password)
                values('${req.body.login}', '${req.body.password}');`);
        }
        // Setting cookie
        res.cookie('authorization',
        JSON.stringify({
            username: req.body.login,
            password: req.body.password,
        }), {
            maxAge: 10 * 60 * 1000,
            httpOnly: true,
            secure: true,
        }
        );
        console.log('Cookie ' + 'authorization'.yellow + ' was set');
        res.sendStatus(200);
        Server.runtimeInfo[req.id].isSending = true;
        next();
        // console.log('Redirecting to ' + '/react'.cyan);
        // return res.redirect('/react');
        // req.session.login = req.body.login;
        // req.session.password = req.body.password;
        // console.log('Redirecting to ' + '/authorization'.cyan);
        // return res.redirect(303, '/authorization');
    }));
}