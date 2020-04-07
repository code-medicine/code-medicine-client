import React, { Component } from 'react';
import Container from '../../shared/container/container';
import { Link, withRouter } from 'react-router-dom';
import NO_PICTURE from '../../resources/images/placeholder.jpg'
import { connect } from "react-redux";
import Axios from 'axios';
import { PROFILE_USER_REQUEST, PROFILE_UPDATE_USER_REQUEST } from '../../shared/rest_end_points';
import { LOGIN_URL, BASE_URL } from '../../shared/router_constants';
import { set_active_user, notify, set_active_page } from '../../actions'
import Inputfield from '../../shared/customs/inputfield/inputfield';
import '../../shared/customs/Animations/animations.css';
import DateTimePicker from 'react-datetime'
import moment from 'moment';
import Select, { components } from 'react-select';
import { BLOOD_GROUPS_OPTIONS, GENDER_OPTIONS, ROLES_OPTIONS } from '../../shared/constant_data';
import Loading from '../../shared/customs/loading/loading';



class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: { value: '', error: false },
            last_name: { value: '', error: false },
            email: { value: '', error: false },
            gender: { value: '', error: false },
            date_of_birth: { value: '', error: false},
            register_date: { value: '', error: false },
            blood_group: { value: '' , error: false},
            role: { value: '', error: false },
            phone_number: { value: '', error: false },
            cnic: { value: '', error: false },
            address: { value: '', error: false },

            loading_status: false,
            previous_payload: null,
        };
    }
    componentDidMount() {        
        const routes = [<Link to={BASE_URL} className="breadcrumb-item">
                        <i className="icon-home2 mr-2"></i> 
                        Home
                    </Link>,<span className="breadcrumb-item active">Profile</span>]
        this.props.set_active_page(routes)
        if (localStorage.user) {
            this.setState({ loading_status: true }, () => {
                Axios.get(`${PROFILE_USER_REQUEST}?tag=${localStorage.user}`).then(res => {
                    if (!res.data['status']) {
                        this.props.history.push(LOGIN_URL)
                    }
                    else {
                        this.props.set_active_user(res.data['payload'])

                        this.setState({
                            first_name: { value: res.data.payload.first_name, error: false },
                            last_name: { value: res.data.payload.last_name, error: false },
                            email: { value: res.data.payload.email, error: false },
                            cnic: { value: res.data.payload.cnic, error: false },
                            phone_number: { value: res.data.payload.phone_number, error: false },
                            address: { value: res.data.payload.address, error: false },
                            date_of_birth: { value: moment(res.data.payload.date_of_birth).format('ll'), error: false },
                            register_date: { value: moment(res.data.payload.register_date).format('lll'), error: false },
                            blood_group: { value: res.data.payload.blood_group, error: false },
                            gender: { value: res.data.payload.gender, error: false },
                            role: { value: res.data.payload.role, error: false },

                            loading_status: false

                        })
                    }
                })
            })

        }
        else {
            this.props.history.push(LOGIN_URL)
        }
    }

    request_update = (data) => {
        this.setState({ loading_status: true }, () => {
            Axios.put(PROFILE_UPDATE_USER_REQUEST, data, { headers: { 'code-medicine': localStorage.getItem('user') } }).then(res => {
                if (res.data.status === true) {
                    this.setState({ loading_status: false })
                    this.props.notify('success', '', res.data.message)
                } else {
                    this.setState({ loading_status: false })

                    this.props.notify('error', '', res.data.message)
                }
            }).
                catch(err => {
                    console.log('request error', err)
                    this.setState({ loading_status: false })
                    this.props.notify('error', '', err.toString())
                })
        })

    }

    check_input = (input,required = true,only_alpha=false,only_numbers=false) => {
        const alphabets = /^[A-Za-z]+$/;
        const numbers = /^[0-9]+$/;
        if (required  && input === ''){
            return true;
        }
        if (only_alpha && !input.match(alphabets)){
            return true;
        }
        if (only_numbers && !input.match(numbers)){
            return true;
        }
    }

    on_click_update = () => {
        let status = false;
        if (this.check_input(this.state.first_name.value,true,true,false)){
            this.setState({ first_name: { value: this.state.first_name.value, error: true}})
            status = true
        }

        if (this.check_input(this.state.last_name.value,true,true,false)){
            this.setState({ last_name: { value: this.state.last_name.value, error: true}})
            status = true
        }

        if (this.check_input(this.state.email.value,true,false,false)){
            this.setState({ email: { value: this.state.email.value, error: true}})
            status = true
        }

        if (this.check_input(this.state.phone_number.value,true,false,true)){
            this.setState({ phone_number: { value: this.state.phone_number.value, error: true}})
            status = true
        }

        if (this.check_input(this.state.cnic.value,true,false,true)){
            this.setState({ cnic: { value: this.state.cnic.value, error: true}})
            status = true
        }

        if (status === true){
            this.props.notify('error','','Invalid input')
            return
        }
        const payload = {
            first_name: this.state.first_name.value,
            last_name: this.state.last_name.value,
            email: this.state.email.value,
            gender: this.state.gender.value,
            date_of_birth: this.state.date_of_birth.value,
            register_date: this.state.register_date.value,
            blood_group: this.state.blood_group.value,
            role: this.state.role.value,
            phone_number: this.state.phone_number.value,
            cnic: this.state.cnic.value,
            address: this.state.address.value,
        }
        this.request_update(payload)
    }

    on_text_changed = (e) => {
        switch (e.target.id) {
            case 'first_name_text_input':
                this.setState({ first_name: { value: e.target.value, error: false } });
                break;
            case 'last_name_text_input':
                this.setState({ last_name: { value: e.target.value, error: false } });
                break;
            case 'cnic_text_input':
                this.setState({ cnic: { value: e.target.value, error: false } });
                break;
            case 'phone_number_text_input':
                this.setState({ phone_number: { value: e.target.value, error: false } });
                break;
            case 'address_text_input':
                this.setState({ address: { value: e.target.value, error: false } });
                break;
            case 'email_text_input':
                this.setState({ email: { value: e.target.value, error: false } });
                break;
            default:
                break;
        }
    }
    on_selected_changed = (e, actor) => {
        if (e !== null) {
            switch (e.id) {
                case 'blood_group_selection':
                    this.setState({ blood_group: { value: e.label } })
                    break;
                case 'gender_selection':
                    this.setState({ gender: { value: e.label } })
                    break;
                default:
                    break;
            }
        }
        else {
            switch (actor) {
                case 'blood_group_selection':
                    this.setState({ user_blood_group: { value: '' } })
                    break;
                case 'gender_selection':
                    this.setState({ user_gender: { value: '' } })
                    break;
                default:
                    break;
            }
        }
    }
    render() {
        const selection_value_container = ({ children, ...props }) => (
            <components.ValueContainer {...props}>
                <div className={`input-group `}>
                    <div className="ml-2 my-0">
                        {
                            children
                        }
                    </div>
                </div>
            </components.ValueContainer>)
        const view = <div className="container-fluid">
            <div className="row">
                <div className={`col-lg-2 col-sm-12 d-flex justify-content-center`}>
                    <div className="card-img-actions d-inline-block mb-3">
                        <img className="img-fluid rounded-circle" src={NO_PICTURE} style={{ width: 100, height: 100 }} alt="" />
                        <div className="card-img-actions-overlay card-img rounded-circle">
                            <Link to={"#"} className="btn btn-outline bg-white text-white border-white border-2 btn-icon rounded-round">
                                <i className="icon-plus3"></i>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-sm-12 px-3">
                    <Inputfield
                        id="first_name_text_input"
                        label_tag="First Name"
                        placeholder="First name"
                        icon_class="icon-user"
                        default_value={this.state.first_name.value}
                        on_text_change_listener={this.on_text_changed}
                        error={this.state.first_name.error}
                    />
                </div>
                <div className="col-lg-3 col-sm-12 px-3">
                    <Inputfield
                        id="last_name_text_input"
                        label_tag="Last Name"
                        placeholder="Last name"
                        icon_class="icon-user"
                        type="email"
                        default_value={this.state.last_name.value}
                        on_text_change_listener={this.on_text_changed}
                        error={this.state.last_name.error}
                    />
                </div>
                <div className={`col-lg-4 col-sm-12 px-3`}>
                    <Inputfield
                        id="email_text_input"
                        label_tag="Email"
                        placeholder="Email"
                        icon_class="icon-envelop4"
                        default_value={this.state.email.value}
                        on_text_change_listener={this.on_text_changed}
                        disabled={true}
                    />
                </div>

            </div>
            <div className="row">
                <div className="col-lg-3 col-sm-12 px-3">

                    <Inputfield
                        id="phone_number_text_input"
                        label_tag="Phone number"
                        placeholder="Phone number"
                        icon_class="icon-phone2"
                        default_value={this.state.phone_number.value}
                        on_text_change_listener={this.on_text_changed}
                        error={this.state.phone_number.error}
                    />
                </div>
                <div className="col-lg-3 col-sm-12 px-3">
                    <Inputfield
                        id="cnic_text_input"
                        label_tag="CNIC"
                        placeholder="CNIC"
                        icon_class="icon-vcard"
                        default_value={this.state.cnic.value}
                        on_text_change_listener={this.on_text_changed}
                        error={this.state.cnic.error}
                    />
                </div>
                <div className="col-lg-6 col-sm-12">
                    <div className={`row `}>
                        <div className={`col-lg-4`}>
                            <div className={``}>
                                <label className="col-form-label-lg">Blood Group</label>
                                <Select
                                    isClearable
                                    components={{ ValueContainer: selection_value_container }}
                                    name="color"
                                    options={BLOOD_GROUPS_OPTIONS}
                                    placeholder={'Blood Group'}
                                    menuPosition="auto"
                                    id="blood_group_selection"
                                    onChange={this.on_selected_changed}
                                    value={[{ id: 'blood_group_selection', label: this.state.blood_group.value }]}
                                />

                            </div>
                        </div>
                        <div className={`col-lg-4`}>
                            <div className={``}>
                                <label className="col-form-label-lg">Gender</label>
                                <Select
                                    isClearable
                                    components={{ ValueContainer: selection_value_container }}
                                    name="color"
                                    options={GENDER_OPTIONS}
                                    placeholder={'Gender'}
                                    menuPosition="auto"
                                    id="gender_selection"
                                    onChange={this.on_selected_changed}
                                    value={[{ id: 'gender_selection', label: this.state.gender.value }]}
                                />

                            </div>
                        </div>
                        <div className={`col-lg-4`}>
                            <div className={``}>
                                <label className="col-form-label-lg">Role</label>
                                <Select
                                    isClearable
                                    components={{ ValueContainer: selection_value_container }}
                                    name="color"
                                    options={ROLES_OPTIONS}
                                    placeholder={'Role'}
                                    menuPosition="auto"
                                    id="role_selection"
                                    onChange={this.on_selected_changed}
                                    value={[{ id: 'role_selection', label: this.state.role.value }]}
                                />

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-6 col-sm-12 px-3">
                    <Inputfield
                        id="address_text_input"
                        label_tag="Address"
                        placeholder="Address"
                        icon_class="icon-home"
                        field_type="text-area"
                        default_value={this.state.address.value}
                        on_text_change_listener={this.on_text_changed}
                        error={this.state.address.error}
                    />
                </div>

                <div className="col-lg-3 col-sm-12 px-3">
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
                                value={this.state.date_of_birth.value}
                                disabled
                            />
                        </div>
                    </div>
                </div>

                <div className="col-lg-3 col-sm-12 px-3">
                    <div className={`form-group row`}>
                        <label className={`col-form-label-lg `}>Register Date</label>
                        <div className="input-group">
                            <span className="input-group-prepend">
                                <span className="input-group-text">
                                    <i className="icon-calendar3 text-muted"></i>
                                </span>
                            </span>
                            <DateTimePicker id="user_dob_text_input"
                                className="clock_datatime_picker form-control form-control-lg"
                                inputProps={{ placeholder: 'Register Date', className: 'border-0 w-100', disabled: true }}
                                input={true}
                                dateFormat={'lll'}
                                timeFormat={false}
                                closeOnSelect={true}
                                value={this.state.register_date.value}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className={`row`}>
                <div className={`col-12`}>
                    <button className={`btn bg-teal-400 btn-labeled btn-labeled-right pr-5 float-right`}
                        onClick={this.on_click_update}>
                        <b><i className={`icon-floppy-disk`}></i></b>
                        Save
                </button>
                    <button
                        className={`btn bg-dark btn-labeled btn-labeled-right pr-5 float-right mr-2`}
                        onClick={() => this.props.history.push(BASE_URL)}>
                        <b><i className={`icon-cross`}></i></b>
                    Leave
                </button>
                </div>
            </div>
        </div>
        return (
            <Container container_type="home">
                <div className="card border-top-info">
                    <div className="card-body">
                        {this.state.loading_status ? <Loading size={150} /> : view}
                    </div>
                </div>
            </Container>
        );
    }
}
function map_state_to_props(state) {
    return {
        active_user: state.active_user,
        notify: state.notify,
        
    }
}
export default connect(map_state_to_props, { set_active_user, notify, set_active_page })(withRouter(Profile));