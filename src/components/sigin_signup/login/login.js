import React, { Component } from 'react';
import Axios from 'axios';
import { connect } from "react-redux";
import Loader from 'react-loader-spinner';
import { withRouter, Link } from 'react-router-dom';

import Container from '../../../shared/container/container';
import { notify, set_active_user } from '../../../actions';
import Inputfield from '../../../shared/customs/inputfield/inputfield';

import { BASE_URL, REGISTER_URL, LOGIN_URL, FORGOT_PASSWORD } from '../../../shared/router_constants';
import { USERS_LOGIN } from '../../../shared/rest_end_points';


class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: { value: 'x@cm.com', error: false },
            password: { value: '111222333', error: false },
            remember_me_option: true,
            loading_status: false,
        }
    }

    // UNSAFE_componentWillMount() {
    //     if (localStorage.user) {
    //         Axios.get(`${PROFILE_USER_REQUEST}?tag=${localStorage.user}`).then(res => {
    //             if (res.data['status']) {
    //                 this.props.history.push(BASE_URL)
    //             }
    //         })
    //     }
    // }

    on_text_field_change = (e) => {
        switch (e.target.id) {
            case 'email_text_input':
                this.setState({ email: { value: e.target.value, error: false } })
                break;
            case 'password_text_input':
                this.setState({ password: { value: e.target.value, error: false } })
                break;
            case 'remember_me_text_input':
                this.setState({ remember_me_option: e.target.checked })
                break;
            default:
                break;
        }
    }

    __check_hard_constraints = (data) => {
        if (data.email === '') {
            this.props.notify('error', '', 'Please specify a username or phone number');
            return false;
        }
        if (data.password === '') {
            this.props.notify('error', '', 'Please give your password');
            return false;
        }
        return true
    }

    on_submit = (e) => {
        e.preventDefault()
        this.setState({ loading_status: true })
        const data = {
            email: this.state.email.value.trim(),
            password: this.state.password.value.trim(),
            remember_me: this.state.remember_me_option
        }
        Axios.post(USERS_LOGIN, data).then(res => {
            this.setState({ loading_status: false })
            console.log('user login', res.data)
            localStorage.setItem("user", res.data['token'])
            this.props.notify('success', '', res.data['message'])
            this.props.history.push(BASE_URL)
        }).catch(err => {
            if (err.response) {
                console.log('login',err.response)
                if (err.response.status >= 500) {
                    this.props.notify('error', '', 'Server not responding! please try again later')
                }
                else if (err.response.status >= 400 && err.response.status < 500) {
                    this.props.notify('error', '', err.response.data.message)
                }
                this.setState({
                    loading_status: false,
                    email: { value: this.state.email.value, error: true },
                    password: { value: this.state.password.value, error: true }
                })
            }
            console.log('login error', err) 
        });
    }


    render() {

        var view = ''
        if (this.state.loading_status) {
            view = <div className="mt-3">
                <div className="d-flex justify-content-center ">
                    <Loader
                        type="Rings"
                        color="#00BFFF"
                        height={150}
                        width={150}
                        timeout={60000} //60 secs
                    />
                </div>
                <div className="d-flex justify-content-center">
                    <p>Loading...</p>
                </div>
            </div>
        }
        else {
            const username_password = <div className={``}>
                <Inputfield
                    id={'email_text_input'}
                    label_tag={'Email'}
                    placeholder={"someone@hello.com"}
                    icon_class={'icon-user'}
                    input_type={'email'}
                    on_text_change_listener={this.on_text_field_change}
                    default_value={this.state.email.value}
                    error={this.state.email.error}
                />
                <Inputfield
                    id={'password_text_input'}
                    label_tag={'Password'}
                    placeholder={"Enter your password"}
                    icon_class={'icon-lock2'}
                    input_type={'password'}
                    on_text_change_listener={this.on_text_field_change}
                    default_value={this.state.password.value}
                    error={this.state.password.error}
                />

            </div>
            const remember_me_reset_password = <div className="form-group d-flex align-items-center">
                <div className="form-check mb-0">
                    <label className="form-check-label">
                        <div className="uniform-checker">
                            <span className={this.state.remember_me_option ? 'checked' : ''}>
                                <input type="checkbox"
                                    name="remember"
                                    id="remember_me_text_input"
                                    defaultChecked={this.state.remember_me_option}
                                    value={this.state.remember_me_option}
                                    onChange={this.on_text_field_change}
                                    className="form-input-styled" />
                            </span>
                        </div>
                        Remember
                    </label>
                </div>

                <Link to={FORGOT_PASSWORD} className="ml-auto">Forgot password?</Link>
            </div>

            view = <div className={``}>
                {username_password}
                <hr />
                {remember_me_reset_password}
            </div>
        }

        return (
            <Container container_type={'login'}>
                <div className={`container-fluid`}>
                    <div className={`row`}>
                        <div className={`col-lg-4 col-md-6 p-0`}>
                            <form method="post" onSubmit={this.on_submit}>
                                <div className={`card m-0`} style={{ height: '100vh' }}>
                                    <div className={`card-header text-center h4 font-weight-light`}>
                                        <span>Sign in</span>
                                        <hr />
                                    </div>
                                    <div className={`card-body px-5`} >
                                        {view}
                                        <hr />
                                        <div className="form-group ">
                                            <button
                                                type="submit"
                                                className="btn btn-block bg-teal-400 btn-labeled btn-labeled-right ml-auto"
                                                style={{ textTransform: "inherit" }}
                                                onClick={this.on_submit}>
                                                <b><i className="icon-circle-right2"></i></b>
                                                Sign in
                                            </button>
                                        </div>

                                        <div className="form-group text-center text-muted content-divider">
                                            <span className="px-2">Don't have an account?</span>
                                        </div>

                                        <div className="form-group">
                                            <button
                                                type="button"
                                                className="btn btn-block bg-dark btn-labeled btn-labeled-right ml-auto"
                                                style={{ textTransform: "inherit" }}
                                                onClick={() => this.props.history.push(REGISTER_URL)}>
                                                <b><i className="icon-plus2"></i></b>
                                                Sign up
                                            </button>
                                        </div>
                                        <span className="form-text text-center text-muted">By continuing, you're confirming that you've read our <Link to={LOGIN_URL}>Terms &amp; Conditions</Link> and <Link to={LOGIN_URL}>Cookie Policy</Link></span>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className={`col-lg-8 col-md-6 d-none d-lg-block d-xl-block d-md-block background_custom`}>

                        </div>
                    </div>
                </div>

            </Container >
        );
    }
}
function map_state_to_props(state) {
    return {
        notify: state.notify,
        active_user: state.active_user,
    }
}
export default connect(map_state_to_props, { notify, set_active_user })(withRouter(Login));