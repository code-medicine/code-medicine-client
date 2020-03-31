import React, { Component, Fragment } from 'react';
import Loading from '../customs/loading/loading';
import Select from 'react-select'
import Modal from 'react-bootstrap4-modal';
import DateTimePicker from 'react-datetime';
import moment from 'moment';
import Axios from 'axios';
import { NEW_APPOINTMENT_URL, SEARCH_USER_REQUEST, UPDATE_APPOINTMENT_URL } from '../rest_end_points';
import { notify } from '../../actions';
import { connect } from "react-redux";
import NewUserModal from './newusermodal';


class NewAppointmentModal extends Component {
    constructor(props){
        super(props);
        this.state = {
            loading_status: false,

            patients: this.props.state === 'update'? 
                        [{
                            id: 'appointment_patient_selection',
                            reference: this.props.payload.patient_ref.id,
                            label: `${this.props.payload.patient_ref.first_name} ${this.props.payload.patient_ref.last_name} | ${this.props.payload.patient_ref.phone_number} | ${this.props.payload.patient_ref.email}`
                        }]:[],
            doctors: this.props.state === 'update'? 
                        [{
                            id: 'appointment_doctor_selection',
                            reference: this.props.payload.doctor_ref.id,
                            label: `${this.props.payload.doctor_ref.first_name} ${this.props.payload.doctor_ref.last_name} | ${this.props.payload.doctor_ref.phone_number} | ${this.props.payload.doctor_ref.email}`
                        }]:[],

            appointment_patient: { value: this.props.state === 'update'? this.props.payload.patient_ref.id: '' },
            appointment_doctor: { value: this.props.state === 'update'? this.props.payload.doctor_ref.id: '' },
            appointment_reason: { value: this.props.state === 'update'? this.props.payload.reason: '' },
            appointment_date: { value: this.props.state === 'update'? moment(this.props.payload.date).format('ll'): moment().format('ll') },
            appointment_time: { value: this.props.state === 'update'? this.props.payload.time: moment().format('LT') },

            new_patient_modal_visibility: false,

            patient_select_value:  this.props.state === 'update'? {
                                        id: 'appointment_patient_selection',
                                        reference: this.props.payload.patient_ref.id,
                                        label: `${this.props.payload.patient_ref.first_name} ${this.props.payload.patient_ref.last_name} | ${this.props.payload.patient_ref.phone_number} | ${this.props.payload.patient_ref.email}`
                                    }: '',
            doctor_select_value:   this.props.state === 'update'? {
                                        id: 'appointment_doctor_selection',
                                        reference: this.props.payload.doctor_ref.id,
                                        label: `${this.props.payload.doctor_ref.first_name} ${this.props.payload.doctor_ref.last_name} | ${this.props.payload.doctor_ref.phone_number} | ${this.props.payload.doctor_ref.email}`
                                    }: '',

        }
    }

    async request(_data, _url, _method = "post") {
        try {
            if (_method === 'post'){
                return await Axios.post(_url, _data, { headers: { 'code-medicine': localStorage.getItem('user') } })
            }
            else if (_method === 'get') {
                return await Axios.get(_url, { headers: { 'code-medicine': localStorage.getItem('user') } })
            }
        }
        catch (err) {
            this.props.notify('error', '', 'Server is not responding! Please try again later')
            return null
        }
    }

    async render_users(string,role) {
        const query = `${SEARCH_USER_REQUEST}?search=${string}&role=${role}`
        const res_users = await this.request({}, query, 'get')
        let temp_users = []
        if (this.props.state === 'update'){
            if (role === 'patient'){
                temp_users.push({
                    id: 'appointment_patient_selection',
                    reference: this.props.payload.patient_ref.id,
                    label: `${this.props.payload.patient_ref.first_name} ${this.props.payload.patient_ref.last_name} | ${this.props.payload.patient_ref.phone_number} | ${this.props.payload.patient_ref.email}`
                })
            }
            else{
                temp_users.push( {
                    id: 'appointment_doctor_selection',
                    reference: this.props.payload.doctor_ref.id,
                    label: `${this.props.payload.doctor_ref.first_name} ${this.props.payload.doctor_ref.last_name} | ${this.props.payload.doctor_ref.phone_number} | ${this.props.payload.doctor_ref.email}`
                })
            }
        }
        if (res_users.data['status']) {
            for (var i = 0; i < res_users.data.payload['count']; ++i) {
                const t_user = res_users.data.payload['users'][i]
                temp_users.push({
                    id: `appointment_${role.toLowerCase()}_selection`,
                    reference: t_user._id,
                    label: `${t_user.first_name} ${t_user.last_name} | ${t_user.phone_number} | ${t_user.email}`
                })
            }
            if (role === 'Patient'){
                this.setState({ patients: temp_users })
            }
            else if (role === 'Doctor'){
                this.setState({ doctors: temp_users })
            }
        }
    }

