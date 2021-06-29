import React, { Component, Fragment } from 'react';
import ProcedureItem from './procedure_item';
import Modal from "react-bootstrap4-modal";
import { connect } from 'react-redux';
import { update_appointment, load_todays_appointments, clear_todays_appointments } from '../../../../redux/actions';
import ReactToPrint from 'react-to-print';
import LOGO from '../../../../resources/images/LOGO.png';
import { get_utc_date, Ucfirst } from '../../../../utils/functions';
import moment from 'moment';
import Inputfield from '../../../../components/inputfield';
import ProcedureLoading from './procedure_loading';
import { AppointmentCharges, AppointmentCheckout, AppointmentSearchById, AppointmentUpdateCharges, ProcedureCreate, ProcedureSearchByAppointmentId, ProcedureUpdate } from '../../../../services/queries';
import _ from 'lodash';
import notify from 'notify'

class ProcedureModal extends Component {


    constructor(props) {
        super(props)
        this.state = {
            consultancy_fee_text_input: { value: "", error: false },
            discount_text_input: { value: "", error: false },
            follow_up_text_input: { value: "", error: false },
            paid_text_input: { value: "", error: false },
            paid_amount_copy: 0,
            total: 0,
            discount: 0,
            minimum_payable: 0,
            procedures_list: [],
            procedures_list_copy: [],
            user_data: null,
            loading_status: true,
            edited_items: [],

        }
    }

    componentDidMount() {
        // this.add_procedure({
        //     procedure_fee: 0,
        //     procedure_discount: 0,
        //     procedure_description: '',
        //     type: 'new'
        // })s
        this.handle_total_values();
    }



