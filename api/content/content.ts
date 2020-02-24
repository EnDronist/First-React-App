import postsInfo from '@public/info/postsInfo.json';
import { Validation } from "@utils/types";

export type PostsAPI = {
    // Data from url
    url: {
        pageNumber: number;
        displayCount: number;
    }
    // Data from client to server
    req: {
        pageNumber: number;
        displayCount: number;
    },
    // Data from server to client
    res: {
        postsCount?: number,
        posts?: Array<{
            id: number;
            header: string;
            description: string;
            username: string;
            commentsCount: number;
            date: { year: number, month: number, day: number };
            tags: string;
        }>
    }
}

export const urlVerification: Validation<PostsAPI['url']> = {
    pageNumber: value => typeof(value) == 'number' && value > 0,
    displayCount: value => typeof(value) == 'number' &&
        postsInfo.displayCount.options.includes(value),
}

export const urlDefaultVerification: Validation<PostsAPI['url']> = {
    pageNumber: value => typeof(value) == 'number' && value == postsInfo.pageNumber.default,
    displayCount: value => typeof(value) == 'number' && value == postsInfo.displayCount.default,
}

export const reqVerification: Validation<PostsAPI['req']> = {
    pageNumber: value => typeof(value) == 'number' && value > 0,
    displayCount: value => typeof(value) == 'number' &&
        postsInfo.displayCount.options.includes(value),
}