import { StoreState, initialState } from "@redux/State";
import { GroupName } from "@redux/actions/Posts";
import { ActionData, ActionGroupTypes } from "@redux/actions/types";
import { RequiredKeys } from "@utils/types";
import UniqueArray from "@utils/UniqueArray";

// Reducer
export default function reducer(state: StoreState['postsInfo'] = initialState.postsInfo,
    action: ActionData<typeof GroupName, any>): StoreState['postsInfo']
{
    var type = action.type as RequiredKeys<ActionGroupTypes[typeof GroupName]>;
    switch (type) {
        case 'setPosts': {
            let data = (action as ActionData<typeof GroupName, 'setPosts'>).data;
            return { ...state,
                posts: new UniqueArray(data),
            };
        }
        default: return state;
    }
}