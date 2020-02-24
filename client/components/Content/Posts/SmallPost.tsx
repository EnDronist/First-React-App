// React
import React from 'react';
// API
import { DeletePostAPI } from '@api/content/delete-post';
// Public
import postsInfo from '@public/info/postsInfo.json';
// Redux
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { StoreState } from '@redux/State';
import { ActionData, ActionInput } from '@redux/actions/types';
import { GroupName, Actions } from '@redux/actions/Posts';
// Misc
import classNames from 'classnames';
import { PostsControlTypes } from './PostsControl';

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
    tags: string;
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

    change = () => {
        // Filling post control with post data
        this.props.setPostControlType(PostsControlTypes.Change);
        this.props.setPostControlInputs({
            id: this.state.id,
            header: this.state.header,
            description: this.state.description,
            tags: this.state.tags,
        });
    };

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
                    <div className="header d-flex mr-auto">
                        <h1>{this.state.header}</h1>
                    </div>
                    <div className="right d-flex flex-row">
                        { ((this.state.username == this.props.username || !!this.props.isModerator) && (<>
                            <div className="delete clickable"
                                onClick={this.delete}
                            >
                                <div className="icon"></div>
                                <span>Delete post</span>
                            </div>
                            <div className="change clickable"
                                onClick={this.change}
                            >
                                <div className="icon"></div>
                                <span>Change post</span>
                            </div>
                        </>)) }
                        <div className="comments">{this.state.commentsCount}</div>
                    </div>
                </header>
                <p className="description">{this.state.description}</p>
                <footer>
                    <em>Written by: </em><strong>{this.state.username}</strong>
                    <span className="new_line">
                        <em>Tags: </em>
                        { this.state.tags.split(' ').map((value, i) => (
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
    isModerator: state?.authorization?.isModerator,
    // Posts
    posts: state?.postsInfo?.posts,
    postControl: state?.postsInfo?.postControl,
});

// Dispatch to Props
const mapDispatchToProps = (dispatch: Dispatch<ActionData<typeof GroupName>>) => ({
    // Posts
    setPosts: (args: ActionInput<typeof GroupName, 'setPosts'>) => dispatch(Actions.setPosts(args)),
    setPostControlType: (args: ActionInput<typeof GroupName, 'setPostControlType'>) =>
        dispatch(Actions.setPostControlType(args)),
    setPostControlInputs: (args: ActionInput<typeof GroupName, 'setPostControlInputs'>) =>
        dispatch(Actions.setPostControlInputs(args)),
});

// React-Redux-component
export default connect(mapStateToProps, mapDispatchToProps)(ContentPost);