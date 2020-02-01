import { Action } from 'redux';
import * as Authorization from '@redux/actions/Authorization';
import * as Posts from '@redux/actions/Posts';
import { ValueOf, RequiredKeys  } from '@utils/types';

/* Add any new actions to this type */
type ActionCluster = {
    [Authorization.GroupName]: {
        types: Authorization.Types,
        actions: typeof Authorization.Actions,
    }
    [Posts.GroupName]: {
        types: Posts.Types,
        actions: typeof Posts.Actions,
    }
}
// Action Type
export type ActionType<Input extends Object = {}, Output extends Object = {}> = {
    input: Input;
    output: Output;
};
// Action Group
export type ActionGroupTypes = {
    [key in keyof ActionCluster]: ActionCluster[key]['types'];
};
export type ActionGroupType = ValueOf<{
    [key in keyof ActionCluster]: RequiredKeys<ActionCluster[key]['types']>;
}>;
export type ActionGroups = {
    [key in keyof ActionCluster]: ActionCluster[key]['actions'];
}
export type ActionGroup = ValueOf<{
    [key in keyof ActionCluster]: RequiredKeys<ActionCluster[key]['actions']>;
}>;
// Action Function
export type ActionInput<Group extends keyof ActionGroupTypes, T extends keyof ActionGroupTypes[Group]> = (
    ActionGroupTypes[Group][T]['input']
);
export type ActionOutput<Group extends keyof ActionGroupTypes, T extends keyof ActionGroupTypes[Group]> = (
    ActionGroupTypes[Group][T]['output']
);
export interface ActionData<Group extends keyof ActionGroupTypes, T extends keyof ActionGroupTypes[Group] = keyof ActionGroupTypes[Group]> extends Action<T> {
    data: ActionOutput<Group, T>;
};
export type ActionFunction<Group extends keyof ActionGroupTypes = keyof ActionGroupTypes, T extends keyof ActionGroupTypes[Group] = keyof ActionGroupTypes[Group]> = (
    (args: ActionInput<Group, T>) => ActionData<Group, T>
);