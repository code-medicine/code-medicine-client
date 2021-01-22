import React, { Component, Fragment } from 'react';
import ProcedureItem from './procedure_item';
import Modal from "react-bootstrap4-modal";
import { connect } from 'react-redux';
import { notify, update_appointment, load_todays_appointments, clear_todays_appointments } from '../../../../actions';
import Axios from 'axios';
import { UPDATE_APPOINTMENT_CHARGES, CHECKOUT_APPOINTMENT, PROCEDURES_SEARCH_BY_APPOINTMENT_ID, APPOINTMENTS_SEARCH_BY_ID, GET_APPOINTMENT_CHARGES } from '../../../../shared/rest_end_points';
import Loading from '../../../../shared/customs/loading/loading';
import ReactToPrint from 'react-to-print';
import LOGO from '../../../../resources/images/LOGO.png';
import { get_utc_date, Ucfirst } from '../../../../shared/functions';
import moment from 'moment';
import Inputfield from '../../../../shared/customs/inputfield/inputfield';
import ProcedureLoading from './procedure_loading';

class ProcedureModal extends Component {


    constructor(props) {
        super(props)
        this.state = {
            consultancy_fee_text_input: { value: "", error: false },
            discount_text_input: { value: "", error: false },
            follow_up_text_input: { value: "", error: false },
            paid_text_input: { value: "", error: false },
            total: 0,
            discount: 0,
            minimum_payable: 0,
            procedures_list: [],
            user_data: null,
            loading_status: true,
        }
    }

    componentDidMount() {
        // this.add_procedure({
        //     procedure_fee: 0,
        //     procedure_discount: 0,
        //     procedure_description: '',
        //     type: 'new'
        // })
        this.handle_total_values();
    }

    add_procedure(item) {
        const temp = this.state.procedures_list;
        temp.push(item)
        this.setState({ procedures_list: temp }, () => {
            this.scrollToBottom()
        });
    };

    save_procedure = (key, data) => {
        const temp = this.state.procedures_list;
        temp[key].type = 'previous';
        temp[key].procedure_fee = data.fee;
        temp[key].procedure_discount = data.discount;
        temp[key].procedure_description = data.description;
        temp[key].id = data.id
        this.setState({ procedures_list: temp }, () => {
            this.handle_total_values()
        })
    }

    delete_procedure = (key) => {
        const temp = this.state.procedures_list;
        if (key === -1)
            temp.pop();
        else {
            temp.splice(key, 1);
        }
        this.setState({ procedures_list: [] }, () => {
            this.setState({ procedures_list: temp }, () => this.handle_total_values())
        })
    }

    add_procedure_click = () => {
        if ((this.state.procedures_list.filter((data) => { return data.type === 'new' })).length === 0) {
            this.add_procedure({
                id: null,//Math.max.apply(Math, this.state.procedures_list.map(function(obj) { return obj.id })),
                procedure_fee: 0,
                procedure_discount: 0,
                procedure_description: '',
                type: 'new',
            })

        }
        else {
            this.props.notify('info', '', 'There is an unsaved procedure. Please save it first')
        }
    }

