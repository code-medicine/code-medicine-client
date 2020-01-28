import React, { Component } from 'react';
import Loader from 'react-loader-spinner';
import Axios from 'axios';
import { REGISTER_USER_REQUEST } from '../../shared/rest_end_points';
import { connect } from "react-redux";
import { notify } from '../../actions'
import 'react-toastify/dist/ReactToastify.css';
import { LOGIN_URL } from '../../shared/router_constants';
import Container from '../../shared/container/container';
import Select from 'react-select';
import './register.css'
// import Modal from 'react-bootstrap4-modal';
import DateTimePicker from 'react-datetime'
import { withRouter } from 'react-router-dom';


class Register extends Component {
    constructor(props) {
        super(props)
        this.state = {
            first_name: { value: '', label_visibility: false },
            last_name: { value: '', label_visibility: false },
            email: { value: '', label_visibility: false },
            password: { value: '', label_visibility: false },
            verify_password: { value: '', label_visibility: false },
            gender: { value: '', label_visibility: false },
            dob: { value: new Date(), label_visibility: false },
            blood_group: { value: '', label_visibility: false },
            role: { value: '', label_visibility: false },
            phone: { value: '', label_visibility: false },
            cnic: { value: '', label_visibility: false },
            address: { value: '', label_visibility: false },
            loading_status: false,
            role_select_modal_visibility: false
        }
    }
    on_text_field_change = (e) => {
        switch (e.target.id) {
            case 'first_name_text_input':
                if (e.target.value === '')
                    this.setState({ first_name: { value: e.target.value, label_visibility: false } })
                else
                    this.setState({ first_name: { value: e.target.value, label_visibility: true } })
                break;
            case 'last_name_text_input':
                if (e.target.value === '')
                    this.setState({ last_name: { value: e.target.value, label_visibility: false } })
                else
                    this.setState({ last_name: { value: e.target.value, label_visibility: true } })
                break;
            case 'cnic_text_input':
                if (e.target.value === '')
                    this.setState({ cnic: { value: e.target.value, label_visibility: false } })
                else
                    this.setState({ cnic: { value: e.target.value, label_visibility: true } })
                break;
            case 'phone_number_text_input':
                if (e.target.value === '')
                    this.setState({ phone_number: { value: e.target.value, label_visibility: false } })
                else
                    this.setState({ phone_number: { value: e.target.value, label_visibility: true } })
                break;
            case 'email_text_input':
                if (e.target.value === '')
                    this.setState({ email: { value: e.target.value, label_visibility: false } })
                else
                    this.setState({ email: { value: e.target.value, label_visibility: true } })
                break;
            case 'password_text_input':
                if (e.target.value === '')
                    this.setState({ password: { value: e.target.value, label_visibility: false } })
                else
                    this.setState({ password: { value: e.target.value, label_visibility: true } })
                break;
            case 'verify_password_text_input':
                if (e.target.value === '')
                    this.setState({ verify_password: { value: e.target.value, label_visibility: false } })
                else
                    this.setState({ verify_password: { value: e.target.value, label_visibility: true } })
                break;
            case 'phone_text_input':
                if (e.target.value === '')
                    this.setState({ phone: { value: e.target.value, label_visibility: false } })
                else
                    this.setState({ phone: { value: e.target.value, label_visibility: true } })
                break;
            case 'address_text_input':
                if (e.target.value === '')
                    this.setState({ address: { value: e.target.value, label_visibility: false } })
                else
                    this.setState({ address: { value: e.target.value, label_visibility: true } })
                break;
            default:
                break;
        }
    }

