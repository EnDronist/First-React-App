import { StoreState } from '@redux/State';
import { combineReducers, ReducersMapObject } from 'redux';
import authorization from '@redux/reducers/Authorization';
import postsInfo from '@redux/reducers/Posts';

/* Add any new reducer here */
var allReducers: ReducersMapObject<StoreState> = {
    authorization: authorization,
    postsInfo: postsInfo,
}

// All reducers
export default combineReducers(allReducers);