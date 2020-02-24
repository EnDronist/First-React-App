// React
import React, { ChangeEvent } from 'react';
// API
import { PostControlAPI } from '@api/content/post-control';
import { verification } from '@api/content/post-control';
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

export enum PostsControlTypes {
    Create = 'Create',
    Change = 'Change',
}

export type State = {
    inputs: {
        [key in keyof WithRequiredKeys<typeof verification>]: {
            className: {
                incorrect: boolean;
                [key: string]: any;
            };
            check: (str: string) => boolean;
        };
    };
    submitType: { [key in PostsControlTypes]: () => void }
}

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class ContentCreatePost extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            inputs: {
                header: {
                    className: {
                        incorrect: false,
                        'form-control': true,
                    },
                    check: str => verification['header'](str),
                },
                description: {
                    className: {
                        incorrect: false,
                        'form-control': true,
                    },
                    check: str => verification['description'](str),
                },
                tags: {
                    className: {
                        incorrect: false,
                        'form-control': true,
                    },
                    check: str => verification['tags'](str),
                },
            },
            submitType: {
                Create: this.createPost,
                Change: this.updatePost,
            }
        }
    }

    createPost = async () => {
        // Fetching posts
        var reqData: PostControlAPI['req'] = {
            header: this.props.postControl.inputs.header,
            description: this.props.postControl.inputs.description,
            tags: this.props.postControl.inputs.tags,
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
        let data = await responce.json() as PostControlAPI['res'];
        const posts = this.props.posts;
        let currentDate = new Date();
        posts.push({
            id: data.id,
            header: reqData.header,
            description: reqData.description,
            tags: reqData.tags,
            date: {
                year: currentDate.getFullYear(),
                month: currentDate.getMonth(),
                day: currentDate.getDate(),
            },
            commentsCount: 0,
            username: this.props.username,
        });
        this.props.setPosts(this.props.posts);
    }

    updatePost = async () => {
        // Fetching posts
        const inputs = this.state.inputs;
        var reqData: PostControlAPI['req'] = {
            id: this.props.postControl.inputs.id,
            header: this.props.postControl.inputs.header,
            description: this.props.postControl.inputs.description,
            tags: this.props.postControl.inputs.tags,
            doReturnInfo: true,
        };
        var responce = await fetch('/api/update-post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(reqData),
        });
        if (!responce.ok) return;
        console.log('Post updated!');
        // Changing post on page
        const posts = this.props.posts;
        const post = posts.find(elem => elem.id == reqData.id);
        if (!post) return;
        Object.assign<typeof post, Partial<typeof post>>(post, {
            header: reqData.header,
            description: reqData.description,
            tags: reqData.tags,
        });
        this.props.setPosts(this.props.posts);
    }
    
    onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const inputName = event.target.name as keyof State['inputs'];
        const input = this.state.inputs[inputName];
        input.className.incorrect = !(input.check(event.target.value) || event.target.value == '');
        this.props.setPostControlInputs({ [inputName]: event.target.value });
        this.forceUpdate();
    }

    render = () => {
        const inputs = this.state.inputs;
        return (
            <article id="create_post">
                <form>
                    <header><h1>{this.props.postControl.type}</h1></header>
                    <div className="form-group">
                        <label htmlFor="header_input">Header</label>
                        <input id="header_input" className={classNames(inputs.header.className)}
                            onChange={this.onChange} type="text" name="header" placeholder="Enter header"
                            value={this.props.postControl.inputs.header}></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="description_input">Description</label>
                        <input id="description_input" className={classNames(inputs.description.className)}
                            onChange={this.onChange} type="text" name="description" placeholder="Enter description"
                            value={this.props.postControl.inputs.description}></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="tags_input">Tags</label>
                        <input id="tags_input" className={classNames(inputs.tags.className)}
                            onChange={this.onChange} type="text" name="tags" placeholder="Enter tags"
                            value={this.props.postControl.inputs.tags}></input>
                    </div>
                    <button type="button" className="btn btn-primary" onClick={this.state.submitType[this.props.postControl.type]}>
                        {this.props.postControl.type} post on behalf of <b>{this.props.username}</b>
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
    postControl: state?.postsInfo?.postControl,
});

// Dispatch to Props
const mapDispatchToProps = (dispatch: Dispatch<ActionData<typeof GroupName>>) => ({
    setPosts: (args: ActionInput<typeof GroupName, 'setPosts'>) => dispatch(Actions.setPosts(args)),
    setPostControlInputs: (args: ActionInput<typeof GroupName, 'setPostControlInputs'>) =>
        dispatch(Actions.setPostControlInputs(args)),
});

// React-Redux-component
export default connect(mapStateToProps, mapDispatchToProps)(ContentCreatePost);