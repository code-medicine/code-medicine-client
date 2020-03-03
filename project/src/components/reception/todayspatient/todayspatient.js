import React, { Component } from 'react';
import Container from '../../../shared/container/container'
import Select from 'react-select'
import Axios from 'axios';
import { BASE_RECEPTION_URL, BASE_USERS_URL, NEW_APPOINTMENT_URL, REGISTER_USER_REQUEST } from '../../../shared/rest_end_points';
import { connect } from "react-redux";
import { notify } from '../../../actions';
import { Link, withRouter } from 'react-router-dom';
import NO_PICTURE from '../../../resources/images/placeholder.jpg'
// import Moment from 'react-moment';
import Modal from 'react-bootstrap4-modal';
// import Inputfield from '../../../shared/inputfield/inputfield';
import Loader from 'react-loader-spinner';
import DateTimePicker from 'react-datetime'
import Inputfield from '../../../shared/inputfield/inputfield';
import { BLOOD_GROUPS_OPTIONS, GENDER_OPTIONS, ROLES_OPTIONS } from '../../../shared/constant_data'
import './todayspatient.css'
import { LOGIN_URL } from '../../../shared/router_constants';
import User from '../../../shared/customs/user' 

// import 'moment-timezone';
class Todayspatient extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: null,
            totalRecords: 0,

            providers: [],
            patients: [],

            new_appointment_modal_visibility: false,
            new_user_modal_visibility: false,
            appointment_modal_loading_status: false,
            user_modal_loading_status: false,

            appointment_patient: { value: '' },
            appointment_doctor: { value: '' },
            appointment_reason: { value: '' },
            appointment_date: { value: '' },
            appointment_time: { value: '' },

            user_first_name: { value: '', label_visibility: false },
            user_last_name: { value: '', label_visibility: false },
            user_email: { value: '', label_visibility: false },
            user_password: { value: '', label_visibility: false },
            user_verify_password: { value: '', label_visibility: false },
            user_gender: { value: '', label_visibility: false },
            user_dob: { value: '', label_visibility: false },
            user_blood_group: { value: '', label_visibility: false },
            user_role: { value: 'Patient', label_visibility: false },
            user_phone_number: { value: '', label_visibility: false },
            user_cnic: { value: '', label_visibility: false },
            user_address: { value: '', label_visibility: false }
        }
    }

    async request(data,url) {
        try{
            let response = await Axios.post(url, data, {
                headers: { 'code-medicine': localStorage.getItem('user')}
            })
            return response
        }
        catch(err){
            this.props.notify('error','','Server is not responding! Please try again later')
            return null
        }
    }

    populate_doctors = async (data) => {
        let res_doctors = await this.request(data, BASE_USERS_URL)
        if (res_doctors === null) return
        if (res_doctors.data.status) {
            var temp_doctors = []

            for (var i = 0; i < res_doctors.data.payload['count']; ++i) {
                const t_user = res_doctors.data.payload['users'][i]
                temp_doctors.push({
                    id: 'appointment_doctor_selection',
                    reference: t_user.email,
                    label: `Dr. ${t_user.first_name} ${t_user.last_name} | ${t_user.phone_number} | ${t_user.email}`
                })
            }
            this.setState({ providers: temp_doctors })
        }
        else {
            console.log(res_doctors.data.message)
        }
    }
    populate_patients = async (data) => {
        let res_patients = await this.request(data,BASE_USERS_URL)
        if (res_patients === null) return
        if (res_patients.data.status) {
            var temp_patients = [] //res.data.payload['users']

            for (var i = 0; i < res_patients.data.payload['count']; ++i) {
                const t_user = res_patients.data.payload['users'][i]
                temp_patients.push({
                    id: 'appointment_patient_selection',
                    reference: t_user.email,
                    label: `${t_user.first_name} ${t_user.last_name} | ${t_user.phone_number} | ${t_user.email}`
                })
            }
            this.setState({ patients: temp_patients })
        }
        else {
            console.log(res_patients.data.message)
        }
    }

    populate_appointments = async (data) => {
        let res_visits = await this.request(data,BASE_RECEPTION_URL)
        if (res_visits === null) return
        if (res_visits.data.status) {
            this.setState({ data: res_visits.data.payload, totalRecords: res_visits.data.payload.length })
        }
        else {
            this.props.notify('info', '', res_visits.data.message)
            if (res_visits.data.message !== 'No visits found for today')
                this.props.history.push(LOGIN_URL)
            this.setState({data: []})
        }
    }
    componentDidMount() {
        this.populate_appointments({date_flag: 'today'})
        var data = {
            select: {role: 'Doctor'},
            range: 'None'
        }
        this.populate_doctors(data)
        data = {
            select: {role: 'Patient'},
            range: {min: 0,max: 4}
        }
        this.populate_patients(data)
    }

    on_text_field_change = (e) => {
        switch (e.target.id) {
            case 'user_first_name_text_input':
                if (e.target.value === '')
                    this.setState({ user_first_name: { value: e.target.value, label_visibility: false } })
                else
                    this.setState({ user_first_name: { value: e.target.value, label_visibility: true } })
                break;
            case 'user_last_name_text_input':
                if (e.target.value === '')
                    this.setState({ user_last_name: { value: e.target.value, label_visibility: false } })
                else
                    this.setState({ user_last_name: { value: e.target.value, label_visibility: true } })
                break;
            case 'user_cnic_text_input':
                if (e.target.value === '')
                    this.setState({ user_cnic: { value: e.target.value, label_visibility: false } })
                else {
                    this.setState({ user_cnic: { value: e.target.value, label_visibility: true } })
                }
                break;
            case 'user_phone_number_text_input':
                if (e.target.value === '')
                    this.setState({ user_phone_number: { value: e.target.value, label_visibility: false } })
                else
                    this.setState({ user_phone_number: { value: e.target.value, label_visibility: true } })
                break;
            case 'user_email_text_input':
                if (e.target.value === '')
                    this.setState({ user_email: { value: e.target.value, label_visibility: false } })
                else
                    this.setState({ user_email: { value: e.target.value, label_visibility: true } })
                break;
            case 'user_address_text_input':
                if (e.target.value === '')
                    this.setState({ user_address: { value: e.target.value, label_visibility: false } })
                else
                    this.setState({ user_address: { value: e.target.value, label_visibility: true } })
                break;
            case 'appointment_reason_text_input':
                this.setState({ appointment_reason: { value: e.target.value } })
                break;

            default:
                break;
        }
    }



    on_user_date_of_birth_change = (e) => {
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

    on_apointment_date_change = (e) => {
        if (e === '')
            this.setState({ appointment_date: { value: '', label_visibility: false } })
        else {
            var configured_date = null;
            try {
                configured_date = e.format('ll');
            }
            catch (err) {
                configured_date = ''
            }
            finally {
                this.setState({ appointment_date: { value: configured_date, label_visibility: true } })
            }
        }
    }
    on_apointment_time_change = (e) => {
        
        if (e === '')
            this.setState({ appointment_time: { value: '', label_visibility: false } })
        else {
            var configured_date = null;
            try {
                configured_date = e.format('LT');
            }
            catch (err) {
                configured_date = ''
            }
            finally {
                this.setState({ appointment_time: { value: configured_date, label_visibility: true } })
            }
        }
    }

    

    on_submit_new_appointment = () => {
        const data = {
            patient_email: this.state.appointment_patient.value,
            doctor_email: this.state.appointment_doctor.value,
            date: this.state.appointment_date.value,
            time: this.state.appointment_time.value,
            reason: this.state.appointment_reason.value,
            type: 'Admin sahab replace this with token or identification!',
            status: 'waiting'
        }
        this.setState({ appointment_modal_loading_status: true })
        Axios.post(NEW_APPOINTMENT_URL, data, {
            headers: {
                'code-medicine': localStorage.getItem('user')
            }
        }).then(res => {
            if (res.data.status) {
                this.props.notify('success', '', res.data.message)
                this.setState({
                    appointment_patient: { value: '' },
                    appointment_doctor: { value: '' },
                    appointment_date: { value: '' },
                    appointment_time: { value: '' },
                    appointment_reason: { value: '' },
                    appointment_modal_loading_status: false,
                    new_appointment_modal_visibility: false
                })
                this.populate_appointments({date_flag: 'today'})
            }
            else {
                this.props.notify('error', '', res.data.message)
                this.setState({
                    appointment_modal_loading_status: false,
                })
            }
        }).catch(err => {
            this.props.notify('error', '', 'Server not responding')
            this.setState({
                appointment_modal_loading_status: false,
            })
        })

    }

    on_selected_changed = (e) => {
        switch (e.id) {
            case 'user_blood_group_selection':
                this.setState({ user_blood_group: { value: e.label } })
                break;
            case 'user_gender_selection':
                this.setState({ user_gender: { value: e.label } })
                break;
            case 'appointment_patient_selection':
                this.setState({ appointment_patient: { value: e.reference } })
                break;
            case 'appointment_doctor_selection':
                this.setState({ appointment_doctor: { value: e.reference } })
                break;
            default:
                break;
        }
    }
    renderDataInRows = () => {
        return (this.state.data.map((booking, i) => {
            return (
                // <div key={i} className="card border-left-slate border-top-0 border-bottom-0 border-right-0" >
                <div key={i} className="">
                    <div  className="row my-1 mx-1">
                        <div className="col-md-4">
                            <User 
                                name={booking.patient['first_name'] + ' ' + booking.patient['last_name']} 
                                dob={booking.patient['dob']}
                                gender={booking.patient['gender']}
                                phone={booking.patient['phone_number']}
                                email={booking.patient['email']}
                            />
                        </div>
                        <div className="col-md-8">
                            <div className="row">
                                <div className="col-md-8">
                                    <h5 className="font-weight-bold"> 
                                        Today at {booking.time} 
                                    </h5>
                                </div>
                                <div className="col-md-4 text-right">
                                    <span className="badge badge-danger">{booking.status}</span>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-3">
                                    Attendant
                                </div>
                                <div className="col-md-9">
                                    <p>Dr. {booking.doctor['first_name']} {booking.doctor['last_name']}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-3">
                                    Reason
                                </div>
                                <div className="col-md-9">
                                    <p className="text-break">{booking.description}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <button className="btn btn-outline-primary btn-sm float-right">Payment</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr/>
                </div>
                // </div>
                
            )
        }))
    }

    on_submit_new_patient = async () => {
        const data = {
            first_name: this.state.user_first_name.value.trim(),
            last_name: this.state.user_last_name.value.trim(),
            email: this.state.user_email.value.trim(),
            password: 'default',
            phone_number: this.state.user_phone_number.value.trim(),
            cnic: this.state.user_cnic.value.trim(),
            role: this.state.user_role.value.trim(),
            dob: this.state.user_dob.value,
            gender: this.state.user_gender.value.trim(),
            blood_group: this.state.user_blood_group.value.trim(),
            address: this.state.user_address.value.trim()
        }
        this.setState({ user_modal_loading_status: true })
        var response = await Axios.post(`${REGISTER_USER_REQUEST}`, data);

        try {
            if (response.data['status']) {
                setTimeout(() => {
                    this.props.notify('success', '', response.data['message']);
                    this.setState({ user_modal_loading_status: false, new_user_modal_visibility: false })
                    let update = {
                        select: {role: 'Patient'},
                        range: {min: 0,max: 4}
                    }
                    this.populate_patients(update)
                }, 5000)
            }
            else {
                this.props.notify('error', '', response.data['message'])
                setTimeout(() => {
                    this.setState({ user_modal_loading_status: false })
                }, 3000)
            }
        }
        catch (err) {
            this.props.notify('error', '', 'We are sorry for invonvenience. Server is not responding! please try again later')
            setTimeout(() => {
                this.setState({ user_modal_loading_status: false })
            }, 3000)
        }
    }
    render() {
        var table = <div className="d-flex justify-content-center">
                <Loader
                    type="Rings"
                    color="#00BFFF"
                    height={150}
                    width={150}
                    timeout={60000} //60 secs
                />
            </div>
        if (this.state.data != null) {
            if (this.state.totalRecords > 0) {
                table = <div className="container-fluid">
                    {this.renderDataInRows(this.state.filter_data)}
                </div>
            }
            else{
                table = <div className="alert alert-info" style={{ marginBottom: '0px' }}>
                    <strong>Info!</strong> No visits found.
                </div>;
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
                                onClick={() => this.setState({
                                    new_appointment_modal_visibility: this.state.new_appointment_modal_visibility ? false : true
                                })}>
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

                {/* 
                    Add new appointment modal
                */}

                <Modal
                    visible={this.state.new_appointment_modal_visibility}
                    onClickBackdrop={() => this.setState({ new_appointment_modal_visibility: false })}
                    fade={true}
                    dialogClassName={`modal-dialog-centered modal-lg`}>

                    <div className="modal-header bg-teal-400">
                        <h5 className="modal-title">New Appointment</h5>
                    </div>
                    {this.state.appointment_modal_loading_status ? <div className="mt-3">
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
                    </div> : <div className="modal-body">
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
                                            placeholder="Select Patient"
                                            onChange={this.on_selected_changed}
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
                                        <textarea rows={5} cols={5}
                                            id="appointment_reason_text_input"
                                            className="form-control"
                                            placeholder="Reason for visit"
                                            onChange={this.on_text_field_change} />
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-1">
                                <div className="col-6">
                                    Which doctor will be suitable
                            </div>
                                <div className="col-6">
                                    What is the date and time of appointment
                            </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group form-group-feedback form-group-feedback-right">
                                        <Select
                                            options={this.state.providers}
                                            classNamePrefix={`form-control`}
                                            placeholder="Select a Doctor"
                                            onChange={this.on_selected_changed}
                                        />
                                        <div className="form-control-feedback">
                                            <i className="icon-user-tie text-muted"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <DateTimePicker id="dob_text_input"
                                        onChange={this.on_apointment_date_change}
                                        className="clock_datatime_picker"
                                        inputProps={{ placeholder: 'Select Date', width: '100%', className: 'form-control' }}
                                        input={true}
                                        dateFormat={'ll'}
                                        timeFormat={false}
                                        closeOnSelect={true}
                                        value={this.state.appointment_date.value}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <DateTimePicker id="dob_text_input"
                                        onChange={this.on_apointment_time_change}
                                        className="clock_datatime_picker"
                                        inputProps={{ placeholder: 'Select Time', width: '100%', className: 'form-control' }}
                                        input={true}
                                        dateFormat={false}
                                        timeFormat={true}
                                        closeOnSelect={true}
                                        strictParsing={true}
                                        value={this.state.appointment_time.value}
                                    />
                                </div>
                            </div>
                        </div>
                    }
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
                            onClick={this.on_submit_new_appointment}>
                            <b><i className="icon-plus3"></i></b>
                            Add
                        </button>
                    </div>
                </Modal>
                {/* 
                    Register new patient modal 
                */}
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

                    {this.state.user_modal_loading_status ? <div className="mt-3">
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
                    </div> : <div className="modal-body">
                        <div className={`row`}>
                            <div className={`col-md-9`}>
                                <div className={`row`}>
                                    <div className={`col-md-6`}>
                                        <Inputfield
                                            id={`user_first_name_text_input`}
                                            label_visibility={this.state.user_first_name.label_visibility}
                                            label_tag={'First name'}
                                            icon={'icon-user-check'}
                                            input_type={'text'}
                                            on_text_change_listener={this.on_text_field_change}
                                            default_value={this.state.user_first_name.value} />
                                    </div>
                                    <div className={`col-md-6`}>
                                        <Inputfield
                                            id={`user_last_name_text_input`}
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
                                            id={`user_phone_number_text_input`}
                                            label_visibility={this.state.user_phone_number.label_visibility}
                                            label_tag={'Phone number'}
                                            icon={'icon-user-check'}
                                            input_type={'number'}
                                            on_text_change_listener={this.on_text_field_change}
                                            default_value={this.state.user_phone_number.value} />
                                    </div>
                                    <div className={`col-md-4`}>
                                        <Inputfield
                                            id={`user_cnic_text_input`}
                                            label_visibility={this.state.user_cnic.label_visibility}
                                            label_tag={'CNIC'}
                                            icon={'icon-user-check'}
                                            input_type={'number'}
                                            on_text_change_listener={this.on_text_field_change}
                                            default_value={this.state.user_cnic.value} />
                                    </div>
                                    <div className={`col-md-4`}>
                                        <Inputfield
                                            id={`user_email_text_input`}
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
                                    id={`user_address_text_input`}
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
                                        <DateTimePicker id="user_dob_text_input"
                                            onChange={this.on_user_date_of_birth_change}
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
                                        id="user_gender_selection"
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
                                        id="user_blood_group_selection"
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
                                        value={[{ id: 'role_selection', label: 'Patient' }]}
                                        isDisabled
                                    />
                                    <div className="form-control-feedback">
                                        <i className="icon-user-check text-muted"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>}
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
                            onClick={this.on_submit_new_patient}>
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