    save_procedure = (key, data) => {
        const temp = this.state.procedures_list;
        temp[key].type = 'previous';
        temp[key].procedure_fee = data.fee;
        temp[key].procedure_discount = data.discount;
        temp[key].procedure_dr_share = data.dr_share;
        temp[key].procedure_description = data.description;
        temp[key].id = data.id
        this.setState({ procedures_list: temp }, () => this.handle_total_values());
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

    // add_procedure_click = () => {
    //     if ((this.state.procedures_list.filter((data) => { return data.type === 'new' })).length === 0) {
    //         this.add_procedure({
    //             id: null,//Math.max.apply(Math, this.state.procedures_list.map(function(obj) { return obj.id })),
    //             procedure_fee: 0,
    //             procedure_discount: 0,
    //             procedure_dr_share: 0,
    //             procedure_description: '',
    //             type: 'new',
    //         })

    //     }
    //     else {
    //         notify('info', '', 'There is an unsaved procedure. Please save it first')
    //     }
    // }

    mount = (appointment_id) => {
        ProcedureSearchByAppointmentId(appointment_id)
            .then(res => {
                this.setState({ procedures_list: res.data.payload, procedures_list_copy: _.cloneDeep(res.data.payload) });

                AppointmentCharges(appointment_id)
                    .then(res => {
                        const amount = res.data.payload.paid_for_procedures === 0 ?
                            "" :
                            res.data.payload.paid_for_procedures.toString();
                        this.setState({
                            loading_status: false,
                            paid_text_input: { value: amount, error: false },
                            paid_amount_copy: amount
                        }, () => this.handle_total_values())
                        /**
                         * Fetch appointment by id, we need patient data here
                         */
                        AppointmentSearchById(appointment_id)
                            .then(res => this.setState({ user_data: res.data.payload, loading_status: false }))
                            .catch(err => {
                                notify('error', '', err.toString())
                                this.setState({ loading_status: false })
                            })
                    }).catch(err => {
                        notify('error', '', err.toString())
                        this.setState({ loading_status: false })
                    })
            })
            .catch(err => {
                this.setState({ procedures_list: [], loading_status: false })
                if (err.response) {
                    if (err.response.status === 401) {
                        notify('error', '', 'Session timeout! Please Signin again');
                    }
                    else {
                        notify('error', '', 'Server is not responding! Please try again later');
                    }
                }
            })
    }

    componentWillReceiveProps(new_props) {
        if (new_props.visibility && new_props.appointment_id !== null) {
            this.mount(new_props.appointment_id);
        }
        else if (new_props.visibility && new_props.appointment_id === null) {
            notify('error', '', 'Something went wrong! Please try again later');
        }

    }

    handle_change = (e) => {
        const that = this;
        this.setState({ [e.target.id]: { value: e.target.value, error: false } }, () => {
            that.handle_total_values()
        })
    }

    // handle_total_values = () => {
    //     let procedure_total = 0;
    //     let procedure_discount = 0;
    //     for (let i = 0; i < this.state.procedures_list.length; ++i) {
    //         procedure_total += this.state.procedures_list[i].procedure_fee;
    //         procedure_discount += this.state.procedures_list[i].procedure_discount;
    //     }

    //     const t_total = this.state.consultancy_fee_text_input.value.length > 0 ?
    //         parseInt(this.state.consultancy_fee_text_input.value) : 0;
    //     const t_discount = this.state.discount_text_input.value.length > 0 ?
    //         parseFloat(this.state.discount_text_input.value) : 0;
    //     const t_followup = this.state.follow_up_text_input.value.length > 0 ?
    //         parseFloat(this.state.follow_up_text_input.value) : 0;

    //     this.setState({
    //         total: ((t_total + t_followup) - t_discount) + (procedure_total - procedure_discount),
    //         minimum_payable: (t_total - t_discount) + (procedure_total - procedure_discount),
    //         discount: t_discount + procedure_discount
    //     })
    // }

    show_procedures = () => {
        return this.state.procedures_list.map((item, index) => {
            console.log('item', item);
            return <ProcedureItem
                key={index}
                appointment_id={this.props.appointment_id}
                data={item}
                index={index}
                save_opp={this.save_procedure}
                delete_opp={this.delete_procedure} />
        })
    }

    handle_close_modal = () => {
        for (let i = 0; i < this.state.procedures_list.length; ++i) {
            if (this.state.procedures_list[i]._id === null) {
                notify('info', '', 'There are unsaved procedures. Either delete them or save them.')
                return;
            }
        }
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


    handle_checkout_button_click = () => {
        const paid = parseInt(this.state.paid_text_input.value === "" ? 0 : this.state.paid_text_input.value)
        if (paid < this.state.minimum_payable) {
            notify('error', '', 'Payment is less that minimum payable amount.')
            return;
        }
        else {
            const that = this;
            AppointmentCheckout(this.props.appointment_id).then(res => {
                notify('info', '', res.data.message)
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

    /**
     * ***********************************************************************************************************
     * 
     * ***********************************************************************************************************
     * 
     * ***********************************************************************************************************
     */

    on_text_change = (e) => {
        this.setState({ [e.target.id]: { value: e.target.value, error: false } })
    }

    on_item_text_change = (e, index) => {
        console.log('e', e.target.type, e.target.value)
        const prev_procedure_list = this.state.procedures_list;
        prev_procedure_list[index][e.target.id] = (e.target.type === 'number' ? 
                                                    (e.target.value === "" ? 0 : parseInt(e.target.value)) : 
                                                    e.target.value);
        this.setState({ procedures_list: prev_procedure_list }, () => {
            this.handle_total_values();
            this.compare_changes(index);
        });
    }

    on_item_delete_click = (e, index) => {
        if (this.state.procedures_list[index]._id && this.state.procedures_list[index]._id !== "") {
            // previous procedure delete
            const prev_procedure_list = this.state.procedures_list;
            prev_procedure_list[index]['is_deleted'] = !prev_procedure_list[index]['is_deleted'];
            
            this.setState({ 
                procedures_list: prev_procedure_list, 
                edited_items: prev_procedure_list[index]['is_deleted'] ? 
                    [...this.state.edited_items, index] : 
                    this.state.edited_items.filter(x => x !== index) 
                }, () => this.handle_total_values());

        }
        else {
            // new procedure delete
            const prev_procedure_list = this.state.procedures_list;
            prev_procedure_list.splice(index, 1);
            this.setState({ procedures_list: prev_procedure_list }, () => this.handle_total_values());
        }

    }

    handle_total_values = () => {
        let procedure_total = 0;
        let procedure_discount = 0;
        for (let i = 0; i < this.state.procedures_list.length; ++i) {
            if (!this.state.procedures_list[i].is_deleted && this.state.procedures_list[i].is_active) {
                procedure_total += this.state.procedures_list[i].fee;
                procedure_discount += this.state.procedures_list[i].discount;
            }
        }
        this.setState({
            total: procedure_total - procedure_discount,
            minimum_payable: procedure_total - procedure_discount,
            discount: procedure_discount
        })
    }

    compare_changes = (index) => {
        // check only the old ones
        if (index < this.state.procedures_list_copy.length) {
            let changes = false;
            if (this.state.procedures_list_copy[index].description !== this.state.procedures_list[index].description) changes = true;
            if (this.state.procedures_list_copy[index].fee !== this.state.procedures_list[index].fee) changes = true;
            if (this.state.procedures_list_copy[index].discount !== this.state.procedures_list[index].discount) changes = true;
            if (this.state.procedures_list_copy[index].dr_share !== this.state.procedures_list[index].dr_share) changes = true;
            if (this.state.procedures_list_copy[index].is_deleted !== this.state.procedures_list[index].is_deleted) changes = true;

            this.setState({
                edited_items: changes ?
                    (this.state.edited_items.indexOf(index) === -1 ?
                        [...this.state.edited_items, index] :
                        this.state.edited_items) :
                    (this.state.edited_items.length === 0 ? [] :
                        this.state.edited_items.filter(x => x !== index))
            });
        }
    }

    add_procedure(item) {
        this.setState({ procedures_list: [...this.state.procedures_list, item] }, () => {
            this.scrollToBottom()
        });
    };

    add_procedure_click = () => {
        const obj = {
            _id: null,
            description: "",
            fee: 0,
            discount: 0,
            dr_share: 0,
            is_deleted: false,
            is_active: true,
            doctor_id: "",
            appointment_id: this.props.appointment_id,
            time_stamp: {
                created: new Date(),
                operate: new Date(),
                report: new Date(),
                last_updated: new Date(),
            }
        }
        this.add_procedure(obj);
    }

    on_save_changes_click = async () => {

        let error = false;
        for (let i = 0; i < this.state.procedures_list.length; ++i) {
            if ((this.state.procedures_list[i].discount) > this.state.procedures_list[i].fee) {
                notify('error', '', `Discount cannot be more than the charges in procedure number ${i + 1}`);
                error = true;
            }
            else if (this.state.procedures_list[i].dr_share > 100) {
                notify('error', '', 'Doctor share cannot be more than 100%');
                error = true;
            }
        }
        if (error) {
            return;
        }
        this.setState({ loading_status: true });

        let procedures_to_create = this.state.procedures_list.filter(procedure => { return procedure._id === null });
        let procedures_to_update = this.state.procedures_list.filter(procedure => { return procedure._id !== null });

        procedures_to_update = procedures_to_update.filter((o, i) => this.state.edited_items.indexOf(i) > -1);

        if (procedures_to_create.length > 0) {
            await ProcedureCreate(procedures_to_create).then(res => {
                notify('success', '', res.data.message)
            }).catch(err => {
                if (err.response) {
                    if (err.response.status === 400) {
                        notify('error', '', err.response.data.message);
                    }
                    else {
                        notify('error', '', err.response.data.message);
                    }
                }
                else {
                    notify('error', '', err.toString());
                }
            });
        }
        if (procedures_to_update.length > 0) {
            await ProcedureUpdate(procedures_to_update).then(res => {
                notify('success', '', res.data.message)
                this.setState({ edited_items: [] });
            }).catch(err => {
                if (err.response) {
                    if (err.response.status === 400) {
                        notify('error', '', err.response.data.message);
                    }
                    else {
                        notify('error', '', err.response.data.message);
                    }
                }
                else {
                    notify('error', '', err.toString());
                }
            });
        }
        // this.setState({ loading_status: false });
        this.mount(this.props.appointment_id);
    }

    on_save_payment_click = () => {

        if (parseInt(this.state.paid_text_input.value) < this.state.total) {
            notify('info', '', 'Paid amount is insufficient');
            return;
        }

        const payload = {
            appointment_id: this.props.appointment_id,
            procedures: this.state.total,
            paid_for_procedures: parseInt(this.state.paid_text_input.value),
        }
        AppointmentUpdateCharges(payload).then(res => {
            notify('success', '', res.data.message);
        }).catch(err => {
            notify('error', '', 'Changes could not be saved! ' + err.toString());
        })
    }

    render() {
        console.log('edited items', this.state.edited_items)
        // this.handle_total_values();
        console.log('procedure modal', this.state.paid_amount_copy, parseInt(this.state.paid_text_input.value));

        const undo_button_classes = `btn btn-outline btn-sm bg-teal-400 btn-block text-teal-400`;
        // const update_button_classes = `btn btn-outline-dark btn-sm secondary btn-icon mx-1 ${this.state.save_click_loading ? 'p-0' : ''}`;
        const delete_button_classes = `btn btn-outline btn-sm bg-danger btn-block text-danger`;

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
                                            <table className="table table-bordered w-100">
                                                <thead>
                                                    <tr>
                                                        <th className={`border-0`} style={{ width: '50%' }}>Procedure reason</th>
                                                        <th className={`border-0`} style={{ width: '12%' }}>Charges</th>
                                                        <th className={`border-0`} style={{ width: '12%' }}>Discount</th>
                                                        <th className={`border-0`} style={{ width: '12%' }}>Dr. Share</th>
                                                        <th className={`border-0 text-center`} >Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        this.state.procedures_list.map((item, i) => {
                                                            return (
                                                                <Fragment >
                                                                    <tr>
                                                                        <td className={'p-0'} style={{ borderLeft: item._id? "":"2px solid #26a69a" }} colSpan="5">
                                                                            <div className={`d-flex flex-lg-row flex-md-column flex-column justify-content-lg-between`}>
                                                                                <label className={`text-muted mb-0`} style={{ fontSize: '8px' }}>Created: {moment(item.time_stamp.created).format("LLL")}</label>
                                                                                <label className={`text-muted mb-0`} style={{ fontSize: '8px' }}>Operate: {moment(item.time_stamp.operate).format("LLL")}</label>
                                                                                <label className={`text-muted mb-0`} style={{ fontSize: '8px' }}>Report: {moment(item.time_stamp.report).format("LLL")}</label>
                                                                                <label className={`text-muted mb-0`} style={{ fontSize: '8px' }}>Last updated: {moment(item.time_stamp.last_updated).format("LLL")}</label>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                    <tr >
                                                                        <td className={'p-0'} style={{ width: '50%', borderLeft: item._id? "":"2px solid #26a69a" }}>
                                                                            <input
                                                                                id="description"
                                                                                placeholder="Enter Reason"
                                                                                type={'text'}
                                                                                disabled={item.is_deleted || this.state.loading_status}
                                                                                className="form-control form-control-sm"
                                                                                style={{ border: 0 }}
                                                                                defaultValue={item.description}
                                                                                onChange={e => this.on_item_text_change(e, i)}
                                                                            />
                                                                        </td>
                                                                        <td className="p-0" style={{ width: '12%' }}>
                                                                            <input
                                                                                id="fee"
                                                                                placeholder="Charges"
                                                                                type={'number'}
                                                                                disabled={item.is_deleted || this.state.loading_status}
                                                                                className="form-control form-control-sm"
                                                                                style={{ border: 0 }}
                                                                                defaultValue={item.fee === 0 ? "" : item.fee}
                                                                                onChange={e => this.on_item_text_change(e, i)}
                                                                            />
                                                                        </td>
                                                                        <td className="p-0" style={{ width: '12%' }}>
                                                                            <input
                                                                                id="discount"
                                                                                placeholder="Discount"
                                                                                type="number"
                                                                                disabled={item.is_deleted || this.state.loading_status}
                                                                                className="form-control form-control-sm"
                                                                                style={{ border: 0 }}
                                                                                defaultValue={item.discount === 0 ? "" : item.discount}
                                                                                onChange={e => this.on_item_text_change(e, i)}
                                                                            />
                                                                        </td>
                                                                        <td className="p-0" style={{ width: '12%' }}>
                                                                            <input
                                                                                id="dr_share"
                                                                                placeholder="Dr Share %"
                                                                                type="number"
                                                                                disabled={item.is_deleted || this.state.loading_status}
                                                                                className="form-control form-control-sm"
                                                                                style={{ border: 0 }}
                                                                                defaultValue={item.dr_share === 0 ? "" : item.dr_share}
                                                                                onChange={e => this.on_item_text_change(e, i)}
                                                                            />
                                                                        </td>
                                                                        <td className="p-0" >
                                                                            {
                                                                                item.is_deleted ?
                                                                                    <button
                                                                                        disabled={this.state.loading_status}
                                                                                        className={undo_button_classes}
                                                                                        onClick={e => this.on_item_delete_click(e, i)}>
                                                                                        Undo
                                                                                </button> :
                                                                                    <button
                                                                                        disabled={this.state.loading_status}
                                                                                        className={delete_button_classes}
                                                                                        onClick={e => this.on_item_delete_click(e, i)}>
                                                                                        Delete
                                                                                </button>
                                                                            }
                                                                            {/* disabled={item.is_deleted || this.state.loading_status} */}

                                                                        </td>
                                                                    </tr>
                                                                </Fragment>
                                                            )
                                                        })
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
                            className="btn bg-dark btn-labeled btn-sm btn-labeled-right pr-5"
                            style={{ textTransform: "inherit" }}
                            disabled={
                                this.state.paid_text_input.value === "" ||
                                ((this.state.total > parseInt(this.state.paid_text_input.value)) ||
                                parseInt(this.state.paid_amount_copy) === parseInt(this.state.paid_text_input.value))
                            }
                            onClick={this.on_save_payment_click}>
                            <b><i className="icon-floppy-disk" /></b>
                            Save Payment
                        </button>
                        <button
                            type="button"
                            className="btn bg-dark btn-labeled btn-sm btn-labeled-right pr-5"
                            style={{ textTransform: "inherit" }}
                            disabled={
                                this.state.procedures_list.length === 0 ||
                                (this.state.procedures_list_copy.length === this.state.procedures_list.length &&
                                    this.state.edited_items.length === 0)
                            }
                            onClick={this.on_save_changes_click}>
                            <b><i className="icon-floppy-disk" /></b>
                            Save Changes
                        </button>
                        <button
                            type="button"
                            className="btn bg-danger btn-labeled btn-sm btn-labeled-right pr-5"
                            style={{ textTransform: "inherit" }}
                            onClick={this.handle_close_modal}>
                            <b><i className="icon-cross" /></b>
                            Cancel
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
                                                        {item.description}
                                                    </td>
                                                    <td className="py-1">
                                                        {item.discount}
                                                    </td>
                                                    <td className="py-1">
                                                        {item.fee}
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
                                        <td>{parseInt(this.state.paid_text_input.value) - this.state.total}</td>
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
export default connect(null, { update_appointment, load_todays_appointments, clear_todays_appointments })(ProcedureModal);