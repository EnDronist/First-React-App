/* Includes */
// Server
import Express, { Request, Response, NextFunction, RequestHandler } from 'express';
import https from 'https';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import requestId from 'express-request-id';
import asyncHandler from 'express-async-handler';
// Routes
import authorization from '@routes/Authorization';
import content from '@routes/Content';
// JSON
import serverConfig from './server-config.json';
import postsInfo from '@public/info/postsInfo.json';
import globalButtonsInfo from '@public/info/globalButtonsInfo.json';
// MySQL
import mysql, {mysqlModule} from 'promise-mysql';
// Utilities
import fs from 'fs';
import path from 'path';
import minimist from 'minimist';
import 'colors';

// Get command line arguments
var argv = minimist(process.argv.slice(2));
// Argument "with_errors" makes server unstable to errors (for debug)
var handler: (handler: RequestHandler) => RequestHandler;
if (argv._.includes('with_errors')) {
    console.log('"with_errors" is enabled');
    handler = (handler: RequestHandler): RequestHandler => (handler)
}
else handler = asyncHandler;
// Argument "post" indicates the port that the server will listen
var port: number = 3000; // default
if (argv['port'] != undefined) {
    port = argv['port'];
    console.log('"port" specified by ' + port);
}

export default class Server {
    // JSON files
    static filesJSON = {
        // postsInfo: JSON.parse(fs.readFileSync('../public/info/postsInfo.json').toString()),
        // globalButtonsInfo: JSON.parse(fs.readFileSync('../public/info/globalButtonsInfo.json').toString()),
        postsInfo: postsInfo,
        globalButtonsInfo: globalButtonsInfo,
    };
    public static runtimeInfo: {
        [key in Request['id']]: {
            startTime?: number,
            isSending: boolean,
            endTime?: number,
        }
    } = {};
    constructor() {}
    async run(): Promise<void> {
        // MySQL connecting
        console.log('Connecting to database...');
        var database: mysql.Connection = await mysql.createConnection(serverConfig.database)
            .catch(err => { console.log('Connecting failed: ' + err.message); return null; });
        if (!database) return;
        console.log('Connection established successfully');
        // Creating app
        const app = Express();

        // Filling handlers
        app.set('path', path);
        app.set('fs', fs);
        app.set('mysql', mysql);
        app.set('database', database);
        app.set('handler', handler);

        // Template engine (depricated)
        // app.set('view engine', 'ejs');

        // Public folder
        app.use('/public', Express.static('../public'));
        app.use('/bundle.js', Express.static('../client/bundle.js'));
        app.use('/favicon.ico', Express.static('../public/favicon.ico'));

        // Parsers
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());
        app.use(cookieParser());
        app.use(requestId());

        // Other
        app.use(session({
            secret: 'secret',
            resave: true,
            saveUninitialized: true,
        }));

        // Start
        app.use(/.*/, async (req: Request, res: Response, next: NextFunction) => {
            Server.runtimeInfo[req.id] = {
                startTime: new Date().getTime(),
                isSending: false,
            };
            // Printing time
            process.stdout.write(new Date().toLocaleTimeString('en-GB').green + ': ');
            // Printing method
            process.stdout.write(req.method === 'GET' ? 'GET'.blue : 'POST'.blue);
            // Printing other
            process.stdout.write(` from ${req.socket.remoteAddress.magenta} to ${req.originalUrl.cyan}`);
            // req.get('host'); // host IP-address
            // console.log('Cookies: ' + JSON.stringify(req.cookies)); // prints client cookies
            next();
        });

        // Authorization (must be first route)
        authorization(app);

        // Content
        content(app);

        // React App
        app.get(/.*/, handler(async (req: Request, res: Response, next: NextFunction) => {
            if (!Server.runtimeInfo[req.id].isSending) {
                res.sendFile(path.resolve('../client/index.html'));
                Server.runtimeInfo[req.id].isSending = true;
            }
            next();
        }));

        // End
        app.get(/.*/, async (req: Request, res: Response, next: NextFunction) => {
            if (!Server.runtimeInfo[req.id].isSending) res.send(`<h1>Результат по запросу "${req.url}" не найден.</h1>`); next();
        });
        app.post(/.*/, async (req: Request, res: Response, next: NextFunction) => {
            if (!Server.runtimeInfo[req.id].isSending) res.sendStatus(400); next();
        });
        app.use(/.*/, async (req: Request, res: Response) => {
            let currentInfo = Server.runtimeInfo[req.id];
            currentInfo.endTime = new Date().getTime();
            console.log(`Successfully sended [${res.statusCode}, ${currentInfo.endTime - currentInfo.startTime}ms]`);
            delete Server.runtimeInfo[req.id];
        });
        // End with error
        app.use(async (err: any, req: Request, res: Response, next: NextFunction) => {
            let currentInfo = Server.runtimeInfo[req.id];
            if (currentInfo == undefined) return;
            currentInfo.endTime = new Date().getTime();
            console.log(`Error [${currentInfo.endTime - currentInfo.startTime}ms]: ${err}`);
            delete Server.runtimeInfo[req.id];
            res.sendStatus(500);
        });

        // Listening port
        https.createServer({
            key: fs.readFileSync('../secure/localhost.key'),
            cert: fs.readFileSync('../secure/localhost.crt'),
        }, app)
        .listen(port, () => console.log(`Server running at https://localhost:${port}/`));
    }
}
// Starting server
new Server().run();