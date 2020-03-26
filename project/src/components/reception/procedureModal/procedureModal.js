import React, { Component } from 'react';
import Modal from "react-bootstrap4-modal";
import Procedure from "./procedure/procedure";
import uniqueRandom from 'unique-random';
import Axios from "axios";
import {NEW_PROCEDURES_URL,GET_PROCEDURE_BY_ID} from "../../../shared/rest_end_points";

class ProcedureModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            procedureList:[],
            random : uniqueRandom(1, Math.pow(2,53))
        }
    }

    componentDidMount() {

        try {
            let response = Axios.get(`${GET_PROCEDURE_BY_ID}`,{
                headers: { 'code-medicine': localStorage.getItem('user') }
            });
            response.then((response)=>{
                console.log(response);
            });
        }
        catch (err) {
            this.props.notify('error', '', 'Server is not responding! Please try again later');
        }


        this.addProcedure();
    }

    addProcedure = () => {
        const updateProcedureList = this.state.procedureList;
        updateProcedureList.push({id:this.state.random(),procedure_details:'',procedure_fee:0,discount:0});
        this.setState({procedureList:updateProcedureList});
    };

    deleteProcedureHandler= (id) => {
        console.log(id);
        let updateProcedureList = this.state.procedureList;
        updateProcedureList = updateProcedureList.filter((ele) => {
            return ele.id !== id;
        });
        this.setState({procedureList:updateProcedureList});
    };

    handlerSubmit = (e) => {
        e.preventDefault();
        console.log(this.props.visit_id);
        console.log(this.state.procedureList);
        let data = {
            "visit_id": this.props.visit_id,
            "procedures":this.state.procedureList
        };

        try {
            let response = Axios.post(`${NEW_PROCEDURES_URL}`, data,{
                headers: { 'code-medicine': localStorage.getItem('user') }
            });
            response.then((response)=>{
                console.log(response);
            });
        }
        catch (err) {
            this.props.notify('error', '', 'Server is not responding! Please try again later');
        }

        this.setState({procedureList:[]});
        this.props.cancelProcedureModal();

    };

    getIndex = (list,id) => {
        const element = (data) => data.id === id;
        return list.findIndex(element);
    };

    changeProcedureList = (id,updatedObject) => {
        let updateProcedureList = [...this.state.procedureList];
        const index = this.getIndex(updateProcedureList,id);
        updateProcedureList[index] = {
            ...updateProcedureList[index],
            ...updatedObject
        };
        this.setState({procedureList:updateProcedureList});
    };

    handleChangeProcedureDetails = (event,id) => {
        this.changeProcedureList(id,{procedure_details:event.target.value});
    };

    handleChangeProcedureFee = (event,id) => {
        this.changeProcedureList(id,{procedure_fee:event.target.value});
    };

    handleChangeDiscount = (event,id) => {
        this.changeProcedureList(id,{discount:event.target.value});
    };


    render() {
        return (
            <Modal
                visible={this.props.new_procedure_visibility}
                onClickBackdrop={this.props.procedure_backDrop}
                fade={true}
                dialogClassName={`modal-dialog-centered modal-lg`}
            >
                {/* <Register/> */}
                <div className="modal-header bg-teal-400">
                    <h5 className="modal-title">Add New Procedures</h5>
                    <button
                        type="button"
                        className="btn bg-teal-400 btn-labeled btn-labeled-right"
                        style={{ textTransform: "inherit" }}
                        onClick={this.addProcedure}
                    >
                        <b><i className="icon-plus3" /></b>
                    </button>
                </div>
                <div className="modal-body">
                    {
                        this.state.procedureList.map((data)=>{
                           return (<Procedure
                               key={data.id}
                               id={data.id}
                               ProcedureDetailValue={data.procedure_details}
                               ProcedureFeeValue={data.procedure_fee}
                               discountValue={data.discount}
                               procedureDetailHandler={this.handleChangeProcedureDetails}
                               procedureFeeHandler={this.handleChangeProcedureFee}
                               procedureDiscount={this.handleChangeDiscount}
                               deleteProcedure={this.deleteProcedureHandler}
                           />)
                        })
                    }
                </div>
                <div className="modal-footer">
                    <button
                        type="button"
                        className="btn bg-danger btn-labeled btn-labeled-right pr-5"
                        style={{ textTransform: "inherit" }}
                        onClick={this.props.cancelProcedureModal}
                    >
                        <b><i className="icon-cross" /></b>
                        Cancel
                    </button>
                    <button
                        disabled={this.state.procedureList.length===0}
                        type="button"
                        className="btn bg-teal-400 btn-labeled btn-labeled-right pr-5"
                        style={{ textTransform: "inherit" }}
                        onClick={this.handlerSubmit}
                    >
                        <b><i className="icon-plus3" /></b>
                        Add
                    </button>
                </div>

            </Modal>
        );
    }
}

export default ProcedureModal;