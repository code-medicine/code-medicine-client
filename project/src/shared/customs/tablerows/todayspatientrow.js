import React, { Component, Fragment } from 'react';
import { Collapse } from 'reactstrap'
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Popup } from "semantic-ui-react";
import NewAppointmentModal from '../../modals/newappointmentmodal';

class TodaysPatientRow extends Component {
    constructor(props) {
        super(props)
        this.state = {
            toggle: false,
            toggle_icon: 'icon-eye-plus',
            row_data: this.props.row_data,
            hidden_data: this.props.hidden_data,
            hidden_header_elements: this.props.hidden_header_elements,
            hidden_header_color: this.props.hidden_header_color,
            col_span: '',

            update_appointment_modal_visibility: false,
        }
    }
    toggle_row = () => {
        if (this.state.toggle)
            this.setState({toggle: false, toggle_icon: 'icon-eye-plus'})
        else
            this.setState({toggle: true, toggle_icon: 'icon-eye-minus'})
    }
    componentDidMount(){
        console.log(this.props.row_data);
        // this.setState({row_data: this.props.data})
        this.setState({col_span: this.props.columns})
    }

    view_user = (id) => {
        this.props.open_user_view_modal(id)
    }

    render_read_only_cols = () => {
        return (
            // <div>{this.state.row_data}</div>
            <div className={`container-fluid`}>
                <div className={`row`}>
                    {/* Patient name and phone number */}
                    <div className={`col-lg-3 col-md-6 col-sm-6 mt-0 text-teal-400 border-left-2 border-left-teal-400 btn-block d-flex align-items-center justify-content-center text-center`}>
                        <div className={`btn btn-outline bg-teal-400 text-teal-400 btn-block zoomIn animated`}
                            style={{ verticalAlign: 'center' }}
                            onClick={() => this.view_user(this.state.row_data.patient['id'])}>
                            <span className={`img-fluid rounded-circle text-white bg-teal-400 h3 p-2`} >
                                {this.state.row_data.patient['first_name'].charAt(0).toUpperCase() + this.state.row_data.patient['last_name'].charAt(0).toUpperCase()}
                            </span>
                            <h4 className="mt-2">{this.state.row_data.patient['first_name'] + ' ' + this.state.row_data.patient['last_name']}</h4>
                            <span><i className="icon-phone-wave mr-1"></i> {this.state.row_data.patient['phone_number']}</span>
                        </div>
                    </div>
                    {/* Appointment Time column */}
                    <div className={`col-lg-3 col-md-6 col-sm-6 mt-0 text-teal-400 border-left-2 border-bottom-sm-2 border-left-teal-400 border-right-teal-400 border-right-2 btn-block d-flex align-items-center justify-content-center text-center`} >
                        <div className={` zoomIn animated`} >
                            <h1 className="mb-0">{moment(this.state.row_data.date, "YYYY-MM-DDThh:mm:ss").format('hh:mm a')}</h1>
                            <p>{moment(this.state.row_data.date, "YYYY-MM-DDThh:mm:ss").fromNow()}</p>
                        </div>
                    </div>
                    {/* appointment details */}
                    <div className={`col-lg-6 col-md-12 col-sm-12 mt-sm-2`}>
                        {/* Appointment Reason */}
                        <div className={`row`}>
                            <div className={`col-lg-4 h6 font-weight-bold`}>Reason</div>
                            <div className={`col-lg-8 h6`}>
                                {this.state.row_data.description.length > 30 ? this.state.row_data.description.substring(0, 30) + '...' : this.state.row_data.description}
                            </div>
                        </div>
                        {/* Appointment date and time */}
                        <div className={`row`}>
                            <div className={`col-4 h6 font-weight-bold`}>Appointment</div>
                            <div className={`col-8 h6`}>
                                <span className="">On {moment(this.state.row_data.date, "YYYY-MM-DDThh:mm:ss").format('LLL')}</span>
                            </div>
                        </div>
                        {/* Appointment Doctor */}
                        <div className={`row`}>
                            <div className={`col-4 h6 font-weight-bold`}>Doctor</div>
                            <div className={`col-8 h6`}>
                                <Link className="text-teal-400 font-weight-bold" to={"#"}
                                    onClick={() => this.view_user(this.state.row_data.doctor['id'])}>
                                    <i className="icon-user-tie mr-2"></i>
                                    {this.state.row_data.doctor['first_name'] + ' ' + this.state.row_data.doctor['last_name']}
                                </Link>
                            </div>
                        </div>
                        {/* Status of the appointment */}
                        <div className={`row`}>
                            <div className={`col-4 h6 font-weight-bold`}>Status</div>
                            <div className={`col-8 h6`}>
                                <span className="badge badge-danger">{this.state.row_data.status}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    render_hidden_elements = () => {
        
        return (
            <div className="">
                <h5 className="font-weight-semibold">Reason of visit</h5>,
                <blockquote className="blockquote blockquote-bordered py-2 pl-3 mb-0">
                    <p className="mb-1">
                        {this.state.hidden_data.visit_description}
                    </p>
                    <footer className="blockquote-footer">Perscription</footer>
                </blockquote>
            </div>
        )
    }
    render_hidden_header_elements = () => {
        return this.state.hidden_header_elements.map((str,i) => {
            return <Fragment key={i}>{str}</Fragment>
        })
    }

    close_update_appointment_modal = () => {
        this.setState({update_appointment_modal_visibility: false})
    }

    open_update_appointment_modal = () => {
        this.setState({update_appointment_modal_visibility: true})
    }

    render () {
        // const popup_style = {
        //     borderRadius: 0,
        //     opacity: 0.7,
        //     padding: '2em',
        //   }
        // console.log('stateeeeeee',this.state)
        return (
            <Fragment>
                <tr >
                    {/* <td onClick={this.toggle_row} >
                        <div  >
                            <Link className="" to="#" onClick={this.toggle_row}>
                                <i className={this.state.toggle_icon}></i>
                            </Link>
                        </div>
                        
                    </td> */}
                    <td colSpan={this.state.col_span}>
                        {
                            this.render_read_only_cols()
                        }
                    </td>
                    <td>
                        <div className={``}>
                            <Fragment>
                            <Popup
                                trigger={
                                    <button className="btn btn-outline btn-sm bg-teal-400 border-teal-400 text-teal-400 secondary btn-icon "
                                            onClick={()=>this.props.open_procedure_modal(this.props.row_data.visit_id)}>
                                        <i className="icon-plus2"></i>
                                    </button>}
                                content={<div className={`card card-body bg-teal-400 text-teal-white shadow mr-2 mt-3 py-1`}>View or add procedures</div>}
                                flowing
                                hoverable
                                position='left center'
                            />
                            </Fragment>
                        </div>

                        <div className={`mt-1`}>
                            <Popup
                                trigger={
                                    <button className={`btn btn-outline btn-sm bg-teal-400 border-teal-400 text-teal-400 btn-icon`}
                                            onClick={()=>this.props.openInvoiceModal(this.props.row_data.visit_id)}>
                                        <i className={`icon-file-text2`}></i>
                                    </button>}
                                content={<div className={`card card-body bg-teal-400 text-white shadow mr-2 mt-3 py-1`}>Generate Invoice</div>}
                                flowing
                                hoverable
                                // style={popup_style}
                                position='left center'
                                // inverted={false}
                            />
                        </div>

                        <div className={`mt-1`}>
                            
                            <Popup
                                trigger={
                                    <button className={`btn btn-outline btn-sm bg-teal-400 border-teal-400 text-teal-400 btn-icon`}
                                        onClick={() => this.setState({update_appointment_modal_visibility: true})}    >
                                        <i className={`icon-pencil3`}></i>
                                    </button>}
                                flowing
                                hoverable
                                content={<div className={`card card-body bg-teal-400 text-white shadow mr-2 mt-3 py-1`}>Edit appointment</div>}
                                position='left center'
                            />
                        </div>

                        <div className={`mt-1`}>
                            
                            <Popup
                                trigger={
                                    <button className={`btn btn-outline btn-sm bg-dark border-dark text-dark btn-icon`}
                                            onClick={this.toggle_row}>
                                        <i className={this.state.toggle_icon}></i>
                                    </button>}
                                flowing
                                hoverable
                                content={<div className={`card card-body bg-dark text-white shadow mr-2 mt-3 py-1`}>Show more details</div>}
                                position='left center'
                            />
                        </div>      
                    </td>
                </tr>
                <tr className="">
                    <td colSpan={`${this.state.col_span + 1}`} className={`${this.state.toggle? '':'py-0'}`}>
                        <Collapse isOpen={this.state.toggle} >
                            <div className="float-right">
                                <Link onClick={this.toggle_row} to="#" className="btn btn-sm btn-outline bg-teal-400 text-teal-400">
                                    <i className="icon-cross3 icon-2x"></i>
                                </Link>
                            </div>
                            {
                                this.render_hidden_elements()
                            }
                        </Collapse>
                        <NewAppointmentModal 
                            visibility={this.state.update_appointment_modal_visibility}
                            close={ this.close_update_appointment_modal }
                            call_back={this.call_back_update_appointment_modal}
                            state={'update'}
                            payload={{
                                visit_id: this.state.row_data.visit_id,
                                patient_ref: this.state.row_data.patient,
                                doctor_ref: this.state.row_data.doctor,
                                reason: this.state.row_data['description'],
                                date: this.state.row_data.date,
                                time: this.state.row_data.time
                            }} />
                    </td>
                
                </tr>
                {/* update appointment modal */}
                
            </Fragment>
        )
    }
}
export default TodaysPatientRow