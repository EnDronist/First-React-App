import { StoreState, initialState } from "@redux/State";
import { GroupName } from '@redux/actions/Authorization';
import { ActionData } from "@redux/actions/types";

// Reducer
export default function reducer(state: StoreState['authorization'] = initialState.authorization, action: ActionData<typeof GroupName, any>) {
    switch (action.type) {
        case 'logIn': {
            let data = (action as ActionData<typeof GroupName, 'logIn'>).data;
            return { ...state,
                username: data.username,
                loggedIn: true,
            };
        }
        case 'logOut': {
            return { ...state,
                username: '',
                loggedIn: false,
            };
        }
        default: return state;
    }
}