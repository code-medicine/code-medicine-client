import React, { Component, Fragment } from 'react';
import Select, { components } from 'react-select'
import { USERS_SEARCH_BY_CREDENTIALS } from '../../../services/rest_end_points';
import { connect } from "react-redux";
import { set_active_page, load_todays_appointments, clear_todays_appointments } from 'redux/actions';
import { Link, withRouter } from 'react-router-dom';
import './todays_patient.css';
import { BASE_URL } from '../../../router/constants';
import moment from 'moment';
import ProcedureModal from './procedures/procedure_modal';
import InvoiceModal from './invoice/invoice';
import TodaysPatientRow from './todays_patient_row';
import UserPreviewModal from '../../../shared/modals/userpreviewmodal';
import NewAppointmentModal from './appointment/new_appointment_modal';
import { Popup } from "semantic-ui-react";
import { PATIENT_VISIT_STATUSES } from '../../../utils/constant_data';
import DateTimePicker from 'react-datetime';
import { convert_object_array_to_string, Ucfirst } from '../../../utils/functions';
import ConsultacyModal from './consultancy';
import TodaysPatientRowLoading from './todays_patient_row_loading';
import { GetRequest, PostRequest, UserSearchByCredentials, UserSearchById } from '../../../services/queries';
import notify from 'notify'
import { InputField } from  'components';
import _ from 'lodash';
import { Typography } from '@material-ui/core';

const Menu = props => {
    return (
        <components.Menu {...props} >
            <div className={`bg-light text-teal-400`} style={{ width: '400px' }}>
                {props.children}
            </div>
        </components.Menu>
    );
};

