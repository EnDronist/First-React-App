import { Validation, WithRequiredKeys } from '@utils/types';

export type CreatePostAPI = {
    // Data from client to server
    req: {
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

export const verification: Validation<CreatePostAPI['req']> = {
    header: value => typeof(value) == 'string' && /^.{16,128}$/.test(value),
    description: value => typeof(value) == 'string' && /^.{1,65536}$/.test(value),
    tags: value => typeof(value) == 'string' && /^([a-z][a-z_]{0,28}[a-z]( (?!$)|$)){1,8}$/.test(value),
    doReturnInfo: () => true,
}