import { createStore, compose } from 'redux';
import reducers from '@redux/reducers';
import Actions from '@redux/actions';
import { initialState } from '@redux/State';

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}

var __DEV__: boolean = process.env.NODE_ENV == 'development';
const composeEnhancers = (__DEV__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
export default () => {
    const store = createStore(reducers, composeEnhancers());
    store.dispatch(Actions.Utils.init({}));
    return store;
};