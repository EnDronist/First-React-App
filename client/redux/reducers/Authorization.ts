import { StoreState, initialState } from "@redux/State";
import { GroupName } from '@redux/actions/Authorization';
import { ActionData, ActionGroupTypes } from "@redux/actions/types";
import { RequiredKeys } from "@utils/types";

// Reducer
export default function reducer(state: StoreState['authorization'] = initialState.authorization,
    action: ActionData<typeof GroupName, any>): StoreState['authorization']
{
    var type = action.type as RequiredKeys<ActionGroupTypes[typeof GroupName]>;
    switch (type) {
        case 'logIn': {
            let data = (action as ActionData<typeof GroupName, 'logIn'>).data;
            return { ...state,
                username: data.username,
                isModerator: data.isModerator,
                loggedIn: true,
            };
        }
        case 'logOut': {
            let data = (action as ActionData<typeof GroupName, 'logOut'>).data;
            return { ...state,
                username: '',
                isModerator: false,
                loggedIn: false,
            };
        }
        default: return state;
    }
}