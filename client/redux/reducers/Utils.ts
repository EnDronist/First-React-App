import { StoreState } from "@redux/State";
import { GroupName } from '@redux/actions/Utils';
import { ActionData } from "@redux/actions/types";
import { initialState } from '@redux/State';

// Reducer
export default function reducer(state: {} = {}, action: ActionData<typeof GroupName, any>) {
    switch (action.type) {
        case 'init': {
            return { ...state };
        }
        default: return state;
    }
}