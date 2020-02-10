import { ActionFunction, ActionInput, ActionType } from '@redux/actions/types';
import { State as PostsState } from '@client/components/Content/Posts/SmallPost';
import UniqueArray from '@utils/UniqueArray';

// Action group name
export const GroupName = 'Posts';

// Action types
export type Types = {
    // // Add
    setPosts: ActionType<
        UniqueArray<PostsState>,
        UniqueArray<PostsState>
    >;
    [key: string]: any;
}

// Actions
export const Actions: { [key in keyof Types]: ActionFunction<typeof GroupName, key> } = {
    setPosts: (args: ActionInput<typeof GroupName, 'setPosts'>) => ({
        type: 'setPosts',
        data: args
    }),
}