import React, { Component } from 'react';
import Container from '../../shared/container/container';
import { Link, withRouter } from 'react-router-dom';
import NO_PICTURE from '../../resources/images/placeholder.jpg'
import { connect } from "react-redux";
import Axios from 'axios';
import { USERS_SEARCH_BY_TOKEN, USERS_UPDATE } from '../../shared/rest_end_points';
import { LOGIN_URL, BASE_URL } from '../../shared/router_constants';
import { set_active_user, notify, set_active_page } from '../../actions'
import Inputfield from '../../shared/customs/inputfield/inputfield';
import '../../shared/customs/Animations/animations.css';
import moment from 'moment';
import { BLOOD_GROUPS_OPTIONS, CITIES, GENDER_OPTIONS } from '../../shared/constant_data';
import Loading from '../../shared/customs/loading/loading';



class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: { value: '', error: false },
            last_name: { value: '', error: false },
            email: { value: '', error: false },
            gender: { value: '', error: false },
            date_of_birth: { value: '', error: false },
            register_date: { value: '', error: false },
            blood_group: { value: '', error: false },
            role: { value: '', error: false },
            phone_number: { value: '', error: false },
            cnic: { value: '', error: false },
            city: { value: '', error: false },
            address: { value: '', error: false },

            loading_status: false,
            previous_payload: null,
        };
    }
    componentDidMount() {
        const routes = [<Link to={BASE_URL} className="breadcrumb-item">
            <i className="icon-home2 mr-2"></i>
                        Home
                    </Link>, <span className="breadcrumb-item active">Profile</span>]
        this.props.set_active_page(routes)
        if (localStorage.user) {
            this.setState({ loading_status: true }, () => {
                Axios.get(`${USERS_SEARCH_BY_TOKEN}?tag=${localStorage.user}`).then(res => {
                    this.props.set_active_user(res.data['payload'])

                    this.setState({
                        first_name:     { value: res.data.payload.first_name, error: false },
                        last_name:      { value: res.data.payload.last_name, error: false },
                        email:          { value: res.data.payload.email, error: false },
                        cnic:           { value: res.data.payload.cnic, error: false },
                        phone_number:   { value: res.data.payload.phone_number, error: false },
                        city:           { value: res.data.payload.city, error: false },
                        address:        { value: res.data.payload.address, error: false },
                        date_of_birth:  { value: moment(res.data.payload.date_of_birth).format('ll'), error: false },
                        register_date:  { value: moment(res.data.payload.register_date).format('lll'), error: false },
                        blood_group:    { value: res.data.payload.blood_group, error: false },
                        gender:         { value: res.data.payload.gender, error: false },

                        loading_status: false

                    })
                }).catch(err => {
                    if (err) {
                        console.log(err.response)
                        if (err.response.status >= 500) {
                            this.props.notify('error', '', `No response`)
                            this.setState({ loading_status: false })
                        }
                        else if (err.response.status >= 400 && err.response.status < 500) {
                            this.props.notify('info', '', `${err.response.status}. Please refresh the page.`)
                            this.setState({ loading_status: false })
                        }
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
            Axios.put(USERS_UPDATE, data).then(res => {
                this.setState({ loading_status: false })
                this.props.notify('success', '', res.data.message)
            }).catch(err => {
                console.log('request error', err)
                this.setState({ loading_status: false })
                if (err.response){
                    this.props.notify('error', '', err.response['message'])
                }
            })
        })

    }

    check_input = (input, required = true, only_alpha = false, only_numbers = false) => {
        const alphabets = /^[A-Za-z]+$/;
        const numbers = /^[0-9]+$/;
        if (required && input === '') {
            return true;
        }
        if (only_alpha && !input.match(alphabets)) {
            return true;
        }
        if (only_numbers && !input.match(numbers)) {
            return true;
        }
    }

    on_click_update = () => {
        let status = false;
        if (this.check_input(this.state.first_name.value, true, true, false)) {
            this.setState({ first_name: { value: this.state.first_name.value, error: true } })
            status = true
        }

        if (this.check_input(this.state.last_name.value, true, true, false)) {
            this.setState({ last_name: { value: this.state.last_name.value, error: true } })
            status = true
        }

        if (this.check_input(this.state.email.value, true, false, false)) {
            this.setState({ email: { value: this.state.email.value, error: true } })
            status = true
        }

        if (this.check_input(this.state.phone_number.value, true, false, true)) {
            this.setState({ phone_number: { value: this.state.phone_number.value, error: true } })
            status = true
        }

        if (this.check_input(this.state.cnic.value, true, false, true)) {
            this.setState({ cnic: { value: this.state.cnic.value, error: true } })
            status = true
        }

        if (status === true) {
            this.props.notify('error', '', 'Invalid input')
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
            phone_number: this.state.phone_number.value,
            cnic: this.state.cnic.value,
            address: this.state.address.value,
            city: this.state.city.value,
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
                    this.setState({ blood_group: { value: e.label } });
                    break;
                case 'gender_selection':
                    this.setState({ gender: { value: e.label } });
                    break;
                case 'city_selection':
                    this.setState({ city: { value: e.label } });
                    break;
                default:
                    break;
            }
        }
        else {
            switch (actor) {
                case 'blood_group_selection':
                    this.setState({ blood_group: { value: '' } })
                    break;
                case 'gender_selection':
                    this.setState({ gender: { value: '' } })
                    break;
                case 'city_selection':
                    this.setState({ city: { value: '' } });
                    break;
                default:
                    break;
            }
        }
    }
    render() {
        const view = <div className="container-fluid">
            <div className="row">
                <div className={`col-lg-2 col-sm-0 `}></div>
                <div className="col-lg-8 col-sm-12">
                    <div className="card-img-actions d-inline-block mb-3">
                        <img className="img-fluid rounded-circle" src={NO_PICTURE} style={{ width: 100, height: 100 }} alt="" />
                        <div className="card-img-actions-overlay card-img rounded-circle">
                            <Link to={"#"} className="btn btn-outline bg-white text-white border-white border-2 btn-icon rounded-round">
                                <i className="icon-plus3"></i>
                            </Link>
                        </div>
                    </div>
                    <Inputfield
                        id="first_name_text_input"
                        heading="First Name"
                        placeholder="Enter your first name"
                        value={this.state.first_name.value}
                        onChange={this.on_text_changed}
                        error={this.state.first_name.error}
                    />
                    <Inputfield
                        id="last_name_text_input"
                        heading="Last Name"
                        placeholder="Enter your last name"
                        type="email"
                        value={this.state.last_name.value}
                        onChange={this.on_text_changed}
                        error={this.state.last_name.error}
                    />
                    <Inputfield
                        id="email_text_input"
                        heading="Email"
                        placeholder="Enter your email"
                        value={this.state.email.value}
                        onChange={this.on_text_changed}
                        disabled={true}
                    />
                    <Inputfield
                        id="phone_number_text_input"
                        heading="Phone number"
                        placeholder="Enter phone number"
                        value={this.state.phone_number.value}
                        onChange={this.on_text_changed}
                        error={this.state.phone_number.error}
                    />
                    <Inputfield
                        id="cnic_text_input"
                        heading="CNIC"
                        placeholder="Enter CNIC"
                        value={this.state.cnic.value}
                        onChange={this.on_text_changed}
                        error={this.state.cnic.error}
                    />
                    <Inputfield
                        field_type="select"
                        id="blood_group_selection"
                        heading="Blood Group"
                        placeholder={'Select blood group'}
                        error={this.state.cnic.error}
                        isClearable
                        name="color"
                        options={BLOOD_GROUPS_OPTIONS}
                        menuPosition="auto"
                        onChange={e => this.on_selected_changed(e, 'blood_group_selection')}
                        value={[{ id: 'blood_group_selection', label: this.state.blood_group.value }]}
                    />
                    <Inputfield
                        field_type="select"
                        heading="Gender"
                        isClearable
                        name="color"
                        options={GENDER_OPTIONS}
                        placeholder={'Select gender'}
                        menuPosition="auto"
                        id="gender_selection"
                        onChange={e => this.on_selected_changed(e, 'gender_selection')}
                        value={[{ id: 'gender_selection', label: this.state.gender.value }]}
                    />
                    <Inputfield
                        field_type="select"
                        heading="City"
                        isClearable
                        options={CITIES}
                        placeholder="Select city"
                        menuPosition="auto"
                        id="city_selection"
                        onChange={e => this.on_selected_changed(e, 'city_selection')}
                        value={[{ id: 'city_selection', label: this.state.city.value }]}
                    />
                    <Inputfield
                        id="address_text_input"
                        heading="Address"
                        placeholder="Address"
                        icon_class="icon-home"
                        field_type="text-area"
                        value={this.state.address.value}
                        onChange={this.on_text_changed}
                        error={this.state.address.error}
                    />
                    <Inputfield
                        id="user_dob_text_input"
                        onChange={this.on_user_date_of_birth_change}
                        className="clock_datatime_picker form-control form-control-lg"
                        placeholder="Enter your date of birth"
                        heading="Date of birth"
                        field_type="date-time"
                        input={true}
                        dateFormat={'ll'}
                        timeFormat={false}
                        closeOnSelect={true}
                        value={this.state.date_of_birth.value}
                    />
                    <Inputfield
                        field_type="date-time"
                        heading="Register Date"
                        className="clock_datatime_picker form-control form-control-lg"
                        inputProps={{ placeholder: 'Register Date', className: 'border-0 w-100', disabled: true }}
                        input={true}
                        dateFormat={'lll'}
                        timeFormat={false}
                        closeOnSelect={true}
                        value={this.state.register_date.value}
                    />
                    <div className="d-flex">
                        <button className={`btn bg-teal-400 btn-labeled btn-labeled-right pr-5 float-right`}
                            onClick={this.on_click_update}>
                            <b><i className={`icon-floppy-disk`}></i></b>
                            Save
                        </button>
                        <button
                            className={`btn bg-dark btn-labeled btn-labeled-right pr-5 float-right ml-2`}
                            onClick={() => this.props.history.push(BASE_URL)}>
                            <b><i className={`icon-cross`}></i></b>
                            Leave
                        </button>
                    </div>
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