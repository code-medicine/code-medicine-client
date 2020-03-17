import React, { Component, Fragment } from 'react';
import Modal from "react-bootstrap4-modal";
import Inputfield from "../../../shared/inputfield/inputfield";

class ProcedureModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            procedureList:[]
        }
    }


    render() {
        console.log('new_procedure_visibility: ' + this.props.new_procedure_visibility);
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
                    <div className="row">
                        <div className={`col-md-4  px-3`}>
                            <Inputfield
                                id={`procedure_reason_text_input`}
                                label_tag={'Procedure Reason'}
                                icon_class={'icon-question3'}
                                placeholder="Enter Reason"
                                input_type={'text'}
                                field_type=""
                                on_text_change_listener={this.on_text_field_change}
                            />
                        </div>

                        <div className={`col-md-4  px-3`}>
                            <Inputfield
                                id={`total_price_text_input`}
                                label_tag={'Total Price'}
                                icon_class={'icon-cash2'}
                                placeholder="Enter Price"
                                input_type={'text'}
                                field_type=""
                                on_text_change_listener={this.on_text_field_change}
                            />
                        </div>

                        <div className={`col-md-3  px-3`}>
                            <Inputfield
                                id={`discount_price_text_input`}
                                label_tag={'Discount Amount'}
                                icon_class={'icon-percent'}
                                placeholder="Enter Amount"
                                input_type={'text'}
                                field_type=""
                                on_text_change_listener={this.on_text_field_change}
                            />
                        </div>
                        <div className={`col-md-1  px-3`}
                             style={{display: 'flex', justifyContent: 'center',alignItems: 'center'}}
                        >
                            <button
                                type="button"
                                className="btn bg-danger mt-4"
                                style={{ textTransform: "inherit" }}
                            >
                                <b><i className="icon-cross"></i></b>
                            </button>
                        </div>
                    </div>
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