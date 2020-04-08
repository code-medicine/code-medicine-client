import React, { Component } from 'react';
import Modal from "react-bootstrap4-modal";
import Procedure from "../customs/tablerows/procedurerow";
import uniqueRandom from 'unique-random';
import Axios from "axios";
import {NEW_PROCEDURES_URL,GET_PROCEDURE_BY_ID,UPDATE_PROCEDURE} from "../../shared/rest_end_points";
import {connect} from "react-redux";
import {notify} from "../../actions";

class ProcedureModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            procedureList:[],
            visitId:null,
            random : uniqueRandom(1, Math.pow(2,53))
        }
    }

    componentDidMount() {
        this.addProcedure();
    }

    addProcedure = () => {
        const updateProcedureList = this.state.procedureList;
        updateProcedureList.push({_id:this.state.random(),procedure_details:'',procedure_fee:0,discount:0});
        this.setState({procedureList:updateProcedureList}, () => {
            this.scrollToBottom()
        });
    };

    deleteProcedureHandler= (id) => {
        let updateProcedureList = this.state.procedureList;
        updateProcedureList = updateProcedureList.filter((ele) => {
            return ele._id !== id;
        });
        this.setState({procedureList:updateProcedureList});
    };

    updateProcedureHandler = (id) => {

        const data = this.props.prevProcedureList ? this.props.prevProcedureList.find(ele => ele._id === id) : null;

        try {
            let response = Axios.post(`${UPDATE_PROCEDURE}`, data,{
                headers: { 'code-medicine': localStorage.getItem('user') }
            });
            response.then((response)=>{
                if(response.data.status===true) {
                    this.props.notify('success', '', 'Procedures Updated!');
                }
            });
        }
        catch (err) {
            this.props.notify('error', '', 'Server is not responding! Please try again later');
        }
    };

    handlerSubmit = (e) => {
        e.preventDefault();
        let data = {
            "visit_id": this.props.visit_id,
            "procedures":this.state.procedureList
        };

        try {
            let response = Axios.post(`${NEW_PROCEDURES_URL}`, data,{
                headers: { 'code-medicine': localStorage.getItem('user') }
            });
            response.then((response)=>{
                if(response.data.status===true) {
                    this.props.notify('success', '', 'Procedures added!');
                }
            });
        }
        catch (err) {
            this.props.notify('error', '', 'Server is not responding! Please try again later');
        }

        this.setState({procedureList:[]});
        this.props.cancelProcedureModal();

    };

    getIndex = (list,id) => {
        const element = (data) => data._id === id;
        return list.findIndex(element);
    };

    changeProcedureList = (id,updatedObject,list,listType) => {
        let updateProcedureList = [...list];
        const index = this.getIndex(updateProcedureList,id);
        updateProcedureList[index] = {
            ...updateProcedureList[index],
            ...updatedObject
        };
        listType==='prev'? this.props.updateProcedureList(updateProcedureList):this.setState({procedureList:updateProcedureList});
    };

    handleChangeProcedureDetails = (event,id,listType) => {
        listType ==='new' ?
            this.changeProcedureList(id,{procedure_details:event.target.value},this.state.procedureList,listType):
            this.changeProcedureList(id,{procedure_details:event.target.value},this.props.prevProcedureList,listType);
    };

    handleChangeProcedureFee = (event,id,listType) => {
        listType ==='new' ?
            this.changeProcedureList(id,{procedure_fee:event.target.value},this.state.procedureList,listType):
            this.changeProcedureList(id,{procedure_fee:event.target.value},this.props.prevProcedureList,listType);

    };

    handleChangeDiscount = (event,id,listType) => {
        listType ==='new' ?
            this.changeProcedureList(id,{discount:event.target.value},this.state.procedureList,listType):
            this.changeProcedureList(id,{discount:event.target.value},this.props.prevProcedureList,listType);
    };

    scrollToBottom = () => {
        this.last_element.scrollIntoView({ behavior: "smooth" });
    };


    render() {
        return (
            <Modal
                visible={this.props.new_procedure_visibility}
                onClickBackdrop={this.props.procedure_backDrop}
                fade={true}
                dialogClassName={`modal-dialog modal-lg `}
                >
                <div className="modal-header bg-teal-400">
                    <h5 className="modal-title">Add New Procedures</h5>
                    <button
                        type="button"
                        className="btn bg-secondary btn-labeled btn-labeled-right pr-5"
                        style={{ textTransform: "inherit" }}
                        onClick={this.addProcedure}
                    >
                        <b><i className="icon-plus3" /></b>
                        Add
                    </button>
                </div>
                <div className="modal-body" style={{height: '60vh', overflowY: 'auto'}}>
                    {
                        this.props.prevProcedureList.map((data)=>{
                            return (<Procedure
                                key={data._id}
                                id={data._id}
                                ProcedureDetailValue={data.procedure_details}
                                ProcedureFeeValue={data.procedure_fee}
                                discountValue={data.discount}
                                procedureDetailHandler={this.handleChangeProcedureDetails}
                                procedureFeeHandler={this.handleChangeProcedureFee}
                                procedureDiscount={this.handleChangeDiscount}
                                listType="prev"
                                disableDelete={true}
                                updateProcedure={this.updateProcedureHandler}
                                deleteProcedure={this.deleteProcedureHandler}
                            />)
                        })
                    }

                    {
                        this.state.procedureList.map((data)=>{
                           return (<Procedure
                               key={data._id}
                               id={data._id}
                               ProcedureDetailValue={data.procedure_details}
                               ProcedureFeeValue={data.procedure_fee}
                               discountValue={data.discount}
                               procedureDetailHandler={this.handleChangeProcedureDetails}
                               procedureFeeHandler={this.handleChangeProcedureFee}
                               listType="new"
                               procedureDiscount={this.handleChangeDiscount}
                               disableDelete={false}
                               deleteProcedure={this.deleteProcedureHandler}
                           />)
                        })
                    }
                    <div style={{ float:"left", clear: "both" }}
                        ref={(el) => { this.last_element = el; }}>
                    </div>
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
                        <b><i className="icon-floppy-disk" /></b>
                        Save
                    </button>
                </div>

            </Modal>
        );
    }
}

function map_state_to_props(notify) {
    return { notify }
}
export default connect(map_state_to_props, { notify })(ProcedureModal);