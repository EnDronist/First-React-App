import { State as PostsState } from '@client/components/Content/Posts/SmallPost';
import UniqueArray from '@utils/UniqueArray';
import { RouterState } from 'connected-react-router';

// Redux store state
export type StoreState = {
    authorization: {
        username: string;
        isModerator: boolean;
        loggedIn: boolean;
    };
    postsInfo: {
        posts: UniqueArray<PostsState>;
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
    }
};