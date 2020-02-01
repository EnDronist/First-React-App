import postsInfo from '@public/info/postsInfo.json';
import { Validation } from "@utils/types";

export type PostsAPI = {
    // Data from url
    url: {
        postsPageNumber: number;
        postsDisplayCount: number;
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
            tags: Array<string>;
        }>
    }
}

export const verification: Validation<PostsAPI['req']> = {
    pageNumber: value => typeof(value) == 'number' && value > 0,
    displayCount: value => typeof(value) == 'number' &&
        postsInfo.displayCount.options.includes(value),
}