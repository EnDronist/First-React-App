import { ActionGroups } from '@redux/actions/types';
import * as Authorization from '@redux/actions/Authorization';
import * as Posts from '@redux/actions/Posts';

// All actions
/* Add any new actions here */
const actionClusters: ActionGroups = {
    Authorization: Authorization.Actions,
    Posts: Posts.Actions,
}

export default actionClusters;