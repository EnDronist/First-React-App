// React
import React from 'react';
import { Link } from 'react-router-dom';
import SmallPost from './SmallPost';
import SmallPostCreate from './SmallPostCreate';
// API
import { PostsAPI, urlVerification, urlDefaultVerification } from '@api/content/content';
// JSON
import postsInfo from '@public/info/postsInfo.json';
// Redux
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { StoreState } from '@redux/State';
import { GroupName, Actions } from '@redux/actions/Posts';
import { ActionData, ActionInput } from '@redux/actions/types';
// Utils
import { fromUrlParams, mergeUrlParams } from '@utils/url-params';
import getRangeArray from '@utils/range-array';
import validate from '@utils/validate';
// Misc
import classNames from 'classnames';
import './Posts.scss';

export type State = {
    postsOptions: {
        postsCount: number;
        pageNumber: number;
        pageButtonFocus: number;
        displayCount: number;
        // Constants
        pageButtonsRange: Readonly<2>,
        displayCounts: Readonly<typeof postsInfo.displayCount.options>;
        // Additional info
        pageButtonStart: () => number;
        pageButtonEnd: () => number;
        pagesCount: () => number;
        pageButtonFocusMin: () => number;
        pageButtonFocusMax: () => number;
        getPageButtonFocus: (value: number) => number;
    }
}

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class Content extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        var urlParams: PostsAPI['url'] = fromUrlParams();
        this.state = {
            postsOptions: {
                postsCount: 0,
                pageNumber: urlParams.pageNumber || postsInfo.pageNumber.default,
                pageButtonFocus: 2,
                displayCount: urlParams.displayCount || postsInfo.displayCount.default,
                // Constants
                pageButtonsRange: 2,
                displayCounts: postsInfo.displayCount.options,
                // Additional info
                pageButtonStart: () => {
                    var pageButtonStart = this.state.postsOptions.pageButtonFocus - this.state.postsOptions.pageButtonsRange;
                    if (pageButtonStart < 1) pageButtonStart = 1;
                    return pageButtonStart;
                },
                pageButtonEnd: () => {
                    var pageButtonEnd = this.state.postsOptions.pageButtonFocus + this.state.postsOptions.pageButtonsRange
                    var pagesCount = this.state.postsOptions.pagesCount();
                    if (pageButtonEnd > pagesCount) pageButtonEnd = pagesCount;
                    return pageButtonEnd;
                },
                pagesCount: () => (
                    Math.ceil(this.state.postsOptions.postsCount / this.state.postsOptions.displayCount)
                ),
                pageButtonFocusMin: () => (
                    this.state.postsOptions.pageButtonsRange + 2
                ),
                pageButtonFocusMax: () => (
                    this.state.postsOptions.pagesCount() - this.state.postsOptions.pageButtonsRange - 1
                ),
                getPageButtonFocus: (value: number) => {
                    let pageButtonFocusMin = this.state.postsOptions.pageButtonFocusMin();
                    let pageButtonFocusMax = this.state.postsOptions.pageButtonFocusMax();
                    return value < pageButtonFocusMin ? pageButtonFocusMin
                        : value > pageButtonFocusMax ? pageButtonFocusMax
                        : value;
                },
            },
        };
        this.fetchPosts();
    }

    fetchPosts = async (): Promise<void> => {
        // Fetching posts
        let reqData: PostsAPI['req'] = {
            pageNumber: this.state.postsOptions.pageNumber,
            displayCount: this.state.postsOptions.displayCount,
        };
        let responce = await fetch('/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(reqData),
        });
        if (!responce.ok) return;
        // Saving posts
        let resData = await responce.json() as PostsAPI['res'];
        const posts = this.props.store.posts;
        posts.clear();
        posts.push(...resData.posts);
        this.props.actions.setPosts(posts);
        // Changing posts options
        const postsOptions = this.state.postsOptions;
        postsOptions.postsCount = resData.postsCount;
        postsOptions.pageButtonFocus = postsOptions.getPageButtonFocus(postsOptions.pageNumber);
        this.forceUpdate();
    }

    calculatePageNumber = (newDisplayCount: number): number => {
        const postsOptions = this.state.postsOptions;
        let firstPostNumber = (postsOptions.pageNumber - 1) * postsOptions.displayCount + 1;
        return Math.floor((firstPostNumber - 1) / newDisplayCount + 1);
    }
    
    changePostsOptions = (options: { pageNumber?: number, displayCount?: number, pageButtonFocus?: number }, forceUpdate: boolean = true): void => {
        const postsOptions = this.state.postsOptions;
        // Updating posts options
        postsOptions.pageNumber = options.pageNumber != undefined ? options.pageNumber : postsOptions.pageNumber;
        postsOptions.displayCount = options.displayCount != undefined ? options.displayCount : postsOptions.displayCount;
        postsOptions.pageButtonFocus = options.pageButtonFocus != undefined
            ? postsOptions.getPageButtonFocus(options.pageButtonFocus)
            : postsOptions.getPageButtonFocus(postsOptions.pageNumber);
        if (forceUpdate) this.forceUpdate();
    }

    render = () => {
        const { postsOptions } = this.state;
        const { store, actions } = this.props;
        // URL checking
        var urlParams: PostsAPI['url'] = fromUrlParams();
        if (validate(urlParams, urlVerification)) {
            if (Object.keys(urlParams).map<boolean>(
                    (key: string) => (urlParams[key] != postsOptions[key])
                ).includes(true)
            ) {
                this.changePostsOptions({
                    pageNumber: urlParams.pageNumber,
                    displayCount: urlParams.displayCount,
                }, false);
                this.fetchPosts();
            }
        }
        // If URL params is incorrect setting default
        else if (!validate(postsOptions, urlDefaultVerification)) {
            this.changePostsOptions({
                pageNumber: postsInfo.pageNumber.default,
                displayCount: postsInfo.displayCount.default,
            }, false);
            this.fetchPosts();
        }
        // Additional values
        var pageButtonStart = postsOptions.pageButtonStart();
        var pageButtonEnd = postsOptions.pageButtonEnd();
        var pagesCount = postsOptions.pagesCount();
        // Variable for help
        let url: string;
        return (<>
            <article id="page_options">
                <header className="col-8">
                    <div id="page_numbers" className="d-flex justify-content-start align-items-center">
                        <span>Page:</span>
                        <ul className="d-flex justify-content-start align-items-center">
                        { pageButtonStart > 1 + 1 && (
                            <li key={pageButtonStart - 1} className={classNames('page_number', "clickable")}>
                            <div className={`p-1 align-items-center`}
                                onClick={() => this.changePostsOptions({ pageButtonFocus: postsOptions.pageButtonFocus - 1 })}
                            >
                                <span>{'<'}</span>
                            </div>
                            </li>
                        )}
                        { getRangeArray(pageButtonStart <= 1 + 1 ? 1 : pageButtonStart, pageButtonEnd >= pagesCount - 1 ? pagesCount : pageButtonEnd).map(value => (
                            <li key={value} className={classNames('page_number', value == postsOptions.pageNumber ? " selected" : " clickable")}>
                                { value != postsOptions.pageNumber
                                    && (url = mergeUrlParams({ pageNumber: value, displayCount: postsOptions.displayCount })) != undefined
                                    && (
                                        <Link to={url} onClick={() => {
                                            this.changePostsOptions({ pageNumber: value });
                                            this.fetchPosts();
                                        }}>
                                            <div className={`p-1 align-items-center`}>
                                                <span style={{ fontSize: `${24 - 2.5 * `${value}`.length}px` }}>
                                                    {value}
                                                </span>
                                            </div>
                                        </Link>
                                    )
                                    || (
                                        <div className={`p-1 align-items-center`}>
                                            <span style={{ fontSize: `${24 - 2.5 * `${value}`.length}px` }}>
                                                {value}
                                            </span>
                                        </div>
                                    )
                                }
                            </li>
                        )) }
                        { pageButtonEnd < pagesCount - 1 && (
                            <li key={pageButtonEnd + 1} className={classNames('page_number', "clickable")}>
                                <div className={`p-1 align-items-center`}
                                    onClick={() => this.changePostsOptions({ pageButtonFocus: postsOptions.pageButtonFocus + 1 })}
                                >
                                    <span>{'>'}</span>
                                </div>
                            </li>
                        )}
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
                                    { elem != postsOptions.displayCount
                                        && (url = mergeUrlParams({ pageNumber: newPageNumber, displayCount: elem })) != undefined
                                        && (
                                            <Link to={url} onClick={() => {
                                                this.changePostsOptions({
                                                    pageNumber: newPageNumber,
                                                    displayCount: elem,
                                                });
                                                this.fetchPosts();
                                            }}> 
                                                <div className={`p-1 align-items-center`}>
                                                    <span>{elem}</span>
                                                </div>
                                            </Link>
                                        )
                                        || (
                                            <div className={`p-1 align-items-center`}>
                                                <span>{elem}</span>
                                            </div>
                                        )
                                    }
                                </li>
                            )
                        }) }
                        </ul>
                    </div>
                </header>
            </article>
            { store.posts.map((elem, i) =>
                <SmallPost key={store.posts.ids[i]} options={elem} />
            ) }
            { store.loggedIn && (
                <SmallPostCreate />
            ) }
        </>);
    }
}

// State to Props
const mapStateToProps = (state: StoreState) => ({
    store: {
        // Authorization
        loggedIn: state?.authorization?.loggedIn,
        // Posts
        posts: state?.postsInfo?.posts,
        // URL
        url: state?.router?.location,
    }
});

// Dispatch to Props
const mapDispatchToProps = (dispatch: Dispatch<ActionData<typeof GroupName>>) => ({
    actions: {
        setPosts: (args: ActionInput<typeof GroupName, 'setPosts'>) => dispatch(Actions.setPosts(args)),
    }
});

// Assembled component
export default connect(mapStateToProps, mapDispatchToProps)(Content);