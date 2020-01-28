import { ActionType, ActionFunction } from "./types"

// Action group name
export const GroupName = 'Utils';

// Action types
export type Types = {
    init: ActionType<{}, {}>;
    [key: string]: any;
}

// Actions
export const Actions: { [key in keyof Types]: ActionFunction<typeof GroupName, key> } = {
    init: () => ({
        type: 'init',
        data: null
    }),
}