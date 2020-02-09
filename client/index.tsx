// React
import React from 'react';
import { render } from 'react-dom';
import { Provider, ReactReduxContext } from 'react-redux';
import App from './components/App';
// Redux & History
import createStore, { history } from './redux';
import { ConnectedRouter as Router } from 'connected-react-router';

// Creating redux store
const store = createStore();

// Console mode message
console.log(`Current mode is '${process.env.NODE_ENV}'`);

// Initial rendering of react app
render(
    <Provider store={store} context={ReactReduxContext}>
        <Router history={history} context={ReactReduxContext}>
            <App />
        </Router>
    </Provider>,
    document.getElementById('root')
);