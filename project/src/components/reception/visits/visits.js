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


class Visits extends Component { 
    constructor(props) {
        super(props)
        this.state = {
            data: null,
            visits_type: 'previous',
            date_from: {value: '', label_visibility: false},
            date_to: {value: '', label_visibility: false}
        }
    }

    componentDidMount(){
        // this.render_data('previous')
    }


    render_data = (e) => {
        if (e === 'previous'){
            this.setState({visits_type: 'previous', data:null}, () => {
                this.populate_appointments({date_flag: 'yesterday'})
            })
        }
        else if (e === 'upcoming'){
            this.setState({visits_type: 'upcoming', data:null}, () => {
                this.populate_appointments({date_flag: 'tomorrow'})
            })
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

    populate_appointments = async (data) => {
        let res_visits = await this.request(data,BASE_RECEPTION_URL)
        if (res_visits === null) return
        if (res_visits.data.status) {
            this.setState({ data: res_visits.data.payload, totalRecords: res_visits.data.payload.length })
        }
        else {
            this.props.notify('info', '', res_visits.data.message)
            if (res_visits.data.message !== 'No visits found')
                this.props.history.push(LOGIN_URL)
            this.setState({data: []})
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
                                        {this.state.visits_type === 'previous'? moment(booking.date.toString()).format('MMMM Do YYYY, h:mm:ss a'): moment(booking.date.toString()).format('MMMM Do YYYY, h:mm:ss a')} 
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
                    <hr/>
                </div>
                // </div>
                
            )
        }))
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
            <Container container_type={'visits'}>
                <div className="row mb-2">
                    <div className="col-3">
                        <div className={`form-group form-group-float mb-1`}>
                            <label className={`form-group-float-label animate ${this.state.date_from.label_visibility ? 'is-visible' : ''}`}>Date of birth</label>
                            <span className="input-group-prepend">
                                <span className="input-group-text">
                                    <i className="icon-calendar3 text-muted"></i>
                                </span>
                                <DateTimePicker id="dob_text_input"
                                    onChange={this.on_date_of_birth_change}
                                    className="clock_datatime_picker"
                                    inputProps={{ placeholder: 'From', width: '100%', className: 'form-control' }}
                                    input={true}
                                    dateFormat={'ll'}
                                    timeFormat={false}
                                    closeOnSelect={true}
                                />
                            </span>

                        </div>
                    </div>
                    <div className="col-3">
                        <div className={`form-group form-group-float mb-1`}>
                            <label className={`form-group-float-label animate ${this.state.date_to.label_visibility ? 'is-visible' : ''}`}>Date of birth</label>
                            <span className="input-group-prepend">
                                <span className="input-group-text">
                                    <i className="icon-calendar3 text-muted"></i>
                                </span>
                                <DateTimePicker id="dob_text_input"
                                    onChange={this.on_date_of_birth_change}
                                    className="clock_datatime_picker"
                                    inputProps={{ placeholder: 'To', width: '100%', className: 'form-control' }}
                                    input={true}
                                    dateFormat={'ll'}
                                    timeFormat={false}
                                    closeOnSelect={true}
                                />
                            </span>

                        </div>
                    </div>
                    <div className={`col-6 d-flex align-items-end mb-1`}>
                        <button
                            type="button"
                            className="btn bg-dark btn-labeled btn-labeled-right pr-5"
                            style={{ textTransform: "inherit" }}
                            onClick={this.on_submit_new_patient}>
                            <b><i className="icon-filter4"></i></b>
                            Filter
                        </button>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body">
                        {table}
                    </div>
                </div>
            </Container>
        )
    }
}
function map_state_to_props(notify) {
    return { notify }
}
export default connect(map_state_to_props, { notify })(withRouter(Visits));