    populate_patients = (string) => {
        if (string.length >= 1) {
            this.render_users(string,'Patient')
        }
        else{
            if (this.props.state === 'update'){
                this.setState({ patients: [{
                    id: 'appointment_patient_selection',
                    reference: this.props.payload.patient_ref.id,
                    label: `${this.props.payload.patient_ref.first_name} ${this.props.payload.patient_ref.last_name} | ${this.props.payload.patient_ref.phone_number} | ${this.props.payload.patient_ref.email}`
                }] })
            }
            else{
                this.setState({patients: []})
            }
        }
    }

    populate_doctors = (string) => {
        if (string.length >= 1) {
            this.render_users(string,'Doctor')
        }
        else{
            if(this.props.state === 'update'){
                this.setState({ doctors: [{
                    id: 'appointment_doctor_selection',
                    reference: this.props.payload.doctor_ref.id,
                    label: `${this.props.payload.doctor_ref.first_name} ${this.props.payload.doctor_ref.last_name} | ${this.props.payload.doctor_ref.phone_number} | ${this.props.payload.doctor_ref.email}`
                }] })
            }
            else{
                this.setState({ doctors: [] })
            }
        }
    }


    on_selected_changed = (e, actor) => {
        if (e !== null) {

            switch (e.id) {
                case 'appointment_patient_selection':
                    const val_patient = {
                        id: 'appointment_patient_selection',
                        reference: e.reference,
                        label: e.label
                    }
                    this.setState({ appointment_patient: { value: e.reference }, patient_select_value: val_patient })
                    break;
                case 'appointment_doctor_selection':
                    const val_doctor = {
                        id: 'appointment_doctor_selection',
                        reference: e.reference,
                        label: e.label
                    }
                    this.setState({ appointment_doctor: { value: e.reference }, doctor_select_value: val_doctor })
                    break;
                default:
                    break;
            }
        }
        else {
            switch (actor) {
                case 'appointment_patient_selection':
                    this.setState({ appointment_patient: { value: '' }, patient_select_value: '' })
                    break;
                case 'appointment_doctor_selection':
                    this.setState({ appointment_doctor: { value: '' }, doctor_select_value: '' })
                    break;
                default:
                    break;
            }
        }
    }

    on_text_field_change = (e) => {
        switch (e.target.id) {
            case 'appointment_reason_text_input':
                this.setState({ appointment_reason: { value: e.target.value } })
                break;
            default:
                break;
        }
    }

    on_apointment_date_change = (e) => {
        if (e === '')
            this.setState({ appointment_date: { value: '' } })
        else {
            var configured_date = null;
            try {
                configured_date = e.format('ll');
            }
            catch (err) {
                configured_date = ''
            }
            finally {
                this.setState({ appointment_date: { value: configured_date } })
            }
        }
    }

    on_apointment_time_change = (e) => {

        if (e === '')
            this.setState({ appointment_time: { value: '' } })
        else {
            var configured_date = null;
            try {
                configured_date = e.format('LT');
            }
            catch (err) {
                configured_date = ''
            }
            finally {
                this.setState({ appointment_time: { value: configured_date } })
            }
        }
    }

    on_submit = () => {
        this.setState({ loading_status: true })
        if (this.props.state !== 'update'){
            const data = {
                patient_id: this.state.appointment_patient.value,
                doctor_id: this.state.appointment_doctor.value,
                date: this.state.appointment_date.value + ' ' + this.state.appointment_time.value + ' GMT',
                time: this.state.appointment_time.value,
                reason: this.state.appointment_reason.value,
                type: 'Admin sahab replace this with token or identification!',
                status: 'waiting'
            }
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
                        loading_status: false,
                        
                    })
                    
