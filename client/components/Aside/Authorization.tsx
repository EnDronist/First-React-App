import React, { FormEvent, Dispatch } from 'react';
const autoBind = require('react-autobind');
const classNames = require('classnames');
import './Authorization.scss';

import { Actions, GroupName } from '@redux/actions/Authorization';
import { ActionData, ActionInput, ActionGroupTypes } from '@redux/actions/types';
import { StoreState } from '@redux/State';
import { connect } from 'react-redux';
import { ValueOf } from '@utils/types';

// State
type State = {
    authorization: boolean;
    signTypes: Readonly<{
        [key in 'signIn' | 'signUp' | 'logOut' ]: {
            url: string;
            type: 'GET' | 'POST';
        };
    }>;
    signType: ValueOf<State['signTypes']> | null;
    inputs: {
        [key in 'login' | 'password']: {
            name: string;
            value: string;
            className: {
                incorrect: boolean;
                [key: string]: any;
            };
            check: (str: any) => any;
        };
    };
    errorDescription: string | null;
}

// Props
type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

// React-component
class Authorization extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        autoBind(this);
        this.state = {
            authorization: false,
            signTypes: Object.freeze({
                signIn: {
                    url: '/sign-in',
                    type: 'POST',
                },
                signUp: {
                    url: '/sign-up',
                    type: 'POST',
                },
                logOut: {
                    url: '/log-out',
                    type: 'GET',
                },
            }),
            signType: null,
            inputs: {
                login: {
                    name: 'login',
                    value: '',
                    className: {
                        incorrect: false,
                    },
                    check: str => str.match(/^[a-zA-Z][a-zA-Z0-9-]{3,31}$/),
                },
                password: {
                    name: 'password',
                    value: '',
                    className: {
                        incorrect: false,
                    },
                    check: str => str.match(/^[a-zA-Z0-9_-]{8,32}$/),
                },
            },
            errorDescription: null,
        };
    }

    async componentDidMount() {}

    changeType(type: keyof State['signTypes']) {
        this.setState({ signType: this.state.signTypes[type] });
    }

    onChange(event: any) {
        const input = this.state.inputs[event.target.name as keyof State['inputs']];
        input.className.incorrect = !(input.check(event.target.value) || event.target.value == '');
        input.value = event.target.value;
        this.forceUpdate();
    }

    async onSubmit(event: FormEvent) {
        event.preventDefault();
        const signType = this.state.signType;
        const inputs = this.state.inputs;
        if (signType.type == 'POST') {
            // Checking form
            var isCorrectForm = true;
            Object.keys(inputs).map((key: keyof State['inputs']) => {
                const element: ValueOf<State['inputs']> = inputs[key];
                if (!element.check(element.value)) {
                    element.className.incorrect = true;
                    isCorrectForm = false;
                }
            });
            if (!isCorrectForm) { this.forceUpdate(); return; }
            // Password encrypting
            var buffer = new TextEncoder().encode(inputs.password.value);
            if (window.crypto.subtle == undefined) {
                console.log('Connection not secure, cannot encode password');
                return false;
            }
            var uglyCryptedPassword = await window.crypto.subtle.digest('SHA-256', buffer);
            var cryptedPassword = Array.prototype.map.call(
                new Uint8Array(uglyCryptedPassword),
                (x: number) => ('00' + x.toString(16)).slice(-2)
            ).join('');
            
            if (signType == null) {
                console.log('POST URL is not specified.');
                return;
            }
            // Sending data
            let jsonedData = JSON.stringify({
                login: inputs.login.value,
                password: cryptedPassword,
            });
            console.log(signType);
            let responce = await fetch(signType.url, {
                method: signType.type,
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: jsonedData,
                // credentials: 'include',
            });
            // Checking responce for OK
            console.log(responce);
            if (responce.ok) {
                // Logging in
                this.props.logIn({ username: inputs.login.value });
                this.setState({ errorDescription: null });
                return;
            }
            // Else checking form for server-validation errors
            else { // responce.status == 409 /* Conflict */
                console.log(`Error ${responce.status}${responce.status == 409 ? ': Conflict' : ''}`);
                var responceBody = await responce.json();
                console.log(responceBody);
                Object.keys(inputs).map((element: keyof State['inputs']) => {
                    if (responceBody[element] != undefined)
                        inputs[element].className.incorrect = true;
                });
                if (responceBody.errorDescription != undefined) {
                    this.setState({ errorDescription: responceBody.errorDescription });
                }
                return;
            }
        }
        else if (signType.type == 'GET') {
            // Logging out
            console.log(signType.url);
            let responce = await fetch(signType.url);
            console.log(responce);
            if (responce.status != 200) { console.log('Server error: ' + responce.statusText); return; }
            this.props.logOut(null);
            this.forceUpdate();
        }
    }

    render() {
        const authorization = this.state.authorization;
        const inputs = this.state.inputs;
        return (
            <section id="authorization">
                <h1>Authorization</h1>
                <form id="authorization_form" onSubmit={this.onSubmit}>
                    {/* Login input */}
                    <div className="d-flex justify-content-between align-items-center">
                        <span className="login col-4 text-center align-middle">Login</span>
                        <div className="col-8 d-flex align-items-center">
                            <input className={ classNames(inputs['login'].className, "col-12") }
                                type="text" name="login" placeholder="username"
                                onChange={this.onChange}
                            />
                        </div>
                    </div>
                    {/* Password input */}
                    <div className="d-flex justify-content-between align-items-center">
                        <span className="password col-4 text-center align-middle">Password</span>
                        <div className="col-8 d-flex align-items-center">
                            <input className={ classNames(inputs['password'].className, "col-12") }
                                type="password" name="password" placeholder="password"
                                onChange={this.onChange}
                            />
                        </div>
                    </div>
                    {/* Authorization buttons */}
                    { this.props.loggedIn ? (
                        <div id="authorization_buttons" className="d-flex justify-content-between align-items-center">
                            <div className="authorization_button col-12">
                                <button id="log_out_button" className="btn btn-success btn-block"
                                    type="submit" onClick={() => this.changeType('logOut')}>Log Out</button>
                            </div>
                        </div>
                    ) : (
                        <div id="authorization_buttons" className="d-flex justify-content-between align-items-center">
                            <div className="authorization_button col-6">
                                <button id="sign_in_button" className="btn btn-success btn-block"
                                    type="submit" onClick={() => this.changeType('signIn')}>Sign In</button>
                            </div>
                            <div className="authorization_button col-6">
                                <button id="sign_up_button" className="btn btn-primary btn-block"
                                    type="submit" onClick={() => this.changeType('signUp')}>Sign Up</button>
                            </div>
                        </div>
                    )}
                    {/* Error description */}
                    { this.state.errorDescription != null && (
                        <a className="error_description">{this.state.errorDescription}</a>
                    )}
                </form>
            </section>
        )
    }
}

// State to Props
const mapStateToProps = (state: StoreState) => ({
    username: state?.authorization?.username,
    loggedIn: state?.authorization?.loggedIn,
});

// Dispatch to Props
const mapDispatchToProps = (dispatch: Dispatch<ActionData<typeof GroupName, any>>) => ({
    logIn: (args: ActionInput<typeof GroupName, 'logIn'>) => dispatch(Actions.logIn(args)),
    logOut: (args: ActionInput<typeof GroupName, 'logOut'>) => dispatch(Actions.logOut(args)),
});

// React-Redux-component
export default connect(mapStateToProps, mapDispatchToProps)(Authorization);