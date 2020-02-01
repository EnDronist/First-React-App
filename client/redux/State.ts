import ContentPost, { State as ContentPostState } from '@client/components/Content/ContentPost';
import UniqueArray from '@utils/UniqueArray';

// InitialState
export type StoreState = {
    authorization: {
        username: string;
        loggedIn: boolean;
    };
    postsInfo: {
        posts: UniqueArray<ContentPostState>;
    }
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