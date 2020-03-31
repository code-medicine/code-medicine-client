import React, { Component, Fragment } from 'react';
import Container from '../../../shared/container/container'
import Select, {components} from 'react-select'
import Axios from 'axios';
import {
        BASE_USERS_URL,
        SEARCH_TODAYS_APPOINTMENTS_URL,
        SEARCH_BY_ID_USER_REQUEST,
        SEARCH_USER_REQUEST
    } from '../../../shared/rest_end_points';
import { connect } from "react-redux";
import { notify } from '../../../actions';
import { Link, withRouter } from 'react-router-dom';
import { classNameColors } from '../../../shared/constant_data'
import './todayspatient.css';
import { LOGIN_URL } from '../../../shared/router_constants';
import moment from 'moment';
import ProcedureModal from '../../../shared/modals/proceduremodal';
import InvoiceModal from '../../../shared/modals/invoiceModal';
import TodaysPatientRow from '../../../shared/customs/tablerows/todayspatientrow';
import UserPreviewModal from '../../../shared/modals/userpreviewmodal';
import Loading from '../../../shared/customs/loading/loading';
import NewAppointmentModal from '../../../shared/modals/newappointmentmodal';
import NewUserModal from '../../../shared/modals/newusermodal';

class Todayspatient extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: null,
            filtered_data: null,

            use_filtered_data: false,
            totalRecords: 0,

            doctors: [],
            patients: [],

            new_appointment_modal_visibility: false,
            procedure_visibility: false,
            user_preview_modal_visibility: false,
            new_patient_modal_visibility: false,
            invoice_modal_visibility: false,

            user_modal_props: null,
            modal_visit_id: null,
            search_doctor: { value: '' },
            search_patient: { value: '' }
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
        if (res_users.data['status']) {
            for (var i = 0; i < res_users.data.payload['count']; ++i) {
                const t_user = res_users.data.payload['users'][i]
                temp_users.push({
                    id: `${role.toLowerCase()}_selection`,
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

    populate_doctors = (string) => {
        if (string.length >= 1) {
            this.render_users(string,'Doctor')
        }
        else{
            this.setState({ doctors: [] })
        }
    }

    populate_patient = (string) => {
        if (string.length >= 1) {
            this.render_users(string,'Patient')
        }
        else{
            this.setState({ patients: [] })
        }
    }

    populate_appointments = async (data) => {
        let res_visits = await this.request(data, SEARCH_TODAYS_APPOINTMENTS_URL)
        if (res_visits === null) return
        if (res_visits.data.status) {
            this.setState({ data: res_visits.data.payload, filtered_data: res_visits.data.payload, totalRecords: res_visits.data.payload.length })
        }
        else {
            this.props.notify('info', '', res_visits.data.message)
            if (res_visits.data.message !== 'No visits found')
                this.props.history.push(LOGIN_URL)
            this.setState({ data: [] })
        }
    }

    componentDidMount() {
        let d = new Date();
        d = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        this.populate_appointments({ date_flag: d })
    }

    
    on_selected_changed = (e, actor) => {
        if (e !== null) {
            switch (e.id) {
                case 'location_selection':
                    this.setState({ user_blood_group: { value: e.label } })
                    break;
                case 'status_selection':
                    this.setState({ user_gender: { value: e.label } })
                    break;
                case 'doctor_selection':
                    this.setState({ search_doctor: { value: e.reference } })
                    break;
                case 'patient_selection':
                    this.setState({ search_patient: { value: e.reference } })
                    break
                default:
                    break;
            }
        }
        else {
            switch (actor) {
                case 'location_selection':
                    this.setState({ user_blood_group: { value: '' } })
                    break;
                case 'status_selection':
                    this.setState({ user_gender: { value: '' } })
                    break;
                case 'doctor_selection':
                    this.setState({ search_doctor: { value: '' } })
                    break;
                case 'patient_selection':
                    this.setState({ search_patient: { value: '' } })
                    break
                default:
                    break;
            }
        }
    }

    request_user = (id) => {
        this.setState({
            user_preview_modal_visibility: true
        }, () => {
            Axios.post(SEARCH_BY_ID_USER_REQUEST, {
                user_id: id
            }, {
                headers: { 'code-medicine': localStorage.getItem('user') }
            }).then(res => {
                if (res.data.status === true) {
                    this.setState({
                        user_modal_props: res.data.payload.user
                    })
                }
            }).catch(err => {
                console.log('failed to fetch user')
            })
        })
    }
    renderDataInRows = (data) => {
        if (data === null) {
            return
        }
        console.log('data', data)
        return (data.map((booking, i) => {
            var random_color = classNameColors[Math.floor(Math.random() * classNameColors.length)]

            const hidden_data = {
                visit_description: booking.description
            }
            let header_elements = [
                moment(booking.date, "YYYY-MM-DDThh:mm:ss").format('MMMM Do YYYY, hh:mm a'),
                <div className={`text-muted`}>{booking.visit_id}</div>,
                <div className={`header-elements`}>
                    <div className={`list-icons`}>
                        <span className="badge badge-danger">{booking.status}</span>
                    </div>
                </div>
            ]
            return (
                <TodaysPatientRow
                    key={i}
                    visit_id={booking.visit_id}
                    row_data={booking}
                    hidden_data={hidden_data}
                    open_procedure_modal={this.openProcedureModalHandler}
                    open_user_view_modal={this.request_user}
                    hidden_header_elements={header_elements}
                    columns="7" />
            )
        }))
    }

    openProcedureModalHandler = (id) => {
        console.log('id: '+id);
        this.setState({procedure_visibility:true,modal_visit_id:id})
    };
    closeProcedureModalHandler = () => {
        this.setState({ procedure_visibility: false })
    };

    open_new_appointment_modal = () => {
        this.setState({ new_appointment_modal_visibility: true })
    }
    openInvoiceModalHandler = (id) => {
        this.setState({invoice_modal_visibility:true,invoice_visit_id:id})
    };
    closeInvoiceModalHandler = () => {
        this.setState({ invoice_modal_visibility: false })
    };

    close_new_appointment_modal = () => {
        this.setState({ new_appointment_modal_visibility: false })
    }

    call_back_new_appointment_modal = () => {
        this.setState({ new_appointment_modal_visibility: false, data: null}, () => {
            let d = new Date();
            d = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
            this.populate_appointments({ date_flag: d })
        })
    }
    
    set_filters = () => {
        this.setState({ filtered_data: null }, () => {
            const temp = []
            for (let i = 0; i < this.state.data.length; ++i){
                console.log(this.state.search_patient.value, this.state.data[i].patient.id)

                if (this.state.search_patient.value === '' &&
                    this.state.search_doctor.value === this.state.data[i].doctor.id){
                    temp.push(this.state.data[i])
                }
                else if (this.state.search_patient.value === this.state.data[i].patient.id &&
                    this.state.search_doctor.value === ''){
                    temp.push(this.state.data[i])
                }
                else if (this.state.search_patient.value === this.state.data[i].patient.id &&
                    this.state.search_doctor.value === this.state.data[i].doctor.id){
                    temp.push(this.state.data[i])
                }

                if (i === this.state.data.length - 1){
                    if (this.state.search_patient.value !== '' || this.state.search_doctor.value !== ''){
                        this.setState({ filtered_data: temp })
                        return
                    }
                }

            }
            this.setState({ filtered_data: this.state.data })
        })
        
    }


    render() {
        var table = <Loading size={150} />
        if (this.state.data != null) {
            if (this.state.totalRecords > 0) {
                console.log(this.state.data)
                table = <div className="table-responsive mt-2 card mb-0 pb-0"><table className="table table-hover">
                    <thead className="table-header-bg bg-dark">
                        <tr>
                            <th colSpan="7">
                                Patients List for today
                                <span className="badge badge-secondary ml-2">{moment().format('LL')}</span>
                            </th>
                            <th >Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.renderDataInRows(this.state.filtered_data)
                        }
                    </tbody>
                </table></div>
            }
            else {
                table = <div className="alert alert-info" style={{ marginBottom: '0px' }}>
                    <strong>Info!</strong> No visits found.
                </div>;
            }
        }


        const Menu = props => {
            return (
                    <components.Menu {...props} >
                        <div className={`bg-light text-teal-400`} style={{width: '400px'}}>
                            {props.children}
                        </div>
                    </components.Menu>
            );
          };

        const filters = <div className="row">
            <div className="col-md-9">
                <div className="row">
                    <div className="col-md-3">
                        <div className="form-group">
                            <label className="font-weight-semibold">Doctors</label>
                            <Select
                                id="doctor_selection"
                                isClearable
                                components={{ Menu }}
                                menuPlacement="auto"
                                options={this.state.doctors}
                                classNamePrefix={`form-control`}
                                placeholder="Search Doctor"
                                onInputChange={e => this.populate_doctors(e)}
                                onChange={e => this.on_selected_changed(e, "doctor_selection")}
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label className="font-weight-semibold">Patients</label>
                            <Select
                                id="patient_selection"
                                isClearable
                                components={{ Menu }}
                                menuPlacement="auto"
                                options={this.state.patients}
                                classNamePrefix={`form-control`}
                                placeholder="Search Patient"
                                onInputChange={e => this.populate_patient(e)}
                                onChange={e => this.on_selected_changed(e, "patient_selection")}
                            />
                        </div>
                    </div>
                    <div className={`col-md-3`}>
                        <div className="form-group">
                            <label className="font-weight-semibold">Location</label>
                            <Select
                                isClearable
                                // options={this.state.search_options}
                                placeholder="Location"
                            // value={this.state.selectedOption}
                            // onChange={this.handleSelectChange}
                            // onClick={()=>this.get}
                            />
                        </div>


                    </div>
                    <div className={`col-md-3`}>

                        <div className="form-group">
                            <label className="font-weight-semibold">Status</label>
                            <Select
                                isClearable
                                // options={this.state.search_options}
                                placeholder="Status"
                            // value={this.state.selectedOption}
                            // onChange={this.handleSelectChange}
                            // onClick={()=>this.get}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-3 d-inline-flex align-items-end mb-2 pb-2">
                    <button
                        type="button"
                        className="btn btn-dark btn-icon mr-1 float-right"
                        style={{ textTransform: "inherit" }}
                        onClick={this.set_filters}
                        >
                        <i className="icon-filter4"></i>
                        
                    </button>
                    <button
                        type="button"
                        className="btn bg-teal-400 btn-labeled btn-labeled-right pr-5 float-right"
                        style={{ textTransform: "inherit" }}
                        onClick={this.open_new_appointment_modal}>
                        <b><i className="icon-plus3"></i></b>
                        New Appointment
                </button>
            </div>
        </div>

        return (
            <Container container_type="todayspatient">
                {/* filters panel */}
                {filters}
                
                {/* table of todays appointments */}
                {table}

                {/* Add new appointment modal */}
                <NewAppointmentModal 
                    visibility={this.state.new_appointment_modal_visibility}
                    close={ this.close_new_appointment_modal }
                    call_back={this.call_back_new_appointment_modal}
                    bind_function={this.open_new_patient_modal}
                    state={'new'} />
                    

                <ProcedureModal
                    new_procedure_visibility={this.state.procedure_visibility}
                    visit_id={this.state.procedure_visit_id}
                    procedure_backDrop={this.closeProcedureModalHandler}
                    cancelProcedureModal={this.closeProcedureModalHandler}
                />

                <InvoiceModal
                    modal_visibility={this.state.invoice_modal_visibility}
                    visit_id={this.state.invoice_visit_id}
                    invoice_backDrop={this.closeInvoiceModalHandler}
                    cancelInvoiceModal={this.closeInvoiceModalHandler}
                />

                <UserPreviewModal visibility={this.state.user_preview_modal_visibility}
                    modal_props={this.state.user_modal_props}
                    on_click_back_drop={() => this.setState({ user_preview_modal_visibility: false, user_modal_props: null })}
                    on_click_cancel={() => this.setState({ user_preview_modal_visibility: false, user_modal_props: null })} />
            </Container>
        )
    }
}
function map_state_to_props(notify) {
    return { notify }
}
export default connect(map_state_to_props, { notify })(withRouter(Todayspatient));