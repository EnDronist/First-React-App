import { ActionFunction, ActionInput, ActionType } from '@redux/actions/types';
import { StoreState } from '@redux/State';
import { State as PostsState } from '@client/components/Content/Posts/SmallPost';
import { PostsControlTypes } from '@client/components/Content/Posts/PostsControl';
import UniqueArray from '@utils/UniqueArray';

// Action group name
export const GroupName = 'Posts';

// Action types
export type Types = {
    // Update posts array
    setPosts: ActionType<
        UniqueArray<PostsState>,
        UniqueArray<PostsState>
    >;
    // Update post control type
    setPostControlType: ActionType<
        PostsControlTypes,
        PostsControlTypes
    >;
    // Update post control inputs
    setPostControlInputs: ActionType<
        StoreState['postsInfo']['postControl']['inputs'],
        StoreState['postsInfo']['postControl']['inputs']
    >;
    [key: string]: any;
}

// Actions
export const Actions: { [key in keyof Types]: ActionFunction<typeof GroupName, key> } = {
    setPosts: (args: ActionInput<typeof GroupName, 'setPosts'>) => ({
        type: 'setPosts',
        data: args
    }),
    setPostControlType: (args: ActionInput<typeof GroupName, 'setPostControlType'>) => ({
        type: 'setPostControlType',
        data: args
    }),
    setPostControlInputs: (args: ActionInput<typeof GroupName, 'setPostControlInputs'>) => ({
        type: 'setPostControlInputs',
        data: args
    }),
}