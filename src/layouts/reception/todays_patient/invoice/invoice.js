import React, { Component } from 'react';
import Modal from "react-bootstrap4-modal";
import LOGO from '../../../../resources/images/LOGO.png';
import Axios from 'axios';
import { APPOINTMENTS_INVOICE } from '../../../../services/rest_end_points';
import Loading from '../../../../components/loading';
import ReactToPrint from 'react-to-print';
import { get_utc_date, Ucfirst } from '../../../../utils/functions';
import moment from 'moment'
import { AppointmentInvoice } from '../../../../services/queries';


class Invoice extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data: null,
            loading: true,
        }
    }

    componentWillReceiveProps(new_props, new_state) {
        if (new_props.visibility === true) {
            console.log('fetching data')
            AppointmentInvoice(new_props.appointment_id)
                .then(res => {
                    console.log('fetched', res.data)
                    this.setState({ data: res.data.payload, loading: false })
                })
        }
        else {
            this.setState({ data: null })
        }
    }

    get_total = () => {
        if (this.state.data !== null) {
            const procedures = parseInt(this.state.data.appointment_charges.procedures);
            const consultancy = parseInt(this.state.data.appointment_charges.consultancy);
            const follow_up = parseInt(this.state.data.appointment_charges.follow_up);
            const discount = parseInt(this.state.data.appointment_charges.discount);

            return procedures + consultancy + follow_up - discount;
        }
        return 0;
    }

    get_balance = () => {
        if (this.state.data !== null) {
            const total = this.get_total();
            const paid = parseInt(this.state.data.appointment_charges.paid);
            const paid_for_procedures = parseInt(this.state.data.appointment_charges.paid_for_procedures);

            return total - paid - paid_for_procedures;
        }
        return 0;
    }

    get_total_paid = () => {
        if (this.state.data !== null) {
            const paid = parseInt(this.state.data.appointment_charges.paid);
            const paid_for_procedures = parseInt(this.state.data.appointment_charges.paid_for_procedures);
            console.log('charges', this.state.data.appointment_charges)
            return paid + paid_for_procedures;
        }
        return 0;
    }

    componentWillUnmount() {
        this.setState({ data: null })
    }

    render() {
        const table_header = <div className="row">
            <div className="col-lg-6">
                <img src={LOGO} className="img-fluid" alt="logo" />
            </div>
            {this.state.data ?
                <div className="col-lg-6">

                    <div className="table-responsive card">
                        <table className="table table-hover mb-0">
                            <tbody>
                                <tr>
                                    <td className="py-1">
                                        <span className="font-weight-bold">MRN# </span>
                                    </td>
                                    <td className="py-1">
                                        <span className="">{this.state.data.patient.mrn}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-1">
                                        <span className="font-weight-bold">Patient </span>
                                    </td>
                                    <td className="py-1">
                                        <span className="">{`${Ucfirst(this.state.data.patient.first_name)} ${Ucfirst(this.state.data.patient.last_name)}`}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-1">
                                        <span className="font-weight-bold">Contact</span>
                                    </td>
                                    <td className="py-1">
                                        <span className="">{`${this.state.data.patient.phone_number}`}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-1">
                                        <span className="font-weight-bold">Doctor </span>
                                    </td>
                                    <td className="py-1">
                                        <span className="">{`${Ucfirst(this.state.data.doctor.first_name)} ${Ucfirst(this.state.data.doctor.last_name)}`}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-1">
                                        <span className="font-weight-bold">Date </span>
                                    </td>
                                    <td className="py-1">
                                        <span className="">{`${moment(get_utc_date(this.state.data.appointment_date), "YYYY-MM-DDThh:mm:ss").format('LLLL')}`}</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div> : <Loading size={150} />
            }
        </div>
        const procedures_table = this.state.data !== null && this.state.data.appointment_procedures.length > 0 ? <div className="table-responsive card">
            <table className="table table-hover mb-0">
                <thead>
                    <tr>
                        <th className="py-1">
                            <b>Description</b>
                        </th>
                        <th className="py-1">
                            <b>Charges</b>
                        </th>
                        <th className="py-1">
                            <b>Discount</b>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.state.data ?
                            this.state.data.appointment_procedures.map((item, i) => {
                                return (<tr key={i} >
                                    <td className="py-1">
                                        {item.description}
                                    </td>
                                    <td className="py-1">
                                        {item.fee}
                                    </td>
                                    <td className="py-1">
                                        {item.discount}
                                    </td>
                                </tr>)

                            }) : 'No procedure found'
                    }
                </tbody>
            </table>
        </div> : ''
        const appointment_charges_table = <div className="table-responsive card">
            <table className="table table-hover mb-0">
                <tbody>
                    <tr>
                        <td className="py-1">Procedures total fee</td>
                        <td className="py-1">
                            {this.state.data ? this.state.data.appointment_charges.procedures : ''}
                        </td>
                    </tr>
                    <tr>
                        <td className="py-1">Consultancy fee</td>
                        <td className="py-1">
                            {this.state.data ? this.state.data.appointment_charges.consultancy : ''}
                        </td>
                    </tr>
                    <tr>
                        <td className="py-1">Follow up fee</td>
                        <td className="py-1">
                            {this.state.data ? this.state.data.appointment_charges.follow_up : ''}
                        </td>
                    </tr>
                    <tr>
                        <td className="py-1">Discount on Appointment charges</td>
                        <td className="py-1">
                            {this.state.data ? this.state.data.appointment_charges.discount : ''}
                        </td>
                    </tr>
                    <tr>
                        <td className="py-1 h4">Total</td>
                        <td className="py-1 h4">
                            {this.get_total()}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        const appointment_paid_balance = <div className={`table-responsive card`}>
            <table className={"table table-hover mb-0"}>
                <tbody>
                    <tr>
                        <td className="py-1">Paid Amount</td>
                        <td className="py-1">
                            {this.state.data ? this.state.data.appointment_charges.paid : ''}
                        </td>
                    </tr>
                    <tr>
                        <td className="py-1">Paid Amount for procedures</td>
                        <td className="py-1">
                            {this.state.data ? this.state.data.appointment_charges.paid_for_procedures : ''}
                        </td>
                    </tr>
                    <tr>
                        <td className="py-1">Total paid Amount</td>
                        <td className="py-1">
                            {this.get_total_paid()}
                        </td>
                    </tr>
                    <tr>
                        <td className="py-1">Due Amount</td>
                        <td className="py-1">
                            {this.state.data ? this.get_balance() : ''}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        return (
            <Modal visible={this.props.visibility}
                onClickBackdrop={this.props.close_modal}
                fade={true}
                dialogClassName={`modal-dialog modal-lg `}>
                <div className="modal-body pb-0" ref={el => (this.componentRef = el)}>
                    <div className="container-fluid" >
                        {table_header}
                        <div className="row">
                            <div className="col-12">
                                {this.state.data !== null && this.state.data.appointment_procedures.length > 0 ? <h4 className="font-weight-bold">Procedures</h4> : ''}
                                {procedures_table}
                                <h4 className="font-weight-bold">Appointment Charges</h4>
                                {appointment_charges_table}
                                <div className={`row`}>
                                    <div className={`col-lg-6`}>

                                    </div>
                                    <div className={`col-lg-6`}>
                                        {appointment_paid_balance}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="modal-footer">
                    <ReactToPrint
                        trigger={() => <button
                            type="button"
                            className="btn bg-teal-400 btn-labeled btn-labeled-right btn-sm pr-5"
                            style={{ textTransform: "inherit" }}
                        >
                            <b><i className="icon-printer2" /></b>Print</button>}
                        content={() => this.componentRef}
                    />
                    <button
                        type="button"
                        className="btn bg-danger btn-labeled btn-labeled-right btn-sm pr-5"
                        style={{ textTransform: "inherit" }}
                        onClick={this.props.close_modal}
                    >
                        <b><i className="icon-cross" /></b>
                        Close
                    </button>


                </div>
            </Modal>
        )
    }
}
export default Invoice