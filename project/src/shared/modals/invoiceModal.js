import React, { Component } from 'react';
import Modal from "react-bootstrap4-modal";
import LOGO from '../../resources/images/LOGO.png';
import Select from "react-select";
import './invoiceModal.css';
import Axios from "axios";
import {GET_PROCEDURES_FEE,GET_PROFITS_BY_DOCTOR_ID} from "../rest_end_points";

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
            addons: 0,
            proceduresFee:0
        }
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log(this.props.visit_id);
        if(this.props.visit_id!=null && this.props.visit_id!==this.state.visitId) {
            try {
                let response = Axios.get(`${GET_PROCEDURES_FEE}?visit_id=`+this.props.visit_id,{
                    headers: { 'code-medicine': localStorage.getItem('user') }
                });
                response.then((response)=>{
                    if(response.data.status===true) {
                        this.setState({
                            proceduresFee : response.data.payload.procedures_fees,
                            visitId: this.props.visit_id
                        });
                    }
                });
            }
            catch (err) {
                this.props.notify('error', '', 'Server is not responding! Please try again later');
            }


            try {
                let response = Axios.get(`${GET_PROFITS_BY_DOCTOR_ID}?doctor_id=`+this.props.doctor_id,{
                    headers: { 'code-medicine': localStorage.getItem('user') }
                });
                response.then((response)=>{
                    if(response.data.status===true) {
                        this.setState({
                            proceduresFee : response.data.payload.procedures_fees,
                            visitId: this.props.visit_id
                        });
                    }
                });
            }
            catch (err) {
                this.props.notify('error', '', 'Server is not responding! Please try again later');
            }



        }
    }

    on_selected_changed = (e) => {
        if (e !== null) {
            this.setState({ selectedInvoiceType: e.label });
        }
    };

    render() {
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
                                            <th scope="col">Amount</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <th scope="row">1</th>
                                            <td>Consultancy Fee</td>
                                            <td>{this.state.consultancyFee}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">2</th>
                                            <td>Addons</td>
                                            <td>{this.state.addons}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">3</th>
                                            <td>Procedures Fee</td>
                                            <td>{this.state.proceduresFee}</td>
                                        </tr>
                                        <tr>
                                            <td />
                                            <td />
                                            <td />
                                        </tr>
                                        <tr>
                                            <th scope="row" />
                                            <td>Total</td>
                                            <td>3400</td>
                                        </tr>
                                        <tr>
                                            <th scope="row" />
                                            <td>Discount</td>
                                            <td>400</td>
                                        </tr>
                                        <tr>
                                            <th scope="row" />
                                            <td>Payable Amount</td>
                                            <td>3000</td>
                                        </tr>

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <div className="col-md-4">
                        <div className="form-group" style={{marginBottom:'0px'}}>
                            <Select
                                isClearable
                                options={this.state.invoiceType}
                                placeholder="Select Invoice Type Copy"
                                onChange={e => this.on_selected_changed(e)}
                            />
                        </div>
                    </div>
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