import React, { Component } from 'react';
import ProcedureItem from './procedure_item';
import Modal from "react-bootstrap4-modal";
import Inputfield from '../../../../shared/customs/inputfield/inputfield';
import { connect } from 'react-redux';
import { notify, update_appointment, load_todays_appointments, clear_todays_appointments } from '../../../../actions';
import Axios from 'axios';
import { UPDATE_APPOINTMENT_CHARGES, GET_APPOINTMENT_CHARGES, CHECKOUT_APPOINTMENT } from '../../../../shared/rest_end_points';
import Loading from '../../../../shared/customs/loading/loading';


class ProcedureModal extends Component {


    constructor(props) {
        super(props)
        this.state = {
            consultancy_fee_text_input: { value: "1500", error: false },
            discount_text_input: { value: "", error: false },
            follow_up_text_input: { value: "", error: false },
            paid_text_input: { value: "", error: false },
            total: 0,
            discount: 0,
            minimum_payable: 0,
            procedures_list: [],
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
        console.log('willReceiveProps', new_props)
        if (new_props.new_procedure_visibility) {
            if (new_props.prev_procedure_list.length > 0) {
                const prev_list = new_props.prev_procedure_list
                const temp = [];
                for (let i = 0; i < prev_list.length; ++i) {
                    temp.push({
                        id: new_props.prev_procedure_list[i]._id,
                        procedure_fee: new_props.prev_procedure_list[i].fee,
                        procedure_discount: new_props.prev_procedure_list[i].discount,
                        procedure_description: new_props.prev_procedure_list[i].description,
                        type: 'previous'
                    })
                    if (i === prev_list.length - 1) {
                        this.setState({ procedures_list: temp, loading_status: false }, () => this.handle_total_values())
                    }
                }
            }
            if (new_props.appointment_id) {
                Axios.get(`${GET_APPOINTMENT_CHARGES}?tag=${new_props.appointment_id}`).then(res => {
                    this.setState({
                        consultancy_fee_text_input: { value: res.data.payload.consultancy === 0 ? "" : res.data.payload.consultancy.toString(), error: false },
                        discount_text_input: { value: res.data.payload.discount === 0 ? "" : res.data.payload.discount.toString(), error: false },
                        follow_up_text_input: { value: res.data.payload.follow_up === 0 ? "" : res.data.payload.follow_up.toString(), error: false },
                        paid_text_input: { value: res.data.payload.paid === 0 ? "" : res.data.payload.paid.toString(), error: false }
                    }, () => {
                        this.handle_total_values()
                    })
                }).catch(err => {
                    this.props.notify('error', '', err.toString())
                })
            }

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
            consultancy_fee_text_input: { value: "1500", error: false },
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
            consultancy: parseInt(this.state.consultancy_fee_text_input.value),
            discount: parseInt(this.state.discount_text_input.value),
            follow_up: parseInt(this.state.follow_up_text_input.value),
            paid: parseInt(this.state.paid_text_input.value),
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

    render() {
        // this.handle_total_values();
        return (
            <Modal
                visible={this.props.new_procedure_visibility}
                onClickBackdrop={this.props.procedure_backDrop}
                fade={true}
                dialogClassName={`modal-dialog modal-lg `}
            >
                <div className="modal-header d-flex flex-lg-row flex-column bg-teal-400">
                    <h5 className="modal-title">Appointment details</h5>
                    <div className="">
                        <button
                            type="button"
                            className="btn bg-secondary btn-sm btn-labeled btn-labeled-right pr-5 mr-1"
                            style={{ textTransform: "inherit" }}
                            // onClick={this.add_procedure_click}
                            disabled
                        >
                            <b>
                                <i className="icon-plus3" />
                            </b>
                            Add FollowUp with appointments
                        </button>
                        <button
                            type="button"
                            className="btn bg-dark btn-sm btn-labeled btn-labeled-right pr-5"
                            style={{ textTransform: "inherit" }}
                            onClick={this.add_procedure_click}
                        >
                            <b>
                                <i className="icon-plus3" />
                            </b>
                            Add Procedures
                        </button>
                    </div>
                </div>
                <div className="modal-body pt-1" style={{ height: '65vh', overflowY: 'auto', overflowX: 'hidden' }}>
                    <div className="row" >
                        <div className="col-lg-3 col-6 px-3">
                            <Inputfield
                                id="consultancy_fee_text_input"
                                label_tag="Consultancy Fee"
                                icon_class="icon-cash3"
                                placeholder="Fee"
                                disabled={false}
                                default_value={this.state.consultancy_fee_text_input.value}
                                error={this.state.consultancy_fee_text_input.error}
                                on_text_change_listener={this.handle_change}
                                size="form-control-sm"
                            />
                        </div>
                        <div className="col-lg-3 col-6 px-3">
                            <Inputfield
                                id="discount_text_input"
                                label_tag="Discount over total"
                                icon_class="icon-arrow-down132"
                                placeholder="Discount"
                                default_value={this.state.discount_text_input.value}
                                error={this.state.discount_text_input.error}
                                on_text_change_listener={this.handle_change}
                                size="form-control-sm"
                            />
                        </div>
                        <div className="col-lg-3 col-6 px-3 border-right">
                            <Inputfield
                                id="follow_up_text_input"
                                label_tag="Follow ups Fee"
                                icon_class="icon-loop"
                                placeholder="Follow ups Fee"
                                custom_classes=""
                                disabled={false}
                                default_value={this.state.follow_up_text_input.value}
                                error={this.state.follow_up_text_input.error}
                                on_text_change_listener={this.handle_change}
                                size="form-control-sm"
                            />
                        </div>
                        <div className="col-lg-3 col-6 px-3 ">
                            <Inputfield
                                id="paid_text_input"
                                label_tag="Paid"
                                icon_class="icon-cash3"
                                placeholder="Fee paid"
                                custom_classes=""
                                disabled={false}
                                default_value={this.state.paid_text_input.value}
                                error={this.state.paid_text_input.error}
                                on_text_change_listener={this.handle_change}
                                size="form-control-sm"
                            />
                        </div>
                    </div>
                    <hr className="mt-1 mb-1" />

                    {
                        this.state.loading_status ? <div className={`d-flex justify-content-center`}><Loading size={150} /></div> :
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
                    }


                    <div style={{ float: "left", clear: "both" }}
                        ref={(el) => { this.last_element = el; }}>
                    </div>
                </div>
                <div className="modal-footer d-flex flex-lg-row flex-column border border-top pt-3">
                    <div className="mr-auto">
                        <span className="badge badge-light badge-striped badge-striped-left border-left-teal-400" >
                            <span className="h6 font-weight-bold mr-1">Total: {this.state.total}</span>
                        </span>
                        <span className="ml-2 badge badge-light badge-striped badge-striped-left border-left-teal-400">
                            <span className="h6 font-weight-bold mr-1">Discount: {this.state.discount}</span>
                        </span>
                        <span className="ml-2 badge badge-light badge-striped badge-striped-left border-left-teal-400">
                            <span className="h6 font-weight-bold mr-1">Paid: {this.state.paid_text_input.value.length > 0 ? this.state.paid_text_input.value : 0}</span>
                        </span>
                        <span className="ml-2 badge badge-light badge-striped badge-striped-left border-left-teal-400">
                            <span className="h6 font-weight-bold mr-1">Bal: {this.calculate_balance()}</span>
                        </span>
                        <span className="ml-2 badge badge-light badge-striped badge-striped-left border-left-teal-400">
                            <span className="h6 font-weight-bold mr-1">Due: {this.state.minimum_payable}</span>
                        </span>
                    </div>
                    <button
                        type="button"
                        className="btn bg-danger btn-labeled btn-labeled-right pr-5 mt-1"
                        style={{ textTransform: "inherit" }}
                        onClick={this.handle_close_modal}
                    >
                        <b><i className="icon-cross" /></b>
                        Cancel
                    </button>
                    <button
                        // disabled={this.state.procedures_list.length === 0}
                        type="button"
                        className="btn bg-dark btn-labeled btn-labeled-right pr-5 mt-1"
                        style={{ textTransform: "inherit" }}
                        onClick={this.handle_save_button_click}
                    >
                        <b><i className="icon-floppy-disk" /></b>
                        Save
                    </button>
                    <button
                        // disabled={this.state.procedures_list.length === 0}
                        type="button"
                        className="btn bg-teal-400 btn-labeled btn-labeled-right pr-5 mt-1"
                        style={{ textTransform: "inherit" }}
                        onClick={this.handle_checkout_button_click}
                    >
                        <b><i className="icon-checkmark2" /></b>
                        Checkout
                    </button>
                </div>

            </Modal>
        )
    }
}
export default connect(null, { notify, update_appointment, load_todays_appointments, clear_todays_appointments })(ProcedureModal);