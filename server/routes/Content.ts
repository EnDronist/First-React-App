import Server from '@server/Server';
import Express, { Request, Response, NextFunction } from 'express';
import mysql from 'promise-mysql';
import asyncHandler from 'express-async-handler';

import validate from '@utils/validate';
import { PostsAPI, reqVerification as contentVerification } from '@api/content/content';
import { PostControlAPI, verification as createPostVerification } from '@api/content/post-control';
import { DeletePostAPI, verification as deletePostVerification } from '@api/content/delete-post';

// Data from MySQL (raw)
type PostsSQL = Array<{
    id: number;
    header: string;
    description: Buffer;
    username: string;
    comments_count: number;
    date: string;
    tags: Buffer;
}>

export default function (app: Express.Application): void {
    var database = app.get('database') as mysql.Connection;
    var handler = app.get('handler') as typeof asyncHandler;
    app.post('/api/posts', handler(async (req: Request, res: Response, next: NextFunction) => {
        // Body validation
        let reqBody = req.body as PostsAPI['req'];
        if (!validate(reqBody, contentVerification)) {
            res.sendStatus(400 /* Bad request */);
            Server.runtimeInfo[req.id].isSending = true;
            next(); return;
        }
        // Get data from database
        let resBody: PostsAPI['res'] = {};
        let rawData: PostsSQL = await database.query(
            `select posts.id, posts.header, posts.description, users.username, posts.comments_count, 
            date_format(posts.date, '%Y-%m-%d') as date, posts.tags from posts
            join users on users.id = posts.user_id
            order by posts.id desc
            limit ${(reqBody.pageNumber - 1) * reqBody.displayCount}, ${reqBody.displayCount};`
        );
        resBody.postsCount = (await database.query(
            `select count(*) from posts;`
        ))[0]['count(*)'];
        resBody.posts = rawData.map((value): PostsAPI['res']['posts'][0] => {
            let dateArray = value.date.split('-');
            return {
                id: value.id,
                header: value.header,
                description: value.description.toString(),
                username: value.username,
                commentsCount: value.comments_count,
                date: {
                    year: +dateArray[0],
                    month: +dateArray[1],
                    day: +dateArray[2],
                },
                tags: value.tags.toString('utf-8'),
            };
        });
        res.send(resBody);
        Server.runtimeInfo[req.id].isSending = true;
        next();
    }));
    app.post(['/api/create-post', '/api/update-post'], handler(async (req: Request, res: Response, next: NextFunction) => {
        // Authorization check
        if (!req.session.authorization.loggedIn) {
            res.sendStatus(401 /* Unauthorized */);
            Server.runtimeInfo[req.id].isSending = true;
            next(); return;
        }
        // Body validation
        const reqData = req.body as PostControlAPI['req'];
        if (!validate(reqData, createPostVerification)) {
            res.sendStatus(400 /* Bad request */);
            Server.runtimeInfo[req.id].isSending = true;
            next(); return;
        }
        // Preparation data to insert in database
        Object.assign(reqData, {
            header: reqData.header.replace(/\\/g, '\\\\').replace(/"/g, '\\"'),
            description: reqData.description.replace(/\\/g, '\\\\').replace(/"/g, '\\"'),
        });
        // Control post
        let queryComplete: boolean = true;
        if (req.url == '/api/create-post') {
            // Creating post
            await database.query(
                `insert posts(header, description, tags, comments_count, user_id)
                    select "${reqData.header}", "${reqData.description}", "${reqData.tags}",
                    ${Math.floor(Math.random() * 100)}, id
                    from users where username="${req.session.authorization.username}";`
            ).catch(() => { queryComplete = false });
        }
        else if (req.url == '/api/update-post') {
            // Checking post author
            let result: Array<{
                username: string;
                version: number;
            }> = await database.query(
                `select users.username as username, posts.version as version from posts
                    join users on posts.user_id = users.id
                    where posts.id = ${reqData.id};`
            );
            const auth = req.session.authorization;
            if (!(result[0].username == auth.username || auth.isModerator)) {
                res.sendStatus(401 /* Unauthorized */);
                Server.runtimeInfo[req.id].isSending = true;
                next(); return;
            }
            // Copying last post version to deleted posts
            await database.query(
                `insert deleted_posts(date, header, description, comments_count, tags, user_id, version)
                    select date, header, description, comments_count, tags, user_id, version from posts
                    where id = ${reqData.id};`
            );
            // Changing post and increasing version
            await database.query(
                `update posts
                    set
                        header = "${reqData.header}",
                        description = "${reqData.description}",
                        tags = "${reqData.tags}",
                        version = version + 1
                    where id = ${reqData.id};`
            );
        }
        if (!queryComplete) {
            res.sendStatus(500 /* Internal server error */);
            Server.runtimeInfo[req.id].isSending = true;
            next(); return;
        }
        // Getting post ID
        let responce: PostControlAPI['res'] = {
            id: (req.url == '/api/create-post')
                ? (await database.query(`select last_insert_id();`))[0]['last_insert_id()']
                : (req.url == '/api/update-post')
                ? reqData.id : null,
        }
        // Event announcement
        Array(
            `Post #${`${responce.id}`.blue} was ${req.url == '/api/create-post' ? 'created' : 'updated'}`,
            ` by ${req.session.authorization.username.green}\n`,
        ).map(elem => process.stdout.write(elem));
        // Responce
        if (reqData.doReturnInfo) {
            res.send(responce);
            Server.runtimeInfo[req.id].isSending = true;
            next(); return;
        }
        // Completion
        res.sendStatus(200);
        Server.runtimeInfo[req.id].isSending = true;
        next();
    }));
    app.post('/api/delete-post', handler(async (req: Request, res: Response, next: NextFunction) => {
        // Authorization check
        if (!req.session.authorization.loggedIn) {
            res.sendStatus(401 /* Unauthorized */);
            Server.runtimeInfo[req.id].isSending = true;
            next(); return;
        }
        // Body validation
        let reqData = req.body as DeletePostAPI['req'];
        if (!validate(reqData, deletePostVerification)) {
            res.sendStatus(400 /* Bad request */);
            Server.runtimeInfo[req.id].isSending = true;
            next(); return;
        }
        // Cheking post author
        let result: Array<{
            username: string;
        }> = await database.query(
            `select username from users where id in (
                select user_id from posts where id=${reqData.id}
            );`
        );
        const auth = req.session.authorization;
        if (!(result[0].username == auth.username || auth.isModerator)) {
            res.sendStatus(401 /* Unauthorized */);
            Server.runtimeInfo[req.id].isSending = true;
            next(); return;
        }
        // Replacing post in deleted_posts
        let responce: boolean = true;
        await database.query(
            `insert deleted_posts(date, header, description, comments_count, tags, user_id, version)
                select date, header, description, comments_count, tags, user_id, version from posts
                where id=${reqData.id};`
        )
        .catch(err => { console.log(err); responce = false });
        if (!responce) {
            res.sendStatus(409 /* Conflict */);
            Server.runtimeInfo[req.id].isSending = true;
            next(); return;
        }
        // Deleting post
        await database.query(
            `delete from posts where id=${reqData.id};`
        );
        // Event announcement
        console.log(`Post #${`${reqData.id}`.blue} was deleted by ${req.session.authorization.username.green}`);
        // Completion
        res.sendStatus(200);
        Server.runtimeInfo[req.id].isSending = true;
        next();
    }));
}