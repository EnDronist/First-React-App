import React from 'react';
const autoBind = require('react-autobind');
const classNames = require('classnames');
import './ContentPost.scss'

import postsInfo from '@public/info/postsInfo.json';

type State = {
    header: string;
    description: string;
    username: string;
    commentsCount: number;
    date: {
        year: number;
        month: number;
        day: number;
    };
    tags: string[];
}

type Props = {
    options: State,
}

export default class ContentPost extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        autoBind(this);
        if (!props.options) throw 'Asd';
        this.state = props.options;
    }
    render() {
        return (
            <article className="post">
                <header>
                    <div className="time">
                        <div className="year">{this.state.date.year}</div>
                        <div className="date">{this.state.date.day}
                            <span>{postsInfo.monthEng[this.state.date.month]}</span>
                        </div>
                    </div>
                    <h1>{this.state.header}</h1>
                    <div className="comments">{this.state.commentsCount}</div>
                </header>
                <p>{this.state.description}</p>
                <footer>
                    <em>Written by: </em><strong>{this.state.username}</strong>
                    <span className="newLine">
                        <em>Tags: </em>
                        <a href="#">tag</a>
                    </span>
                    <a href="#" className="button">Continue Reading</a>
                </footer>
            </article>
        );
    }
}