// React
import React, { ChangeEvent } from 'react';
// API
import { verification, CreatePostAPI } from '@api/content/create-post';
// Redux
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { StoreState } from '@redux/State';
import { ActionData, ActionInput } from '@redux/actions/types';
import { GroupName, Actions } from '@redux/actions/Posts';
// Utils
import { WithRequiredKeys } from '@utils/types';
// Misc
import classNames from 'classnames';
import './ContentCreatePost.scss';

export type State = {
    inputs: {
        [key in keyof WithRequiredKeys<typeof verification>]: {
            name: key;
            value: string;
            className: {
                incorrect: boolean;
                [key: string]: any;
            };
            check: (str: string) => boolean;
        };
    };
}

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class ContentCreatePost extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            inputs: {
                header: {
                    name: 'header',
                    value: '',
                    className: {
                        incorrect: false,
                        'form-control': true,
                    },
                    check: str => verification['header'](str),
                },
                description: {
                    name: 'description',
                    value: '',
                    className: {
                        incorrect: false,
                        'form-control': true,
                    },
                    check: str => verification['description'](str),
                },
                tags: {
                    name: 'tags',
                    value: '',
                    className: {
                        incorrect: false,
                        'form-control': true,
                    },
                    check: str => verification['tags'](str),
                },
            }
        }
    }

    sendPost = async () => {
        // Fetching posts
        const inputs = this.state.inputs;
        var reqData: CreatePostAPI['req'] = {
            header: inputs.header.value,
            description: inputs.description.value,
            tags: inputs.tags.value,
            doReturnInfo: true,
        };
        var responce = await fetch('/api/create-post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(reqData),
        });
        if (!responce.ok) return;
        console.log('Post created!');
        // Adding new post to page
        let data = await responce.json() as CreatePostAPI['res'];
        const posts = this.props.posts;
        let currentDate = new Date();
        posts.push({
            id: data.id,
            header: reqData.header,
            description: reqData.description,
            tags: reqData.tags.split(' '),
            date: {
                year: currentDate.getFullYear(),
                month: currentDate.getMonth(),
                day: currentDate.getDay(),
            },
            commentsCount: 0,
            username: this.props.username,
        });
        this.props.setPosts(this.props.posts);
    }
    
    onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const input = this.state.inputs[event.target.name as keyof State['inputs']];
        input.className.incorrect = !(input.check(event.target.value) || event.target.value == '');
        input.value = event.target.value;
        this.forceUpdate();
    }

    render = () => {
        const inputs = this.state.inputs;
        return (
            <article id="create_post">
                <form>
                    <div className="form-group">
                        <label htmlFor="headerInput">Header</label>
                        <input id="headerInput" className={classNames(inputs.header.className)} onChange={this.onChange}
                            type="text" name="header" placeholder="Enter header"></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="descriptionInput">Description</label>
                        <input id="descriptionInput" className={classNames(inputs.description.className)} onChange={this.onChange}
                            type="text" name="description" placeholder="Enter description"></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="tagsInput">Tags</label>
                        <input id="tagsInput" className={classNames(inputs.tags.className)} onChange={this.onChange}
                            type="text" name="tags" placeholder="Enter tags"></input>
                    </div>
                    <button type="button" className="btn btn-primary" onClick={this.sendPost}>
                        Create post on behalf of <b>{this.props.username}</b>
                    </button>
                </form>
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
export default connect(mapStateToProps, mapDispatchToProps)(ContentCreatePost);