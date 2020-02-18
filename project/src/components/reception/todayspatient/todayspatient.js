import React, { Component } from 'react';
import Container from '../../../shared/container/container'
import Select from 'react-select'
import Axios from 'axios';
import { BASE_RECEPTION_URL, BASE_USERS_URL } from '../../../shared/rest_end_points';
import { connect } from "react-redux";
import { notify } from '../../../actions';
import { Link, withRouter } from 'react-router-dom';
import NO_PICTURE from '../../../resources/images/placeholder.jpg'
import Moment from 'react-moment';
import Modal from 'react-bootstrap4-modal';
// import Inputfield from '../../../shared/inputfield/inputfield';
import Loader from 'react-loader-spinner';
import DateTimePicker from 'react-datetime'
import Inputfield from '../../../shared/inputfield/inputfield';
import { BLOOD_GROUPS_OPTIONS, GENDER_OPTIONS, ROLES_OPTIONS } from '../../../shared/constant_data'
import './todayspatient.css'
import { LOGIN_URL } from '../../../shared/router_constants';

// import 'moment-timezone';
class Todayspatient extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            totalRecords: 0,

            providers: [],
            patients: [],
            
            new_appointment_modal_visibility: false,
            new_user_modal_visibility: false,
            modal_loading_status: false,

            user_first_name: { value: '', label_visibility: false },
            user_last_name: { value: '', label_visibility: false },
            user_email: { value: '', label_visibility: false },
            user_password: { value: '', label_visibility: false },
            user_verify_password: { value: '', label_visibility: false },
            user_gender: { value: '', label_visibility: false },
            user_dob: { value: '', label_visibility: false },
            user_blood_group: { value: '', label_visibility: false },
            user_role: { value: '', label_visibility: false },
            user_phone: { value: '', label_visibility: false },
            user_cnic: { value: '', label_visibility: false },
            user_address: { value: '', label_visibility: false }
        }
    }


    componentDidMount() {
        var data = {
            select: {
                role: 'Doctor'
            },
            range: 'None'
        }
        Axios.post(BASE_USERS_URL,data,{
            headers: {
                'code-medicine': localStorage.getItem('user')
            }
        }).then(res => {
            if (res.data.status){
                var temp_doctors = [] //res.data.payload['users']

                for (var i = 0; i < res.data.payload['count']; ++i){
                    const t_user = res.data.payload['users'][i]
                    temp_doctors.push({
                        id: t_user._id, 
                        label: `Dr. ${t_user.first_name} ${t_user.last_name} | ${t_user.phone_number} | ${t_user.email}`
                    })
                }
                this.setState({ providers: temp_doctors })
            }
            else {
                console.log(res.data.message)
            }
        }).catch(err => {
            console.log('error',err)
        })
        data = {
            select: {
                role: 'Patient'
            },
            range: {
                min: 0,
                max: 4
            }
        }
        Axios.post(BASE_USERS_URL,data,{
            headers: {
                'code-medicine': localStorage.getItem('user')
            }
        }).then(res => {
            if (res.data.status){
                var temp_patient = [] //res.data.payload['users']

                for (var i = 0; i < res.data.payload['count']; ++i){
                    const t_user = res.data.payload['users'][i]
                    temp_patient.push({
                        id: t_user._id, 
                        label: `${t_user.first_name} ${t_user.last_name} | ${t_user.phone_number} | ${t_user.email}`
                    })
                }
                this.setState({ patients: temp_patient })
            }
            else {
                console.log(res.data.message)
            }
        }).catch(err => {
            console.log('error',err)
        })
        Axios.post(BASE_RECEPTION_URL, {}, {
            headers: {
                'code-medicine': localStorage.getItem('user')
            }
        }).then(res => {
            if (res.data.status) {
                this.setState({ data: res.data.payload, totalRecords: res.data.payload.length })
            }
            else {
                this.props.notify('info', '', res.data.message)
                if (res.data.message !== 'No visits found for today')
                    this.props.history.push(LOGIN_URL)
            }
        }).catch(err => {
            this.props.notify('error','',err)
            this.props.history.push(LOGIN_URL)
        })
    }

    on_text_field_change = (e) => {
        switch (e.target.id) {
            case 'first_name_text_input':
                if (e.target.value === '')
                    this.setState({ user_first_name: { value: e.target.value, label_visibility: false } })
                else
                    this.setState({ user_first_name: { value: e.target.value, label_visibility: true } })
                break;
            case 'last_name_text_input':
                if (e.target.value === '')
                    this.setState({ user_last_name: { value: e.target.value, label_visibility: false } })
                else
                    this.setState({ user_last_name: { value: e.target.value, label_visibility: true } })
                break;
            case 'cnic_text_input':
                if (e.target.value === '')
                    this.setState({ user_cnic: { value: e.target.value, label_visibility: false } })
                else {
                    this.setState({ user_cnic: { value: e.target.value, label_visibility: true } })
                }
                break;
            case 'phone_number_text_input':
                if (e.target.value === '')
                    this.setState({ user_phone_number: { value: e.target.value, label_visibility: false } })
                else
                    this.setState({ user_phone_number: { value: e.target.value, label_visibility: true } })
                break;
            case 'email_text_input':
                if (e.target.value === '')
                    this.setState({ user_email: { value: e.target.value, label_visibility: false } })
                else
                    this.setState({ user_email: { value: e.target.value, label_visibility: true } })
                break;
            case 'password_text_input':
                if (e.target.value === '')
                    this.setState({ user_password: { value: e.target.value, label_visibility: false } })
                else
                    this.setState({ user_password: { value: e.target.value, label_visibility: true } })
                break;
            case 'verify_password_text_input':
                if (e.target.value === '')
                    this.setState({ user_verify_password: { value: e.target.value, label_visibility: false } })
                else
                    this.setState({ user_verify_password: { value: e.target.value, label_visibility: true } })
                break;
            case 'phone_text_input':
                if (e.target.value === '')
                    this.setState({ user_phone: { value: e.target.value, label_visibility: false } })
                else
                    this.setState({ user_phone: { value: e.target.value, label_visibility: true } })
                break;
            case 'address_text_input':
                if (e.target.value === '')
                    this.setState({ user_address: { value: e.target.value, label_visibility: false } })
                else
                    this.setState({ user_address: { value: e.target.value, label_visibility: true } })
                break;
            default:
                break;
        }
    }

    on_date_of_birth_change = (e) => {

        if (e === '')
            this.setState({ user_dob: { value: '', label_visibility: false } })
        else {
            var configured_date = null;
            try {
                configured_date = e.format('ll');
            }
            catch (err) {
                configured_date = ''
            }
            finally {
                this.setState({ user_dob: { value: configured_date, label_visibility: true } })
            }
        }
    }

    renderDataInRows = () => {
        return (this.state.data.map((booking, i) => {
            // var time = new Date(booking.time);

            return (
                <tr key={i}>
                    <td>
                        {booking.patient['first_name']}
                    </td>
                    <td>
                        <Moment format="HH:mm" date={booking.time}></Moment>
                    </td>
                    <td>
                        {booking.description}
                    </td>
                </tr>
            )
        }))
    }

    on_submit_new_appointment = () => {

    }

    render() {
        const users_options = [
            { id: 'user1', label: 'Farrukh | i150310@nu.edu.pk | 03044848492' },
            { id: 'user1', label: 'Ammad | ammad.hassan@gmail.com | 03233535354' },
            { id: 'user1', label: 'Uzair | uzair.hassan@gmail.com | 03356333860' }
        ]
        var table = <div className="">
            <div className="alert alert-info" style={{ marginBottom: '0px' }}>
                <strong>Info!</strong> No visits found.
                        </div>
            <div className="d-flex justify-content-center">
                <Loader
                    type="Rings"
                    color="#00BFFF"
                    height={150}
                    width={150}
                    timeout={60000} //60 secs
                />
            </div>
        </div>;
        if (this.state.data != null) {
            if (this.state.totalRecords > 0) {
                table = <table className="table table-togglable table-hover table-bordered">
                    <tbody>
                        {this.renderDataInRows(this.state.filter_data)}
                    </tbody>
                </table>
            }
        }

        return (
            <Container container_type="todayspatient">
                <div className="row">
                    <div className="col-md-9">
                        <div className="card">
                            <div className="card-body py-1">
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label className="font-weight-semibold">Providers</label>
                                            <Select
                                                options={this.state.providers}
                                                placeholder="Select Providers"
                                            // value={this.state.selectedOption}
                                            // onChange={this.handleSelectChange}
                                            // onClick={()=>this.get}
                                            />
                                        </div>
                                    </div>
                                    <div className={`col-md-4`}>
                                        <div className="form-group">
                                            <label className="font-weight-semibold">Location</label>
                                            <Select
                                                // options={this.state.search_options}
                                                placeholder="Select Location"
                                            // value={this.state.selectedOption}
                                            // onChange={this.handleSelectChange}
                                            // onClick={()=>this.get}
                                            />
                                        </div>


                                    </div>
                                    <div className={`col-md-4`}>

                                        <div className="form-group">
                                            <label className="font-weight-semibold">Status</label>
                                            <Select
                                                // options={this.state.search_options}
                                                placeholder="Select Status"
                                            // value={this.state.selectedOption}
                                            // onChange={this.handleSelectChange}
                                            // onClick={()=>this.get}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="d-flex align-items-center">
                            <button
                                type="button"
                                className="btn bg-teal-400 btn-labeled btn-labeled-right btn-block pr-5"
                                style={{ textTransform: "inherit" }}
                                onClick={() => this.setState({ new_appointment_modal_visibility: this.state.new_appointment_modal_visibility ? false : true })}>
                                <b><i className="icon-plus3"></i></b>
                                New Appointment
                            </button>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-body">
                        {table}
                    </div>
                </div>
                <Modal
                    visible={this.state.new_appointment_modal_visibility}
                    onClickBackdrop={() => this.setState({ new_appointment_modal_visibility: false })}
                    fade={true}
                    dialogClassName={`modal-dialog-centered modal-lg`}>

                    <div className="modal-header bg-teal-400">
                        <h5 className="modal-title">New Appointment</h5>
                    </div>
                    <div className="modal-body">
                        <div className="row mb-1">
                            <div className="col-12">
                                Select or add user
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-10">
                                <div className="form-group form-group-feedback form-group-feedback-right">
                                    <Select
                                        options={this.state.patients}
                                        classNamePrefix={`form-control`}
                                        placeholder="Select User"
                                        id="patient_selection"
                                    />
                                    <div className="form-control-feedback">
                                        <i className="icon-user-check text-muted"></i>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-2">
                                <button
                                    type="button"
                                    className="btn bg-teal-400 btn-labeled btn-labeled-right btn-block pr-5"
                                    style={{ textTransform: "inherit" }}
                                    onClick={() => this.setState({ new_user_modal_visibility: true })}>
                                    <b><i className="icon-plus3"></i></b>
                                    New user
                                </button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="form-group form-group-float">
                                    <div className="form-group-float-label is-visible mb-1">
                                        What is the reason for the visit
                                    </div>
                                    <textarea rows={5} cols={5} className="form-control" placeholder="Reason for visit" />
                                </div>
                            </div>
                        </div>
                        <div className="row mb-1">
                            <div className="col-6">
                                Which doctor will be suitable
                            </div>
                            <div className="col-6">
                                What is the date/time of appointment
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group form-group-feedback form-group-feedback-right">
                                    <Select
                                        options={this.state.providers}
                                        classNamePrefix={`form-control`}
                                        placeholder="Select a Doctor"
                                        id="doctor_selection"
                                    />
                                    <div className="form-control-feedback">
                                        <i className="icon-user-tie text-muted"></i>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <DateTimePicker id="dob_text_input"
                                    // onChange={this.on_date_of_birth_change}
                                    className="clock_datatime_picker"
                                    inputProps={{ placeholder: 'Select Date', width: '100%', className: 'form-control' }}
                                    input={true}
                                    dateFormat={'ll'}
                                    timeFormat={false}
                                    closeOnSelect={true}
                                // value={this.state.dob.value}
                                />
                            </div>
                            <div className="col-md-3">
                                <DateTimePicker id="dob_text_input"
                                    // onChange={this.on_date_of_birth_change}
                                    className="clock_datatime_picker"
                                    inputProps={{ placeholder: 'Select Time', width: '100%', className: 'form-control' }}
                                    input={true}
                                    dateFormat={false}
                                    timeFormat={true}
                                    closeOnSelect={true}
                                // value={this.state.dob.value}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn bg-danger btn-labeled btn-labeled-right pr-5"
                            style={{ textTransform: "inherit" }}
                            onClick={() => this.setState({ new_appointment_modal_visibility: false })}>
                            <b><i className="icon-cross"></i></b>
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="btn bg-teal-400 btn-labeled btn-labeled-right pr-5"
                            style={{ textTransform: "inherit" }}
                            onClick={this.on_submit}>
                            <b><i className="icon-plus3"></i></b>
                            Add
                        </button>
                    </div>
                </Modal>
                <Modal
                    visible={this.state.new_user_modal_visibility}
                    onClickBackdrop={() => this.setState({ new_user_modal_visibility: false })}
                    fade={true}
                    dialogClassName={`modal-dialog-centered modal-lg`}
                >
                    {/* <Register/> */}
                    <div className="modal-header bg-teal-400">
                        <h5 className="modal-title">New Patient</h5>
                    </div>
                    <div className="modal-body">
                        <div className={`row`}>
                            <div className={`col-md-9`}>
                                <div className={`row`}>
                                    <div className={`col-md-6`}>
                                        <Inputfield
                                            id={`first_name_text_input`}
                                            label_visibility={this.state.user_first_name.label_visibility}
                                            label_tag={'First name'}
                                            icon={'icon-user-check'}
                                            input_type={'text'}
                                            on_text_change_listener={this.on_text_field_change}
                                            default_value={this.state.user_first_name.value} />
                                    </div>
                                    <div className={`col-md-6`}>
                                        <Inputfield
                                            id={`last_name_text_input`}
                                            label_visibility={this.state.user_last_name.label_visibility}
                                            label_tag={'Last name'}
                                            icon={'icon-user-check'}
                                            input_type={'text'}
                                            on_text_change_listener={this.on_text_field_change}
                                            default_value={this.state.user_last_name.value} />
                                    </div>
                                </div>
                                <div className={`row`}>
                                    <div className={`col-md-4`}>
                                        <Inputfield
                                            id={`phone_text_input`}
                                            label_visibility={this.state.user_phone.label_visibility}
                                            label_tag={'Phone number'}
                                            icon={'icon-user-check'}
                                            input_type={'number'}
                                            on_text_change_listener={this.on_text_field_change}
                                            default_value={this.state.user_phone.value} />
                                    </div>
                                    <div className={`col-md-4`}>
                                        <Inputfield
                                            id={`cnic_text_input`}
                                            label_visibility={this.state.user_cnic.label_visibility}
                                            label_tag={'CNIC'}
                                            icon={'icon-user-check'}
                                            input_type={'number'}
                                            on_text_change_listener={this.on_text_field_change}
                                            default_value={this.state.user_cnic.value} />
                                    </div>
                                    <div className={`col-md-4`}>
                                        <Inputfield
                                            id={`email_text_input`}
                                            label_visibility={this.state.user_email.label_visibility}
                                            label_tag={'Enter email'}
                                            icon={'icon-user-check'}
                                            input_type={'email'}
                                            on_text_change_listener={this.on_text_field_change}
                                            default_value={this.state.user_email.value} />
                                    </div>
                                </div>
                            </div>
                            <div className={`col-md-3`}>
                                <div className={`d-flex justify-content-center`}>
                                    <div className="card-img-actions d-inline-block mb-3">
                                        <img className="img-fluid rounded-circle" src={NO_PICTURE} style={{ width: 130, height: 130 }} alt="" />
                                        <div className="card-img-actions-overlay card-img rounded-circle">
                                            <Link to={"#"} className="btn btn-outline bg-white text-white border-white border-2 btn-icon rounded-round">
                                                <i className="icon-plus3"></i>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`row`}>
                            <div className={`col-md-8`}>
                                <Inputfield
                                    id={`address_text_input`}
                                    label_visibility={this.state.user_address.label_visibility}
                                    label_tag={'New patient address'}
                                    icon={'icon-user-check'}
                                    input_type={'text'}
                                    text_area={true}
                                    on_text_change_listener={this.on_text_field_change}
                                    default_value={this.state.user_address.value} />
                            </div>
                            <div className={`col-md-4`}>
                                <div className={`form-group form-group-float mb-1`}>
                                    <label className={`form-group-float-label animate ${this.state.user_dob.label_visibility ? 'is-visible' : ''}`}>Date of birth</label>
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
                                            value={this.state.user_dob.value}
                                        />
                                    </span>

                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className={`row`}>
                            <div className={`col-md-3`}>
                                <div className="form-group form-group-feedback form-group-feedback-right">
                                    <Select
                                        options={GENDER_OPTIONS}
                                        classNamePrefix={`form-control`}
                                        placeholder="Select Gender"
                                        id="gender_selection"
                                        onChange={this.on_selected_changed}
                                    />
                                    <div className="form-control-feedback">
                                        <i className="icon-user-check text-muted"></i>
                                    </div>
                                </div>
                            </div>
                            <div className={`col-md-3`}>
                                <div className="form-group form-group-feedback form-group-feedback-right">
                                    <Select
                                        options={BLOOD_GROUPS_OPTIONS}
                                        className={`Select-option`}
                                        classNamePrefix={`form-control`}
                                        placeholder="Select blood group"
                                        id="blood_group_selection"
                                        onChange={this.on_selected_changed}
                                    />
                                    <div className="form-control-feedback">
                                        <i className="icon-user-check text-muted"></i>
                                    </div>
                                </div>
                            </div>
                            <div className={`col-md-3`}>
                                <div className="form-group form-group-feedback form-group-feedback-right">
                                    <Select
                                        options={ROLES_OPTIONS}
                                        className={`Select-option`}
                                        classNamePrefix={`form-control`}
                                        placeholder="Select roles"
                                        id="role_selection"
                                        value={[{id: 'role_selection', label: 'Patient'}]}
                                        isDisabled
                                    />
                                    <div className="form-control-feedback">
                                        <i className="icon-user-check text-muted"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn bg-danger btn-labeled btn-labeled-right pr-5"
                            style={{ textTransform: "inherit" }}
                            onClick={() => this.setState({ new_user_modal_visibility: false })}>
                            <b><i className="icon-cross"></i></b>
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="btn bg-teal-400 btn-labeled btn-labeled-right pr-5"
                            style={{ textTransform: "inherit" }}
                            onClick={this.on_submit}>
                            <b><i className="icon-plus3"></i></b>
                            Add
                        </button>
                    </div>
                </Modal>
            </Container>
        )
    }
}
function map_state_to_props(notify) {
    return { notify }
}
export default connect(map_state_to_props, { notify })(withRouter(Todayspatient));