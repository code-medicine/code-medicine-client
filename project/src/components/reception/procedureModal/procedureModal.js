import React, { Component, Fragment } from 'react';
import Modal from "react-bootstrap4-modal";
import Procedure from "./procedure/procedure";
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
                        <b><i className="icon-plus3"></i></b>
                    </button>
                </div>
                <div className="modal-body">
                    {
                        this.state.procedureList.map((data)=>{
                           return <Procedure
                               key={data.id}
                               id={data.id}
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