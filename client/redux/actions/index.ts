import { Action } from 'redux';
import { ActionGroups } from '@redux/actions/types';
import * as Authorization from './Authorization';
import * as Utils from './Utils';

const ActionClusters: ActionGroups = {
    Authorization: Authorization.Actions,
    Utils: Utils.Actions,
}

export default ActionClusters;