class Todayspatient extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            filtered_data: null,

            doctors: [],
            patients: [],

            new_appointment_modal_visibility: false,
            procedure_modal_visibility: false,
            consultancy_modal_visibility: false,
            
            prev_procedure_list: null,
            user_preview_modal_visibility: false,
            new_patient_modal_visibility: false,
            invoice_modal_visibility: false,

            user_modal_props: null,
            invoice_data: null,
            appointment_invoice_id: '',
            selected_appointment_id: null,

            doctor_selection: { value: '', label: '', error: false },
            patient_selection: { value: '', label: '', error: false },
            status_selection: { value: '', label: '', error: false },
            search_date: { value: moment(new Date()).format('ll') },

            patients_options_loading: false,

        }
        this.search_patient_trigger_timmer = null;
    }

    load_data = () => {
        this.props.clear_todays_appointments();
        if (localStorage.getItem('Gh65$p3a008#2C')) {
            this.setState({ search_date: { value: localStorage.getItem('Gh65$p3a008#2C') }}, () => this.props.load_todays_appointments(this.state.search_date.value))
        } else {
            const app_date = new Date(this.state.search_date.value);
            this.props.load_todays_appointments(new Date(app_date.getTime() + (app_date.getTimezoneOffset() * 60000)).toISOString())
            localStorage.setItem('Gh65$p3a008#2C', this.state.search_date.value)
        }
    }

    componentDidMount() {
        const routes = [
            <Link to={BASE_URL} className="breadcrumb-item">
                <i className="icon-user mr-2"></i>
                Reception
            </Link>,
            <span className="breadcrumb-item active">Today's Patient</span>
        ]
        if (this.props.doctors) {
            this.populate_doctors(this.props);
        }
        
        this.props.set_active_page(routes)
        this.load_data();
    }

    UNSAFE_componentWillReceiveProps(new_props) {
        if (new_props.todays_patient) {
            this.setState({ filtered_data: new_props.todays_patient.data, data: new_props.todays_patient.data })
        }
        if (new_props.doctors) {
            this.populate_doctors(new_props);
        }
    }


    async request(_data, _url, _method = "post") {
        try {
            if (_method === 'post') {
                return await PostRequest(_url, _data)
            }
            else if (_method === 'get') {
                return await GetRequest(_url)
            }
        }
        catch (err) {
            notify('error', '', 'Server is not responding! Please try again later')
            return null
        }
    }

    populate_doctors = (props) => {
        console.log('props.doctors', props.doctors)
        const temp_users = []
        for (let i = 0; i < props.doctors.length; ++i) {
            const t_user = props.doctors[i]

            temp_users.push({
                id: `doctor_selection`,
                value: t_user.doctor._id,
                label: `Dr. ${Ucfirst(t_user.doctor.first_name)} ${Ucfirst(t_user.doctor.last_name)} | ${convert_object_array_to_string(t_user.details.specialities, 'description')}`
            })
            if (i === props.doctors.length - 1) {
                this.setState({ doctors: temp_users });
            }
        }
    }
    

    async render_users(string, role) {
        const query = `${USERS_SEARCH_BY_CREDENTIALS}?search=${string}&role=${role}`
        try {
            const res_users = await this.request({}, query, 'get')
            let temp_users = []
            if (role === 'Doctor'){
                for (var i = 0; i < res_users.data.payload['count']; ++i) {
                    const t_user = res_users.data.payload['users'][i]
                    temp_users.push({
                        id: `${role.toLowerCase()}_selection`,
                        reference: t_user.doctor._id,
                        label: `${Ucfirst(t_user.doctor.first_name)} ${Ucfirst(t_user.doctor.last_name)} | ${t_user.details.specialities.toString()}`
                    })
                }
            }
            
            if (role === 'Patient') {
                this.setState({ patients: temp_users })
            }
            else if (role === 'Doctor') {
                this.setState({ doctors: temp_users })
            }
        }
        catch (error) {
            console.error('error', error);
        }
    }

    populate_patients = (str) => {
        clearTimeout(this.search_patient_trigger_timmer);
        if (str.length >= 2) {
            this.setState({ patients_options_loading: true }, () => {
                this.search_patient_trigger_timmer = setTimeout(() => {
                    UserSearchByCredentials(str, 'Patient').then(_res => {
                        console.log('response patients', _res.data);
                        const temp = []
                        if (_res.data.payload.users.length > 0){
                            for (let i = 0; i < _res.data.payload.users.length; ++i) {
                                const t = _res.data.payload.users[i]
        
                                temp.push({
                                    id: 'patient_selection',
                                    value: t._id,
                                    label: `${t.mrn} | ${Ucfirst(t.first_name)} ${Ucfirst(t.last_name)} `
                                })
                                if (i === _res.data.payload.users.length - 1) {
                                    this.setState({ patients: temp, patients_options_loading: false });
                                }
                            }
                        }
                        else {
                            this.setState({ patients: [], patients_options_loading: false });
                        }
                    })
                }, 1000)
                
            })
        }
        else {
            this.setState({ patients: [], pateints_options_loading: false });
        }
    }

    onSelectChange = (e, actor) => {
        this.setState({ [actor]: { value: e ? e.value : '', label: e ? e.label : '', error: false } });
    }

    request_user = (id) => {
        this.setState({
            user_preview_modal_visibility: true
        }, () => {
            UserSearchById(id)
                .then(res => {
                    this.setState({ user_modal_props: res.data.payload.user })
                }).catch(err => {
                    console.log('failed to fetch user', err)
                })
        })
    }

    openProcedureModalHandler = (id) => {
        this.setState({ procedure_modal_visibility: true, selected_appointment_id: id });
    };

    closeProcedureModalHandler = (type) => {
        this.setState({ procedure_modal_visibility: false, prev_procedure_list: null, data: null })
    };

    invoiceVisitIdHandler = (value) => {
        this.setState({ invoiceVisitId: value });
    };

    UpdateProcedureListHandler = (updateProcedureList) => {
        this.setState({ prevProcedureList: updateProcedureList });
    };

    open_new_appointment_modal = () => {
        this.setState({ new_appointment_modal_visibility: true })
    };

    openInvoiceModalHandler = (object) => {
        this.setState({ invoice_modal_visibility: true, appointment_invoice_id: object })
    };

    closeInvoiceModalHandler = () => {
        this.setState({ invoice_modal_visibility: false })
    };

    close_new_appointment_modal = () => {
        this.setState({ new_appointment_modal_visibility: false })
    };

    call_back_new_appointment_modal = () => {
        this.setState({ new_appointment_modal_visibility: false, data: null })
    };

    set_filters = () => {
        return this.state.data? this.state.data.filter(item => 
            (this.state.doctor_selection.value === "" ? true : item.doctor.id === this.state.doctor_selection.value) &&
            (this.state.patient_selection.value === "" ? true : item.patient.id === this.state.patient_selection.value) &&
            (this.state.status_selection.label === "" ? true : item.appointment_status.info === this.state.status_selection.label.toLowerCase())): []
    }

    todays_date_change = (e) => {
        if (e === '') {
            this.setState({ search_date: { value: '' } })
        }
        else {
            var configured_date = null;
            try {
                configured_date = e.format('ll');
                this.props.clear_todays_appointments()
                this.props.load_todays_appointments(configured_date)
                localStorage.setItem('Gh65$p3a008#2C', configured_date)
            }
            catch (err) {
                configured_date = ''
            }
            finally {
                this.setState({ search_date: { value: configured_date } })
            }
        }
    }

    /*************************************************************************************************************************************************/

    toggle_consultancy_modal = (id) => {
        this.setState({ consultancy_modal_visibility: !this.state.consultancy_modal_visibility }, () => {
            if (this.state.consultancy_modal_visibility) {
                this.setState({ selected_appointment_id: id })
            }
        })
    }


    render() {
        const records = this.set_filters();
        return (
            <Fragment>
                {/* filters panel */}
                <div className="row">
                    <div className="col-md-10">
                        <div className="row">
                            <div className="col-md-4">
                                <InputField
                                    heading="Doctors"
                                    field_type="select"
                                    isClearable
                                    menuPlacement="auto"
                                    options={this.state.doctors}
                                    className={`Select-option`}
                                    classNamePrefix={`form-control`}
                                    components={{ Menu }}
                                    placeholder="Search Doctor"
                                    onChange={e => this.onSelectChange(e, 'doctor_selection')}
                                />
                            </div>
                            <div className="col-md-4">
                                <InputField
                                    heading="Patients"
                                    field_type="select"
                                    isClearable
                                    menuPlacement="auto"
                                    isLoading={this.state.patients_options_loading}
                                    options={this.state.patients}
                                    noOptionsMessage={(e) => "Type to Search"}
                                    className={`Select-option`}
                                    classNamePrefix={`form-control`}
                                    components={{ Menu }}
                                    placeholder="Search Patients"
                                    onChange={e => this.onSelectChange(e, 'patient_selection')}
                                    onInputChange={e => this.populate_patients(e)}
                                />
                            </div>

                            <div className={`col-md-4`}>
                                <InputField
                                    heading="Status"
                                    field_type="select"
                                    isClearable
                                    menuPlacement="auto"
                                    options={PATIENT_VISIT_STATUSES}
                                    className={`Select-option`}
                                    classNamePrefix={`form-control`}
                                    placeholder="Select Status"
                                    onChange={e => this.onSelectChange(e, 'status_selection')}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2 d-flex justify-content-center align-items-end">

                        <Popup
                            trigger={
                                <button
                                    type="button"
                                    className="btn bg-teal-400 btn-icon mr-1 btn-block"
                                    style={{ textTransform: "inherit" }}
                                    onClick={this.open_new_appointment_modal}>
                                    <b><i className="icon-plus3"></i></b>
                                </button>}
                            content={
                                <div className={`card card-body bg-teal-400 text-white shadow mb-1 py-1`}>
                                    New Appointment
                                </div>
                            }
                            flowing
                            // hoverable
                            position='top center'
                        />

                    </div>
                </div>
                <div className="table-header-background shadow-sw mt-2">
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-4 d-flex align-items-center h6">
                            <span className="badge badge-danger ml-2 d-flex">
                                <span className={`d-none d-lg-block`}>Waiting: </span>
                                <span className={``}> {this.state.data ? this.state.data.filter(item => item.appointment_status.info === 'waiting').length : 0}</span>
                            </span>
                            <span className="badge badge-primary ml-2 d-flex">
                                <span className={`d-none d-lg-block`}>Checked out: </span>
                                <span className={``}> {this.state.data ? this.state.data.filter(item => item.appointment_status.info === 'checked out').length : 0}</span>
                            </span>
                            <span className="badge badge-warning ml-2 d-flex">
                                <span className={`d-none d-lg-block`}>Scheduled: </span>
                                <span className={``}> {this.state.data ? this.state.data.filter(item => item.appointment_status.info === 'scheduled').length : 0}</span>
                            </span>
                            
                        </div>
                        <div className="col-lg-3 d-none d-lg-block col-0"></div>
                        <div className="col-lg-3 col-md-6 col-8 d-flex">
                            <DateTimePicker id="dob_text_input"
                                onChange={this.todays_date_change}
                                className="clock_datatime_picker "
                                inputProps={{
                                    placeholder: 'Select Date',
                                    width: '100%',
                                    className: `form-control bg-teal-400 border-teal-400`
                                }}
                                input={true}
                                dateFormat={'ll'}
                                timeFormat={false}
                                closeOnSelect={true}
                                value={this.state.search_date.value}

                                onClick={() => console.log('date select', this.state.search_date.value)}
                            />
                            <button className="btn bg-teal-400 border-teal-400 text-teal-400 btn-sm ml-2 d-none d-lg-block" onClick={() => {
                                this.props.clear_todays_appointments()
                                this.props.load_todays_appointments(localStorage.getItem('Gh65$p3a008#2C'))
                            }}>
                                <i className="icon-search4" />
                            </button>
                        </div>
                    </div>
                </div>
                {/* table of todays appointments */}
                {
                    this.props.todays_patient && 
                        this.props.todays_patient.loading ?
                        <Fragment>
                            <TodaysPatientRowLoading />
                            <TodaysPatientRowLoading />
                            <TodaysPatientRowLoading /> 
                            <TodaysPatientRowLoading />
                            <TodaysPatientRowLoading />
                            <TodaysPatientRowLoading />
                        </Fragment>
                        :
                        records.length > 0 ?
                            <div className="table-responsive mt-2 card mb-0 pb-0">
                                <table className="table table-hover mb-0">
                                    <tbody>
                                        {
                                            records.map((item, i) => {
                                                return (
                                                    <tr key={i}>
                                                        <td>
                                                            <div className={`container-fluid`} >
                                                                <div className={`row`}>
                                                                    {/* Patient name and phone number */}
                                                                    <div className={`col-lg-3 col-md-6 col-sm-6 mt-0 text-teal-400 border-left-2 border-left-teal-400 btn-block d-flex align-items-center justify-content-center text-center`}>
                                                                        <div className={`btn btn-outline bg-teal-400 text-teal-400 btn-block jackInTheBox animated`}
                                                                            style={{ verticalAlign: 'center' }}
                                                                            // onClick={() => this.view_user(this.state.row_data.patient['id'])}
                                                                        >
                                                                            <span className={`img-fluid rounded-circle text-white bg-teal-400 h3 p-2`} >
                                                                                {item.patient['first_name'].charAt(0).toUpperCase() + item.patient['last_name'].charAt(0).toUpperCase()}
                                                                            </span>
                                                                            <Typography variant="h6" className="mt-2">{`${Ucfirst(item.patient['first_name'])} ${Ucfirst(item.patient['last_name'])}`}</Typography>
                                                                            <Typography variant="caption"><i className="icon-phone-wave mr-1"></i> {item.patient['phone_number']}</Typography>
                                                                        </div>
                                                                    </div>
                                                                    {/* Appointment Time column */}
                                                                    <div className={`col-lg-2 col-md-6 col-sm-6 mt-0 d-flex align-items-center justify-content-center text-center text-teal-400 table-partition`} >
                                                                        <div className={` jackInTheBox animated`} >
                                                                            <Typography variant="h5" className="mb-0">{moment(item.appointment_date, "YYYY-MM-DDThh:mm:ss").format('hh:mm a')}</Typography>
                                                                            <Typography variant="caption">{`from now`}</Typography>
                                                                        </div>
                                                                    </div>
                                                                    {/* appointment details */}
                                                                    <div className={`col-lg-7 col-md-12 col-sm-12 mt-sm-2`}>
                                                                        {/* Appointment date and time */}
                                                                        <div className="row">
                                                                            <div className="col-12 font-weight-bold h6">
                                                                                Appointment with <Link className="text-teal-400 font-weight-bold ml-1" to={"#"}
                                                                                    // onClick={() => this.view_user(this.state.row_data.doctor['id'])}
                                                                                    >
                                                                                    {`Dr. ${Ucfirst(item.doctor['first_name'])} ${Ucfirst(item.doctor['last_name'])}`}
                                                                                    <i className="icon-user-tie ml-1"></i>
                                                                                </Link>
                                                                                <span className="text-muted float-lg-right float-md-right float-left">
                                                                                    {`${moment(item.appointment_date, "YYYY-MM-DDThh:mm:ss").format('LL')}`}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                        {/* Appointment Reason */}
                                                                        <div className={`row`}>
                                                                            <div className={`col-12 h6`}>
                                                                                <span className="font-weight-bold">Comments</span>
                                                                                <span className=" h6 text-muted">
                                                                                    {` ${item.appointment_comments.length > 25 ? item.appointment_comments.substring(0, 25) + '...' : item.appointment_comments}`}
                                                                                </span>
                                                                                <span className={`badge badge-${item.appointment_status.info === 'checked out' ? 'primary' : 'danger'} float-right`}>
                                                                                    {item.appointment_status.info}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                        {/* Appointment Actions */}
                                                                        <div className="row">
                                                                            <div className="col-12">
                                                                                {/* {!this.state.row_data.appointment_status.is_paid ?
                                                                                    <Fragment>
                                                                                        {options['consultancy_charges']}
                                                                                        {options['procedures']}
                                                                                        {options['invoice']}
                                                                                        {options['edit']}
                                                                                        {options['follow_ups']}
                                                                                        {options['details']}
                                                                                        {options['checkout']}
                                                                                    </Fragment> :
                                                                                    <Fragment>
                                                                                        {options['invoice']}
                                                                                        {options['follow_ups']}
                                                                                        {options['details']}
                                                                                    </Fragment>} */}

                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                                // const hidden_data = {
                                                //     appointment_description: booking.appointment_description,
                                                //     appointment_comments: booking.appointment_comments
                                                // }
                                                // return (
                                                //     <TodaysPatientRow
                                                //         key={i}
                                                //         row_data={booking}
                                                //         hidden_data={hidden_data}
                                                //         toggle_consultancy_modal={this.toggle_consultancy_modal}
                                                //         toggle_procedure_modal={this.openProcedureModalHandler}
                                                //         toggle_invoice_modal={this.openInvoiceModalHandler}
                                                //         toggle_user_view_modal={this.request_user}
                                                //         columns="8" />
                                                // )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div> :
                            <div className="alert alert-info mt-2" style={{ marginBottom: '0px' }}>
                                <strong>Info!</strong> No Appointments found.
                            </div>

                }

                {/* Add new appointment modal */}
                <NewAppointmentModal
                    visibility={this.state.new_appointment_modal_visibility}
                    close={this.close_new_appointment_modal}
                    call_back={this.call_back_new_appointment_modal}
                    bind_function={this.open_new_appointment_modal}
                    state={'new'} />

                <ConsultacyModal
                    visibility={this.state.consultancy_modal_visibility}
                    toggle_modal={this.toggle_consultancy_modal}
                    appointment_id={this.state.selected_appointment_id}
                />

                <ProcedureModal
                    visibility={this.state.procedure_modal_visibility}
                    appointment_id={this.state.selected_appointment_id}
                    prev_procedure_list={this.state.prev_procedure_list}
                    updateProcedureList={this.UpdateProcedureListHandler}
                    procedure_backDrop={this.closeProcedureModalHandler}
                    cancelProcedureModal={this.closeProcedureModalHandler}
                />

                <InvoiceModal
                    visibility={this.state.invoice_modal_visibility}
                    appointment_id={this.state.appointment_invoice_id}
                    close_modal={this.closeInvoiceModalHandler}
                /> 

                <UserPreviewModal 
                    visibility={this.state.user_preview_modal_visibility}
                    modal_props={this.state.user_modal_props}
                    on_click_back_drop={() => this.setState({ user_preview_modal_visibility: false, user_modal_props: null })}
                    on_click_cancel={() => this.setState({ user_preview_modal_visibility: false, user_modal_props: null })} />
            </Fragment>
        )
    }
}
function map_state_to_props(state) {
    return {
        todays_patient: state.todays_patient,
        doctors: state.doctors.payload
    }
}
export default connect(map_state_to_props, { set_active_page, load_todays_appointments, clear_todays_appointments })(withRouter(Todayspatient));