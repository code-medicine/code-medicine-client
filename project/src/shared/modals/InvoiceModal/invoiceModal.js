import React, { Component } from 'react';
import Modal from "react-bootstrap4-modal";
import LOGO from '../../../resources/images/LOGO.png';
import './invoiceModal.css';
import Axios from "axios";
import {GET_PROCEDURES_FEE, GET_PROFITS_BY_DOCTOR_ID, UPDATE_APPOINTMENT_URL, PROFITS_UPDATE,DOCTORDETAILS_SEARCH} from "../../rest_end_points";
import ReactToPrint from 'react-to-print';
import PrintInvoice from '../PrintInvoice/PrintInvoice';
import {connect} from "react-redux";
import {notify} from "../../../actions";
import moment from 'moment';


class InvoiceModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            invoiceType: [{
                label: `Customer Copy`
            }, {
                label: `Hospital Copy`
            }],
            visitId:null,
            selectedInvoiceType:'Hospital Copy',
            consultancyFee: 0,
            consultancyDiscount: 0,
            consultancyDiscountEditable: false,
            consultancyTotal: 0,
            addons: 0,
            addonsEditable: false,
            proceduresFee:0,
            procedures:null,
            total:0,
            totalDiscount:0,
            totalDiscountEditable: false,
            payableAmount:0,
            profitID:0
        }
    };

    consultancyEditHandler = () => {
        this.setState({
            consultancyDiscountEditable:true
        })
    };

    consultancyDiscountSaveHandler =() => {
        this.updateVisit();
        this.setState({
            consultancyDiscountEditable:false
        })
    };

    addonsEditHandler = () => {
        this.setState({
            addonsEditable:true
        })
    };

    addonsSaveHandler =() => {

        const data = {
            '_id':this.state.profitID,
            'addons':this.state.addons,
            'consultancy_fee': this.state.consultancyFee
        };

        try {
            let response = Axios.post(`${PROFITS_UPDATE}`, data,{
                headers: { 'code-medicine': localStorage.getItem('user') }
            });
            response.then((response)=>{
                if(response.data.status===true) {

                    this.setState((state, props) => {
                        return {
                            addonsEditable:false,
                            total: this.state.total + this.state.addons
                        };
                    });

                    this.props.notify('success', '', 'Addons Updated!');
                }
            });
        }
        catch (err) {
            this.props.notify('error', '', 'Server is not responding! Please try again later');
        }
    };

    totalDiscountEditHandler = () => {
        this.setState({
            totalDiscountEditable:true
        })
    };

    totalDiscountSaveHandler =() => {
        this.updateVisit();
        this.setState({
            totalDiscountEditable:false
        })
    };

    addonsHandler = (event) => {
        this.setState({
            addons:event.target.value
        })
    };

    totalDiscountHandler = (event) => {
        this.setState({
            totalDiscount:event.target.value
        })
    };

    consultancyDiscountHandler = (event) => {
        this.setState({
            consultancyDiscount:event.target.value
        })
    };

    updateVisit = () => {

        const data = {
            visit_id: this.props.data.visit_id,
            payload: {
                patient_id: this.props.data.patient.id,
                doctor_id: this.props.data.doctor.id,
                date: this.props.data.date,
                time: this.props.data.time,
                reason: this.props.data['description'],
                type: 'Admin sahab replace this with token or identification!',
                status: this.props.data.status,
                consultancy_discount: this.state.consultancyDiscount,
                overall_discount: this.state.totalDiscount
            }
        };

        try {
            let response = Axios.put(`${UPDATE_APPOINTMENT_URL}`, data,{
                headers: { 'code-medicine': localStorage.getItem('user') }
            });
            response.then((response)=>{
                if(response.data.status===true) {
                    this.setState((state, props) => {
                        return {
                            total: state.total - (state.consultancyDiscount + state.totalDiscount),
                            consultancyTotal: state.consultancyFee - state.consultancyDiscount
                        };
                    });
                    this.props.notify('success', '', 'Visit Updated!');
                }
            });
        }
        catch (err) {
            this.props.notify('error', '', 'Server is not responding! Please try again later');
        }
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        // console.log(this.props.data);
        if (this.props.data!==null && this.props.data.visit_id !== this.props.invoiceVisitId) {
            try {
                let response = Axios.get(`${GET_PROCEDURES_FEE}?visit_id=`+this.props.data.visit_id,{
                    headers: { 'code-medicine': localStorage.getItem('user') }
                });
                response.then((response) => {
                    console.log(response);
                    if (response.data.status === true) {
                        this.setState({
                            proceduresFee : response.data.payload.procedures_fees,
                            procedures: response.data.payload.procedures,
                            visitId: this.props.data.visit_id,
                            consultancyDiscount: this.props.data.consultancy_discount,
                            totalDiscount: this.props.data.overall_discount,
                            total:response.data.payload.procedures_fees
                        });
                    }
                });
            }
            catch (err) {
                this.props.notify('error', '', 'Server is not responding! Please try again later');
            }


            try {
                let response = Axios.get(`${GET_PROFITS_BY_DOCTOR_ID}?visit_id=`+this.props.data.visit_id, {
                    headers: {'code-medicine': localStorage.getItem('user')}
                });
                response.then((response) => {
                    if (response.data.status === true  && response.data.payload.profits.length>0) {

                        this.setState((state, props) => {
                            const ct = (response.data.payload.profits[0].consultancy_fee);
                            return {
                                profitID:response.data.payload.profits[0]._id,
                                addons: response.data.payload.profits[0].addons,
                                total: state.total + ct + response.data.payload.profits[0].addons
                            };
                        });

                    }
                });
            } catch (err) {
                this.props.notify('error', '', 'Server is not responding! Please try again later');
            }


            try {
                let response = Axios.get(`${DOCTORDETAILS_SEARCH}?doctor_id=`+this.props.data.doctor.id, {
                    headers: {'code-medicine': localStorage.getItem('user')}
                });
                response.then((response) => {
                    // console.log(response);
                    if (response.data.status === true && response.data.payload.doctor_details.length>0) {

                        this.setState((state, props) => {
                            return {
                                consultancyFee: response.data.payload.doctor_details[0].consultancy_fee,
                                consultancyTotal: response.data.payload.doctor_details[0].consultancy_fee - state.consultancyDiscount
                            };
                        });
                    }
                });
            } catch (err) {
                this.props.notify('error', '', 'Server is not responding! Please try again later');
            }


            this.props.changeVisitId(this.props.data.visit_id);
         }
    }



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
                    <div className="col-md-4">
                        <div className="form-group" style={{ marginBottom: '0px' }}>
                            {/* <Select
                                isClearable
                                options={this.state.invoiceType}
                                placeholder="Select Invoice Type Copy"
                                onChange={e => this.on_selected_changed(e)}
                            /> */}
                        </div>
                    </div>
                    {/* <button
                        type="button"
                        className="btn bg-secondary btn-labeled btn-labeled-right pr-5"
                        style={{ textTransform: "inherit" }}
                    >
                        <b><i className="icon-printer2" /></b>Print</button> */}
                </div>
                <div className="modal-body">
                    <div className="container-fluid">
                        <div className="row d-print-flex" id="print">
                            <div className="col-md-12">
                                <img src={LOGO} className="logo" alt="logo" />
                                <div className="row patientData">
                                    <div className="offset-md-1 col-md-5">
                                        {
                                            this.props.data ? (<>
                                                <p><b>MRN#:</b> {this.props.data.patient.id}</p>
                                                <p><b>Patient:</b> {this.props.data.patient.first_name +" "+ this.props.data.patient.last_name}</p>
                                                <p><b>Age:</b> {moment.utc(this.props.data.patient.dob).fromNow()}, {this.props.data.patient.gender}</p>
                                                <p><b>Doctor:</b> {this.props.data.doctor.first_name +" "+ this.props.data.doctor.last_name}</p>
                                                <p><b>Visit Description:</b> {this.props.data ? this.props.data['description']:''}</p>
                                            </>):''
                                        }
                                    </div>
                                    <div className="offset-md-1 col-md-5">
                                        <p><b>{this.state.selectedInvoiceType}</b></p>
                                        <p><b>Date:</b> {this.props.data ? moment.utc(this.props.data.date).format('lll'):''}</p>
                                    </div>
                                </div>
                                <div className="table-responsive">
                                    <table className="table table-bordered d-print-table">
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
                                            <td>{this.state.consultancyDiscountEditable ? <input
                                                    type='text'
                                                    className={`form-control form-control-lg`}
                                                    placeholder='Discount'
                                                    onChange={(e)=>this.consultancyDiscountHandler(e)}
                                                    value={this.state.consultancyDiscount}
                                                />: this.state.consultancyDiscount}
                                            </td>
                                            <td>{this.state.consultancyTotal}</td>
                                            <td>{ this.state.consultancyDiscountEditable ?
                                                <button
                                                    type="button"
                                                    className="btn btn-outline btn-sm bg-success text-success btn-icon mb-3"
                                                    style={{ textTransform: "inherit" }}
                                                    onClick={this.consultancyDiscountSaveHandler}>
                                                    <i className="icon-floppy-disk" />
                                                </button> :
                                                <button
                                                    type="button"
                                                    className="btn btn-outline btn-sm bg-success text-success btn-icon mb-3"
                                                    style={{ textTransform: "inherit" }}
                                                    onClick={this.consultancyEditHandler}>
                                                    <i className="icon-pencil7" />
                                                </button>
                                            }</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">2</th>
                                            <td>Addons</td>
                                            <td />
                                            <td />
                                            <td>{this.state.addonsEditable? <input
                                                type='text'
                                                className={`form-control form-control-lg`}
                                                placeholder='Discount'
                                                onChange={(e)=>this.addonsHandler(e)}
                                                value={this.state.addons}
                                            />:this.state.addons}</td>
                                            <td>{ this.state.addonsEditable ?
                                                <button
                                                    type="button"
                                                    className="btn btn-outline btn-sm bg-success text-success btn-icon mb-3"
                                                    style={{ textTransform: "inherit" }}
                                                    onClick={this.addonsSaveHandler}>
                                                    <i className="icon-floppy-disk" />
                                                </button> :
                                                <button
                                                    type="button"
                                                    className="btn btn-outline btn-sm bg-success text-success btn-icon mb-3"
                                                    style={{ textTransform: "inherit" }}
                                                    onClick={this.addonsEditHandler}>
                                                    <i className="icon-pencil7" />
                                                </button>
                                            }</td>
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
                                            <th scope="row" />
                                            <td />
                                            <td />
                                            <td>Total</td>
                                            <td>{this.state.total}</td>
                                            <td />
                                        </tr>
                                        <tr>
                                            <th scope="row" />
                                            <td />
                                            <td />
                                            <td>Discount</td>
                                            <td>{ this.state.totalDiscountEditable ? (<input
                                                type='text'
                                                className={`form-control form-control-lg`}
                                                placeholder='Discount'
                                                onChange={(e)=>this.totalDiscountHandler(e)}
                                                value={this.state.totalDiscount}
                                            />):this.state.totalDiscount}
                                            </td>
                                            <td>{ this.state.totalDiscountEditable ?
                                                <button
                                                    type="button"
                                                    className="btn btn-outline btn-sm bg-success text-success btn-icon mb-3"
                                                    style={{ textTransform: "inherit" }}
                                                    onClick={this.totalDiscountSaveHandler}>
                                                    <i className="icon-floppy-disk" />
                                                </button> :
                                                <button
                                                    type="button"
                                                    className="btn btn-outline btn-sm bg-success text-success btn-icon mb-3"
                                                    style={{ textTransform: "inherit" }}
                                                    onClick={this.totalDiscountEditHandler}>
                                                    <i className="icon-pencil7" />
                                                </button>
                                            }</td>
                                        </tr>
                                        <tr>
                                            <th scope="row" />
                                            <td />
                                            <td />
                                            <td>Payable Amount</td>
                                            <td>{this.state.total-this.state.totalDiscount}</td>
                                            <td />
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <ReactToPrint
                        trigger={() => <button
                            type="button"
                            className="btn bg-teal-400 btn-labeled btn-labeled-right pr-5"
                            style={{ textTransform: "inherit" }}
                        >
                            <b><i className="icon-printer2" /></b>Print</button>}
                        content={() => this.componentRef}
                    />
                    <div style={{ display: "none" }}>
                        <PrintInvoice
                            invoiceType={this.state.invoiceType}
                            data = {this.props.data}
                            total={this.state.total}
                            totalDiscount={this.state.totalDiscount}
                            payableAmount={this.state.total-this.state.totalDiscount}
                            procedures={this.state.procedures}
                            consultancyFee={this.state.consultancyFee}
                            consultancyDiscount={this.state.consultancyDiscount}
                            consultancyTotal={this.state.consultancyTotal}
                            addons={this.state.addons}
                            ref={el => (this.componentRef = el)
                            }/>
                    </div>
                </div>
            </Modal>);
    }
}

export default connect(null, { notify })(InvoiceModal);