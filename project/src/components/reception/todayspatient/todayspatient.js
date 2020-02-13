import React, { Component } from 'react';
import Container from '../../../shared/container/container'
import Select from 'react-select'
import Axios from 'axios';
import { BASE_RECEPTION_URL } from '../../../shared/rest_end_points';
import { connect } from "react-redux";
import { notify } from '../../../actions';
import { withRouter } from 'react-router-dom';
import Moment from 'react-moment';
import Modal from 'react-bootstrap4-modal';
// import Inputfield from '../../../shared/inputfield/inputfield';
import Loader from 'react-loader-spinner';
import DateTimePicker from 'react-datetime'

// import 'moment-timezone';
class Todayspatient extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            totalRecords: 0,
            new_appointment_modal_visibility: false,
            modal_loading_status: false
        }
    }


    componentDidMount() {
        // $('.table-togglable').footable();
        Axios.post(BASE_RECEPTION_URL, {}, {
            headers: {
                'code-medicine': localStorage.getItem('user')
            }
        }).then(res => {
            if (res.data.status) {
                this.setState({ data: res.data.payload, totalRecords: res.data.payload.length })
            }
            else {
                this.props.notify('info', '', res.data.message)
            }
        }).catch(err => {
            console.log(err)
        })
    }

    renderDataInRows = () => {
        return (this.state.data.map((booking, i) => {
            // var time = new Date(booking.time);

            return (
                <tr key={i}>
                    <td>
                        {booking.patient['first_name']}
                    </td>
                    <td>
                        <Moment format="HH:mm" date={booking.time}></Moment>
                    </td>
                    <td>
                        {booking.description}
                    </td>
                </tr>
            )
        }))
    }

    render() {
        const users_options = [
            {id: 'user1', label: 'Farrukh | i150310@nu.edu.pk | 03044848492'},
            {id: 'user1', label: 'Ammad | ammad.hassan@gmail.com | 03233535354'},
            {id: 'user1', label: 'Uzair | uzair.hassan@gmail.com | 03356333860'}
        ]
        const doctors_options = [
            {}
        ]
        var table = <div className="">
                        <div className="alert alert-info" style={{ marginBottom: '0px' }}>
                            <strong>Info!</strong> No Data Found.
                        </div>
                        <div className="d-flex justify-content-center">
                            <Loader 
                                type="Rings"
                                color="#00BFFF"
                                height={150}
                                width={150}
                                timeout={60000} //60 secs
                            />
                        </div>
                    </div>;
        if (this.state.data != null) {
            if (this.state.totalRecords > 0) {
                table = <table className="table table-togglable table-hover table-bordered">
                    <tbody>
                        {this.renderDataInRows(this.state.filter_data)}
                    </tbody>
                </table>
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
                                                // options={this.state.search_options}
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
                        <button
                            type="button"
                            className="btn bg-teal-400 btn-labeled btn-labeled-right btn-block pr-5"
                            style={{ textTransform: "inherit" }}
                            onClick={() => this.setState({ new_appointment_modal_visibility: this.state.new_appointment_modal_visibility ? false : true })}>
                            <b><i className="icon-plus3"></i></b>
                            New Appointment
                        </button>
                    </div>
                </div>

                <div className="card">
                    <div className="card-body">
                        {table}
                    </div>
                </div>
                <Modal 
                    visible={this.state.new_appointment_modal_visibility} 
                    onClickBackdrop={() => this.setState({ new_appointment_modal_visibility: false })}
                    fade={true}
                    dialogClassName={`modal-dialog-centered modal-lg`}
                    >
                    
                    <div className="modal-header">
                        <h5 className="modal-title">Add new visit</h5>
                    </div>
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
                                        options={users_options}
                                        classNamePrefix={`form-control`}
                                        placeholder="Select User"
                                        id="gender_selection"
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
                                    onClick={this.on_submit}>
                                    <b><i className="icon-plus3"></i></b>
                                    Add new
                                </button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="form-group form-group-float">
                                    <div className="form-group-float-label is-visible mb-1">
                                        What is the reason for the visit
                                    </div>
                                    <textarea rows={5} cols={5} className="form-control" placeholder="Reason for visit" />
                                </div>
                            </div>
                        </div>
                        <div className="row mb-1">
                            <div className="col-6">
                                Which doctor will be suitable
                            </div>
                            <div className="col-6">
                                What is the date/time of appointment
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group form-group-feedback form-group-feedback-right">
                                    <Select
                                        options={users_options}
                                        classNamePrefix={`form-control`}
                                        placeholder="Select a Doctor"
                                        id="gender_selection"
                                    />
                                    <div className="form-control-feedback">
                                        <i className="icon-user-tie text-muted"></i>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <DateTimePicker id="dob_text_input"
                                    // onChange={this.on_date_of_birth_change}
                                    className="clock_datatime_picker"
                                    inputProps={{ placeholder: 'Select Date', width: '100%', className: 'form-control' }}
                                    input={true}
                                    dateFormat={'ll'}
                                    timeFormat={false}
                                    closeOnSelect={true}
                                    // value={this.state.dob.value}
                                />
                            </div>
                            <div className="col-md-3">
                                <DateTimePicker id="dob_text_input"
                                    // onChange={this.on_date_of_birth_change}
                                    className="clock_datatime_picker"
                                    inputProps={{ placeholder: 'Select Time', width: '100%', className: 'form-control' }}
                                    input={true}
                                    dateFormat={false}
                                    timeFormat={true}
                                    closeOnSelect={true}
                                    // value={this.state.dob.value}
                                />
                            </div>
                        </div>
                    </div>
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
                            onClick={this.on_submit}>
                            <b><i className="icon-plus3"></i></b>
                            Add
                        </button>
                    </div>
                </Modal>
                {/* <Modal 
                    visible={true} 
                    onClickBackdrop={() => this.setState({ new_appointment_modal_visibility: false })}
                    fade={true}
                    dialogClassName={`modal-dialog-centered modal-lg`}
                    >
                        <Register/>
                    </Modal> */}
            </Container>
        )
    }
}
function map_state_to_props(notify) {
    return { notify }
}
export default connect(map_state_to_props, { notify })(withRouter(Todayspatient));