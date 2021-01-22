import React, { Component, Fragment } from 'react';
import Loading from '../../../../shared/customs/loading/loading';
import Select from 'react-select'
import Modal from 'react-bootstrap4-modal';
import DateTimePicker from 'react-datetime';
import moment from 'moment';
import Axios from 'axios';
import { USERS_SEARCH_BY_CREDENTIALS, APPOINTMENTS_CREATE } from '../../../../shared/rest_end_points';
import { notify, load_todays_appointments, clear_todays_appointments } from '../../../../actions';
import { connect } from "react-redux";
import NewUserModal from '../../../../shared/modals/newusermodal';
// import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';
// import { HOURS12, HOURS24, MINS_BY_5, TIME_PERIOD } from '../../../../shared/constant_data';
// import { get_utc_date } from '../../../../shared/functions';
import './styles.css'
import TimeKeeper from 'react-timekeeper';
// import { Height } from '@material-ui/icons';
import { Popup } from 'semantic-ui-react';

class NewAppointmentModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading_status: false,

            patients: [],
            doctors: [],

            appointment_patient: { value: '', error: false },
            appointment_doctor: { value: '', error: false },
            appointment_referee: { value: '', error: false },
            appointment_comments: { value: '', error: false },
            appointment_date: { value: moment().format('ll'), error: false },
            appointment_time: { value: moment().format('LT'), error: false },

            new_patient_modal_visibility: false,

            patient_select_value: '',
            doctor_select_value: '',

            hours: { value: '12', error: false },
            mins: { value: '00', error: false },
            time_period: { value: 'AM', error: false },

        }
    }

    async request(_data, _url, _method = "post") {
        try {
            if (_method === 'post') {
                return await Axios.post(_url, _data)
            }
            else if (_method === 'get') {
                return await Axios.get(_url)
            }
        }
        catch (err) {
            this.props.notify('error', '', 'Server is not responding! Please try again later')
            return null
        }
    }

    async render_users(string, role) {
        try {
            const query = `${USERS_SEARCH_BY_CREDENTIALS}?search=${string}&role=${role}`
            const res_users = await this.request({}, query, 'get')
            let temp_users = []
            console.log('users...', res_users)
            for (var i = 0; i < res_users.data.payload['count']; ++i) {
                const t_user = res_users.data.payload['users'][i]
                temp_users.push({
                    id: `appointment_${role.toLowerCase()}_selection`,
                    reference: t_user._id,
                    label: `${t_user.first_name} ${t_user.last_name} | ${t_user.phone_number} | ${t_user.email}`
                })
            }
            if (role === 'Patient') {
                this.setState({ patients: temp_users })
            }
            else if (role === 'Doctor') {
                this.setState({ doctors: temp_users })
            }
        }
        catch (error) {
            console.log('error', error);
        }
    }

    populate_patients = (string) => {
        if (string.length >= 1) {
            this.render_users(string, 'Patient')
        }
        else {
            this.setState({ patients: [] })
        }
    }

    populate_doctors = (string) => {
        if (string.length >= 1) {
            this.render_users(string, 'Doctor')
        }
        else {
            this.setState({ doctors: [] })
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
                    this.setState({ appointment_patient: { value: e.reference, error: false }, patient_select_value: val_patient })
                    break;
                case 'appointment_doctor_selection':
                    const val_doctor = {
                        id: 'appointment_doctor_selection',
                        reference: e.reference,
                        label: e.label
                    }
                    this.setState({ appointment_doctor: { value: e.reference, error: false }, doctor_select_value: val_doctor })
                    break;
                case 'hour_selection':
                    console.log('e', e)
                    this.setState({ hours: { value: e.label, error: false } })
                    break;
                case 'min_selection':
                    this.setState({ mins: { value: e.label, error: false } })
                    break;
                default:
                    break;
            }
        }
        else {
            switch (actor) {
                case 'appointment_patient_selection':
                    this.setState({ appointment_patient: { value: '', error: false }, patient_select_value: '' })
                    break;
                case 'appointment_doctor_selection':
                    this.setState({ appointment_doctor: { value: '', error: false }, doctor_select_value: '' })
                    break;
                case 'hour_selection':
                    this.setState({ hours: { value: '12', error: false } })
                    break;
                case 'min_selection':
                    this.setState({ mins: { value: '00', error: false } })
                    break;
                default:
                    break;
            }
        }
    }

    on_text_field_change = (e) => {
        switch (e.target.id) {
            case 'appointment_referee_text_input':
                this.setState({ appointment_referee: { value: e.target.value, error: false } })
                break;
            case 'appointment_comments_text_input':
                this.setState({ appointment_comments: { value: e.target.value, error: false } })
                break;
            default:
                break;
        }
    }

    on_apointment_date_change = (e) => {
        if (e === '')
            this.setState({ appointment_date: { value: '', error: false } })
        else {
            var configured_date = null;
            try {
                configured_date = e.format('ll');
            }
            catch (err) {
                configured_date = ''
            }
            finally {
                this.setState({ appointment_date: { value: configured_date, error: false } })
            }
        }
    }

    on_apointment_time_change = (time) => {

        console.log('time', moment(time).format("LT"));
        this.setState({ appointment_time: { value: moment(time).format("LT") } })
        // if (e === '')
        //     this.setState({ appointment_time: { value: '' } })
        // else {
        //     var configured_date = null;
        //     try {
        //         configured_date = e.format('LT');
        //     }
        //     catch (err) {
        //         configured_date = ''
        //     }
        //     finally {
        //         this.setState({ appointment_time: { value: configured_date } })
        //     }
        // }
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
        return false;
    }

    on_submit = () => {
        this.setState({ loading_status: true })
        let error = false
        if (this.check_input(this.state.appointment_patient.value, true)) {
            this.setState({ appointment_patient: { value: this.state.appointment_patient.value, error: true } })
            error = true
        }
        if (this.check_input(this.state.appointment_doctor.value, true)) {
            this.setState({ appointment_doctor: { value: this.state.appointment_doctor.value, error: true } })
            error = true
        }
        // if (this.check_input(this.state.appointment_reason.value, true)) {
        //     this.setState({ appointment_reason: { value: this.state.appointment_reason.value, error: true } })
        //     error = true
        // }
        if (this.check_input(this.state.appointment_date.value, true)) {
            this.setState({ appointment_date: { value: this.state.appointment_date.value, error: true } })
            error = true
        }

        if (this.check_input(this.state.hours.value, true, false, true)) {
            this.setState({ hours: { value: this.state.hours.value, error: true } })
            error = true
        }
        if (this.check_input(this.state.mins.value, true, false, true)) {
            this.setState({ mins: { value: this.state.mins.value, error: true } })
            error = true
        }

        if (error === true) {
            this.props.notify('error', '', 'Invalid inputs')
            this.setState({ loading_status: false })
            return
        }

        const data = {
            patient: this.state.appointment_patient.value,
            doctor: this.state.appointment_doctor.value,
            date: `${moment(this.state.appointment_date.value).format('YYYY-MM-DD')}T${moment(this.state.appointment_time.value, ["h:mm A"]).format("HH:mm:ss")}Z`,
            time: `${moment(this.state.appointment_time.value, ["h:mm A"]).format("HH:mm:ss")}Z`,
            description: "",
            comments: this.state.appointment_comments.value,
            referee: this.state.appointment_referee.value
        }
        // console.log('data',data)
        // return;
        Axios.post(APPOINTMENTS_CREATE, data).then(res => {
            this.props.notify('success', '', res.data.message)
            this.setState({
                appointment_patient: { value: '', error: false },
                appointment_doctor: { value: '', error: false },
                appointment_date: { value: moment().format('ll'), error: false },
                appointment_time: { value: moment().format("LT"), error: false },
                appointment_comments: { value: '', error: false },
                appointment_referee: { value: '', error: false },
                patient_select_value: '',
                doctor_select_value: '',
                loading_status: false,
            })
            this.props.clear_todays_appointments()
            this.props.load_todays_appointments(localStorage.getItem('Gh65$p3a008#2C'))
            this.props.close()

        }).catch(err => {
            if (err) {
                if (err.response) {
                    this.props.notify('error', '', err.response.message)
                    // this.props.notify('error', '', res.data.message)
                    // this.setState({ loading_status: false })
                }
                else {
                    this.props.notify('error', '', 'Server not responding ' + err.toString())
                }
                this.setState({ loading_status: false })
            } else {
                this.props.notify('error', '', 'Network error' + err.toString())
                this.setState({ loading_status: false })
            }
        })
    }
    open_new_patient_modal = () => {
        this.props.close()
        this.setState({ new_patient_modal_visibility: true })
    }

    close_new_patient_modal = () => {
        this.setState({ new_patient_modal_visibility: false })
    }

    call_back_new_patient_modal = () => {

    }

    render() {      
        return (
            <Fragment>

                {/* Register new patient modal */}
                <NewUserModal
                    visibility={this.state.new_patient_modal_visibility}
                    close={this.close_new_patient_modal}
                    call_back={this.props.bind_function} />

                <Modal
                    visible={this.props.visibility}
                    onClickBackdrop={this.props.close}
                    fade={true}
                    dialogClassName={`modal-dialog-centered modal-lg`}>

                    <div className="modal-header bg-teal-400" >
                        <h5 className="modal-title">New Appointment</h5>
                        {/** Date select */}
                        <div className={`w-25`}>
                            <DateTimePicker id="dob_text_input"
                                onChange={this.on_apointment_date_change}
                                className="clock_datatime_picker text-teal-400"
                                inputProps={{ 
                                    placeholder: 'Select Date', 
                                    width: '100%', 
                                    className: `form-control ${this.state.appointment_date.error ? 'border-danger' : ''}`, 
                                    disabled: this.state.loading_status
                                }}
                                input={true}
                                dateFormat={'ll'}
                                timeFormat={false}
                                closeOnSelect={true}
                                value={this.state.appointment_date.value}
                                
                            />

                        </div>

                    </div>
                    <div className="modal-body">
                        <div className="row">
                            <div className="col-md-8">
                                <div className={`row`}>
                                    <div className={`col-md-10`}>
                                        <div className="form-group">
                                            <label className="font-weight-semibold">Select or add user<span className="text-danger"> * </span></label>
                                            <Select
                                                id="appointment_patient_selection"
                                                isClearable
                                                menuPlacement="auto"
                                                options={this.state.patients}
                                                // components={{ Control: ControlComponent }}
                                                classNamePrefix={`form-control`}
                                                placeholder="Select Patient"
                                                onInputChange={e => this.populate_patients(e)}
                                                onChange={e => this.on_selected_changed(e, "appointment_patient_selection")}
                                                value={this.state.patient_select_value}
                                                isDisabled={this.state.loading_status}
                                                styles={{
                                                    container: base => ({
                                                        ...base,
                                                        backgroundColor: this.state.appointment_patient.error ? '#FF0000' : '',
                                                        padding: 1,
                                                        borderRadius: 5
                                                    }),
                                                }}
                                            />

                                        </div>
                                    </div>
                                    <div className={`col-md-2 d-flex align-items-end mb-3 `}>
                                        <Popup
                                            trigger={
                                                <button 
                                                    disabled={this.state.loading_status}
                                                    className={`btn btn-outline btn-lg bg-secondary btn-block border-secondary text-dark btn-icon`} onClick={this.open_new_patient_modal}>
                                                    <i className="icon-plus3"></i>
                                                </button>}
                                            flowing
                                            // hoverable
                                            content={
                                                <div className={`card card-body bg-dark text-white shadow ml-1 py-1 mt-4`}>
                                                    Add new Patient
                                                </div>
                                            }
                                            position='top center'
                                            style={{ zIndex: 15000 }}
                                        />
                                    </div>
                                </div>


                                <div className="form-group">
                                    <label className="font-weight-semibold">Which doctor to assign<span className="text-danger"> * </span></label>
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
                                        isDisabled={this.state.loading_status}
                                        styles={{
                                            container: base => ({
                                                ...base,
                                                backgroundColor: this.state.appointment_doctor.error ? '#FF0000' : '',
                                                padding: 1,
                                                borderRadius: 5
                                            }),
                                        }}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="font-weight-semibold">Refered by</label>
                                    <input
                                        id="appointment_referee_text_input"
                                        className="form-control"
                                        value={this.state.appointment_referee.value}
                                        onChange={e => this.on_text_field_change(e)}
                                        placeholder="Reference of any doctor if any"
                                        disabled={this.state.loading_status}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Additional comments</label>
                                    <textarea rows={3} cols={3}
                                        id="appointment_comments_text_input"
                                        className="form-control"
                                        placeholder="Comments for the appointment"
                                        onChange={e => this.on_text_field_change(e)}
                                        value={this.state.appointment_comments.value}
                                        disabled={this.state.loading_status} />
                                </div>
                            </div>

                            <div className="col-md-4">

                                <div className={`mt-1 d-flex justify-content-center`}>
                                    <TimeKeeper
                                        time={this.state.appointment_time.value}
                                        onChange={(new_time) => this.on_apointment_time_change(new_time)}
                                        // onDoneClick={() => console.log('time set')}
                                        coarseMinutes={5}
                                        forceCoarseMinutes
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="modal-footer">
                        <Select
                            isClearable
                            menuPlacement="auto"
                            options={[]}
                            classNamePrefix={`form-control`}
                            placeholder="Select Branch"
                            id="branch_selection"
                            isDisabled
                            // onChange={e => this.on_selected_changed(e, 'gender_selection')}
                            value={{
                                id: 'branch_selection',
                                label: 'Ghazi chowk'
                            }}
                            styles={{
                                container: base => ({
                                    ...base,
                                    backgroundColor: '',
                                    padding: 0,
                                    borderRadius: 5,
                                    width: '200px'
                                }),
                            }}
                        />
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
                            disabled={this.state.loading_status}
                            onClick={this.on_submit}>
                            <b><i className="icon-plus3"></i></b>
                            Create
                        </button>
                    </div>
                </Modal>

            </Fragment>
        )
    }
}
function map_state_to_props(state) {
    return {
        notify: state.notify,
        todays_patient: state.todays_patient
    }
}
export default connect(map_state_to_props, { notify, load_todays_appointments, clear_todays_appointments })(NewAppointmentModal);