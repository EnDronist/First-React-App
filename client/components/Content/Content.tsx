// React
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Posts from '@client/components/Content/Posts/Posts';
// Misc
import classNames from 'classnames';
import './Content.scss';

type State = {};

type Props = {};

class Content extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    render = () => (
        <div id="content">
            <Route path="/posts" exact component={Posts}></Route>
            <Route path="/"><Redirect to="/posts"></Redirect></Route>
        </div>
    )
}

// Assembled component
export default Content;