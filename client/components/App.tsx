// React
import React from 'react';
import { Route } from 'react-router-dom';
import Header from './Header/Header'
import Content from './Content/Content'
import Aside from './Aside/Aside'
// Misc
import classNames from 'classnames';
import './App.scss'

type State = {}

export default class App extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {};
    }
    
    render = () => {
        return (<>
            <Header />
            <Content />
            <Aside />
        </>);
    }
}