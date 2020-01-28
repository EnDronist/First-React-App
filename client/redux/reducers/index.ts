import { combineReducers } from 'redux';
import authorization from '@redux/reducers/Authorization';
import utils from '@redux/reducers/Utils';

// Reducer
export default combineReducers({
    authorization,
    utils,
});