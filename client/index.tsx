import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/App';
import createStore from './redux';
const store = createStore();

console.log(`Current mode is '${process.env.NODE_ENV}'`);

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app')
);