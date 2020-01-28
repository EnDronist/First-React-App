import { Action } from 'redux';
import * as Authorization from '@redux/actions/Authorization';
import * as Utils from '@redux/actions/Utils';
import { ValueOf } from '@utils/types';

interface ActionCluster {
    [Authorization.GroupName]: {
        types: Authorization.Types;
        actions: typeof Authorization.Actions;
    }
    [Utils.GroupName]: {
        types: Utils.Types;
        actions: typeof Utils.Actions;
    }
};
// Action Type
export type ActionType<Input extends Object, Output extends Object> = {
    input: Input;
    output: Output;
};
// Action Group
export type ActionGroupTypes = {
    [key in keyof ActionCluster]: ActionCluster[key]['types'];
};
export type ActionGroupType = ValueOf<ActionGroupTypes>;
export type ActionGroups = {
    [key in keyof ActionCluster]: ActionCluster[key]['actions'];
}
export type ActionGroup = ValueOf<ActionGroups>;
// Action Function
export type ActionInput<Group extends keyof ActionGroupTypes, T extends keyof ActionGroupTypes[Group]> = (
    ActionGroupTypes[Group][T]['input']
);
export type ActionOutput<Group extends keyof ActionGroupTypes, T extends keyof ActionGroupTypes[Group]> = (
    ActionGroupTypes[Group][T]['output']
);
export interface ActionData<Group extends keyof ActionGroupTypes, T extends keyof ActionGroupTypes[Group]> extends Action<T> {
    data: ActionOutput<Group, T>;
};
export type ActionFunction<Group extends keyof ActionGroupTypes, T extends keyof ActionGroupTypes[Group]> = (
    (args: ActionInput<Group, T>) => ActionData<Group, T>
);