import Server from '@server/Server';
import Express from 'express';
import mysql from 'promise-mysql';
import asyncHandler from 'express-async-handler';

import { Validation } from '@utils/types';
import validate from '@utils/validate';
import { Posts } from '@api/content';

const postsReqCheck: Validation<Posts['req']> = {
    pageNumber: value => typeof(value) == 'number' && value >= 1,
    displayCount: value => typeof(value) == 'number' &&
        Server.filesJSON.postsInfo.displayCount.options.includes(value),
}
// Data from MySQL (raw)
type PostsSQL = Array<{
    header: string,
    description: Buffer,
    username: string,
    comments_count: number,
    date: string,
    tags: Buffer,
}>


export default function (app: Express.Application): void {
    var database = app.get('database') as mysql.Connection;
    var handler = app.get('handler') as typeof asyncHandler;
    app.post('/api/posts', handler(async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
        // Body validation
        let reqBody = req.body as Posts['req'];
        if (!validate(reqBody, postsReqCheck)) {
            res.sendStatus(400 /* Bad request */);
            Server.runtimeInfo[req.id].isSending = true;
            return next();
        }
        // Get data from database
        let resBody: Posts['res'] = {};
        let rawData: PostsSQL = await database.query(
            `select posts.header, posts.description, users.username, posts.comments_count, 
            date_format(posts.date, '%Y-%m-%d') as date, posts.tags from posts
            join users on users.id = posts.user_id
            order by posts.id desc
            limit ${(reqBody.pageNumber - 1) * reqBody.displayCount}, ${reqBody.displayCount};`
        );
        resBody.postsCount = (await database.query(
            `select count(*) from posts;`
        ))[0]['count(*)'];
        resBody.posts = rawData.map((value): Posts['res']['posts'][0] => {
            let dateArray = value.date.split('-');
            return {
                header: value.header,
                description: value.description.toString(),
                username: value.username,
                commentsCount: value.comments_count,
                date: {
                    year: +dateArray[0],
                    month: +dateArray[1],
                    day: +dateArray[2],
                },
                tags: value.tags.toString('utf-8').split(' '),
            };
        });
        res.send(resBody);
        Server.runtimeInfo[req.id].isSending = true;
        next();
    }));
}