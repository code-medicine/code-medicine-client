import React, { Component, Fragment } from 'react';
import { Collapse } from 'reactstrap'
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Popup } from "semantic-ui-react";
import UpdateAppointmentModal from './appointment/update_appointment_modal';
import { Ucfirst } from 'utils/functions'
import Loading from 'components/loading';
import './todays_patient_row.css'
import { connect } from 'react-redux';
import { load_todays_appointments, clear_todays_appointments } from 'redux/actions'
import { confirmAlert } from 'react-confirm-alert';
import { AppointmentCheckout, ProcedureSearchByAppointmentId } from 'services/queries';
import notify from 'notify'
import CreateProcedure from '../procedures/create-procedure';
// import '../../../../node_modules/semantic-ui-css/semantic.min.css';

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
            appointment_time_difference_from_now: moment(this.props.row_data.appointment_date, "YYYY-MM-DDThh:mm:ss").fromNow(),

            update_appointment_modal_visibility: false,
            procedure_modal_visibility: false,

            procedure_loading: false,
            procedures_list: []
        }
    }
    toggle_row = () => {
        if (this.state.toggle)
            this.setState({ toggle: false, procedure_loading: false, toggle_icon: 'icon-eye-plus' })
        else
            this.setState({ toggle: true, procedure_loading: true, toggle_icon: 'icon-eye-minus' }, () => {
                ProcedureSearchByAppointmentId(this.state.row_data._id)
                    .then(_procedures => {
                        this.setState({ procedures_list: _procedures.data.payload, procedure_loading: false })
                    })
            })
    }
    componentDidMount() {
        // console.log(this.props.row_data);
        // this.setState({row_data: this.props.data})
        this.setState({ col_span: this.props.columns })
        setInterval(() => {
            this.setState({ appointment_time_difference_from_now: moment(this.state.row_data.appointment_date, "YYYY-MM-DDThh:mm:ss").fromNow() })
        }, 60000)
    }

    view_user = (id) => {
        this.props.toggle_user_view_modal(id)
    }

    handle_checkout = () => {
        confirmAlert({
            title: "Checkout confirmation",
            message: 'Are you sure you want to checkout?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {

                        const that = this;
                        AppointmentCheckout(this.state.row_data._id)
                            .then(res => {
                                notify('info', '', res.data.message)
                                this.props.clear_todays_appointments();
                                this.props.load_todays_appointments(localStorage.getItem('Gh65$p3a008#2C'));
                            }).catch(err => {
                                if (err.response) {
                                    if (err.response.status === 400) {
                                        that.props.notify('error', '', err.response.data.message);
                                    }
                                    else {
                                        that.props.notify('error', '', err.response.data.message);
                                    }
                                }
                                else {
                                    that.props.notify('error', '', err.toString());
                                }
                            })
                    }
                },
                {
                    label: 'No',
                    onClick: () => console.log('Not checked out')
                }
            ]
        })
    }

    render_read_only_cols = () => {
        const options = {
            consultancy_charges: <Popup
                trigger={
                    <button className="btn btn-outline btn-sm bg-teal-400 border-teal-400 text-teal-400 secondary btn-icon m-1"
                        onClick={() => this.props.toggle_consultancy_modal(this.props.row_data._id)}>
                        <i className="icon-vcard"></i>
                    </button>}
                content={<div className="card card-body bg-teal-400 text-white shadow mr-1 mt-3 py-1">Payment</div>}
                flowing
                position='left center'
            />,
            procedures: <Popup
                trigger={
                    <button className="btn btn-outline btn-sm bg-teal-400 border-teal-400 text-teal-400 secondary btn-icon m-1"
                        onClick={() => this.setState({ procedure_modal_visibility: true }, () => console.log('state', this.state))}>
                            {/* this.props.toggle_procedure_modal(this.props.row_data._id)}> */}
                        <i className="icon-add-to-list"></i>
                    </button>}
                content={<div className="card card-body bg-teal-400 text-white shadow py-1">Procedures</div>}
                flowing
                position='top center'
            />,
            invoice: <Popup
                trigger={
                    <button className={`btn btn-outline btn-sm bg-teal-400 border-teal-400 text-teal-400 btn-icon m-1`}
                        onClick={() => this.props.toggle_invoice_modal(this.props.row_data._id)}>
                        <i className={`icon-file-text2`}></i>
                    </button>}
                content={<div className={`card card-body bg-teal-400 text-white shadow py-1`}>Details</div>}
                flowing
                // hoverable
                position='top center'
            />,
            edit: <Popup
                trigger={
                    <button className={`btn btn-outline btn-sm bg-teal-400 border-teal-400 text-teal-400 btn-icon m-1`}
                        onClick={() => this.setState({ update_appointment_modal_visibility: true })}    >
                        <i className={`icon-pencil3`}></i>
                    </button>}
                flowing
                // hoverable
                content={<div className={`card card-body bg-teal-400 text-white shadow py-1`}>Edit appointment</div>}
                position='top center'
            />,
            follow_ups: <Popup
                trigger={
                    <button className={`btn btn-outline btn-sm bg-teal-400 border-teal-400 text-teal-400 btn-icon m-1`}
                        onClick={() => alert('In progress')}    >
                        <i className={`icon-loop`}></i>
                    </button>}
                flowing
                // hoverable
                content={<div className={`card card-body bg-teal-400 text-white shadow py-1`}>Follow ups</div>}
                position='top center'
            />,
            details: <Popup
                trigger={
                    <button className={`btn btn-outline btn-sm bg-dark border-dark text-dark btn-icon m-1`}
                        onClick={this.toggle_row}>
                        <i className={this.state.toggle_icon}></i>
                    </button>}
                flowing
                // hoverable
                content={
                    <div className={`card card-body bg-dark text-white shadow ml-1 mt-3 py-1`}>
                        Show more details
                            </div>
                }
                position='right center'
            />,
            checkout: <Popup
                trigger={
                    <button className={`btn btn-outline btn-sm bg-teal-400 border-teal-400 text-teal-400 btn-icon m-1 float-right`}
                        onClick={() => this.handle_checkout()}>
                        <i className={'icon-exit'}></i>
                    </button>}
                flowing
                // hoverable
                content={
                    <div className={`card card-body bg-teal-400 text-white shadow py-1 mt-3 mr-2`}>
                        Checkout
                    </div>
                }
                position='left center'
            />
        }

        return (
            // <div>{this.state.row_data}</div>
            <div className={`container-fluid`} >
                {/* {this.props.reference} */}
                <div className={`row`}>
                    {/* Patient name and phone number */}
                    <div className={`col-lg-3 col-md-6 col-sm-6 mt-0 text-teal-400 border-left-2 border-left-teal-400 btn-block d-flex align-items-center justify-content-center text-center`}>
                        <div className={`btn btn-outline bg-teal-400 text-teal-400 btn-block jackInTheBox animated`}
                            style={{ verticalAlign: 'center' }}
                            onClick={() => this.view_user(this.state.row_data.patient['id'])}
                        >
                            <span className={`img-fluid rounded-circle text-white bg-teal-400 h3 p-2`} >
                                {this.state.row_data.patient['first_name'].charAt(0).toUpperCase() + this.state.row_data.patient['last_name'].charAt(0).toUpperCase()}
                            </span>
                            <h4 className="mt-2">{Ucfirst(this.state.row_data.patient['first_name']) + ' ' + Ucfirst(this.state.row_data.patient['last_name'])}</h4>
                            <span><i className="icon-phone-wave mr-1"></i> {this.state.row_data.patient['phone_number']}</span>
                        </div>
                    </div>
                    {/* Appointment Time column */}
                    <div className={`col-lg-2 col-md-6 col-sm-6 mt-0 text-teal-400 border-left-2 border-bottom-sm-2 border-left-teal-400 border-right-teal-400 border-right-2 btn-block d-flex align-items-center justify-content-center text-center`} >
                        <div className={` jackInTheBox animated`} >
                            <h1 className="mb-0">{moment(this.state.row_data.appointment_date, "YYYY-MM-DDThh:mm:ss").format('hh:mm a')}</h1>
                            <p>{this.state.appointment_time_difference_from_now}</p>
                        </div>
                    </div>
                    {/* appointment details */}
                    <div className={`col-lg-7 col-md-12 col-sm-12 mt-sm-2`}>
                        {/* Appointment date and time */}
                        <div className="row">
                            <div className="col-12 font-weight-bold h6">
                                Appointment with <Link className="text-teal-400 font-weight-bold ml-1" to={"#"}
                                    onClick={() => this.view_user(this.state.row_data.doctor['id'])}>
                                    {Ucfirst(this.state.row_data.doctor['first_name']) + ' ' + Ucfirst(this.state.row_data.doctor['last_name'])}
                                    <i className="icon-user-tie ml-1"></i>
                                </Link>
                                <span className="text-muted float-lg-right float-md-right float-left">
                                    {`${moment(this.state.row_data.appointment_date, "YYYY-MM-DDThh:mm:ss").format('LL')}`}
                                </span>
                            </div>
                        </div>
                        {/* Appointment Reason */}
                        <div className={`row`}>
                            <div className={`col-12 h6`}>
                                <span className="font-weight-bold">Comments</span>
                                <span className=" h6 text-muted">
                                    {` ${this.state.row_data.appointment_comments.length > 25 ? this.state.row_data.appointment_comments.substring(0, 25) + '...' : this.state.row_data.appointment_comments}`}
                                </span>
                                <span className={`badge badge-${this.state.row_data.appointment_status.info === 'checked out' ? 'primary' : 'danger'} float-right`}>
                                    {this.state.row_data.appointment_status.info}
                                </span>
                            </div>
                        </div>
                        {/* Appointment Actions */}
                        <div className="row">
                            <div className="col-12">
                                {!this.state.row_data.appointment_status.is_paid ?
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
                                    </Fragment>}

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
                <h5>Comments</h5>
                <blockquote className="blockquote blockquote-bordered py-2 pl-3 mb-0">
                    <p className="mb-1">
                        {this.state.hidden_data.appointment_comments}
                    </p>
                </blockquote>
                <h5 className="font-weight-semibold">Procedures</h5>
                <blockquote className="blockquote blockquote-bordered py-2 pl-3 mb-0">

                    {
                        this.state.procedure_loading ? <Loading size={100} /> : (
                            this.state.procedures_list.length > 0 ?
                                this.state.procedures_list.map((item, i) => {
                                    return (
                                        <div className="">
                                            <footer className="blockquote-footer text-dark">
                                                {item.description.toUpperCase()}
                                            </footer>
                                            {/* <span className="text-secondary procedureslist-secondary-text">{'item'}</span> */}
                                        </div>
                                    )
                                }) : <div className="alert alert-info mt-2" style={{ marginBottom: '0px' }}>
                                    <strong>Info!</strong> No Procedures found.
                                    </div>
                        )
                    }
                </blockquote>
            </div>
        )
    }
    render_hidden_header_elements = () => {
        return this.state.hidden_header_elements.map((str, i) => {
            return <Fragment key={i}>{str}</Fragment>
        })
    }

    close_update_appointment_modal = () => {
        this.setState({ update_appointment_modal_visibility: false })
    }

    open_update_appointment_modal = () => {
        this.setState({ update_appointment_modal_visibility: true })
    }

    call_back_update_appointment_modal = () => {

    }

    render() {
        return (
            <Fragment>
                <tr >
                    <td colSpan={this.state.col_span}>
                        {
                            this.render_read_only_cols()
                        }
                    </td>

                </tr>
                <tr className="">
                    <td colSpan={`${this.state.col_span + 1}`} className={`${this.state.toggle ? '' : 'py-0'}`}>
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
                        {/* <UpdateAppointmentModal
                            id={this.state.row_data._id}
                            visibility={this.state.update_appointment_modal_visibility}
                            close={this.close_update_appointment_modal}
                            call_back={this.call_back_update_appointment_modal}
                            state={'update'}
                            payload={{
                                visit_id: this.state.row_data._id,
                                patient_ref: this.state.row_data.patient,
                                doctor_ref: this.state.row_data.doctor,
                                reason: this.state.row_data['appointment_description'],
                                date: this.state.row_data.appointment_date,
                                time: this.state.row_data.appointment_time,
                                comments: this.state.row_data.appointment_comments,
                                referee: this.state.row_data.appointment_referee,
                            }} /> */}
                        {
                            this.state.procedure_modal_visibility &&
                            <CreateProcedure
                                visibility={this.state.procedure_modal_visibility}
                                handleClose={() => this.setState({ procedure_modal_visibility: false })}
                                appointment_id={this.state.row_data._id}
                            />
                        }

                    </td>

                </tr>
                {/* update appointment modal */}

            </Fragment>
        )
    }
}
export default connect(null, { notify, load_todays_appointments, clear_todays_appointments })(TodaysPatientRow)