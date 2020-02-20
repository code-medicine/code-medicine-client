import React, { Component } from 'react';
import Container from '../../shared/container/container';
import { BASE_URL, REGISTER_URL, LOGIN_URL } from '../../shared/router_constants';
import Axios from 'axios';
import { LOGIN_USER_REQUEST, PROFILE_USER_REQUEST } from '../../shared/rest_end_points';
import { connect } from "react-redux";
import { notify, set_active_user } from '../../actions';
import Loader from 'react-loader-spinner';
import { withRouter, Link } from 'react-router-dom';


class Login extends Component {

    constructor(props){
        super(props);
        this.state = {
            email:              { value: '', label_visibility: false },
            password:           { value: '', label_visibility: false },
            remember_me_option: true,
            loading_status:     false,
        }
    }

    componentDidMount() {
        if (localStorage.user){
            Axios.get(`${PROFILE_USER_REQUEST}?tag=${localStorage.user}`).then(res => {
                if (res.data['status']){
                    this.props.history.push(BASE_URL)
                }
            })
        }
    }

    on_text_field_change = (e) => {
        switch(e.target.id){
            case 'email_text_input':
                if (e.target.value === '')
                    this.setState({email: { value: e.target.value, label_visibility: false }})
                else
                    this.setState({email: { value: e.target.value, label_visibility: true }})
                break;
            case 'password_text_input':
                if (e.target.value === '')
                    this.setState({password: { value: e.target.value, label_visibility: false }})
                else
                    this.setState({password: { value: e.target.value, label_visibility: true }})
                break;
            case 'remember_me_text_input':
                this.setState({remember_me_option: e.target.checked})
                break;
            default:
                break;
        }
    }

    __check_hard_constraints = (data) => {
        if (data.email === ''){
            this.props.notify('error','','Please specify a username or phone number');
            return false;
        }
        if (data.password === ''){
            this.props.notify('error','','Please give your password');
            return false;
        }
        return true
    }

    on_submit = (e) => {
        this.setState({loading_status: true})
        const data = {
            email: this.state.email.value.trim(),
            password: this.state.password.value.trim(),
            remember_me: this.state.remember_me_option
        }
        Axios.post(LOGIN_USER_REQUEST,data).then(res => {
            setTimeout(() => {
                this.setState({ loading_status: false })
                if (res.data['status']){
                    localStorage.setItem("user",res.data['token'])
                    this.props.notify('success','', res.data['message'])
                    this.props.history.push(BASE_URL)
                }
                else{
                    this.props.notify('error','', res.data['message'])
                }
            }, 5000)
            
        }).catch(err => {
            this.props.notify('error','', 'Server not responding! please try again later')
            setTimeout(() => {
                this.setState({ 
                    loading_status: false,
                    email: '',
                    password: ''
                })
            }, 3000);
        });
    }


    render() {

        var view = ''
        if (this.state.loading_status){
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
        else{
            const form_group = "form-group form-group-float mb-1"
            view = <div className="login-form" style={{background: 'white'}}>
                <div className="card-body">
                    <div className="text-center mb-0">
                        <i className="icon-people icon-2x text-warning-400 border-warning-400 border-3 rounded-round p-3 mb-3 mt-1"></i>
                        <h5 className="mb-0 text-muted">Login to your account</h5>
                    </div>

                    <div className={form_group}>
                        <label className={`form-group-float-label animate ${this.state.email.label_visibility ? 'is-visible' : ''}`}>Username or phone number</label>
                        <div className="input-group">
                            <span className="input-group-prepend">
                                <span className="input-group-text">
                                    <i className="icon-user text-muted"></i>
                                </span>
                            </span>
                            <input type="text"
                                className="form-control"
                                placeholder="Username or phone number"
                                id="email_text_input"
                                onChange={this.on_text_field_change}/>
                        </div>
                    </div>

                    <div className={form_group}>
                        <label className={`form-group-float-label animate ${this.state.password.label_visibility ? 'is-visible' : ''}`}>Password</label>
                        <div className="input-group">
                            <span className="input-group-prepend">
                                <span className="input-group-text">
                                    <i className="icon-lock2 text-muted"></i>
                                </span>
                            </span>
                            <input type="password"
                                className="form-control"
                                placeholder="Password"
                                id="password_text_input"
                                onChange={this.on_text_field_change} />
                        </div>
                    </div>

                    <hr/>

                    <div className="form-group d-flex align-items-center">
                        <div className="form-check mb-0">
                            <label className="form-check-label">
                                <div className="uniform-checker">
                                    <span className={this.state.remember_me_option? 'checked':''}>
                                        <input type="checkbox" 
                                            name="remember"
                                            id="remember_me_text_input"
                                            defaultChecked={this.state.remember_me_option}
                                            value={this.state.remember_me_option}
                                            onChange={this.on_text_field_change}
                                            className="form-input-styled"/>
                                    </span>
                                </div>
                                Remember
                            </label>
                        </div>

                        <a href="login_password_recover.html" className="ml-auto">Forgot password?</a>
                    </div>

                    <div className="form-group ">
                        <button 
                            type="button" 
                            className="btn btn-block bg-teal-400 btn-labeled btn-labeled-right ml-auto"
                            style={{textTransform: "inherit"}}
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
                            style={{textTransform: "inherit"}}
                            onClick={() => this.props.history.push(REGISTER_URL)}>
                            <b><i className="icon-plus2"></i></b>
                            Sign up
                        </button>
                    </div>

                    <span className="form-text text-center text-muted">By continuing, you're confirming that you've read our <Link to={LOGIN_URL}>Terms &amp; Conditions</Link> and <Link to={LOGIN_URL}>Cookie Policy</Link></span>
                </div>
            </div>
        }

        return (
            <Container container_type={'login'}>
                {
                    view
                }
            </Container>
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