import { ActionFunction, ActionInput, ActionType } from '@redux/actions/types';
import ContentPost, { State as ContentPostState } from '@client/components/Content/ContentPost';
import UniqueArray from '@utils/UniqueArray';

// Action group name
export const GroupName = 'Posts';

// Action types
export type Types = {
    // // Add
    setPosts: ActionType<
        UniqueArray<ContentPostState>,
        UniqueArray<ContentPostState>
    >;
    // inspectPosts: ActionType<{}, Readonly<UniqueArray<ContentPost['props']['options']>['add']>>;
    [key: string]: any;
}

// Actions
export const Actions: { [key in keyof Types]: ActionFunction<typeof GroupName, key> } = {
    setPosts: (args: ActionInput<typeof GroupName, 'setPosts'>) => ({
        type: 'setPosts',
        data: args
    }),
}