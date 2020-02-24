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
        case 'setPostControlType': {
            let data = (action as ActionData<typeof GroupName, 'setPostControlType'>).data;
            return { ...state,
                postControl: { ...state.postControl,
                    type: data
                }
            }
        }
        case 'setPostControlInputs': {
            let data = (action as ActionData<typeof GroupName, 'setPostControlInputs'>).data;
            return { ...state,
                postControl: { ...state.postControl,
                    inputs: { ...state.postControl.inputs,
                        ...data
                    }
                }
            }
        }
        default: return state;
    }
}