import React from 'react';
import classNames from 'classnames';
import './App.scss'

import Header from './Header/Header'
import Content from './Content/Content'
import Aside from './Aside/Aside'

type State = {}

export default class App extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {};
    }
    
    render = () => {
        return (
            <div id="react_app">
                <Header />
                <Content />
                <Aside />
            </div>
        );
    }
}