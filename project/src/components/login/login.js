import React, { Component } from 'react';
import Container from '../../shared/container/container';
import { LOGIN_URL, BASE_URL } from '../../shared/router_constants';
import Axios from 'axios';
import { LOGIN_USER_REQUEST } from '../../shared/rest_end_points';
import { connect } from "react-redux";
import { notify, set_active_user } from '../../actions';
import Loader from 'react-loader-spinner';


class Login extends Component {

    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: '',
            remember_me_option: true,
            loading_status: false,
        }
    }

    on_text_change = (e) => {
        switch(e.target.id){
            case 'materialLoginFormEmail':
                this.setState({email: e.target.value})
                break;
            case 'materialLoginFormPassword':
                this.setState({password: e.target.value})
                break;
            case 'materialLoginFormRemember':
                this.setState({remember_me_option: e.target.checked})
                break;
            default:
                break;
        }
    }

    on_submit = (e) => {
        this.setState({loading_status: true})
        const data = {
            email: this.state.email.trim(),
            password: this.state.password.trim(),
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
            view = <div className="container-fluid">
                <div className="row">
                    <div className="col-md-2 col-lg-4 col-sm-0">

                    </div>
                    <div className="col-md-8 col-lg-4 col-sm-12">
                        <div className="card mt-3">
                            <h5 className="card-header info-color white-text text-center py-4">
                                <strong>Sign in</strong>
                            </h5>
                            <div className="card-body px-lg-5 pt-0">
                                <div
                                    className="text-center" 
                                    autoComplete="nope" 
                                    style={{ color: "#757575" }}>
                                    <div className="md-form">
                                        <input 
                                            type="email" 
                                            id="materialLoginFormEmail" 
                                            className="form-control"
                                            value={this.state.email}
                                            onChange={this.on_text_change} />
                                        <label for="materialLoginFormEmail">E-mail</label>
                                    </div>
                                    <div className="md-form">
                                        <input 
                                            type="password" 
                                            id="materialLoginFormPassword" 
                                            className="form-control"
                                            value={this.state.password}
                                            onChange={this.on_text_change} />
                                        <label for="materialLoginFormPassword">Password</label>
                                    </div>
                                    <div className="d-flex justify-content-around">
                                        <div>
                                            <div className="form-check">
                                                <input 
                                                    type="checkbox" 
                                                    className="form-check-input" 
                                                    id="materialLoginFormRemember"
                                                    defaultChecked={this.state.remember_me_option}
                                                    onChange={this.on_text_change} />
                                                <label 
                                                    className="form-check-label" 
                                                    for="materialLoginFormRemember">
                                                    Remember me
                                                </label>
                                            </div>
                                        </div>
                                        <div>
                                            <a href={LOGIN_URL}>Forgot password?</a>
                                        </div>
                                    </div>
                                    <button 
                                        className="btn btn-outline-info btn-rounded btn-block my-4 waves-effect z-depth-0" 
                                        type="submit"
                                        onClick={this.on_submit}>
                                        Sign in
                                    </button>
                                    <p style={{ fontFamily: 'Roboto' }}>
                                        Not a member?
                                        <a href="/register" > 
                                            Register
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2 col-lg-4 col-sm-0">

                    </div>
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
export default connect(map_state_to_props, { notify, set_active_user })(Login);