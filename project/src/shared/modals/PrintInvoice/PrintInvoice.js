import React, { Component } from 'react';
import './PrintInvoice.css';
import LOGO from "../../../resources/images/LOGO.png";

export default class PrintInvoice extends Component {
    render() {

        const printData = this.props.invoiceType.map((elem,index)=>{
            return (<div className="print" key={index}>
                <img src={LOGO} className="logo" alt="logo" />
                <div className="row">
                    <div className="column">
                        {
                            this.props.data ? (<>
                                <p><b>MRN#:</b> {this.props.data.patient.id}</p>
                                <p><b>Patient:</b>{this.props.data.patient.first_name +" "+ this.props.data.patient.last_name}</p>
                                <p><b>Age:</b> {this.props.data.patient.dob}, {this.props.data.patient.gender}</p>
                                <p><b>Doctor:</b> {this.props.data.doctor.first_name +" "+ this.props.data.doctor.last_name}</p>
                                <p><b>Visit Description:</b> {this.props.data ? this.props.data['description']:''}</p>
                            </>):''
                        }
                    </div>
                    <div className="column">
                        <p><b>{elem.label}</b></p>
                        <p><b>Date:</b> {this.props.data ? this.props.data.date:''}</p>
                    </div>
                </div>
                <table className="table table-bordered">
                    <thead>
                    <tr>
                        <th scope="col">SR #</th>
                        <th scope="col">Description</th>
                        <th scope="col">Price</th>
                        <th scope="col">Discount</th>
                        <th scope="col">Total</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>1</td>
                        <td>Consultancy Fee</td>
                        <td>{this.props.consultancyFee}</td>
                        <td>{this.props.consultancyDiscount}</td>
                        <td>{this.props.consultancyTotal}</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Addons</td>
                        <td/>
                        <td/>
                        <td>{this.props.addons}</td>
                    </tr>
                    {
                        this.props.procedures ? this.props.procedures.map((data,ikey)=>{
                            return (<tr key={data._id}>
                                <th scope="row">{ikey+3}</th>
                                <td>{data.procedure_details}</td>
                                <td>{data.procedure_fee}</td>
                                <td>{data.discount}</td>
                                <td>{data.procedure_fee-data.discount}</td>
                            </tr>);
                        }):''
                    }
                    <tr>
                        <td />
                        <td />
                        <td />
                        <td>Total</td>
                        <td>{this.props.total}</td>
                    </tr>
                    <tr>
                        <td />
                        <td />
                        <td />
                        <td>Discount</td>
                        <td>{this.props.totalDiscount}</td>
                    </tr>
                    <tr>
                        <td />
                        <td />
                        <td />
                        <td>Payable Amount</td>
                        <td>{this.props.payableAmount}</td>
                    </tr>
                    </tbody>
                </table>
                <div className="signature">
                    <h3>Signature:</h3>
                    <input type="text"/>
                </div>
            </div>)
        });

        return (<div>{printData}</div>);
    }
}

