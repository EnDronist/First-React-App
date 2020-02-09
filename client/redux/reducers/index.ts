import { StoreState } from '@redux/State';
import { combineReducers, ReducersMapObject, Reducer, AnyAction } from 'redux';
import authorization from '@redux/reducers/Authorization';
import postsInfo from '@redux/reducers/Posts';
import { connectRouter } from 'connected-react-router'
import { History } from 'history';

type RouterReducer = { router: ReturnType<typeof connectRouter> };

/* Add any new reducer here */
var allReducers = (history: History): ReducersMapObject<StoreState> & RouterReducer => ({
    authorization: authorization,
    postsInfo: postsInfo,
    router: connectRouter(history),
})

// All reducers
export default function(history: History) {
    return combineReducers(allReducers(history));
};