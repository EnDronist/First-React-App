import { createStore, compose, applyMiddleware } from 'redux';
import getReducers from '@redux/reducers';
import { initialState } from '@redux/State';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
// import { composeWithDevTools } from 'redux-devtools-extension';
// import { createLogger } from 'redux-logger';

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}

// Redux DevTools
var __DEV__: boolean = process.env.NODE_ENV == 'development';
const composeEnhancers = (__DEV__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
// const logger = createLogger({ actionTransformer: actionTypeEnumToString });
// const composeEnhancers = composeWithDevTools({ actionSanitizer: actionTypeEnumToString });

// Browser history
export const history = createBrowserHistory();

export default () => {
    const store = createStore(
        getReducers(history),
        initialState,
        composeEnhancers(
            applyMiddleware(
                routerMiddleware(history),
            )
        )
    );
    return store;
};