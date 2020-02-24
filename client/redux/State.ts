import { State as PostsState } from '@client/components/Content/Posts/SmallPost';
import { PostsControlTypes } from '@client/components/Content/Posts/PostsControl';
import UniqueArray from '@utils/UniqueArray';
import { RouterState } from 'connected-react-router';
import { ArrayValue, ValueOf } from '@utils/types';
import { PostControlAPI } from '@api/content/post-control';

// Redux store state
export type StoreState = {
    authorization: {
        username: string;
        isModerator: boolean;
        loggedIn: boolean;
    };
    postsInfo: {
        posts: UniqueArray<PostsState>;
        postControl: {
            type: PostsControlTypes;
            inputs: {
                [key in keyof PostControlAPI['req']]?: PostControlAPI['req'][key];
            }
        }
    };
    router?: RouterState;
};

export const initialState: StoreState = {
    authorization: {
        username: '',
        isModerator: false,
        loggedIn: false,
    },
    postsInfo: {
        posts: new UniqueArray(),
        postControl: {
            type: PostsControlTypes.Create,
            inputs: {
                id: 0,
                header: '',
                description: '',
                tags: '',
                doReturnInfo: false,
            },
        }
    },
};