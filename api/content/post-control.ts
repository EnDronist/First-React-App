import { Validation } from '@utils/types';

export const verification: Validation<PostControlAPI['req']> = {
    header: value => typeof(value) == 'string' && /^.{16,128}$/.test(value),
    description: value => typeof(value) == 'string' && /^.{1,65536}$/.test(value),
    tags: value => typeof(value) == 'string' && /^([a-z][a-z_]{0,28}[a-z]( (?!$)|$)){1,8}$/.test(value),
    doReturnInfo: () => true,
}

export type PostControlAPI = {
    // Data from client to server
    req: {
        id?: number;
        header: string;
        description: string;
        tags: string;
        doReturnInfo?: boolean;
    }
    // Data from server to client
    // Success (200 - OK)
    // Error (400 - Bad request, 401 - Unauthorized, 500 - Internal server error)
    res: {
        id: number;
    }
}