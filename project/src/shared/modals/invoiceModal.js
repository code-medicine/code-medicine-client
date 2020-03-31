import React, { Component } from 'react';
import Modal from "react-bootstrap4-modal";
import LOGO from '../../resources/images/LOGO.png';
import Select from "react-select";
import './invoiceModal.css';
import Axios from "axios";
import {GET_PROCEDURES_FEE,GET_PROFITS_BY_DOCTOR_ID} from "../rest_end_points";
import Inputfield from "../customs/inputfield/inputfield";

class InvoiceModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            invoiceType: [{
                id: 'customer',
                reference: 'customer',
                label: `Customer Copy`
            },{
                id: 'hospital',
                reference: 'hospital',
                label: `Hospital Copy`
            }],
            visitId:null,
            selectedInvoiceType:null,
            consultancyFee: 0,
            consultancyDiscount: 0,
            consultancyTotal: 0,
            addons: 0,
            proceduresFee:0,
            procedures:null,
            total:0,
            totalDiscount:0,
            payableAmount:0
        }
    };

    consultancyEditHandler = () => {
        console.log('Edit!!');
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log(this.props.visit_id);
        if (this.props.visit_id != null && this.props.visit_id !== this.state.visitId) {
            try {
                let response = Axios.get(`${GET_PROCEDURES_FEE}?visit_id=`+this.props.visit_id,{
                    headers: { 'code-medicine': localStorage.getItem('user') }
                });
                response.then((response)=>{
                    console.log(response);
                    if(response.data.status===true) {
                        this.setState({
                            proceduresFee : response.data.payload.procedures_fees,
                            procedures: response.data.payload.procedures,
                            visitId: this.props.visit_id,
                        });
                    }
                });
            }
            catch (err) {
                this.props.notify('error', '', 'Server is not responding! Please try again later');
            }


            try {
                let response = Axios.get(`${GET_PROFITS_BY_DOCTOR_ID}?doctor_id=`+this.props.doctor_id, {
                    headers: {'code-medicine': localStorage.getItem('user')}
                });
                response.then((response) => {
                    if (response.data.status === true) {
                        this.setState({
                            consultancyFee: response.data.payload.profits[0].consultancy_fee,
                            consultancyDiscount: response.data.payload.profits[0].consultancy_percentage,
                            consultancyTotal: (response.data.payload.profits[0].consultancy_fee) - (response.data.payload.profits[0].consultancy_percentage)
                        });
                    }
                });
            } catch (err) {
                this.props.notify('error', '', 'Server is not responding! Please try again later');
            }


        }
    }

    render() {
        console.log('RENDER!!!');
        return (
            <Modal
                visible={this.props.modal_visibility}
                onClickBackdrop={this.props.invoice_backDrop}
                fade={true}
                dialogClassName={`modal-dialog modal-lg `}
        >
                <div className="modal-header bg-teal-400">
                    <h5 className="modal-title">Generate Invoice</h5>
                </div>
                <div className="modal-body">
                    <div className="container-fluid">
                        <div className="row" id="print">
                            <div className="col-md-12">
                                <img src={LOGO} className="logo" alt="logo"/>
                                <div className="row patientData">
                                    <div className="offset-md-1 col-md-5">
                                        <p><b>MRN#:</b> 100123</p>
                                        <p><b>Patient:</b> Muhammad Ammad Hassan</p>
                                        <p><b>Age:</b> 26 years, Male</p>
                                        <p><b>Doctor:</b> Dr. Waqas Asad</p>
                                        <p><b>Visit Description:</b> Acupuncture</p>
                                    </div>
                                    <div className="offset-md-1 col-md-5">
                                        <p><b>{this.state.selectedInvoiceType}</b></p>
                                        <p><b>Date:</b> 1/12/19</p>
                                    </div>
                                </div>
                                <div className="table-responsive">
                                    <table className="table table-bordered">
                                        <thead>
                                        <tr>
                                            <th scope="col">SR #</th>
                                            <th scope="col">Description</th>
                                            <th scope="col">Price</th>
                                            <th scope="col">Discount</th>
                                            <th scope="col">Total</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <th scope="row">1</th>
                                            <td>Consultancy Fee</td>
                                            <td>{this.state.consultancyFee}</td>
                                            <td>{this.state.consultancyDiscount}</td>
                                            <td>{this.state.consultancyTotal}</td>
                                            <td><button
                                                type="button"
                                                className="btn btn-outline btn-sm bg-success text-success btn-icon mb-3"
                                                style={{ textTransform: "inherit" }}
                                                onClick={this.consultancyEditHandler}>
                                                <i className="icon-pencil7" />
                                            </button></td>
                                        </tr>
                                        <tr>
                                            <th scope="row">2</th>
                                            <td>Addons</td>
                                            <td>{this.state.addons}</td>
                                        </tr>
                                        {
                                            this.state.procedures ? this.state.procedures.map((data,ikey)=>{
                                                return (<tr key={data._id}>
                                                    <th scope="row">{ikey+3}</th>
                                                    <td>{data.procedure_details}</td>
                                                    <td>{data.procedure_fee}</td>
                                                    <td>{data.discount}</td>
                                                    <td>{data.procedure_fee-data.discount}</td>
                                                    <td />
                                                </tr>);
                                            }):''
                                        }
                                        <tr>
                                            <td />
                                            <td />
                                            <td />
                                        </tr>
                                        <tr>
                                            <th scope="row" />
                                            <td />
                                            <td />
                                            <td>Total</td>
                                            <td>{this.state.total}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row" />
                                            <td />
                                            <td />
                                            <td>Discount</td>
                                            <td>
                                                <Inputfield
                                                    label_tag={'Discount'}
                                                    icon_class={'icon-question3'}
                                                    placeholder="Enter Discount"
                                                    input_type={'text'}
                                                    field_type=""
                                                    default_value={this.props.totalDiscount}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row" />
                                            <td />
                                            <td />
                                            <td>Payable Amount</td>
                                            <td>{this.state.payableAmount}</td>
                                        </tr>

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button
                        type="button"
                        className="btn bg-teal-400 btn-labeled btn-labeled-right pr-5"
                        style={{ textTransform: "inherit" }}
                    >
                        <b><i className="icon-printer2" /></b>Print</button>
                </div>
            </Modal>);
    }
}

export default InvoiceModal;