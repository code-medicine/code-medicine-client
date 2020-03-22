import React, {Component} from 'react';
import Container from '../../shared/container/container';
import { Link, withRouter } from 'react-router-dom';
import NO_PICTURE from '../../resources/images/placeholder.jpg'
import { connect } from "react-redux";
import Axios from 'axios';
import { PROFILE_USER_REQUEST } from '../../shared/rest_end_points';
import { LOGIN_URL } from '../../shared/router_constants';
import {set_active_user} from '../../actions'
import Inputfield from '../../shared/customs/inputfield/inputfield';
import '../../shared/customs/Animations/animations.css'


class Profile extends Component {
    constructor(props){
        super(props);
            this.state = {
                first_name: { value: '' },
                last_name: { value: '' },
                email: { value: '' },
                password: { value: '' },
                verify_password: { value: '' },
                gender: { value: '' },
                dob: { value: new Date() },
                blood_group: { value: '' },
                role: { value: '' },
                phone_number: { value: '' },
                cnic: { value: '' },
                address: { value: '' },
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
                        first_name: { value: res.data['payload'].first_name },
                        last_name: { value: res.data['payload'].last_name },
                        email: { value: res.data['payload'].email },
                        cnic: { value: res.data['payload'].cnic },
                        phone_number: { value: res.data['payload'].phone_number },
                        date_of_birth: { value: res.data['payload'].date_of_birth },
                        register_date: { value: res.data.payload.register_date },

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
                this.setState({first_name: { value: e.target.value }})
                break;
            case 'last_name_text_input':
                this.setState({last_name: { value: e.target.value }})
                break;
            case 'cnic_text_input':
                this.setState({cnic: { value: e.target.value }})
                break;
            case 'phone_number_text_input':
                this.setState({phone_number: { value: e.target.value }})
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
                            <img className="img-fluid rounded-circle" src={NO_PICTURE} style={{width: 100,height: 100}}  alt=""/>
                            <div className="card-img-actions-overlay card-img rounded-circle">
                                <Link to={"#"} className="btn btn-outline bg-white text-white border-white border-2 btn-icon rounded-round">
                                    <i className="icon-plus3"></i>
                                </Link>
                            </div>
                        </div>
                        
                    </div>
                    <div className="card-body">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-md-6 col-sm-12 px-3">
                                    <Inputfield 
                                        id="first_name_text_input"
                                        label_tag="First Name"
                                        placeholder="First name"
                                        icon_class="icon-user"
                                        default_value={this.state.first_name.value}
                                        onChange={this.on_text_changed}
                                        custom_classes="rotateInDownLeft animated"
                                    />
                                </div>
                                <div className="col-md-6 col-sm-6 px-3">
                                    <Inputfield 
                                        id="last_name_text_input"
                                        label_tag="Last Name"
                                        placeholder="Last name"
                                        icon_class="icon-user"
                                        disabled={true}
                                        type="email"
                                        default_value={this.state.last_name.value}
                                        onChange={this.on_text_changed}
                                        custom_classes="rotateInDownRight animated"
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4 col-sm-12 px-3">
                                    <Inputfield 
                                        id="email_text_input"
                                        label_tag="Email"
                                        placeholder="Email"
                                        icon_class="icon-envelop4"
                                        default_value={this.state.email.value}
                                        onChange={this.on_text_changed}
                                        custom_classes="rotateInUpLeft animated"
                                        disabled={true}
                                    />
                                </div>
                                <div className="col-md-4 col-sm-12 px-3">
                                    <Inputfield 
                                        id="cnic_text_input"
                                        label_tag="CNIC"
                                        placeholder="CNIC"
                                        icon_class="icon-vcard"
                                        default_value={this.state.cnic.value}
                                        onChange={this.on_text_changed}
                                        custom_classes="rotateIn animated"
                                    />
                                </div>
                                <div className="col-md-4 col-sm-12 px-3">
                                    <Inputfield 
                                        id="phone_number_text_input"
                                        label_tag="Phone number"
                                        placeholder="Phone number"
                                        icon_class="icon-phone2"
                                        default_value={this.state.phone_number.value}
                                        onChange={this.on_text_changed}
                                        custom_classes="rotateInDownRight animated"
                                    />
                                </div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-md-4 col-sm-12 px-3">
                                    <div className={`form-group row`}>
                                        <label className={`col-form-label-lg `}>Date of birth</label>
                                        <div className="input-group">
                                            <span className="input-group-prepend">
                                                <span className="input-group-text">
                                                    <i className="icon-calendar3 text-muted"></i>
                                                </span>
                                            </span>
                                            <DateTimePicker id="user_dob_text_input"
                                                onChange={this.on_user_date_of_birth_change}
                                                className="clock_datatime_picker form-control form-control-lg"
                                                inputProps={{ placeholder: 'Date of birth', className: 'border-0 w-100' }}
                                                input={true}
                                                dateFormat={'ll'}
                                                timeFormat={false}
                                                closeOnSelect={true}
                                                value={this.state.user_dob.value}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 col-sm-12 px-3">
                                    <div className={`form-group row`}>
                                        <label className={`col-form-label-lg `}>Date of birth</label>
                                        <div className="input-group">
                                            <span className="input-group-prepend">
                                                <span className="input-group-text">
                                                    <i className="icon-calendar3 text-muted"></i>
                                                </span>
                                            </span>
                                            <DateTimePicker id="user_dob_text_input"
                                                onChange={this.on_user_date_of_birth_change}
                                                className="clock_datatime_picker form-control form-control-lg"
                                                inputProps={{ placeholder: 'Date of birth', className: 'border-0 w-100' }}
                                                input={true}
                                                dateFormat={'ll'}
                                                timeFormat={false}
                                                closeOnSelect={true}
                                                value={this.state.user_dob.value}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 col-sm-12 px-3">
                                    <Inputfield 
                                        id="phone_number_text_input"
                                        label_tag="Phone number"
                                        placeholder="Phone number"
                                        icon_class="icon-phone2"
                                        default_value={this.state.phone_number.value}
                                        onChange={this.on_text_changed}
                                        custom_classes="rotateInDownRight animated"
                                    />
                                </div>
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