    componentWillReceiveProps(new_props) {
        if (new_props.visibility && new_props.appointment_id !== null) {
            Axios
                .get(`${PROCEDURES_SEARCH_BY_APPOINTMENT_ID}?tag=${new_props.appointment_id}`)
                .then(res => {
                    const temp = [];
                    const list = res.data.payload;
                    for (let i = 0; i < list.length; ++i) {
                        temp.push({
                            id: list[i]._id,
                            procedure_fee: list[i].fee,
                            procedure_discount: list[i].discount,
                            procedure_description: list[i].description,
                            type: 'previous'
                        })
                        if (i === list.length - 1) {
                            this.setState({ procedures_list: temp }, () => this.handle_total_values())
                        }
                    }
                    Axios
                        .get(`${GET_APPOINTMENT_CHARGES}?tag=${new_props.appointment_id}`)
                        .then(res => {
                            const amount = res.data.payload.paid_for_procedures === 0 ? "" : res.data.payload.paid_for_procedures.toString()
                            this.setState({ loading_status: false, paid_text_input: { value: amount, error: false }, }, () => this.handle_total_values())
                            /**
                             * Fetch appointment by id, we need patient data here
                             */
                            Axios
                            .get(`${APPOINTMENTS_SEARCH_BY_ID}?tag=${new_props.appointment_id}`)
                            .then(res => this.setState({ user_data: res.data.payload, loading_status: false }))
                            .catch(err => {
                                this.props.notify('error', '', err.toString())
                                this.setState({ loading_status: false })
                            })
                        }).catch(err => {
                            this.props.notify('error', '', err.toString())
                            this.setState({ loading_status: false })
                        })
                })
                .catch(err => {
                    this.setState({ procedures_list: [], loading_status: false })
                    if (err.response) {
                        if (err.response.status === 401) {
                            this.props.notify('error', '', 'Session timeout! Please Signin again');
                        }
                        else {
                            this.props.notify('error', '', 'Server is not responding! Please try again later');
                        }
                    }
                })

        }
        else if (new_props.visibility && new_props.appointment_id === null) {
            this.props.notify('error', '', 'Something went wrong! Please try again later');
        }

    }

    handle_change = (e) => {
        const that = this;
        this.setState({ [e.target.id]: { value: e.target.value, error: false } }, () => {
            that.handle_total_values()
        })
    }

    handle_total_values = () => {
        let procedure_total = 0;
        let procedure_discount = 0;
        for (let i = 0; i < this.state.procedures_list.length; ++i) {
            procedure_total += this.state.procedures_list[i].procedure_fee;
            procedure_discount += this.state.procedures_list[i].procedure_discount;
        }


        const t_total = this.state.consultancy_fee_text_input.value.length > 0 ?
            parseInt(this.state.consultancy_fee_text_input.value) : 0;
        const t_discount = this.state.discount_text_input.value.length > 0 ?
            parseFloat(this.state.discount_text_input.value) : 0;
        const t_followup = this.state.follow_up_text_input.value.length > 0 ?
            parseFloat(this.state.follow_up_text_input.value) : 0;

        this.setState({
            total: ((t_total + t_followup) - t_discount) + (procedure_total - procedure_discount),
            minimum_payable: (t_total - t_discount) + (procedure_total - procedure_discount),
            discount: t_discount + procedure_discount
        })
    }

    show_procedures = () => {
        return this.state.procedures_list.map((item, index) => {
            return <ProcedureItem
                key={index}
                appointment_id={this.props.appointment_id}
                data={item}
                index={index}
                save_opp={this.save_procedure}
                delete_opp={this.delete_procedure} />
        })
    }

    handle_close_modal = (type) => {
        this.setState({
            procedures_list: [],
            consultancy_fee_text_input: { value: "", error: false },
            discount_text_input: { value: "", error: false },
            follow_up_text_input: { value: "", error: false },
            paid_text_input: { value: "", error: false },
            total: 0,
            discount: 0
        })
        this.props.cancelProcedureModal()
    }

    handle_save_button_click = () => {
        for (let i = 0; i < this.state.procedures_list.length; ++i) {
            if (this.state.procedures_list[i].type === 'new') {
                this.props.notify('info', '', 'There is an unsaved procedure.')
                return;
            }
        }

        const payload = {
            appointment_id: this.props.appointment_id,
            paid_for_procedures: parseInt(this.state.paid_text_input.value),
        }
        Axios.put(UPDATE_APPOINTMENT_CHARGES, payload).then(res => {
            this.props.notify('success', '', res.data.message);
            // this.handle_close_modal()
        }).catch(err => {
            this.props.notify('error', '', 'Changes could not be saved!' + err.toString());
        })
        // this.handle_close_modal()
    }

