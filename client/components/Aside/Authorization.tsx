// React
import React, { FormEvent, Dispatch } from 'react';
// API
import { verification, LoginAttemptAPI, AuthorizationAPI } from '@api/authorization';
// Redux
import { connect } from 'react-redux';
import { Actions, GroupName } from '@redux/actions/Authorization';
import { ActionData, ActionInput } from '@redux/actions/types';
import { StoreState } from '@redux/State';
// Utils
import { ValueOf } from '@utils/types';
// Misc
import classNames from 'classnames';

// State
export type State = {
    authorization: boolean;
    signTypes: Readonly<{
        [key in 'signIn' | 'signUp' | 'logOut' ]: {
            url: string;
            type: 'GET' | 'POST';
        };
    }>;
    signType: ValueOf<State['signTypes']> | null;
    inputs: {
        [key in keyof typeof verification]: {
            name: key;
            value: string;
            className: {
                incorrect: boolean;
                [key: string]: any;
            };
            check: (str: string) => boolean;
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
                username: {
                    name: 'username',
                    value: '',
                    className: {
                        incorrect: false,
                    },
                    check: str => verification.username.test(str),
                },
                password: {
                    name: 'password',
                    value: '',
                    className: {
                        incorrect: false,
                    },
                    check: str => verification.password.test(str),
                },
            },
            errorDescription: null,
        };
        this.loginAttempt();
    }

    loginAttempt = async () => {
        var responce = await fetch('/authorization', { method: 'GET' });
        if (!responce.ok) return;
        var resData: LoginAttemptAPI['res'] = await responce.json();
        this.props.logIn({
            username: resData.username,
            isModerator: resData.isModerator,
        });
    }

    changeType = (type: keyof State['signTypes']) => {
        this.setState({ signType: this.state.signTypes[type] });
    }

    onChange = (event: any) => {
        const input = this.state.inputs[event.target.name as keyof State['inputs']];
        input.className.incorrect = !(input.check(event.target.value) || event.target.value == '');
        input.value = event.target.value;
        this.forceUpdate();
    }

    onSubmit = async (event: FormEvent) => {
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
            let sendingData: AuthorizationAPI['req'] = {
                username: inputs.username.value,
                password: cryptedPassword,
            };
            let jsonedData = JSON.stringify(sendingData);
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
            let resData = await responce.json() as AuthorizationAPI['res'];
            console.log(resData);
            if (responce.ok) {
                // Logging in
                this.props.logIn({
                    username: inputs.username.value,
                    isModerator: resData.success.isModerator,
                });
                this.setState({ errorDescription: null });
                return;
            }
            // Else checking form for server-validation errors
            else { // responce.status == 409 /* Conflict */
                console.log(`Error ${responce.status}${responce.status == 409 ? ': Conflict' : ''}`);
                Object.keys(inputs).map((element: keyof State['inputs']) => {
                    if (!resData.error[element])
                        inputs[element].className.incorrect = true;
                });
                if (resData.error.errorDescription) {
                    this.setState({ errorDescription: resData.error.errorDescription });
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

    render = () => {
        const authorization = this.state.authorization;
        const inputs = this.state.inputs;
        return (
            <section id="authorization">
                <h1>Authorization</h1>
                <form id="authorization_form" onSubmit={this.onSubmit}>
                    { !this.props.loggedIn ? (
                        <>
                        {/* Username input */}
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="username col-4 text-center align-middle">Username</span>
                            <div className="col-8 d-flex align-items-center">
                                <input className={ classNames(inputs.username.className, "col-12") }
                                    type="text" name="username" placeholder="username"
                                    onChange={this.onChange}
                                />
                            </div>
                        </div>
                        {/* Password input */}
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="password col-4 text-center align-middle">Password</span>
                            <div className="col-8 d-flex align-items-center">
                                <input className={ classNames(inputs.password.className, "col-12") }
                                    type="password" name="password" placeholder="password"
                                    onChange={this.onChange}
                                />
                            </div>
                        </div>
                        {/* Authorization buttons */}
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
                        </>
                    ) : (
                        <>
                        {/* Log out button */}
                        <div id="authorization_buttons" className="d-flex justify-content-between align-items-center">
                            <div className="authorization_button col-12">
                                <button id="log_out_button" className="btn btn-success btn-block"
                                    type="submit" onClick={() => this.changeType('logOut')}>Log Out</button>
                            </div>
                        </div>
                        </>
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