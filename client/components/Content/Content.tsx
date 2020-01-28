import React, { Fragment } from 'react';
const autoBind = require('react-autobind');
const classNames = require('classnames');
import './Content.scss';

import { Route, Link, BrowserRouter as Router } from 'react-router-dom';
import ContentPost from './ContentPost';
import UniqueArray from '@utils/UniqueArray';
import getUrlParams from '@utils/url-params';
import getRangeArray from '@utils/range-array';

import postsInfo from '@public/info/postsInfo.json';

import { Posts } from '@api/content';
import { ArrayValue } from '@utils/types';
import { StoreState } from '@redux/State';
import { connect } from 'react-redux';

type State = {
    postsOptions: {
        postsCount: number;
        pageNumber: number;
        displayCount: number;
        displayCounts: Readonly<typeof postsInfo.displayCount.options>;
    }
    posts: UniqueArray<ContentPost['props']['options']>;
}

type Props = ReturnType<typeof mapStateToProps>;

class Content extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        autoBind(this);
        var urlParams: Posts['url'] = getUrlParams(new URLSearchParams(window.location.search).entries());
        this.state = {
            postsOptions: {
                postsCount: 0,
                pageNumber: urlParams.postsPageNumber || postsInfo.pageNumber.default,
                displayCount: urlParams.postsDisplayCount || postsInfo.displayCount.default,
                displayCounts: postsInfo.displayCount.options,
            },
            posts: new UniqueArray(),
        };
        this.init();
    }
    async init() {
        this.fetchPosts();
        return;
        var timeout = 2000;
        console.log(this.state.posts);
        var posts = this.state.posts;
        await new Promise(resolve => { setTimeout(resolve, timeout) });
        // posts.push({
        //     options: {
        //         value: 'New',
        //     },
        // });
        this.forceUpdate();
        console.log(posts);

        await new Promise(resolve => { setTimeout(resolve, timeout) });
        posts[posts.length - 1].options.value = 'Word';
        this.forceUpdate();
        console.log(posts);

        await new Promise(resolve => { setTimeout(resolve, timeout) });
        posts.remove(1, 1);
        this.forceUpdate();
        console.log(posts);

        await new Promise(resolve => { setTimeout(resolve, timeout) });
        this.forceUpdate();
        console.log(posts);
        await new Promise(resolve => { setTimeout(resolve, timeout) });
        posts.remove(2, 2);
        this.forceUpdate();
        console.log(posts);
    }
    async fetchPosts(): Promise<void> {
        // Fetching posts
        var reqData: Posts['req'] = {
            pageNumber: this.state.postsOptions.pageNumber,
            displayCount: this.state.postsOptions.displayCount,
        };
        var responce = await fetch('api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(reqData),
        });
        if (!responce.ok) return;
        // Saving posts
        var resData = await responce.json() as Posts['res'];
        const posts = this.state.posts;
        posts.clear();
        posts.push(...resData.posts);
        // Changing posts options
        const postsOptions = this.state.postsOptions;
        postsOptions.postsCount = resData.postsCount;
        this.forceUpdate();
    }
    calculatePageNumber(newDisplayCount: number): number {
        const postsOptions = this.state.postsOptions;
        let firstPostNumber = (postsOptions.pageNumber - 1) * postsOptions.displayCount + 1;
        return Math.floor((firstPostNumber - 1) / newDisplayCount + 1);
    }
    changePostsOptions(options: { postsPageNumber?: number, postsDisplayCount?: number }): void {
        const postsOptions = this.state.postsOptions;
        // Updating posts options
        postsOptions.pageNumber = options.postsPageNumber != undefined ? options.postsPageNumber : postsOptions.pageNumber;
        postsOptions.displayCount = options.postsDisplayCount != undefined ? options.postsDisplayCount : postsOptions.displayCount;
        this.forceUpdate();
        this.fetchPosts();
    }
    render() {
        const { posts, postsOptions } = this.state;
        return (
            <Router>
                <div id="content">
                    <article id="page_options">
                        <header className="col-8">
                            <div id="page_numbers" className="d-flex justify-content-start align-items-center">
                                <span key="-1">Page:</span>
                                <ul className="d-flex justify-content-start align-items-center">
                                { getRangeArray(1, Math.ceil(postsOptions.postsCount / postsOptions.displayCount)).map(value => (
                                    <li key={value} className={`page_number${value == postsOptions.pageNumber ? " selected" : " clickable"}`}>
                                        { value != postsOptions.pageNumber && (
                                            <Link to={`/?postsPageNumber=${value}&postsDisplayCount=${postsOptions.displayCount}`}
                                                onClick={() => this.changePostsOptions({ postsPageNumber: value })}
                                            > 
                                                <div className={`p-1 align-items-center`}>
                                                    <span>{value}</span>
                                                </div>
                                            </Link>
                                        ) || (
                                            <div className={`p-1 align-items-center`}>
                                                <span>{value}</span>
                                            </div>
                                        ) }
                                    </li>
                                )) }
                                </ul>
                            </div>
                        </header>
                        <header className="col-4">
                            <div id="posts_display_counts" className="d-flex justify-content-start align-items-center">
                                <span>Count:</span>
                                <ul className="d-flex justify-content-start align-items-center">
                                { postsOptions.displayCounts.map((elem, i) => {
                                    let newPageNumber = this.calculatePageNumber(elem);
                                    return (
                                        <li key={i} className={`posts_display_count${elem == postsOptions.displayCount ? " selected" : " clickable"}`}>
                                            { elem != postsOptions.displayCount && (
                                                <Link to={`/?postsPageNumber=${newPageNumber}&postsDisplayCount=${elem}`}
                                                    onClick={() => this.changePostsOptions({
                                                        postsPageNumber: newPageNumber,
                                                        postsDisplayCount: elem,
                                                    })}
                                                > 
                                                    <div className={`p-1 align-items-center`}>
                                                        <span>{elem}</span>
                                                    </div>
                                                </Link>
                                            ) || (
                                                <div className={`p-1 align-items-center`}>
                                                    <span>{elem}</span>
                                                </div>
                                            ) }
                                        </li>
                                    )
                                }) }
                                </ul>
                            </div>
                        </header>
                    </article>
                    { this.state.posts.map((elem, i) =>
                        <ContentPost key={posts.ids[i]} options={elem} />
                    ) }
                    { /* this.props.loggedIn */ true && (
                        <article id="create_post">
                            <form>
                                {this.props.username}
                                <div className="form-group">
                                    <label htmlFor="headerInput">Header</label>
                                    <input id="headerInput" className="form-control"
                                        type="text" name="header"placeholder="Enter header"></input>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="descriptionInput">Description</label>
                                    <input id="descriptionInput" className="form-control"
                                        type="text" name="description" placeholder="Enter description"></input>
                                </div>
                            </form>
                        </article>
                    ) }
                </div>
            </Router>
        );
    }
}

// State to Props
const mapStateToProps = (state: StoreState) => ({
    username: state?.authorization?.username,
    loggedIn: state?.authorization?.loggedIn,
});

// React-Redux-component
export default connect(mapStateToProps)(Content);