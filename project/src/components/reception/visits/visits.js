import React, { Component } from 'react';
import Container from '../../../shared/container/container';
import { SEARCH_USER_REQUEST, SEARCH_APPOINTMENTS_URL, SEARCH_BY_ID_USER_REQUEST } from '../../../shared/rest_end_points';
import Axios from 'axios';
import { connect } from "react-redux";
import { notify, set_active_page } from '../../../actions';
import { Link, withRouter } from 'react-router-dom';
import moment from 'moment';
import DateTimePicker from 'react-datetime'
import "./visits.css"
import { BLOOD_GROUPS_OPTIONS, PATIENT_VISIT_STATUSES, classNameColors } from '../../../shared/constant_data';
import makeAnimated from 'react-select/animated';
import Select from 'react-select';
import TableRow from '../../../shared/customs/tablerows/tablerow';
import '../../../shared/customs/Animations/animations.css';
import UserPreviewModal from '../../../shared/modals/userpreviewmodal';
import Loading from '../../../shared/customs/loading/loading';
import { BASE_URL } from '../../../shared/router_constants';


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
                    </Link>,<span className="breadcrumb-item active">All Apointments</span>]
        this.props.set_active_page(routes)
        setInterval(() => {
            this.setState({ today: moment().format('LT') })
        }, 60000)
        this.on_search_click()
    }

    async request(_data, _url, _method = "post") {
        try {
            if (_method === 'post'){
                this.setState({ previous_query: { data: _data } })
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

    on_selected_changed = (e, actor) => {

        if (e !== null) {
            switch (e.id) {
                case 'gender_selection':
                    this.setState({ user_gender: { value: e.label } })
                    break;
                case 'patient_list':
                    this.setState({ search_patient_id: { value: e.reference } })
                    break;
                case 'doctor_list':
                    this.setState({ search_doctor_id: { value: e.reference } })
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
                default:
                    break;
            }
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
                    id: `${role.toLowerCase()}_list`,
                    reference: t_user._id,
                    label: `${t_user.first_name} ${t_user.last_name} | ${t_user.phone_number} | ${t_user.email}`
                })
            }
            if (role === 'Patient'){
                this.setState({ patient_list: temp_users })
            }
            else if (role === 'Doctor'){
                this.setState({ doctor_list: temp_users })
            }
        }
    }

    populate_patients = (string) => {
        if (string.length >= 3) {
            this.render_users(string,'Patient')
        }
        else{
            this.setState({ patient_list: [] })
        }
    }
    populate_doctors = (string) => {
        if (string.length >= 3) {
            this.render_users(string,'Doctor')
        }
        else{
            this.setState({ doctor_list: [] })
        }
    }

    populate_appointments = async (data) => {
        this.setState({ loading_status: true })
        let res_visits = await this.request(data, SEARCH_APPOINTMENTS_URL)
        if (res_visits === null) return
        if (res_visits.data.status) {
            this.setState({
                data: res_visits.data.payload.visits,
                total_records_on_this_page: res_visits.data.payload.visits.length,
                total_pages: res_visits.data.payload.total_pages,
                loading_status: false
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
        },() => {
            if (this.state.date_from.value !== '' && this.state.date_to.value !== '') {
                if (this.state.patient_checkbox === true && this.state.doctor_checkbox === true) {
                    this.populate_appointments({
                        to_date: this.state.date_to.value,
                        from_date: this.state.date_from.value,
                        patient_id: this.state.search_patient_id.value,
                        doctor_id: this.state.search_doctor_id.value,
                        page: this.state.page_number
                    })
                }
                else if (this.state.patient_checkbox === false && this.state.doctor_checkbox === false) {
                    this.populate_appointments({
                        to_date: this.state.date_to.value,
                        from_date: this.state.date_from.value,
                        page: this.state.page_number
                    })
                }
                else if (this.state.patient_checkbox === true && this.state.doctor_checkbox === false) {
                    if (this.state.search_patient_id.value !== '') {
                        this.populate_appointments({
                            to_date: this.state.date_to.value,
                            from_date: this.state.date_from.value,
                            patient_id: this.state.search_patient_id.value,
                            page: this.state.page_number
                        })
                    }
                    else {
                        this.props.notify('info', '', 'Please select a patient')
                    }
                }
                else if (this.state.patient_checkbox === false && this.state.doctor_checkbox === true) {
                    if (this.state.search_doctor_id.value !== '') {
                        this.populate_appointments({
                            to_date: this.state.date_to.value,
                            from_date: this.state.date_from.value,
                            doctor_id: this.state.search_doctor_id.value,
                            page: this.state.page_number
                        })
                    }
                    else {
                        this.props.notify('info', '', 'Please select a doctor')
                    }
                }
            }
            else {
                this.props.notify('error', '', 'Please specify a range of dates')
            }
        })
        
    }

    refresh_button_click = () => {
        if (this.state.previous_query.data !== null){
            this.populate_appointments(this.state.previous_query.data)
        }
        else{
            this.props.notify('info','','Select dates and click search button to search')
        }
    }

    request_user = (id) => {
        this.setState({
            user_preview_modal_visibility: true
        }, () => {
            
        })
        Axios.post(SEARCH_BY_ID_USER_REQUEST, {
            user_id: id
        }, {
            headers: { 'code-medicine': localStorage.getItem('user') }
        }).then( res => {
            if (res.data.status === true){
                console.log(res.data.payload.user)
                this.setState({
                    user_modal_props: res.data.payload.user
                })
            }

        }).catch(err => {
            console.log('failed to fetch user')
        })        
    }

    renderDataInRows = () => {
        return (this.state.data.map((booking, i) => {
            var random_color = classNameColors[Math.floor(Math.random() * classNameColors.length)]

            const row_data = {
                date_of_booking: <span className="bounceInRight animated">{`${moment(booking.date, "YYYY-MM-DDThh:mm:ss").format('LL')}`}</span>,// date of booking
                time_of_booking: <span className="bounceInRight animated">{`${moment(booking.date, "YYYY-MM-DDThh:mm:ss").format('LT')}`}</span>,// time of booking
                patient_name: <button className="btn btn-outline bg-teal-400 border-teal-400 text-teal-400 btn-sm btn-block jackInTheBox animated" 
                                    onClick={() => this.request_user(booking.patient['id']) }>
                                {booking.patient['first_name'] + ' ' + booking.patient['last_name']}
                            </button>,// patient_name
                visit_reason: <span className="d-inline-block text-truncate " style={{maxWidth: "150px"}}>
                                {booking.description}
                            </span>,
                doctor_name: <button className="btn btn-outline-secondary btn-sm btn-block jackInTheBox animated" 
                                    onClick={() => this.request_user(booking.doctor['id'])}>
                                {booking.doctor['first_name'] + ' ' + booking.doctor['last_name']}
                            </button>,// doctor name
                visit_status: <span className={`badge ${booking.status === 'waiting'? 'badge-danger':'badge-primary'}`}>{booking.status}</span>,
                visit_total_charges: 0
                
            }
            const hidden_data = [
                <h5 className="font-weight-semibold">Reason of visit</h5>,
                <blockquote className="blockquote blockquote-bordered py-2 pl-3 mb-0">
                    <p className="mb-1">
                        {booking.description}
                    </p>
                    <footer className="blockquote-footer">Perscription</footer>
                </blockquote>
            ]
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
                <TableRow
                    key={i}
                    row_data={row_data}
                    hidden_data={hidden_data}
                    hidden_header_elements={header_elements}
                    hidden_header_color={random_color}
                    columns="8" />
            )
        }))
    }

    on_previous_button_click = () => {
        const to_request_page_number = this.state.page_number - 1 
        const updated = this.state.previous_query
        updated.data.page = to_request_page_number
        this.setState({page_number: to_request_page_number}, () => {
            this.populate_appointments(updated.data)
        })
    }

    on_page_number_click = (e) => {
        const to_request_page_number = parseInt(e.target.innerHTML) - 1 
        const updated = this.state.previous_query
        updated.data.page = to_request_page_number
        this.setState({page_number: to_request_page_number}, () => {
            this.populate_appointments(updated.data)
        })
    }

    on_next_button_click = () => {
        const to_request_page_number = this.state.page_number + 1  
        const updated = this.state.previous_query
        updated.data.page = to_request_page_number
        this.setState({page_number: to_request_page_number}, () => {
            this.populate_appointments(updated.data)
        })
    }


    render() {
        const loading = <Loading size={150}/>
        var table = ''
        if (this.state.data != null) {
            if (this.state.total_records_on_this_page > 0) {
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
                                        <li className={`page-item ${this.state.page_number === 0? 'disabled':''}`}>
                                            <Link 
                                                className="page-link"
                                                to="#"
                                                onClick={this.on_previous_button_click}>
                                                Previous
                                            </Link>
                                        </li>
                                        {
                                        Array(this.state.total_pages).fill().map((item,i) => {
                                            return <li key={i} className="page-item">
                                                <Link className="page-link" to="#" onClick={e => this.on_page_number_click(e)}>
                                                    {i + 1}
                                                </Link>
                                            </li>
                                        })
                                        }
                                        <li className={`page-item ${this.state.page_number === this.state.total_pages-1? 'disabled':''}`}>
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
        return (
            <Container container_type={'visits'}>
                <div className={`container-fluid`}>
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="form-group row mb-2 px-2">
                                        <label className="col-form-label-lg">From</label>
                                        <div className={`input-group`}>
                                            <span className="input-group-prepend">
                                                <span className="input-group-text"><i className={'icon-calendar3'} /></span>
                                            </span>
                                            <DateTimePicker id="dob_text_input"
                                                onChange={this.on_from_date_change}
                                                className="clock_datatime_picker form-control form-control-lg "
                                                inputProps={{ placeholder: 'Where from', className: 'border-0 w-100' }}
                                                input={true}
                                                dateFormat={'ll'}
                                                timeFormat={false}
                                                closeOnSelect={true}
                                                value={this.state.date_from.value}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group row mb-2 px-2">
                                        <label className="col-form-label-lg">To</label>
                                        <div className={`input-group`}>
                                            <span className="input-group-prepend">
                                                <span className="input-group-text"><i className={'icon-calendar3'} /></span>
                                            </span>
                                            <DateTimePicker id="dob_text_input"
                                                onChange={this.on_to_date_change}
                                                className="clock_datatime_picker form-control form-control-lg "
                                                inputProps={{ placeholder: 'Where to', className: 'border-0 w-100' }}
                                                input={true}
                                                dateFormat={'ll'}
                                                timeFormat={false}
                                                closeOnSelect={true}
                                                value={this.state.date_to.value}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 d-flex flex-column-reverse mb-2 pb-1">
                            
                            <div className="row">
                                <div className="col">
                                    <button
                                        type="button"
                                        className="btn bg-dark btn-block btn-labeled btn-labeled-right pr-5"
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
                                <div className="col">
                                    
                                    <button
                                        type="button"
                                        className="btn bg-teal-400 btn-labeled btn-labeled-right pr-5 btn-block"
                                        style={{ textTransform: "inherit" }}
                                        onClick={this.refresh_button_click}>
                                        <b><i className="icon-reset"></i></b>
                                        Refresh
                                    </button>
                                </div>
                            </div>
                            <div className="row mb-2">
                                <div className="col">
                                    <Select
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
                            </div>
                        </div>

                    </div>
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="row mb-2">
                                <div className="col-11">
                                    <Select
                                        isClearable
                                        isDisabled={!this.state.patient_checkbox}
                                        id="patient_list"
                                        options={this.state.patient_list}
                                        onInputChange={e => this.populate_patients(e)}
                                        onChange={e => this.on_selected_changed(e, 'patient_list')}
                                        placeholder="Search patients" />
                                    {/* <Inputfield label_tag="Search Patient"
                                            icon_className="icon-user"
                                            placeholder="Enter name, Phone number or email to search"
                                            field_type="select"
                                            options={this.state.users_list}
                                            on_text_change_listener={e => this.populate_users(e)}
                                            on_selected_changed={e => this.on_selected_changed(e,'users_list')}
                                            /> */}
                                </div>
                                <div className="col-1 d-flex align-items-end pr-0 mb-2 pl-0">
                                    <div className="form-check">
                                        <label className="form-check-label">
                                            <div className="uniform-checker">
                                                <span className={this.state.patient_checkbox ? 'checked' : ''}>
                                                    <input type="checkbox"
                                                        name="patient"
                                                        id="patient_checkbox_input"
                                                        defaultChecked={this.state.patient_checkbox}
                                                        value={this.state.patient_checkbox}
                                                        onChange={this.on_text_field_change}
                                                        className="form-input-styled" />
                                                </span>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="row">
                                <div className="col-11">
                                    {/* <Inputfield label_tag="Search Doctor"
                                            icon_className="icon-user"
                                            placeholder="Enter name, Phone number or email to search"
                                            field_type="select"
                                            options={this.state.users_list}
                                            on_text_change_listener={e => this.populate_users(e)}
                                            on_selected_changed={e => this.on_selected_changed(e,'users_list')}
                                            /> */}
                                    <Select
                                        isClearable
                                        isDisabled={!this.state.doctor_checkbox}
                                        options={this.state.doctor_list}
                                        onInputChange={e => this.populate_doctors(e)}
                                        onChange={e => this.on_selected_changed(e, 'doctor_list')}
                                        placeholder="Search Doctor" />
                                </div>
                                <div className="col-1 d-flex align-items-end pr-0 mb-2 pl-0">
                                    <div className="form-check ">
                                        <label className="form-check-label">
                                            <div className="uniform-checker">
                                                <span className={this.state.doctor_checkbox ? 'checked' : ''}>
                                                    <input type="checkbox"
                                                        name="doctor"
                                                        id="doctor_checkbox_input"
                                                        defaultChecked={this.state.doctor_checkbox}
                                                        value={this.state.doctor_checkbox}
                                                        onChange={this.on_text_field_change}
                                                        className="form-input-styled" />
                                                </span>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`row`}>
                        <div className="col">
                            <Select
                                className=""
                                options={PATIENT_VISIT_STATUSES}
                                classNamePrefix={``}
                                components={makeAnimated()}
                                placeholder="Visit Status"
                                isClearable
                                id="status_selection"
                                onChange={this.on_selected_changed}
                            />
                        </div>
                        <div className={`col`}>
                            <Select
                                className=""
                                options={BLOOD_GROUPS_OPTIONS}
                                classNamePrefix={``}
                                components={makeAnimated()}
                                placeholder="Blood group"
                                isClearable
                                id="blood_group_selection"
                                onChange={this.on_selected_changed}
                            />
                        </div>
                        <div className={`col`}>
                            <button
                                type="button"
                                className="btn bg-dark btn-labeled btn-labeled-right pr-5 btn-block"
                                style={{ textTransform: "inherit" }}
                                onClick={this.on_submit_new_patient}>
                                <b><i className="icon-sort-alpha-asc"></i></b>
                                Sort
                            </button>
                        </div>
                        <div className={`col`}>
                            <button
                                type="button"
                                className="btn bg-teal-400 btn-labeled btn-labeled-right pr-5 btn-block "
                                style={{ textTransform: "inherit" }}
                                onClick={this.on_search_click}>
                                <b><i className="icon-search4"></i></b>
                                Search
                            </button>
                        </div>
                    </div>
                </div>
                {this.state.loading_status ? loading : table}
                <UserPreviewModal visibility={this.state.user_preview_modal_visibility} 
                    modal_props={this.state.user_modal_props}
                    on_click_back_drop={() => this.setState({user_preview_modal_visibility: false, user_modal_props: null})}
                    on_click_cancel={() => this.setState({user_preview_modal_visibility: false, user_modal_props: null})}/>
            </Container>
        )
    }
}
function map_state_to_props(notify) {
    return { notify }
}
export default connect(map_state_to_props, { notify,set_active_page })(withRouter(Visits));