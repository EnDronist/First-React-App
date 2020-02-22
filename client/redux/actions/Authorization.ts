import { ActionFunction, ActionInput, ActionType } from '@redux/actions/types';

// Action group name
export const GroupName = 'Authorization';

// Action types
export interface Types {
    logIn: ActionType<
        {
            username: string;
            isModerator: boolean;
        },
        {
            username: string;
            isModerator: boolean;
        }
    >;
    logOut: ActionType<{}, {}>;
    [key: string]: any;
}

// Actions
export const Actions: { [key in keyof Types]: ActionFunction<typeof GroupName, key> } = {
    logIn: (args: ActionInput<typeof GroupName, 'logIn'>) => ({
        type: 'logIn',
        data: args
    }),
    logOut: (args: ActionInput<typeof GroupName, 'logOut'>) => ({
        type: 'logOut',
        data: args,
    }),
}