                    this.props.call_back()
                }
                else {
                    this.props.notify('error', '', res.data.message)
                    this.setState({loading_status: false})
                }
            }).catch(err => {
                this.props.notify('error', '', 'Server not responding')
                this.setState({loading_status: false})
                this.props.close()
            })
        }
        else{
            const data = {
                visit_id: this.props.payload.visit_id,
                payload: {
                    patient_id: this.state.appointment_patient.value,
                    doctor_id: this.state.appointment_doctor.value,
                    date: this.state.appointment_date.value + ' ' + this.state.appointment_time.value + ' GMT',
                    time: this.state.appointment_time.value,
                    reason: this.state.appointment_reason.value,
                    type: 'Admin sahab replace this with token or identification!',
                    status: 'waiting'
                }
            }
            Axios.put(UPDATE_APPOINTMENT_URL,data).then(res => {
                if (res.data.status === true){
                    this.props.notify('success', '', res.data.message)
                    this.setState({ loading_status: false })
                    this.props.close()
                }
                else{
                    this.props.notify('error', '', res.data.message)
                    this.setState({ loading_status: false })
                }
            }).catch(err => {
                this.props.notify('error','', 'No connection')
                this.setState({ loading_status: false })
            })
        }

    }

    open_new_patient_modal = () => {
        this.setState({ new_patient_modal_visibility: true })
    }

    close_new_patient_modal = () => {
        this.setState({ new_patient_modal_visibility: false })
    }

    render() {
        const add_appointment_modal_body = 
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
                                id="appointment_patient_selection"
                                isClearable
                                menuPlacement="auto"
                                options={this.state.patients}
                                classNamePrefix={`form-control`}
                                placeholder="Select Patient"
                                onInputChange={e => this.populate_patients(e)}
                                onChange={e => this.on_selected_changed(e, "appointment_patient_selection")}
                                value={this.state.patient_select_value}
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
                            onClick={this.open_new_patient_modal}
                            disabled={this.props.state === 'update'? true: false}>
                            <b><i className="icon-plus3"></i></b>
                            New Patient
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
                                onChange={this.on_text_field_change}
                                value={this.state.appointment_reason.value} />
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
                                id="appointment_doctor_selection"
                                isClearable
                                options={this.state.doctors}
                                classNamePrefix={`form-control`}
                                placeholder="Select a Doctor"
                                menuPlacement="auto"
                                onInputChange={e => this.populate_doctors(e)}
                                onChange={e => this.on_selected_changed(e, 'appointment_doctor_selection')}
                                value={this.state.doctor_select_value}
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
        return(
            <Fragment>
                
                {/* Register new patient modal */}
                <NewUserModal 
                    visibility={this.state.new_patient_modal_visibility}
                    close={this.close_new_patient_modal}
                    call_back={this.call_back_new_patient_modal} />
                    
                <Modal
                    visible={this.props.visibility}
                    onClickBackdrop={this.props.close}
                    fade={true}
                    dialogClassName={`modal-dialog-centered modal-lg`}>

                    <div className="modal-header bg-teal-400">
                        <h5 className="modal-title">New Appointment</h5>
                    </div>
                    {this.state.loading_status ? <Loading size={150}/> : add_appointment_modal_body}
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn bg-danger btn-labeled btn-labeled-right pr-5"
                            style={{ textTransform: "inherit" }}
                            onClick={this.props.close}>
                            <b><i className="icon-cross"></i></b>
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="btn bg-teal-400 btn-labeled btn-labeled-right pr-5"
                            style={{ textTransform: "inherit" }}
                            onClick={this.on_submit}>
                            <b><i className="icon-plus3"></i></b>
                            {this.props.state === 'update'? 'Update':'Add'}
                        </button>
                    </div>
                </Modal>
            
            </Fragment>
        )
    }
}
function map_state_to_props(notify) {
    return { notify }
}
export default connect(map_state_to_props, { notify })(NewAppointmentModal);