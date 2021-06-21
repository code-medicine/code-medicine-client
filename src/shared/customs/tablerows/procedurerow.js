import React, { Component } from 'react';
import Inputfield from "../../../components/inputfield";
import "../Animations/animations.css"


class Procedure extends Component {

    constructor(props) {
        super(props);
        this.state = {
            editable:true
        }
    }

    changeInputEditableHandler = () => {
        console.log('changeHandler');
      this.setState({editable:false});
    };

    render() {
        const disabled = this.props.disableDelete && this.state.editable;
        return (
            <div className="row zoomIn animated">
                <div className={`col-md-7  px-3`}>
                    <Inputfield
                        id={`procedure_reason_text_input`+this.props.id}
                        label_tag={'Procedure Reason'}
                        icon_class={'icon-question3'}
                        placeholder="Enter Reason"
                        input_type={'text'}
                        disabled={disabled}
                        field_type=""
                        on_text_change_listener={(e)=>{this.props.procedureDetailHandler(e,this.props.id,this.props.listType)}}
                        default_value={this.props.ProcedureDetailValue}
                    />
                </div>

                <div className={`col-md-2  px-3`}>
                    <Inputfield
                        id={`total_price_text_input`}
                        label_tag={'Charges'}
                        icon_class={'icon-price-tag3'}
                        placeholder="Charges"
                        input_type={'text'}
                        disabled={disabled}
                        field_type=""
                        on_text_change_listener={(e)=>{this.props.procedureFeeHandler(e,this.props.id,this.props.listType)}}
                        default_value={this.props.ProcedureFeeValue}
                    />
                </div>

                <div className={`col-md-2 px-3`}>
                    <Inputfield
                        id={`discount_price_text_input`}
                        label_tag={'Discount'}
                        icon_class={'icon-percent'}
                        placeholder="Discount"
                        disabled={disabled}
                        input_type={'text'}
                        field_type=""
                        on_text_change_listener={(e)=>{this.props.procedureDiscount(e,this.props.id,this.props.listType)}}
                        default_value={this.props.discountValue}
                    />
                </div>
                <div className="col-md-1 d-flex align-items-end pb-1">
                {
                    this.props.disableDelete ? (this.state.editable ? ((
                        <button
                            type="button"
                            className="btn btn-outline btn-sm bg-success text-success btn-icon mb-3"
                            style={{ textTransform: "inherit" }}
                            onClick={this.changeInputEditableHandler}>
                            <i className="icon-pencil7" />
                        </button>
                    )):((
                        <button
                            type="button"
                            className="btn btn-outline btn-sm bg-success text-success btn-icon mb-3"
                            style={{ textTransform: "inherit" }}
                            onClick={()=>this.props.updateProcedure(this.props.id)}>
                            <i className="icon-floppy-disk" />
                        </button>
                    ))):(
                        <button
                            type="button"
                            className="btn btn-outline btn-sm bg-danger text-danger btn-icon mb-3"
                            style={{ textTransform: "inherit" }}
                            onClick={()=>this.props.deleteProcedure(this.props.id)}>
                            <i className="icon-cross" />
                        </button>)
                }
                </div>
            </div>
        );
    }
}

export default Procedure;