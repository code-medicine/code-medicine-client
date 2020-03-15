import React, { Component } from 'react';
import Container from '../../../shared/container/container';
import { BASE_RECEPTION_URL } from '../../../shared/rest_end_points';
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
            today:  moment().format('LT'),
            visits_type: 'previous',
            date_from: { value: '' },
            date_to: { value: '' },
            loading_status: false,
        }
    }

    componentDidMount() {
        // this.render_data('previous')
        setInterval(()=>{
            this.setState({today: moment().format('LT')})
        },60000)
    }


    render_data = (e) => {
        if (e === 'previous') {
            this.setState({ visits_type: 'previous', data: null }, () => {
                this.populate_appointments({ date_flag: 'yesterday' })
            })
        }
        else if (e === 'upcoming') {
            this.setState({ visits_type: 'upcoming', data: null }, () => {
                this.populate_appointments({ date_flag: 'tomorrow' })
            })
        }
    }

    async request(data, url) {
        try {
            let response = await Axios.post(url, data, {
                headers: { 'code-medicine': localStorage.getItem('user') }
            })
            return response
        }
        catch (err) {
            this.props.notify('error', '', 'Server is not responding! Please try again later')
            return null
        }
    }

    populate_appointments = async (data) => {
        this.setState({loading_status: true})
        let res_visits = await this.request(data, BASE_RECEPTION_URL)
        if (res_visits === null) return
        if (res_visits.data.status) {
            // console.log(res_visits.data.payload)
            this.setState({ data: res_visits.data.payload, totalRecords: res_visits.data.payload.length, loading_status:false })
        }
        else {
            this.props.notify('info', '', res_visits.data.message)
            if (res_visits.data.message !== 'No visits found')
                this.props.history.push(LOGIN_URL)
            this.setState({ data: [] })
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
            this.populate_appointments({to_date: this.state.date_to,from_date: this.state.date_from})
        }
        else{
            this.props.notify('error','','Please specify a range of dates')
        }
    }

    renderDataInRows2 = () => {
        return (this.state.data.map((booking, i) => {
            return (
                // <div key={i} className="card border-left-slate border-top-0 border-bottom-0 border-right-0" >
                <div key={i} className="">
                    <div className="row my-1 mx-1">
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
                                        {this.state.visits_type === 'previous' ? moment(booking.date.toString()).format('MMMM Do YYYY, h:mm:ss a') : moment(booking.date.toString()).format('MMMM Do YYYY, h:mm:ss a')}
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
                                    {/* <button className="btn btn-outline-primary btn-sm float-right">Payment</button> */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr />
                </div>
                // </div>

            )
        }))
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
                                                    <span className={this.state.remember_me_option ? 'checked' : ''}>
                                                        <input type="checkbox"
                                                            name="remember"
                                                            id="remember_me_text_input"
                                                            defaultChecked={this.state.remember_me_option}
                                                            value={this.state.remember_me_option}
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
                                                    <span className={this.state.remember_me_option ? 'checked' : ''}>
                                                        <input type="checkbox"
                                                            name="remember"
                                                            id="remember_me_text_input"
                                                            defaultChecked={this.state.remember_me_option}
                                                            value={this.state.remember_me_option}
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
                                            <span className="input-group-text"><i className={'icon-droplet'}/></span>
                                        </span>
                                        <Select
                                            className="w-75"
                                            options={BLOOD_GROUPS_OPTIONS}
                                            classNamePrefix={``}
                                            components={makeAnimated()}
                                            placeholder="Select blood group"
                                            id="blood_group_selection"
                                            onChange={this.on_selected_changed}
                                        />
                                        <div className={`ml-lg-3 ml-md-3 font-weight-light h4`}>{this.state.today}</div>
                                    </div>
                                </div>
                                {/* <Inputfield
                                    id="user"
                                    label_tag={}
                                    icon_class="icon-search4"
                                    placeholder="Search by"
                                    custom_classes="mb-2" /> */}
                                
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
                                                id="blood_group_selection"
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