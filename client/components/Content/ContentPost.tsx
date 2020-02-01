// React
import React from 'react';
import classNames from 'classnames';
import './ContentPost.scss'
// Public
import postsInfo from '@public/info/postsInfo.json';
// API
import { DeletePostAPI } from '@api/content/delete-post';
// Redux
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { StoreState } from '@redux/State';
import { ActionData, ActionInput } from '@redux/actions/types';
import { GroupName, Actions } from '@redux/actions/Posts';

export type State = {
    id: number;
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

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & {
    options: State;
}

class ContentPost extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = props.options;
    }

    delete = async () => {
        // Server request
        console.log(this.state);
        var reqBody: DeletePostAPI['req'] = {
            id: this.state.id,
        }
        var responce = await fetch('/api/delete-post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reqBody),
        });
        if (!responce.ok) return;
        // Deleting post
        const posts = this.props.posts;
        posts.remove(posts.findIndex(elem => elem.id == this.state.id));
        this.props.setPosts(this.props.posts);
    }

    render = () => {
        return (
            <article className="post">
                <header className="d-flex flex-row">
                    <div className="date">
                        <div className="year">{this.state.date.year}</div>
                        <div className="date_right">
                            <span className="day">{this.state.date.day}</span>
                            <span className="month">{postsInfo.monthEng[this.state.date.month]}</span>
                        </div>
                    </div>
                    <div className="header flex-grow-1">
                        <h1>{this.state.header}</h1>
                    </div>
                    { this.state.username == this.props.username && (
                        <div className="right delete"
                            onClick={this.delete}
                        >
                            <div className="icon"></div>
                            <span>Delete post</span>
                        </div>
                    ) }
                    <div className="right comments ml-auto">{this.state.commentsCount}</div>
                </header>
                <p className="description">{this.state.description}</p>
                <footer>
                    <em>Written by: </em><strong>{this.state.username}</strong>
                    <span className="new_line">
                        <em>Tags: </em>
                        { this.state.tags.map((value, i) => (
                            <a key={i} href="#" className="tags">{value}</a>
                        )) }
                    </span>
                    <a href="#" className="button">Continue Reading</a>
                </footer>
            </article>
        );
    }
}

// State to Props
const mapStateToProps = (state: StoreState) => ({
    // Authorization
    username: state?.authorization?.username,
    // Posts
    posts: state?.postsInfo?.posts,
});

// Dispatch to Props
const mapDispatchToProps = (dispatch: Dispatch<ActionData<typeof GroupName>>) => ({
    setPosts: (args: ActionInput<typeof GroupName, 'setPosts'>) => dispatch(Actions.setPosts(args)),
});

// React-Redux-component
export default connect(mapStateToProps, mapDispatchToProps)(ContentPost);