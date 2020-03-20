import React, { Component } from 'react';
import Modal from "react-bootstrap4-modal";
import Procedure from "../customs/tablerows/procedurerow";
import uniqueRandom from 'unique-random';

class ProcedureModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            procedureList:[],
            random : uniqueRandom(1, Math.pow(2,53))
        }
    }

    componentDidMount() {
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
        console.log('handlerSubmit');
    };

    getIndex = (list,id) => {
        const element = (data) => data.id === id;
        return list.findIndex(element);
    };

    handleChangeProcedureDetails = (event,id) => {
        let updateProcedureList = [...this.state.procedureList];
        const index = this.getIndex(updateProcedureList,id);
        console.log('Index: ' + index);
        console.log('ID: ' + id);
        updateProcedureList[index] = {...updateProcedureList,procedure_details:event.target.value};
        this.setState({procedureList:updateProcedureList});
    };

    handleChangeProcedureFee = (event,id) => {
        let updateProcedureList = this.state.procedureList;
        updateProcedureList[this.getIndex(updateProcedureList,id)] = {...updateProcedureList,procedure_fee:event.target.value};
        this.setState({procedureList:updateProcedureList});
    };

    handleChangeDiscount = (event,id) => {
        let updateProcedureList = this.state.procedureList;
        updateProcedureList[this.getIndex(updateProcedureList,id)] = {...updateProcedureList,discount:event.target.value};
        this.setState({procedureList:updateProcedureList});
    };


    render() {

        return (
            <Modal
                visible={this.props.new_procedure_visibility}
                onClickBackdrop={this.props.procedure_backDrop}
                fade={true}
                dialogClassName={`modal-dialog modal-lg`}
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
                        <b><i className="icon-plus3"></i></b>
                    </button>
                </div>
                <div className="modal-body" style={{height: '60vh', overflowY: 'auto'}}>
                    {
                        this.state.procedureList.map((data)=>{
                           return <Procedure
                               key={data.id}
                               id={data.id}
                               ProcedureDetailValue={data.procedure_details}
                               ProcedureFeeValue={data.procedure_fee}
                               discountValue={data.discount}
                               procedureDetailHandler={this.handleChangeProcedureDetails}
                               procedureFeeHandler={this.handleChangeProcedureFee}
                               procedureDiscount={this.handleChangeDiscount}
                               deleteProcedure={this.deleteProcedureHandler}
                           />
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
                        <b><i className="icon-cross"></i></b>
                        Cancel
                    </button>
                    <button
                        disabled={this.state.procedureList.length===0}
                        type="button"
                        className="btn bg-teal-400 btn-labeled btn-labeled-right pr-5"
                        style={{ textTransform: "inherit" }}
                        onClick={this.handlerSubmit}
                    >
                        <b><i className="icon-plus3"></i></b>
                        Add
                    </button>
                </div>

            </Modal>
        );
    }
}

export default ProcedureModal;