    on_date_of_birth_change = (e) => {
        
        if (e === '')
            this.setState({ dob: { value: '', label_visibility: false } })
        else{
            var configured_date = null;
            try{
                configured_date = e.format('ll');
            }
            catch(err){
                configured_date = ''
            }
            finally{
                this.setState({ dob: { value: configured_date, label_visibility: true } })
            }
        }
    }
    on_selected_changed = (e) => {
        switch (e.id) {
            case 'blood_group_selection':
                this.setState({ blood_group: { value: e.label } })
                break;
            case 'gender_selection':
                this.setState({ gender: { value: e.label } })
                break;
            case 'role_selection':
                this.setState({ role: { value: e.label } })
                break;
            default:
                break;
        }
    }
    __check_soft_constraints = (data) => {
        var alphabets = /^[A-Za-z]+$/;
        var numbers = /^[0-9]+$/;
        if (data.first_name === '') {
            this.props.notify('error', '', 'First Name is required!');
            return false;
        }
        else {
            if (!data.first_name.match(alphabets)) {
                this.props.notify('error', '', "First Name can only have alphabets!");
                return false;
            }
        }
        if (data.last_name === '') {
            this.props.notify('error', '', 'Last Name is required!');
            return false;
        }
        else {
            if (!data.last_name.match(alphabets)) {
                this.props.notify('error', '', "Last Name can only have alphabets!");
                return false
            }
        }
        if (data.email === '') {
            this.props.notify('error', '', 'Email is required!');
            return false;
        }
        if (data.password === '') {
            this.props.notify('error', '', 'Please specify a password to secure your account!')
            return false
        }
        if (data.cnic === '') {
            this.props.notify('error', '', 'Please specify your CNIC!');
            return false;
        }
        if (data.phone_number === '') {
            this.props.notify('error', '', 'Please specify your phone number!');
            return false;
        }
        else {
            if (!data.phone_number.match(numbers)) {
                this.props.notify('error', '', 'Phone number is invalid!');
                return false;
            }
        }
        if (data.role === '') {
            this.props.notify('error', '', 'Please select one of the roles!');
            return false
        }
        if (data.dob === ''){
            this.props.notify('error','','Choose your date of birth correctly!');
            return false;
        }
        return true; // all clear. no false condition :)
    }
    __check_hard_constraints = (data) => {
        if (!data.email.includes('@')) {
            this.props.notify('error', '', data.email + ' Invalid email!');
            return false;
        }
        if (data.password.length < 8) {
            this.props.notify('error', '', 'Password must have atleast 8 characters!');
            return false;
        }
        if (data.password !== data.verify_password){
            this.props.notify('error', '', 'Password do not match!');
            return false;
        }
        if (data.phone_number.length < 11) {
            this.props.notify('error', '', 'Invalid Phone number!');
            return false;
        }
        if (data.cnic.length < 13) {
            this.props.notify('error', '', 'Invalid CNIC number!');
            return false;
        }
        var configured_date = null;
        try{
            configured_date = new Date(data.dob)
        }
        catch(err) {
            this.props.notify('error','','Please specify the Date of birth as per given format')
            return false;
        }
        return true;
    }
    on_submit = async () => {
        const data = {
            first_name: this.state.first_name.value.trim(),
            last_name: this.state.last_name.value.trim(),
            email: this.state.email.value.trim(),
            password: this.state.password.value.trim(),
            verify_password: this.state.verify_password.value.trim(),
            phone_number: this.state.phone.value.trim(),
            cnic: this.state.cnic.value.trim(),
            role: this.state.role.value.trim(),
            dob: this.state.dob.value,
            gender: this.state.gender.value.trim(),
            blood_group: this.state.blood_group.value.trim(),
            address: this.state.address.value.trim()
        }
        if (this.__check_soft_constraints(data) && this.__check_hard_constraints(data)) {
            this.setState({ loading_status: true })
            var response = await Axios.post(`${REGISTER_USER_REQUEST}`, data);

            try{
                if (response.data['status']){
                    setTimeout(() => {
                        this.props.notify('success','',response.data['message']);
                        this.props.history.push(LOGIN_URL);
                    }, 5000)
                }
                else {
                    this.props.notify('error', '', response.data['message'])
                    setTimeout(() => {
                        this.setState({ loading_status: false })
                    }, 3000)
                }
            }
            catch(err){
                this.props.notify('error', '', 'We are sorry for invonvenience. Server is not responding! please try again later')
                setTimeout(() => {
                    this.setState({ loading_status: false })
                }, 3000)
            }
        }
        else {
            this.props.notify('info', '', 'Registartion unsuccessfull!');
        }
    }
    render() {
        const options_blood_group = [
            { id: 'blood_group_selection', label: 'A+' },
            { id: 'blood_group_selection', label: 'A-' },
            { id: 'blood_group_selection', label: 'B+' },
            { id: 'blood_group_selection', label: 'B-' },
            { id: 'blood_group_selection', label: 'AB+' },
            { id: 'blood_group_selection', label: 'AB-' },
            { id: 'blood_group_selection', label: 'O+' },
            { id: 'blood_group_selection', label: 'O-' },
            { id: 'blood_group_selection', label: 'Unknown' },
        ];
        const options_gender = [
            { id: 'gender_selection', label: 'Male' },
            { id: 'gender_selection', label: 'Female' },
        ];
        const options_roles = [
            { id: 'role_selection', label: 'Patient' },
            { id: 'role_selection', label: 'Doctor' },
            { id: 'role_selection', label: 'Admin' },
        ];
        var status = null;
        if (this.state.loading_status) {
            status = <div className="mt-3">
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
            const form_group = "form-group form-group-float mb-1"
            status = <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-6 offset-lg-3">
                        <div className="text-center mb-3">
                            <i className="icon-plus3 icon-2x text-success border-success border-3 rounded-round p-3 mb-3 mt-1"></i>
                            <h5 className="mb-0">Create account</h5>
                            <span className="d-block text-muted">All fields are required</span>
                        </div>
                        <div className={form_group}>
                            <label className={`form-group-float-label animate ${this.state.email.label_visibility ? 'is-visible' : ''}`}>Email</label>
                            <div className="input-group">
                                <span className="input-group-prepend">
                                    <span className="input-group-text">
                                        <i className="icon-mention text-muted"></i>
                                    </span>
                                </span>
                                <input type="text"
                                    className="form-control"
                                    placeholder="Enter your email"
                                    id="email_text_input"
                                    onChange={this.on_text_field_change}
                                    value={this.state.email.value} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className={form_group}>
                                    <label className={`form-group-float-label animate ${this.state.first_name.label_visibility ? 'is-visible' : ''}`}>First name</label>
                                    <div className="input-group">
                                        <span className="input-group-prepend">
                                            <span className="input-group-text">
                                                <i className="icon-user-check text-muted"></i>
                                            </span>
                                        </span>
                                        <input type="text"
                                            className="form-control"
                                            placeholder="First name"
                                            id="first_name_text_input"
                                            onChange={this.on_text_field_change}
                                            value={this.state.first_name.value} />
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className={form_group}>
                                    <label className={`form-group-float-label animate ${this.state.last_name.label_visibility ? 'is-visible' : ''}`}>Last name</label>
                                    <div className="input-group">
                                        <span className="input-group-prepend">
                                            <span className="input-group-text">
                                                <i className="icon-user-check text-muted"></i>
                                            </span>
                                        </span>
                                        <input type="text"
                                            className="form-control"
                                            placeholder="Last name"
                                            id="last_name_text_input"
                                            onChange={this.on_text_field_change}
                                            value={this.state.last_name.value} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <div className={form_group}>
                                    <label className={`form-group-float-label animate ${this.state.password.label_visibility ? 'is-visible' : ''}`}>Password</label>
                                    <div className="input-group">
                                        <span className="input-group-prepend">
                                            <span className="input-group-text">
                                                <i className="icon-user-lock text-muted"></i>
                                            </span>
                                        </span>
                                        <input type="password"
                                            className="form-control"
                                            placeholder="Password"
                                            id="password_text_input"
                                            onChange={this.on_text_field_change}
                                            value={this.state.password.value} />
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className={form_group}>
                                    <label className={`form-group-float-label animate ${this.state.verify_password.label_visibility ? 'is-visible' : ''}`}>Verify Password</label>
                                    <div className="input-group">
                                        <span className="input-group-prepend">
                                            <span className="input-group-text">
                                                <i className="icon-user-lock text-muted"></i>
                                            </span>
                                        </span>
                                        <input type="password"
                                            className="form-control"
                                            placeholder="Verify password"
                                            id="verify_password_text_input"
                                            onChange={this.on_text_field_change}
                                            value={this.state.verify_password.value} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className={`${form_group} `}>
                                    <label className={`form-group-float-label animate ${this.state.dob.label_visibility ? 'is-visible' : ''}`}>Date of birth</label>
                                    <span className="input-group-prepend">
                                        <span className="input-group-text">
                                            <i className="icon-calendar3 text-muted"></i>
                                        </span>
                                        <DateTimePicker id="dob_text_input"
                                            onChange={this.on_date_of_birth_change}
                                            className="clock_datatime_picker"
                                            inputProps={{ placeholder: 'Date of birth', width: '100%', className: 'form-control' }}
                                            input={true}
                                            dateFormat={'ll'}
                                            timeFormat={false}
                                            closeOnSelect={true}
                                            value={this.state.dob.value}
                                            />
                                    </span>

                                </div>

                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-3">
                                <div className={form_group}>
                                    <label className={`form-group-float-label animate ${this.state.cnic.label_visibility ? 'is-visible' : ''}`}>CNIC number</label>
                                    <div className="input-group">
                                        <span className="input-group-prepend">
                                            <span className="input-group-text">
                                                <i className="icon-vcard text-muted"></i>
                                            </span>
                                        </span>
                                        <input type="number"
                                            className="form-control"
                                            placeholder="Enter cnic number"
                                            id="cnic_text_input"
                                            onChange={this.on_text_field_change}
                                            value={this.state.cnic.value} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className={form_group}>
                                    <label className={`form-group-float-label animate ${this.state.phone.label_visibility ? 'is-visible' : ''}`}>Phone number</label>
                                    <div className="input-group">
                                        <span className="input-group-prepend">
                                            <span className="input-group-text">
                                                <i className="icon-phone2 text-muted"></i>
                                            </span>
                                        </span>
                                        <input type="number"
                                            className="form-control"
                                            placeholder="Enter phone number"
                                            id="phone_text_input"
                                            onChange={this.on_text_field_change}
                                            value={this.state.phone.value} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className={form_group}>
                                    <label className={`form-group-float-label animate ${this.state.address.label_visibility ? 'is-visible' : ''}`}>Address</label>
                                    <div className="input-group">
                                        <span className="input-group-prepend">
                                            <span className="input-group-text">
                                                <i className="icon-home text-muted"></i>
                                            </span>
                                        </span>
                                        <input type="text"
                                            className="form-control"
                                            placeholder="Enter current address"
                                            id="address_text_input"
                                            onChange={this.on_text_field_change}
                                            value={this.state.address.value}
                                            />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr />

                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group form-group-feedback form-group-feedback-right">
                                    <Select
                                        options={options_blood_group}
                                        classNamePrefix={`form-control`}
                                        placeholder="Select blood group"
                                        id="blood_group_selection"
                                        onChange={this.on_selected_changed}
                                        value={{id: 'blood_group_selection', label: this.state.blood_group.value}}
                                    />
                                    <div className="form-control-feedback">
                                        <i className="icon-user-check text-muted"></i>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group form-group-feedback form-group-feedback-right">
                                    <Select
                                        options={options_gender}
                                        classNamePrefix={`form-control`}
                                        placeholder="Select gender"
                                        id="gender_selection"
                                        onChange={this.on_selected_changed}
                                        value={{id: 'gender_selection', label: this.state.gender.value}}
                                    />
                                    <div className="form-control-feedback">
                                        <i className="icon-user-check text-muted"></i>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group form-group-feedback form-group-feedback-right">
                                    <Select
                                        options={options_roles}
                                        classNamePrefix={`form-control`}
                                        placeholder="Select role"
                                        id="role_selection"
                                        onChange={this.on_selected_changed}
                                        value={{id: 'role_selection', label: this.state.role.value}}
                                    />
                                    <div className="form-control-feedback">
                                        <i className="icon-user-check text-muted"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="float-right mt-0">
                                    <button
                                        type="button"
                                        className="btn bg-teal-400 btn-labeled btn-labeled-right pr-5"
                                        style={{ textTransform: "inherit" }}
                                        onClick={this.on_submit}>
                                        <b><i className="icon-plus3"></i></b>
                                        Create Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        }
        return (
            <Container container_type={'register'}>
                {
                    status
                }
             </Container>
        );
    }
}
function map_state_to_props(notify) {
    return { notify }
}
export default connect(map_state_to_props, { notify })(withRouter(Register));