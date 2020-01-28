/* Includes */
// Server
import Express, { Request } from 'express';
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
import postsInfo from '@public/info/postsInfo.json';
import globalButtonsInfo from '@public/info/globalButtonsInfo.json';
// MySQL
import mysql from 'promise-mysql';
// Utilities
import fs from 'fs';
import path from 'path';
import minimist from 'minimist';
import colors from 'colors';

// Get command line arguments
var argv = minimist(process.argv.slice(2));
// Argument "with_errors" makes server unstable to errors (for debug)
var handler: (handler: Express.RequestHandler) => Express.RequestHandler;
if (argv._.includes('with_errors')) {
    console.log('"with_errors" is enabled');
    handler = (handler: Express.RequestHandler): Express.RequestHandler => (handler)
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
        postsInfo: JSON.parse(fs.readFileSync('../public/info/postsInfo.json').toString()),
        globalButtonsInfo: JSON.parse(fs.readFileSync('../public/info/globalButtonsInfo.json').toString()),
        // postsInfo: postsInfo,
        // globalButtonsInfo: globalButtonsInfo,
    };
    public static runtimeInfo: {
        [key in Express.Request['id']]: {
            startTime?: number,
            isSending: boolean,
            endTime?: number,
        }
    } = {};
    constructor() {}
    async run(): Promise<void> {
        // MySQL connecting
        console.log('Connecting to database...');
        var database: mysql.Connection;
        try {
            database = await mysql.createConnection({
                host: "localhost",
                user: "root",
                database: "nodejs",
                password: "12345",
            });
        }
        catch (err) {
            console.log('Connecting failed: ' + err.message);
            return;
        }
        console.log('Connection established successfully');

        // Creating app
        const app = Express();

        // Filling handlers
        app.set('path', path);
        app.set('fs', fs);
        app.set('colors', colors);
        app.set('mysql', mysql);
        app.set('database', database);
        app.set('handler', handler);

        // Template engine
        app.set('view engine', 'ejs');

        // Public folder
        app.use('/public', Express.static('public'), );
        app.use('/bundle.js', Express.static('../client/bundle.js'));
        app.use('/favicon.ico', () => null);

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
        app.use('*', async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
            Server.runtimeInfo[req.id] = {
                startTime: new Date().getTime(),
                isSending: false,
            };
            // Printing time
            process.stdout.write(`${new Date().toLocaleTimeString('en-GB')}`.green + ': ');
            // Printing method
            if (req.method === 'GET') process.stdout.write('GET'.blue);
            else process.stdout.write('POST'.blue);
            // Printing other
            console.log(' from ' + `${req.socket.remoteAddress}`.magenta + ' to ' + `${req.originalUrl}`.cyan);
            // req.get('host'); // host IP-address
            console.log('Cookies: ' + JSON.stringify(req.cookies));
            next();
        });

        app.get('/api/:rest', handler(async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
            next();
        }));

        // Gets
        app.get('/', handler(async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
            // postsInfo
            var postsInfo: {
                pageNumber?: number,
                displayCount?: {
                    value?: number,
                    options?: Array<number>,
                    default?: number,
                },
                monthRus?: { [key: number]: string },
                postsCount?: number,
                pagesCount?: number,
                // From MySQL
                rawPosts?: Array<{
                    header?: string,
                    description?: string,
                    username?: string,
                    comments_count?: number,
                    date?: string,
                    tags?: Buffer,
                }>,
                posts?: Array<{
                    header?: string,
                    description?: string,
                    username?: string,
                    comments_count?: number,
                    date?: { year: number, month: number, day: number },
                    tags?: Array<string>,
                }>,
            } = {};
            // Posts display options
            {
                if ('pageNumber' in req.query) {
                    postsInfo.pageNumber = parseInt(req.query.pageNumber);
                    if (isNaN(postsInfo.pageNumber)) { res.sendStatus(500); return; }
                    if (postsInfo.pageNumber < 1) postsInfo.pageNumber = 1;
                }
                else postsInfo.pageNumber = 1;
                postsInfo.displayCount = Server.filesJSON.postsInfo.displayCount;
                var displayCount = postsInfo.displayCount;
                if ('postsDisplayCount' in req.query) {
                    displayCount.value = parseInt(req.query.postsDisplayCount);
                    if (isNaN(displayCount.value)) { res.sendStatus(500); return; }
                    if (!displayCount.options.includes(displayCount.value)) {
                        displayCount.value = displayCount.default;
                    }
                }
                else displayCount.value = displayCount.default;
                postsInfo.monthRus = Server.filesJSON.postsInfo.monthRus;
                postsInfo.postsCount = (await database.query(
                    `select count(*) from posts;`
                ))[0]['count(*)'];
                postsInfo.pagesCount = Math.ceil(postsInfo.postsCount / postsInfo.displayCount.value);
            }
            // Posts
            postsInfo.rawPosts = await database.query(
                `select posts.header, posts.description, users.username, posts.comments_count, 
                date_format(posts.date, '%Y-%m-%d') as date, posts.tags from posts
                join users on users.id = posts.user_id
                order by posts.id desc
                limit ${(postsInfo.pageNumber - 1) * postsInfo.displayCount.value}, ${postsInfo.displayCount.value};`
            );
            postsInfo.posts = [];
            for (var postNum in postsInfo.rawPosts) {
                postsInfo.posts[postNum] = {};
                var rawPost = postsInfo.rawPosts[postNum];
                var post = postsInfo.posts[postNum];
                post.header = rawPost.header;
                post.description = rawPost.description;
                post.username = rawPost.username;
                post.comments_count = rawPost.comments_count;
                var dateArray = rawPost.date.split('-');
                post.date = {
                    year: +dateArray[0],
                    month: +dateArray[1],
                    day: +dateArray[2],
                };
                post.tags = rawPost.tags.toString('utf-8').split(' ');
            }
            // Authorization
            var authorization = null;
            if ('authorization' in req.cookies) {
                var cookie = JSON.parse(req.cookies.authorization);
                var result = await database.query(`select count(*) from users
                    where username = '${cookie.username}' and password = '${cookie.password}';`);
                if (result[0]['count(*)'] !== 0) {
                    authorization = {
                        username: cookie.username,
                    };
                }
            }
            // Rendering
            res.render('index', {
                globalButtons: Server.filesJSON.globalButtonsInfo,
                postsInfo: postsInfo,
                authorization: authorization,
                surprise: req.socket.remoteAddress === '::1' ? 'Hello, Localhost!' : 'Hello, Noname!',
            });
            Server.runtimeInfo[req.id].isSending = true;
            next();
        }));

        // Authorization
        authorization(app);

        // Content
        content(app);

        //React
        app.get('/react', handler(async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
            res.sendFile(path.resolve('../client/index.html'));
            Server.runtimeInfo[req.id].isSending = true;
            next();
        }));
        
        // End
        app.get('*', async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
            if (!Server.runtimeInfo[req.id].isSending) res.send(`<h1>Результат по запросу "${req.url}" не найден.</h1>`); next();
        });
        app.post('*', async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
            if (!Server.runtimeInfo[req.id].isSending) res.sendStatus(400); next();
        });
        app.use('*', async (req: Express.Request, res: Express.Response) => {
            let currentInfo = Server.runtimeInfo[req.id];
            currentInfo.endTime = new Date().getTime();
            console.log(`Successfully sended [${currentInfo.endTime - currentInfo.startTime}ms]`);
            delete Server.runtimeInfo[req.id];
        });
        // End with error
        app.use(async (err: any, req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
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
        .listen(port, () => console.log(`Server running at http://localhost:${port}/`));
    }
}
// Starting server
new Server().run();