import React, {Component} from 'react';
import Container from '../../shared/container/container';
import { Link, withRouter } from 'react-router-dom';
import NO_PICTURE from '../../resources/images/placeholder.jpg'
import { connect } from "react-redux";
import Axios from 'axios';
import { PROFILE_USER_REQUEST } from '../../shared/rest_end_points';
import { LOGIN_URL, BASE_URL } from '../../shared/router_constants';
import {set_active_user} from '../../actions'


class Profile extends Component {
    constructor(props){
        super(props);
            this.state = {
                first_name : {
                    value: '',
                    label_visibility: false
                },
                last_name: {
                    value: '',
                    label_visibility: false
                },
                email: {
                    value: '',
                    label_visibility: false
                },
                cnic: {
                    value: '',
                    label_visibility: false
                },
                phone_number: {
                    value: '',
                    label_visibility: false
                }
            };
    }
    componentDidMount(){
        if (localStorage.user){
            Axios.get(`${PROFILE_USER_REQUEST}?tag=${localStorage.user}`).then(res => {
                if (!res.data['status']){
                    this.props.history.push(LOGIN_URL)
                }
                else{
                    this.props.set_active_user(res.data['payload'])
                    this.setState({
                        first_name: {value: res.data['payload'].first_name,label_visibility: false},
                        last_name: {value: res.data['payload'].last_name,label_visibility: false},
                        email: {value: res.data['payload'].email,label_visibility: false},
                        cnic: {value: res.data['payload'].cnic,label_visibility: false},
                        phone_number: {value: res.data['payload'].first_name,label_visibility: false},
                    })
                }
            })
        }
        else{
            this.props.history.push(LOGIN_URL)
        }
    }
    on_text_changed = (e) => {
        switch(e.target.id){
            case 'first_name_text_input':
                if (e.target.value === '')
                    this.setState({first_name: { value: e.target.value, label_visibility: false }})
                else
                    this.setState({first_name: { value: e.target.value, label_visibility: true }})
                break;
            case 'last_name_text_input':
                if (e.target.value === '')
                    this.setState({last_name: { value: e.target.value, label_visibility: false }})
                else
                    this.setState({last_name: { value: e.target.value, label_visibility: true }})
                break;
            case 'cnic_text_input':
                if (e.target.value === '')
                    this.setState({cnic: { value: e.target.value, label_visibility: false }})
                else
                    this.setState({cnic: { value: e.target.value, label_visibility: true }})
                break;
            case 'phone_number_text_input':
                if (e.target.value === '')
                    this.setState({phone_number: { value: e.target.value, label_visibility: false }})
                else
                    this.setState({phone_number: { value: e.target.value, label_visibility: true }})
                break;
            default:
                break;
        }
    }
    render(){
        return(
            <Container container_type="home">
                <div className="card border-top-info">
                    <div className="card-header header-elements-inline">
                        <div className="">
                            <h5 className="font-weight-semibold mb-0">Profile</h5>
                            <p className="text-muted">
                                To edit your profile update and save changes
                            </p>
                        </div>
                        <div className="card-img-actions d-inline-block mb-3">
                            <img className="img-fluid rounded-circle" src={NO_PICTURE} style={{width: 170,height: 170}} />
                            <div className="card-img-actions-overlay card-img rounded-circle">
                                <Link to={"#"} className="btn btn-outline bg-white text-white border-white border-2 btn-icon rounded-round">
                                    <i className="icon-plus3"></i>
                                </Link>
                            </div>
                        </div>
                        
                    </div>
                    <div className="card-body">
                        <div className="container-f">
                            <div className="row">
                                <div className="col-md-6 col-sm-12">
                                    <div className="form-group form-group-float">
                                        <label className={`form-group-float-label animate ${this.state.first_name.label_visibility? 'is-visible': ''}`}>First name</label>
                                        <div className="input-group">
                                            <span className="input-group-prepend">
                                                <span className="input-group-text">
                                                    <i className="icon-pen2"></i>
                                                </span>
                                            </span>
                                            <input type="text" 
                                                id="first_name_text_input" 
                                                className="form-control" 
                                                placeholder="First name"
                                                value={this.state.first_name.value}
                                                onChange={this.on_text_changed}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-sm-6">
                                    <div className="form-group form-group-float">
                                        <label className={`form-group-float-label animate ${this.state.last_name.label_visibility? 'is-visible': ''}`}>Last name</label>
                                        <div className="input-group">
                                            <span className="input-group-prepend">
                                                <span className="input-group-text">
                                                    <i className="icon-pen2"></i>
                                                </span>
                                            </span>
                                            <input type="text" 
                                                id="last_name_text_input" 
                                                className="form-control" 
                                                placeholder="Last name"
                                                value={this.state.last_name.value}
                                                onChange={this.on_text_changed}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4 col-sm-12">
                                    <div className="form-group form-group-float">
                                        <label className={`form-group-float-label animate ${this.state.email.label_visibility? 'is-visible': ''}`}>Email</label>
                                        <div className="input-group">
                                            <span className="input-group-prepend">
                                                <span className="input-group-text">
                                                    <i className="icon-envelop4"></i>
                                                </span>
                                            </span>
                                            <input type="email"
                                                disabled={true}
                                                id="email_text_input" 
                                                className="form-control" 
                                                placeholder="Email"
                                                value={this.state.email.value}
                                                onChange={this.on_text_changed}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 col-sm-12">
                                    <div className="form-group form-group-float">
                                        <label className={`form-group-float-label animate ${this.state.cnic.label_visibility? 'is-visible': ''}`}>CNIC</label>
                                        <div className="input-group">
                                            <span className="input-group-prepend">
                                                <span className="input-group-text">
                                                    <i className="icon-vcard"></i>
                                                </span>
                                            </span>
                                            <input type="text"
                                                id="cnic_text_input" 
                                                className="form-control" 
                                                placeholder="CNIC"
                                                value={this.state.cnic.value}
                                                onChange={this.on_text_changed}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 col-sm-12">
                                    <div className="form-group form-group-float">
                                        <label className={`form-group-float-label animate ${this.state.phone_number.label_visibility? 'is-visible': ''}`}>Phone number</label>
                                        <div className="input-group">
                                            <span className="input-group-prepend">
                                                <span className="input-group-text">
                                                    <i className="icon-phone2"></i>
                                                </span>
                                            </span>
                                            <input type="text"
                                                id="phone_number_text_input" 
                                                className="form-control" 
                                                placeholder="Phone number"
                                                value={this.state.phone_number.value}
                                                onChange={this.on_text_changed}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div className="row">

                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        );
    }
}
function map_state_to_props(state) {
    return { 
        active_user: state.active_user
    }
}
export default connect(map_state_to_props,{set_active_user})(withRouter(Profile));