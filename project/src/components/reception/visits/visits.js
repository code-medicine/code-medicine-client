import React, { Component } from 'react';
import Container from '../../../shared/container/container';
import { BASE_RECEPTION_URL, SEARCH_USER_REQUEST } from '../../../shared/rest_end_points';
import { LOGIN_URL } from '../../../shared/router_constants';
import User from '../../../shared/customs/user';
import Loader from 'react-loader-spinner';
import Axios from 'axios';
import { connect } from "react-redux";
import { notify } from '../../../actions';
import { Link, withRouter } from 'react-router-dom';
import moment from 'moment';
import DateTimePicker from 'react-datetime'
import "./visits.css"
import Inputfield from '../../../shared/inputfield/inputfield';
import { BLOOD_GROUPS_OPTIONS, PATIENT_VISIT_STATUSES, classNameColors } from '../../../shared/constant_data';
import makeAnimated from 'react-select/animated';
import Select from 'react-select';
import TableRow from '../tablerow';


class Visits extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: null,
            users_list: [],
            today:  moment().format('LT'),
            visits_type: 'previous',
            
            date_from: { value: '' },
            date_to: { value: '' },
            search_user_id: { value: '' },

            patient_checkbox: false,
            doctor_checkbox: false,

            loading_status: false,
        }
    }

    componentDidMount() {
        setInterval(() => {
            this.setState({today: moment().format('LT')})
        },60000)
    }

    async request(_data, _url, _method="post") {
        try {
            if (_method === 'post')
                return await Axios.post(_url,_data,{ headers: { 'code-medicine': localStorage.getItem('user') }})
            else if (_method === 'get'){
                return await Axios.get(_url,{ headers: { 'code-medicine': localStorage.getItem('user') }})
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
                case 'users_list':
                    this.setState({ search_user_id: { value: e.reference } })
                    break;
                default:
                    break;
            }
        }
        else {
            switch (actor) {
                case 'gender_selection':
                    this.setState({ user_gender: { value: '' } })
                    break;
                case 'users_list':
                    this.setState({ search_user_id: { value: '' }})
                    break;
                default:
                    break;
            }
        }
    }

    async render_users(string){
        let role = ''
        if ((this.state.patient_checkbox === true && this.state.doctor_checkbox === true) || 
                (this.state.patient_checkbox === false && this.state.doctor_checkbox === false)){
                    role = 'any'
                }
        else if (this.state.patient_checkbox === true && this.state.doctor_checkbox === false){
            role = 'Patient'
        }
        else if (this.state.patient_checkbox === false && this.state.doctor_checkbox === true){
            role = "Doctor"
        }

        const res_users = await this.request({search: string, role: 'Patient'},
                        `${SEARCH_USER_REQUEST}?search=${string}&role=${role}`,'get')
        let temp_users = []
        if (res_users.data['status']){
            for (var i = 0; i < res_users.data.payload['count']; ++i) {
                const t_user = res_users.data.payload['users'][i]
                temp_users.push({
                    id: 'users_list',
                    reference: t_user._id,
                    label: `${t_user.first_name} ${t_user.last_name} | ${t_user.phone_number} | ${t_user.email}`
                })
            }
            this.setState({users_list: temp_users})
        }
    }

    populate_users = (string) => {
        if (string.length >= 3){
            this.render_users(string)
        }
        else{
            this.setState({ users_list: [] })
        }
    }

    populate_appointments = async (data) => {
        this.setState({loading_status: true})
        let res_visits = await this.request(data, BASE_RECEPTION_URL)
        if (res_visits === null) return
        if (res_visits.data.status) {
            this.setState({ 
                data: res_visits.data.payload, 
                totalRecords: res_visits.data.payload.length, 
                loading_status:false 
            })
            
        }
        else {
            this.props.notify('info', '', res_visits.data.message)
            this.setState({ 
                data: null,
                loading_status:false })
        }
    }

    on_text_field_change = (e) =>{
        switch(e.target.id){
            case 'patient_checkbox_input':
                this.setState({ patient_checkbox: e.target.checked })
                break;
            case 'doctor_checkbox_input':
                this.setState({ doctor_checkbox: e.target.checked })
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
        if (this.state.date_from.value !== '' && this.state.date_to.value !== ''){
            console.log(this.state)
            if (this.state.patient_checkbox === true && this.state.doctor_checkbox === true) {
                this.populate_appointments({
                    to_date: this.state.date_to.value,
                    from_date: this.state.date_from.value 
                }) 
            }
            else if (this.state.patient_checkbox === false && this.state.doctor_checkbox === false){
                this.populate_appointments({
                    to_date: this.state.date_to.value,
                    from_date: this.state.date_from.value 
                }) 
            }
            else if (this.state.patient_checkbox === true && this.state.doctor_checkbox === false){
                if (this.state.search_user_id.value !== ''){
                    this.populate_appointments({
                        to_date: this.state.date_to.value,
                        from_date: this.state.date_from.value,
                        patient_id: this.state.search_user_id.value
                    }) 
                }
                else{
                    this.props.notify('info','','Please select a patient')
                }
            }
            else if (this.state.patient_checkbox === false && this.state.doctor_checkbox === true){
                if (this.state.search_user_id.value !== ''){
                    this.populate_appointments({
                        to_date: this.state.date_to.value,
                        from_date: this.state.date_from.value,
                        doctor_id: this.state.search_user_id.value
                    }) 
                }
                else{
                    this.props.notify('info','','Please select a doctor')
                } 
            }
            
        }
        else{
            this.props.notify('error','','Please specify a range of dates')
        }
    }

    renderDataInRows = () => {
        return (this.state.data.map((booking, i) => {
            var random_color = classNameColors[Math.floor(Math.random() * classNameColors.length)]

            const row_data = { patient_name: booking.patient['first_name'] + ' ' + booking.patient['last_name'],// patient_name
                patient_phone_number: booking.patient['phone_number'],// patient_phone_number
                // date_of_booking: moment(booking.date,"YYYY-MM-DDThh:mm:ss").format('MMMM Do YYYY'),//date_of_booking
                status: <span className="badge badge-danger">{booking.status}</span>,
                time_of_booking: `${moment(booking.date,"YYYY-MM-DDThh:mm:ss").format('hh:mm a')} (${moment(booking.date,"YYYY-MM-DDThh:mm:ss").fromNow()})`,// time of booking and arsa of booking
                doctor_name: booking.doctor['first_name'] + ' ' + booking.doctor['last_name'],// doctor name
            }
            const hidden_data = [
                <div className={`card border-left-${random_color}`}>
                    <div className={`card-body`}>
                        <div className={`row`}>
                            <div className={`col-lg-6 col-md-6 col-sm-12`}>
                                <div className={`h6 font-weight-semibold`}>Patient Information</div>
                                <User
                                    fname={booking.patient['first_name']}
                                    lname={booking.patient['last_name']}
                                    dob={booking.patient['dob']}
                                    gender={booking.patient['gender']}
                                    phone={booking.patient['phone_number']}
                                    email={booking.patient['email']}
                                    thumbnail_color={`bg-${random_color}`}
                                />
                                <hr/>
                            </div>
                            <div className={`col-lg-6 col-md-6 col-sm-12`}>
                                <div className={`h6 font-weight-semibold`}>Doctor Information</div>
                                <User
                                    fname={booking.doctor['first_name']}
                                    lname={booking.doctor['last_name']}
                                    dob={booking.doctor['dob']}
                                    gender={booking.doctor['gender']}
                                    phone={booking.doctor['phone_number']}
                                    email={booking.doctor['email']}
                                    thumbnail_color={`bg-${random_color}`}
                                />
                                <hr/>
                            </div>
                        </div>
                        <h6 className="mb-0"><span className="font-weight-semibold">Reason:</span> {booking.description}</h6>
                    </div>
                </div>
                
                
            ]
            let header_elements = [
                moment(booking.date,"YYYY-MM-DDThh:mm:ss").format('MMMM Do YYYY, hh:mm a'),
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
                    hidden_header_color={random_color}/>    
            )
        }))
    }
    render() {
        const loading = <div className="d-flex justify-content-center">
                            <Loader
                                type="Rings"
                                color="#00BFFF"
                                height={150}
                                width={150}
                                timeout={60000} //60 secs
                            />
                        </div>
        var table = ''
        if (this.state.data != null) {
            if (this.state.totalRecords > 0) {
                table = <div className="table-responsive mt-2 card mb-0 pb-0"><table className="table table-hover">
                <thead className="table-header-bg bg-dark">
                    <tr>
                        <th style={{width: "40px"}}></th>
                        <th >Name</th>
                        <th >Phone</th>
                        <th >Status</th>
                        <th >Time</th>
                        <th colSpan="1">Taking care</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderDataInRows()}
                </tbody>
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
                        <div className="col-lg-4">
                            <div className="form-group row mb-1">
                                <label className="col-form-label-lg">From</label>
                                <div className={`input-group`}>
                                    <span className="input-group-prepend">
                                        <span className="input-group-text"><i className={'icon-calendar3'} /></span>
                                    </span>
                                    <DateTimePicker id="dob_text_input"
                                        onChange={this.on_from_date_change}
                                        className="clock_datatime_picker form-control form-control-lg "
                                        inputProps={{ placeholder: 'Where from', width: '100%', className: 'border-0' }}
                                        input={true}
                                        dateFormat={'ll'}
                                        timeFormat={false}
                                        closeOnSelect={true}
                                        value={this.state.date_from.value}
                                    />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-form-label-lg">To</label>
                                <div className={`input-group`}>
                                    <span className="input-group-prepend">
                                        <span className="input-group-text"><i className={'icon-calendar3'} /></span>
                                    </span>
                                    <DateTimePicker id="dob_text_input"
                                        onChange={this.on_to_date_change}
                                        className="clock_datatime_picker form-control form-control-lg "
                                        inputProps={{ placeholder: 'Where to', width: '100%', className: 'border-0' }}
                                        input={true}
                                        dateFormat={'ll'}
                                        timeFormat={false}
                                        closeOnSelect={true}
                                        value={this.state.date_to.value}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-8 ">
                            <div className={`ml-2`}>
                                <div className="form-group row mb-2">
                                    <div className={``}>
                                        <label className="col-form-label-lg">Search</label>
                                        <div className="form-check mb-0 d-inline ml-2">
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
                                                Patient
                                            </label>
                                        </div>
                                        <div className="form-check mb-0 d-inline ml-2">
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
                                                Doctor
                                            </label>
                                        </div>
                                    </div>
                                    <div className={`input-group`}>
                                        <span className="input-group-prepend">
                                            <span className="input-group-text"><i className={'icon-search4'}/></span>
                                        </span>
                                        <Select
                                            isClearable
                                            className="w-75"
                                            options={this.state.users_list}
                                            classNamePrefix={``}
                                            placeholder="Search by"
                                            id="users_list"
                                            onInputChange={e => this.populate_users(e)}
                                            onChange={e => this.on_selected_changed(e,'users_list')}//this.on_selected_changed(e, 'users_list')}
                                        />
                                        <div className={`ml-lg-2 ml-md-2 font-weight-light h4`}>{this.state.today}</div>
                                    </div>
                                </div>
                                
                                <div className={`mt-0 `}>
                                    <div className={`row`}>
                                        <div className={`col col-form-label-lg`}>
                                            <label>Status</label>
                                        </div>
                                        <div className={`col-8 pl-0`}>
                                            <Select
                                                className=""
                                                options={PATIENT_VISIT_STATUSES}
                                                classNamePrefix={``}
                                                components={makeAnimated()}
                                                placeholder="Select Status"
                                                isClearable
                                                id="status_selection"
                                                onChange={this.on_selected_changed}
                                            />
                                        </div>
                                        <div className={`col-2`}>
                                            <button
                                                type="button"
                                                className="btn bg-dark btn-icon btn-block"
                                                style={{ textTransform: "inherit" }}
                                                onClick={this.on_submit_new_patient}>
                                                <b><i className="icon-filter4"></i></b>
                                            </button>
                                        </div>

                                    </div>
                                    <div className={`mt-0`}>
                                        <div className={`row`}>
                                            <div className={`col`}>
                                                <button
                                                    type="button"
                                                    className="btn bg-dark btn-labeled btn-labeled-right pr-5 btn-block"
                                                    style={{ textTransform: "inherit" }}
                                                    onClick={() => this.setState({
                                                        date_from: {value:''}, date_to: {value:''},
                                                        patient_checkbox: false,
                                                        doctor_checkbox: false,
                                                    })}>
                                                    <b><i className="icon-reset"></i></b>
                                                    Reset filters
                                                </button>
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
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.loading_status? loading:table}
            </Container>
        )
    }
}
function map_state_to_props(notify) {
    return { notify }
}
export default connect(map_state_to_props, { notify })(withRouter(Visits));