    handle_checkout_button_click = () => {
        const paid = parseInt(this.state.paid_text_input.value === "" ? 0 : this.state.paid_text_input.value)
        if (paid < this.state.minimum_payable) {
            this.props.notify('error', '', 'Payment is less that minimum payable amount.')
            return;
        }
        else {
            const payload = {
                appointment_id: this.props.appointment_id
            }
            const that = this;
            Axios.post(CHECKOUT_APPOINTMENT, payload).then(res => {
                this.props.notify('info', '', res.data.message)
                // this.props.update_appointment(this.props.appointment_id)

                this.props.clear_todays_appointments();
                this.props.load_todays_appointments(localStorage.getItem('Gh65$p3a008#2C'));
                setTimeout(() => {
                    this.handle_close_modal();
                }, 1000)
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

    scrollToBottom = () => {
        this.last_element.scrollIntoView({ behavior: "smooth" });
    };

    calculate_balance = () => {
        if (this.state.paid_text_input.value.length > 0) {
            return -1 * (this.state.total - parseInt(this.state.paid_text_input.value))
        }
        else {
            return 0
        }
    }

    on_text_change = (e) => {
        this.setState({ [e.target.id]: { value: e.target.value, error: false } })
    }

    render() {
        // this.handle_total_values();
        return (
            <Fragment>
                <Modal
                    visible={this.props.visibility}
                    onClickBackdrop={this.props.procedure_backDrop}
                    fade={true}
                    dialogClassName={`modal-dialog modal-lg `}
                >
                    <div className="modal-header d-flex flex-lg-row flex-column bg-teal-400">
                        <h5 className="modal-title">Procedures</h5>
                        <div className="">
                            <button
                                type="button"
                                className="btn bg-dark btn-sm btn-labeled btn-labeled-right pr-5 mr-1"
                                style={{ textTransform: "inherit" }}
                                disabled={this.state.loading_status}
                                onClick={this.add_procedure_click}>
                                <b><i className="icon-plus3" /></b>
                                New Procedure
                            </button>
                            <ReactToPrint
                                trigger={() => <button
                                    type="button"
                                    className="btn bg-secondary btn-labeled btn-labeled-right btn-sm pr-5"
                                    style={{ textTransform: "inherit" }}
                                    disabled={this.state.loading_status}
                                >
                                    <b><i className="icon-printer2" /></b>Print</button>}
                                content={() => this.componentRef}
                            />
                        </div>
                    </div>
                    <div className="modal-body pt-1 bg-light" style={{ height: '60vh', overflowY: 'auto', overflowX: 'hidden' }}>
                        {
                            this.state.loading_status ? 
                                <ProcedureLoading /> :
                                (
                                    this.state.procedures_list.length === 0 ?
                                        <div className="alert alert-info mt-2" style={{ marginBottom: '0px' }}>
                                            <strong>Info!</strong> No Procedures found.
                                        </div> :
                                        <div className="table-responsive px-1">
                                            <table className="table table-bordered table-hover">
                                                <thead>
                                                    <tr>
                                                        <th className={`border-0`}>Procedure reason</th>
                                                        <th className={`border-0`}>Charges</th>
                                                        <th className={`border-0`}>Discount</th>
                                                        <th className={`border-0`}>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        this.show_procedures()
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                )
                        }


                        <div style={{ float: "left", clear: "both" }}
                            ref={(el) => { this.last_element = el; }}>
                        </div>
                    </div>
                    <div className="modal-footer d-flex flex-lg-row flex-column border border-top pt-3">
                        <div className="mr-auto d-flex">
                            <span className="badge badge-light badge-striped badge-striped-left border-left-teal-400" >
                                <span className="h6 font-weight-bold mr-1">Total: {this.state.total}</span>
                            </span>
                            <span className="ml-2 badge badge-light badge-striped badge-striped-left border-left-teal-400">
                                <span className="h6 font-weight-bold mr-1">Discount: {this.state.discount}</span>
                            </span>
                            <Inputfield
                                id="paid_text_input"
                                // heading="Amount Paid"
                                icon_class="icon-cash3"
                                placeholder="Amount paid"
                                disabled={this.state.loading_status}
                                value={this.state.paid_text_input.value}
                                error={this.state.paid_text_input.error}
                                onChange={this.on_text_change}
                                className="form-control-sm"
                                parent_classes="mb-1"
                                type="number"
                            />
                        </div>
                        <button
                            type="button"
                            className="btn bg-danger btn-labeled btn-sm btn-labeled-right pr-5"
                            style={{ textTransform: "inherit" }}
                            onClick={this.handle_close_modal}>
                            <b><i className="icon-cross" /></b>
                            Cancel
                        </button>
                        <button
                            disabled={this.state.procedures_list.length === 0}
                            type="button"
                            className="btn bg-dark btn-labeled btn-sm btn-labeled-right pr-5"
                            style={{ textTransform: "inherit" }}
                            onClick={this.handle_save_button_click}>
                            <b><i className="icon-floppy-disk" /></b>
                            Save
                        </button>
                        {/* <button
                        // disabled={this.state.procedures_list.length === 0}
                        type="button"
                        className="btn bg-teal-400 btn-labeled btn-labeled-right pr-5 mt-1"
                        style={{ textTransform: "inherit" }}
                        onClick={this.handle_checkout_button_click}
                    >
                        <b><i className="icon-checkmark2" /></b>
                        Checkout
                    </button> */}
                    </div>

                </Modal>
                <div className={`d-none`}>
                    <div className={`row px-3 py-5`} ref={el => (this.componentRef = el)}>

                        <div className={`col-12 row`}>

                            <div className={`col-6`}>
                                <img src={LOGO} className="img-fluid" alt="logo" />
                            </div>
                            <div className={`col-6`}>
                                {this.state.user_data ? <div className="table-responsive card">
                                    <table className="table table-hover mb-0">
                                        <tbody>
                                            <tr>
                                                <td className="py-1 font-weight-bold">MRN#</td>
                                                <td className="py-1">{this.state.user_data.patient.mrn}</td>
                                            </tr>
                                            <tr>
                                                <td className="py-1 font-weight-bold">Patient</td>
                                                <td className="py-1">{`${Ucfirst(this.state.user_data.patient.first_name)} ${Ucfirst(this.state.user_data.patient.last_name)}`}</td>
                                            </tr>
                                            <tr>
                                                <td className="py-1 font-weight-bold">Contact</td>
                                                <td className="py-1">{`${this.state.user_data.patient.phone_number}`}</td>
                                            </tr>
                                            <tr>
                                                <td className="py-1 font-weight-bold">Doctor</td>
                                                <td className="py-1">{`${Ucfirst(this.state.user_data.doctor.first_name)} ${Ucfirst(this.state.user_data.doctor.last_name)}`}</td>
                                            </tr>
                                            <tr>
                                                <td className="py-1 font-weight-bold">Date</td>
                                                <td className="py-1">{`${moment(get_utc_date(this.state.user_data.appointment_date), "YYYY-MM-DDThh:mm:ss").format('LLLL')}`}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div> : <span>Cannot fetch user data</span>
                                }
                            </div>
                        </div>
                        <div className={`table-responsive px-1 row col-12 mt-2`}>
                            <h2 className={`font-weight-bold`}>Procedures</h2>
                            <table className="table table-sm table-bordered table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th className="py-1">
                                            <b>Description</b>
                                        </th>
                                        <th className="py-1">
                                            <b>Discount</b>
                                        </th>
                                        <th className="py-1">
                                            <b>Charges</b>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.procedures_list ?
                                            this.state.procedures_list.map((item, i) => {
                                                return (<tr key={i} >
                                                    <td className="py-1">
                                                        {item.procedure_description}
                                                    </td>
                                                    <td className="py-1">
                                                        {item.procedure_discount}
                                                    </td>
                                                    <td className="py-1">
                                                        {item.procedure_fee}
                                                    </td>
                                                </tr>)

                                            }) : 'No procedure found'
                                    }
                                    <tr>
                                        <td className={`font-weight-bold`} colSpan="2">Total</td>
                                        <td className={`font-weight-bold`}>{this.state.total}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className={`d-flex justify-content-between mt-2`}>
                                <h2 className={`font-weight-bold`}>Payment</h2>
                                {/* <h2 className={`font-weight-bold`}>{this.state.total}</h2>                             */}
                            </div>
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
                            <div className={`d-flex justify-content-between`}>
                                <span className={`text-muted`}>- Invoice date-time {moment(new Date()).format('LLL')}</span>
                                {/* <span className={`text-muted`}>{this.state.user_data.appointment_id}</span> */}
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment >
        )
    }
}
export default connect(null, { notify, update_appointment, load_todays_appointments, clear_todays_appointments })(ProcedureModal);