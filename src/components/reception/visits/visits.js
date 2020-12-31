import React, { Component } from 'react';
import Container from '../../../shared/container/container';
import { USERS_SEARCH_BY_CREDENTIALS, APPOINTMENTS_SEARCH, USERS_SEARCH_BY_ID } from '../../../shared/rest_end_points';
import Axios from 'axios';
import { connect } from "react-redux";
import { notify, set_active_page } from '../../../actions';
import { Link, withRouter } from 'react-router-dom';
import moment from 'moment';
import "./visits.css"
import { components } from 'react-select';
import { BLOOD_GROUPS_OPTIONS, PATIENT_VISIT_STATUSES } from '../../../shared/constant_data';
import TableRow from '../../../shared/customs/tablerows/tablerow';
import '../../../shared/customs/Animations/animations.css';
import UserPreviewModal from '../../../shared/modals/userpreviewmodal';
import Loading from '../../../shared/customs/loading/loading';
import { BASE_URL } from '../../../shared/router_constants';
import { Popup } from "semantic-ui-react";
import { Ucfirst } from '../../../shared/functions'
import Inputfield from '../../../shared/customs/inputfield/inputfield';


class Visits extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: null,
            patient_list: [],
            doctor_list: [],

            today: moment().format('LT'),
            page_number: 0,
            total_records_on_this_page: 0,
            total_pages: 0,

            date_from: { value: moment().subtract(7, 'days').format('ll') },
            date_to: { value: moment().format('ll') },

            search_patient_id: { value: '' },
            search_doctor_id: { value: '' },
            search_status: { value: '' },

            patient_checkbox: false,
            doctor_checkbox: false,

            loading_status: false,
            previous_query: { data: null },

            user_preview_modal_visibility: false,
            user_modal_props: null,
        }
    }

    componentDidMount() {
        const routes = [<Link to={BASE_URL} className="breadcrumb-item">
            <i className="icon-user mr-2"></i>
                        Reception
                    </Link>, <span className="breadcrumb-item active">All Apointments</span>]
        this.props.set_active_page(routes)
        setInterval(() => {
            this.setState({ today: moment().format('LT') })
        }, 60000)
        this.on_search_click()
    }

    async request(_data, _url, _method = "post") {
        try {
            if (_method === 'post') {
                this.setState({ previous_query: { data: _data } })
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

    on_selected_changed = (e, actor) => {
        console.log('e', e)
        if (e !== null) {
            switch (actor) {
                case 'gender_selection':
                    this.setState({ user_gender: { value: e.label } })
                    break;
                case 'patient_list':
                    this.setState({ search_patient_id: { value: e.reference } })
                    break;
                case 'doctor_list':
                    this.setState({ search_doctor_id: { value: e.reference } })
                    break;
                case 'status_list':
                    console.log('sttaus select', e.label)
                    this.setState({ search_status: { value: e.label } });
                    break;
                default:
                    break;
            }
        }
        else {
            switch (actor) {
                case 'blood_group_selection':
                    this.setState({ user_gender: { value: '' } })
                    break;
                case 'patient_list':
                    this.setState({ search_patient_id: { value: '' } })
                    break;
                case 'doctor_list':
                    this.setState({ search_doctor_id: { value: '' } })
                    break;
                case 'status_list':
                    this.setState({ search_status: { value: '' } });
                    break;
                default:
                    break;
            }
        }
    }

    async render_users(string, role) {

        const query = `${USERS_SEARCH_BY_CREDENTIALS}?search=${string}&role=${role}`
        const res_users = await this.request({}, query, 'get')
        let temp_users = []
        if (res_users.status === 200) {
            for (var i = 0; i < res_users.data.payload['count']; ++i) {
                const t_user = res_users.data.payload['users'][i]
                temp_users.push({
                    id: `${role.toLowerCase()}_list`,
                    reference: t_user._id,
                    label: `${Ucfirst(t_user.first_name)} ${Ucfirst(t_user.last_name)} | ${t_user.phone_number} | ${t_user.email}`
                })
            }
            if (role === 'Patient') {
                this.setState({ patient_list: temp_users })
            }
            else if (role === 'Doctor') {
                this.setState({ doctor_list: temp_users })
            }
        }
    }

    populate_patients = (string) => {
        if (string.length >= 3) {
            this.render_users(string, 'Patient')
        }
        else {
            this.setState({ patient_list: [] })
        }
    }
    populate_doctors = (string) => {
        if (string.length >= 3) {
            this.render_users(string, 'Doctor')
        }
        else {
            this.setState({ doctor_list: [] })
        }
    }

    populate_appointments = async (data) => {
        this.setState({ loading_status: true })
        let res_visits = await this.request(data, APPOINTMENTS_SEARCH)
        if (!res_visits) return
        if (res_visits.status === 200) {
            this.setState({
                data: res_visits.data.payload.appointments,
                total_records_on_this_page: res_visits.data.payload.appointments.length,
                total_pages: res_visits.data.payload.total_pages,
                loading_status: false
            }, () => {
                // this['element_7_ref'].scrollIntoView({ behavior: "smooth" });
            })
        }
        else {
            this.props.notify('info', '', res_visits.data.message)
            this.setState({
                data: null,
                loading_status: false,
                total_pages: 0,
                total_records_on_this_page: 0
            })
        }
    }

    on_text_field_change = (e) => {
        switch (e.target.id) {
            case 'patient_checkbox_input':
                this.setState({ patient_checkbox: e.target.checked })
                break;
            case 'doctor_checkbox_input':
                this.setState({ doctor_checkbox: e.target.checked })
                break;
            default:
                break;
        }
    }

    on_from_date_change = (e) => {
        if (e === '')
            this.setState({ date_from: { value: '' } })
        else {
            var configured_date = null;
            try {
                configured_date = e.format('ll');
            }
            catch (err) {
                configured_date = ''
            }
            finally {
                this.setState({ date_from: { value: configured_date } })
            }
        }
    }

    on_to_date_change = (e) => {
        if (e === '')
            this.setState({ date_to: { value: '' } })
        else {
            var configured_date = null;
            try {
                configured_date = e.format('ll');
            }
            catch (err) {
                configured_date = ''
            }
            finally {
                this.setState({ date_to: { value: configured_date } })
            }
        }
    }

    on_search_click = () => {
        this.setState({
            data: null,

            today: moment().format('LT'),
            page_number: 0,
            total_records_on_this_page: 0,
            total_pages: 0,
        }, () => {
            if (this.state.date_from.value !== '' && this.state.date_to.value !== '') {
                const payload = {
                    to_date: this.state.date_to.value,
                    from_date: this.state.date_from.value,
                    page: this.state.page_number
                }

                if (this.state.search_patient_id.value) {
                    payload.patient_id = this.state.search_patient_id.value;
                }
                if (this.state.search_doctor_id.value) {
                    payload.doctor_id = this.state.search_doctor_id.value;
                }
                if (this.state.search_status.value) {
                    payload.appointment_status = this.state.search_status.value;
                }

                this.populate_appointments(payload)
            }
            else {
                this.props.notify('error', '', 'Please specify a range of dates')
            }
        })

    }

    refresh_button_click = () => {
        if (this.state.previous_query.data !== null) {
            this.populate_appointments(this.state.previous_query.data)
        }
        else {
            this.props.notify('info', '', 'Select dates and click search button to search')
        }
    }

    request_user = (id) => {
        this.setState({
            user_preview_modal_visibility: true
        }, () => {
            Axios.post(USERS_SEARCH_BY_ID, { user_id: id }).then(res => {
                this.setState({ user_modal_props: res.data.payload.user })
            }).catch(err => {
                console.log('failed to fetch user')
            })
        })
    }

    renderDataInRows = () => {
        return (this.state.data.map((booking, i) => {
            // var random_color = classNameColors[Math.floor(Math.random() * classNameColors.length)]
            // console.log('booking', booking)
            const row_data = {
                date_of_booking: <div ref={(el) => { this[`element_${i}_ref`] = el; }}>
                    {booking.appointment_date}
                    {/* {`${moment(booking.appointment_date, "YYYY-MM-DDThh:mm:ss").utc().format('LL')}`} */}
                </div>,// date of booking
                time_of_booking: <div>
                    {moment(booking.appointment_time, "HH:mm:ss").format('LT') === 'Invalid date'? "-":moment(booking.appointment_time, "HH:mm:ss").format('LT')}
                    {/* {`${moment(booking.appointment_date, "YYYY-MM-DDThh:mm:ss").format('LT')}`} */}
                </div>,// time of booking
                patient_name: <button className="btn btn-outline bg-teal-400 border-teal-400 text-teal-400 btn-sm btn-block zoomIn animated"
                    onClick={() => this.request_user(booking.patient['id'])}>
                    {Ucfirst(booking.patient['first_name']) + ' ' + Ucfirst(booking.patient['last_name'])}
                </button>,// patient_name
                visit_reason: <span className="d-inline-block text-truncate " style={{ maxWidth: "150px" }}>
                    {booking.appointment_description}
                </span>,
                doctor_name: <button className="btn btn-outline-secondary btn-sm btn-block zoomIn animated"
                    onClick={() => this.request_user(booking.doctor['id'])}>
                    {Ucfirst(booking.doctor['first_name']) + ' ' + Ucfirst(booking.doctor['last_name'])}
                </button>,// doctor name
                visit_status: <span className={`badge ${booking.appointment_status.info === 'waiting' ? 'badge-danger' : 'badge-primary'}`}>
                    {booking.appointment_status.info}
                </span>,
                visit_total_charges: <Popup
                    trigger={<div className="">{booking.total_charges}</div>}
                    flowing
                    position='top center'
                    content={
                        <div className={`card card-body bg-teal-400 text-white shadow mb-1 py-1`}>
                            <div className={``}>Consultancy: {booking.appointment_charges['consultancy']}</div>
                            <div className={``}>Discount: {booking.appointment_charges['discount']}</div>
                            <div className={``}>Follow up: {booking.appointment_charges['follow_up']}</div>
                            <div className={``}>Procedures: {booking.appointment_charges['procedures']}</div>
                            <div className={``}>Paid Amount: {booking.appointment_charges['paid']}</div>
                        </div>
                    }
                />
            }
            const hidden_data = [
                <h5 className="font-weight-semibold">Reason of visit</h5>,
                <blockquote className="blockquote blockquote-bordered py-2 pl-3 mb-0">
                    <p className="mb-1">
                        {booking.appointment_description}
                    </p>
                    <footer className="blockquote-footer">Perscription</footer>
                </blockquote>
            ]
            return (
                <TableRow
                    key={i}
                    row_data={row_data}
                    hidden_data={hidden_data}
                    // hidden_header_elements={header_elements}
                    // hidden_header_color={random_color}
                    columns="8" />
            )
        }))
    }

    on_previous_button_click = () => {
        const to_request_page_number = this.state.page_number - 1
        const updated = this.state.previous_query
        updated.data.page = to_request_page_number
        this.setState({ page_number: to_request_page_number }, () => {
            this.populate_appointments(updated.data)
        })
    }

    on_page_number_click = (e) => {
        const to_request_page_number = parseInt(e.target.innerHTML) - 1
        const updated = this.state.previous_query
        updated.data.page = to_request_page_number
        this.setState({ page_number: to_request_page_number }, () => {
            this.populate_appointments(updated.data)
        })
    }

    on_next_button_click = () => {
        const to_request_page_number = this.state.page_number + 1
        const updated = this.state.previous_query
        updated.data.page = to_request_page_number
        this.setState({ page_number: to_request_page_number }, () => {
            this.populate_appointments(updated.data)
        })
    }



    render() {
        const Menu = props => {
            return (
                <components.Menu {...props} >
                    <div className={`bg-light text-teal-400`} style={{ width: '400px' }}>
                        {props.children}
                    </div>
                </components.Menu>
            );
        };
        const loading = <Loading size={150} />
        var table = ''
        if (this.state.data != null) {
            if (this.state.data.length > 0) {
                table = <div className="table-responsive mt-2 card mb-0 pb-0"><table className="table table-hover">
                    <thead className="table-header-bg bg-dark">
                        <tr>
                            <th></th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Patient</th>
                            <th>Reasons</th>
                            <th>Doctor</th>
                            <th>Status</th>
                            <th>Charges</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderDataInRows()}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="4">
                                <div className="mt-2">
                                    <span className="font-weight-semibold h5">Showing page {this.state.page_number + 1} of {this.state.total_pages} ...</span>
                                </div>
                            </td>
                            <td colSpan="4">
                                <nav className="mt-2">
                                    <ul className="pagination justify-content-end">
                                        <li className={`page-item ${this.state.page_number === 0 ? 'disabled' : ''}`}>
                                            <Link
                                                className="page-link"
                                                to="#"
                                                onClick={this.on_previous_button_click}>
                                                Previous
                                            </Link>
                                        </li>
                                        {
                                            this.state.total_pages > 1 ?
                                                Array(this.state.total_pages).fill().map((item, i) => {
                                                    return <li key={i} className="page-item">
                                                        <Link className="page-link" to="#" onClick={e => this.on_page_number_click(e)}>
                                                            {i + 1}
                                                        </Link>
                                                    </li>
                                                }) : ''
                                        }
                                        <li className={`page-item ${this.state.page_number === this.state.total_pages - 1 ? 'disabled' : ''}`}>
                                            <Link className="page-link" to="#" onClick={this.on_next_button_click}>Next</Link>
                                        </li>
                                    </ul>
                                </nav>
                            </td>
                        </tr>
                    </tfoot>
                </table></div>
            }
            else {
                table = <div className="alert alert-info" style={{ marginBottom: '0px' }}>
                    <strong>Info!</strong> No visits found.
                </div>;
            }
        }
        else {
            table = <div className="alert alert-info mt-2" style={{ marginBottom: '0px' }}>
                <strong>Info!</strong> No data found.
            </div>;
        }
        return (
            <Container container_type={'visits'}>
                <div className={`container-fluid`}>
                    <div className="row">
                        <div className="col-lg-3">
                            <Inputfield
                                field_type="select"
                                heading="Patient"
                                isClearable
                                parent_classes="mb-1"
                                classNamePrefix={`form-control`}
                                id="patient_list"
                                components={{ Menu }}
                                options={this.state.patient_list}
                                onInputChange={e => this.populate_patients(e)}
                                onChange={e => this.on_selected_changed(e, 'patient_list')}
                                placeholder="Search patients"
                                styles={{
                                    container: base => ({
                                        ...base,
                                        // backgroundColor: this.state.appointment_doctor.error ? '#FF0000' : '',
                                        padding: 1,
                                        borderRadius: 5
                                    }),
                                }}
                            />
                        </div>
                        <div className="col-lg-3">
                            <Inputfield
                                field_type="select"
                                heading="Doctor"
                                isClearable
                                parent_classes="mb-1"
                                options={this.state.doctor_list}
                                onInputChange={e => this.populate_doctors(e)}
                                onChange={e => this.on_selected_changed(e, 'doctor_list')}
                                placeholder="Search Doctor"
                                styles={{
                                    container: base => ({
                                        ...base,
                                        // backgroundColor: this.state.appointment_doctor.error ? '#FF0000' : '',
                                        padding: 1,
                                        borderRadius: 5
                                    }),
                                }}
                            />
                        </div>
                        <div className="col-lg-3">
                            <Inputfield
                                field_type="select"
                                heading="Status"
                                className=""
                                parent_classes="mb-1"
                                options={PATIENT_VISIT_STATUSES}
                                classNamePrefix={``}
                                placeholder="Select Status"
                                isClearable
                                id="status_selection"
                                onChange={e => this.on_selected_changed(e, 'status_list')}
                            />
                        </div>
                        <div className="col-lg-3">
                            <Inputfield
                                field_type="select"
                                heading="Blood group"
                                className=""
                                parent_classes="mb-1"
                                options={BLOOD_GROUPS_OPTIONS}
                                classNamePrefix={``}
                                placeholder="(coming soon)"
                                isClearable
                                id="blood_group_selection"
                                isDisabled
                                onChange={this.on_selected_changed}
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-3">
                            <Inputfield
                                field_type="select"
                                heading="Branch"
                                className=""
                                options={PATIENT_VISIT_STATUSES}
                                classNamePrefix={``}
                                placeholder="Branch (Coming soon)"
                                isClearable
                                id="branch_selection"
                                onChange={this.on_selected_changed}
                                isDisabled={true}
                            />
                        </div>
                        <div className="col-lg-9">
                            <div className="row">
                                <div className="col-lg-3">
                                    <Inputfield
                                        field_type="date-time"
                                        heading="From"
                                        id="dob_text_input"
                                        onChange={this.on_from_date_change}
                                        className="clock_datatime_picker form-control"
                                        inputProps={{ placeholder: 'Where from', className: 'border-0 w-100' }}
                                        input={true}
                                        dateFormat={'ll'}
                                        timeFormat={false}
                                        closeOnSelect={true}
                                        value={this.state.date_from.value}
                                    />

                                </div>
                                <div className="col-lg-3">
                                    <Inputfield
                                        field_type="date-time"
                                        heading="To"
                                        id="dob_text_input"
                                        onChange={this.on_to_date_change}
                                        className="clock_datatime_picker form-control "
                                        inputProps={{ placeholder: 'Where to', className: 'border-0 w-100' }}
                                        input={true}
                                        dateFormat={'ll'}
                                        timeFormat={false}
                                        closeOnSelect={true}
                                        value={this.state.date_to.value}
                                    />
                                </div>
                                <div className="col-lg-6">
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <button
                                                type="button"
                                                className="btn bg-dark btn-block btn-sm btn-labeled btn-labeled-right pr-5"
                                                style={{ textTransform: "inherit" }}
                                                onClick={() => this.setState({
                                                    date_from: { value: '' }, date_to: { value: '' },
                                                    patient_checkbox: false,
                                                    doctor_checkbox: false,
                                                })}>
                                                <b><i className="icon-reset"></i></b>
                                                Reset filters
                                            </button>
                                        </div>
                                        <div className="col-lg-6">
                                            <button
                                                type="button"
                                                className="btn bg-teal-400 btn-labeled btn-labeled-right btn-sm pr-5 btn-block"
                                                style={{ textTransform: "inherit" }}
                                                onClick={this.refresh_button_click}>
                                                <b><i className="icon-reset"></i></b>
                                                Refresh
                                            </button>
                                        </div>
                                    </div>
                                    <div className="row mt-1">
                                        <div className="col-lg-12">
                                            <button
                                                type="button"
                                                className="btn bg-teal-400 btn-labeled btn-labeled-right btn-sm pr-5 btn-block "
                                                style={{ textTransform: "inherit" }}
                                                onClick={this.on_search_click}>
                                                <b><i className="icon-search4"></i></b>
                                                Search
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                { this.state.loading_status ? loading : table}
                <UserPreviewModal visibility={this.state.user_preview_modal_visibility}
                    modal_props={this.state.user_modal_props}
                    on_click_back_drop={() => this.setState({ user_preview_modal_visibility: false, user_modal_props: null })}
                    on_click_cancel={() => this.setState({ user_preview_modal_visibility: false, user_modal_props: null })} />
            </Container >
        )
    }
}
function map_state_to_props(notify) {
    return { notify }
}
export default connect(map_state_to_props, { notify, set_active_page })(withRouter(Visits));