export type Posts = {
    // Data from url
    url: {
        postsPageNumber: number;
        postsDisplayCount: number;
    }
    // Data from client
    req: {
        pageNumber: number;
        displayCount: number;
    },
    // Data to client
    res: {
        postsCount?: number,
        posts?: Array<{
            header: string,
            description: string,
            username: string,
            commentsCount: number,
            date: { year: number, month: number, day: number },
            tags: Array<string>,
        }>
    }
}