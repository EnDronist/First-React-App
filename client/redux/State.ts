import ContentPost, { State as ContentPostState } from '@client/components/Content/ContentPost';
import UniqueArray from '@utils/UniqueArray';
import { RouterState, connectRouter } from 'connected-react-router';

// Redux store state
export type StoreState = {
    authorization: {
        username: string;
        loggedIn: boolean;
    };
    postsInfo: {
        posts: UniqueArray<ContentPostState>;
    };
    router?: RouterState;
};

export const initialState: StoreState = {
    authorization: {
        username: '',
        loggedIn: false,
    },
    postsInfo: {
        posts: new UniqueArray(),
    }
};