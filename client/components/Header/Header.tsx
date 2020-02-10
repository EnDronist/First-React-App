// React
import React from 'react';
// JSON
import globalButtonsInfo from '@public/info/globalButtonsInfo.json';
// Redux
import { connect } from 'react-redux';
import { StoreState } from '@redux/State';
// Misc
import classNames from 'classnames';
import './Header.scss';
import { Link } from 'react-router-dom';

// State
export type State = {
    isInit: boolean;
    globalButtons: Array<{
        id: string;
        name: string;
        url?: string;
        subMenu?: {
            [key: string]: {
                name: string;
                url?: string;
            }
        }
    }>;
}

// Props
type Props = ReturnType<typeof mapStateToProps>;

// React-component
class Header extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isInit: false,
            globalButtons: globalButtonsInfo,
        };
        // this.fetchButtons();
    }

    fetchButtons = async () => {
        // const response = await fetch('public/info/globalButtonsInfo.json');
        // if (!response.ok) return console.log('Fetch error');
        // const data = await response.json();
        // this.setState({ globalButtons: data });
    }

    render = () => {
        return (
            <header>
                <hgroup>
                    <h1>Fictive Company Blog.
                    { this.props.loggedIn && (
                        <span> Welcome, { this.props.username }</span>
                    ) }
                    </h1>
                    <h2>a blog showcasing the übercoolness of HTML5 &amp; CSS3</h2>
                </hgroup>
                <nav id="global" className={this.state.globalButtons.length ? "" : "global_uninit"}>
                    <ul id="global_buttons" className="d-flex flex-row justify-content-center text-center">
                    { this.state.globalButtons.map((button, i) => 
                        <li id={button.id} key={i.toString()} className="global_button">
                            { button.url && (
                                <Link to={button.url}>{button.name}</Link>
                            )
                            || (
                                <a>{button.name}</a>
                            ) }
                            { button.subMenu && (
                                <ul className="sub_menu">
                                    { Object.keys(button.subMenu).map((key, i) => 
                                        <li id={key} key={i.toString()} className="global_button">
                                            { button.subMenu[key].url && (
                                                <Link to={button.subMenu[key].url}>{button.subMenu[key].name}</Link>
                                            )
                                            || (
                                                <a>{button.subMenu[key].name}</a>
                                            ) }
                                        </li>
                                    ) }
                                </ul>
                            ) }
                        </li>
                    ) }
                    </ul>
                </nav>
            </header>
        );
    }
}

// State to Props
const mapStateToProps = (state: StoreState) => ({
    username: state.authorization?.username,
    loggedIn: state.authorization?.loggedIn,
});

// React-Redux-component
export default connect(mapStateToProps)(Header);