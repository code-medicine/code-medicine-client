import React, { Component } from 'react';
import Modal from 'react-bootstrap4-modal';
import Inputfield from '../../../../components/inputfield';
import { connect } from 'react-redux';
import { update_appointment, load_todays_appointments, clear_todays_appointments } from '../../../../redux/actions';
import Axios from 'axios';
import { UPDATE_APPOINTMENT_CHARGES, CHECKOUT_APPOINTMENT, GET_APPOINTMENT_CHARGES, APPOINTMENTS_SEARCH_BY_ID } from '../../../../services/rest_end_points';
import ReactToPrint from 'react-to-print';
import LOGO from '../../../../resources/images/LOGO.png';
import { get_utc_date, Ucfirst } from '../../../../utils/functions';
import moment from 'moment';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { AppointmentCharges, AppointmentCheckout, AppointmentSearchById, AppointmentUpdateCharges } from '../../../../services/queries';
import notify from 'notify'

class ConsultancyModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            consultancy_fee_text_input: { value: "1500", error: false },
            discount_text_input: { value: "", error: false },
            follow_up_text_input: { value: "", error: false },
            paid_text_input: { value: "", error: false },

            total: 0,
            balance: 0,
            procedure_charges: 0,

            loading: false,

            data: null
        }
    }

    componentWillReceiveProps(new_props) {
        if (new_props.visibility && new_props.appointment_id !== null) {
            this.setState({ loading: true });
            AppointmentCharges(new_props.appointment_id)
                .then(res => {
                    this.setState({
                        consultancy_fee_text_input: { value: res.data.payload.consultancy === 0 ? "" : res.data.payload.consultancy.toString(), error: false },
                        discount_text_input: { value: res.data.payload.discount === 0 ? "" : res.data.payload.discount.toString(), error: false },
                        follow_up_text_input: { value: res.data.payload.follow_up === 0 ? "" : res.data.payload.follow_up.toString(), error: false },
                        paid_text_input: { value: res.data.payload.paid === 0 ? "" : res.data.payload.paid.toString(), error: false },
                        procedure_charges: res.data.payload.procedures,
                    }, () => {
                        this.handle_total_values()
                        AppointmentSearchById(this.props.appointment_id)
                            .then(res => this.setState({ data: res.data.payload, loading: false }))
                            .catch(err => this.setState({ loading: false }))
                    })
                }).catch(err => {
                    notify('error', '', err.toString())
                })
        }
        else if (new_props.visibility && new_props.appointment_id === null) {
            // notify('error', '', "Something went wrong! Please try again later")
        }
        else {
            this.setState({
                consultancy_fee_text_input: { value: "", error: false },
                discount_text_input: { value: "", error: false },
                follow_up_text_input: { value: "", error: false },
                paid_text_input: { value: "", error: false }
            })
        }
    }

    handle_total_values = () => {
        this.setState({
            total: parseInt(this.state.consultancy_fee_text_input.value === "" ? 0 : this.state.consultancy_fee_text_input.value) +
                parseInt(this.state.follow_up_text_input.value === "" ? 0 : this.state.follow_up_text_input.value) -
                parseInt(this.state.discount_text_input.value === "" ? 0 : this.state.discount_text_input.value),
        }, () => {
            if (this.state.paid_text_input.value !== "") {
                this.setState({
                    balance: this.state.total - parseInt(this.state.paid_text_input.value)
                })
            }
            else {
                this.setState({ balance: 0 })
            }
        })
    }


    on_text_change = (e) => {
        this.setState({ [e.target.id]: { value: e.target.value, error: false } }, () => this.handle_total_values())
    }

    handle_save_button_click = (e) => {
        e.preventDefault()
        this.setState({ loading: true });
        const payload = {
            appointment_id: this.props.appointment_id,
            consultancy: parseInt(this.state.consultancy_fee_text_input.value === "" ? 0 : this.state.consultancy_fee_text_input.value),
            discount: parseInt(this.state.discount_text_input.value === "" ? 0 : this.state.discount_text_input.value),
            follow_up: parseInt(this.state.follow_up_text_input.value === "" ? 0 : this.state.follow_up_text_input.value),
            paid: parseInt(this.state.paid_text_input.value === "" ? 0 : this.state.paid_text_input.value),
        }
        AppointmentUpdateCharges(payload)
            .then(res => {
                notify('success', '', res.data.message)
                this.setState({ loading: false }, () => {
                    setTimeout(() => this.props.toggle_modal(), 1000);
                });
            })
            .catch(err => {
                notify('error', '', 'Changes could not be saved! ' + err.toString())
                this.setState({ loading: false });
            })
    }

    handle_checkout_button_click = () => {
        const paid = parseInt(this.state.paid_text_input.value === "" ? 0 : this.state.paid_text_input.value)
        if (paid < this.state.minimum_payable) {
            notify('error', '', 'Payment is less that minimum payable amount.')
        }
        else {
            const that = this;
            AppointmentCheckout(this.props.appointment_id).then(res => {
                notify('info', '', res.data.message)
                this.props.clear_todays_appointments();
                this.props.load_todays_appointments(localStorage.getItem('Gh65$p3a008#2C'));
                // setTimeout(() => {
                //     this.props.toggle_modal();
                // }, 1000)
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
    }

    render() {
        return (
            <Modal visible={this.props.visibility} onClickBackdrop={this.props.toggle_modal}>
                <div className={`modal-header bg-teal-400`}>
                    <h5>Payment</h5>
                    <ReactToPrint
                        trigger={() => <button
                            type="button"
                            className="btn bg-secondary btn-labeled btn-labeled-right btn-sm pr-5"
                            style={{ textTransform: "inherit" }}
                            disabled={this.state.loading}
                        >
                            <b><i className="icon-printer2" /></b>Print</button>}
                        content={() => this.componentRef}
                        onBeforeGetContent={this.gather_invoice_data}
                    />
                </div>
                <div className={`modal-body bg-light`}>
                    <div className={`row`}>
                        <div className={`col-lg-6 col-md-6`}>
                            <Inputfield
                                id="consultancy_fee_text_input"
                                heading="Consultancy Fee"
                                icon_class="icon-cash3"
                                placeholder="Fee"
                                disabled={false}
                                value={this.state.consultancy_fee_text_input.value}
                                error={this.state.consultancy_fee_text_input.error}
                                onChange={this.on_text_change}
                                className="form-control-sm"
                                parent_classes="mb-1"
                                type="number"
                                loading={this.state.loading}
                            />
                            <Inputfield
                                id="discount_text_input"
                                heading="Discount over total"
                                placeholder="Discount"
                                value={this.state.discount_text_input.value}
                                error={this.state.discount_text_input.error}
                                onChange={this.on_text_change}
                                className="form-control-sm"
                                parent_classes="mb-1"
                                type="number"
                                loading={this.state.loading}
                            />
                            <Inputfield
                                id="follow_up_text_input"
                                heading="Follow ups Fee"
                                placeholder="Follow ups Fee"
                                custom_classes=""
                                disabled={false}
                                value={this.state.follow_up_text_input.value}
                                error={this.state.follow_up_text_input.error}
                                onChange={this.on_text_change}
                                className="form-control-sm"
                                parent_classes="mb-1"
                                type="number"
                                loading={this.state.loading}
                            />
                            <hr className={`mb-0`} />
                            <Inputfield
                                id="paid_text_input"
                                heading="Paid Amount"
                                placeholder="Fee paid"
                                disabled={false}
                                value={this.state.paid_text_input.value}
                                error={this.state.paid_text_input.error}
                                onChange={this.on_text_change}
                                className="form-control-sm"
                                parent_classes="mb-1"
                                type="number"
                                loading={this.state.loading}
                            />
                        </div>
                        <div className={`col-lg-6 col-md-6`}>
                            {
                                this.state.loading ?
                                    <SkeletonTheme color="#ffffff" highlightColor="#f2f2f2">
                                        <Skeleton className="my-1" count={1} height={15} width={80} />
                                        <div className={`row`}>
                                            <div className={`col-6`}>
                                                <Skeleton className="my-2" count={5} height={30} />
                                            </div>
                                            <div className={`col-6`}>
                                                <Skeleton className="my-2" count={5} height={30} />
                                            </div>
                                        </div>
                                    </SkeletonTheme> :
                                    (
                                        <div className={`table-responsive px-1`}>
                                            <table className={`table table-sm table-bordered table-hover mb-0`}>
                                                <thead>
                                                    <tr>
                                                        <th className={`border-0`}>Appointment charges</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>Consultancy</td>
                                                        <td>{this.state.consultancy_fee_text_input.value}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Follow up</td>
                                                        <td>{this.state.follow_up_text_input.value}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Discount</td>
                                                        <td>{this.state.discount_text_input.value}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className={`font-weight-bold`}>Total</td>
                                                        <td className={`font-weight-bold`}>{this.state.total}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Balance</td>
                                                        <td>{this.state.balance}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            {/* <div className={`text-center`}>
                                    Charges for procedures are <span className={`font-weight-bold`}>Rs. {this.state.procedure_charges}</span>
                                </div> */}
                                        </div>)}
                        </div>
                    </div>
                    <hr />
                    <div className={`d-none`}>
                        <div className={`row px-3 py-5`} ref={el => (this.componentRef = el)}>

                            <div className={`col-12 row`}>

                                <div className={`col-6`}>
                                    <img src={LOGO} className="img-fluid" alt="logo" />
                                </div>
                                <div className={`col-6`}>
                                    {
                                        this.state.data ? <div className="table-responsive card">
                                            <table className="table table-hover mb-0">
                                                <tbody>
                                                    <tr>
                                                        <td className="py-1 font-weight-bold">MRN#</td>
                                                        <td className="py-1">{this.state.data.patient.mrn}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-1 font-weight-bold">Patient</td>
                                                        <td className="py-1">{`${Ucfirst(this.state.data.patient.first_name)} ${Ucfirst(this.state.data.patient.last_name)}`}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-1 font-weight-bold">Contact</td>
                                                        <td className="py-1">{`${this.state.data.patient.phone_number}`}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-1 font-weight-bold">Doctor</td>
                                                        <td className="py-1">{`${Ucfirst(this.state.data.doctor.first_name)} ${Ucfirst(this.state.data.doctor.last_name)}`}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-1 font-weight-bold">Date</td>
                                                        <td className="py-1">{`${moment(get_utc_date(this.state.data.appointment_date), "YYYY-MM-DDThh:mm:ss").format('LLLL')}`}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div> : <span>Cannot fetch user data</span>
                                    }
                                </div>
                            </div>
                            <div className={`table-responsive px-1 row col-12 mt-2`}>
                                <h2 className={`font-weight-bold`}>Charges</h2>
                                <table className={`table table-sm table-bordered table-hover mb-0`}>
                                    <tbody>
                                        <tr>
                                            <td>Consultancy</td>
                                            <td>{this.state.consultancy_fee_text_input.value}</td>
                                        </tr>
                                        <tr>
                                            <td>Follow up</td>
                                            <td>{this.state.follow_up_text_input.value}</td>
                                        </tr>
                                        <tr>
                                            <td>Discount</td>
                                            <td>{this.state.discount_text_input.value}</td>
                                        </tr>
                                        <tr>
                                            <td className={`font-weight-bold`}>Total</td>
                                            <td className={`font-weight-bold`}>{this.state.total}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <h2 className={`font-weight-bold mt-2`}>Payment</h2>
                                <table className={`table table-sm table-bordered table-hover mb-0 mt-2`}>
                                    <tbody>

                                        <tr>
                                            <td>Paid</td>
                                            <td>{this.state.paid_text_input.value}</td>
                                        </tr>
                                        <tr>
                                            <td>Balance</td>
                                            <td>{this.state.balance}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <span className={`text-muted`}>- Invoice date-time {moment(new Date()).format('LLL')}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`modal-footer`}>
                    <button
                        // disabled={this.state.procedures_list.length === 0}
                        type="button"
                        className="btn bg-dark btn-labeled btn-labeled-right pr-5"
                        style={{ textTransform: "inherit" }}
                        onClick={this.handle_save_button_click}
                        disabled={this.state.loading}
                    >
                        <b><i className="icon-floppy-disk" /></b>
                        Save
                    </button>
                    <button
                        type="button"
                        className="btn bg-danger btn-labeled btn-labeled-right pr-5"
                        style={{ textTransform: "inherit" }}
                        onClick={this.props.toggle_modal}
                    >
                        <b><i className="icon-cross" /></b>
                        Cancel
                    </button>

                    {/* <button
                        // disabled={this.state.procedures_list.length === 0}
                        type="button"
                        className="btn bg-teal-400 btn-labeled btn-labeled-right pr-5"
                        style={{ textTransform: "inherit" }}
                        onClick={this.handle_checkout_button_click}
                    >
                        <b><i className="icon-checkmark2" /></b>
                        Checkout
                    </button> */}
                </div>
            </Modal>
        )
    }
}
export default connect(null, { notify, update_appointment, load_todays_appointments, clear_todays_appointments })(ConsultancyModal);