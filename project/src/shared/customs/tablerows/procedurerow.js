import React, { Component } from 'react';
import Inputfield from "../inputfield/inputfield";
import "../Animations/animations.css"


class Procedure extends Component {
    render() {

        return (
            <div className="row jackInTheBox animated">
                <div className={`col-md-7  px-3`}>
                    <Inputfield
                        id={`procedure_reason_text_input`}
                        label_tag={'Description'}
                        icon_class={'icon-pencil3'}
                        placeholder="Enter description"
                        input_type={'text'}
                        field_type=""
                        on_text_change_listener={(e)=>{this.props.procedureDetailHandler(e,this.props.id);console.log('Testing!!')}}
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
                        field_type=""
                        on_text_change_listener={this.props.procedureFeeHandler}
                        default_value={this.props.ProcedureFeeValue}
                    />
                </div>

                <div className={`col-md-2 px-3`}>
                    <Inputfield
                        id={`discount_price_text_input`}
                        label_tag={'Discount'}
                        icon_class={'icon-percent'}
                        placeholder="Discount"
                        input_type={'text'}
                        field_type=""
                        on_text_change_listener={this.props.procedureDiscount}
                        default_value={this.props.discountValue}
                    />
                </div>
                <div className="col-md-1 d-flex align-items-end pb-1">
                    <button
                        type="button"
                        className="btn btn-outline btn-sm bg-danger text-danger btn-icon mb-3"
                        style={{ textTransform: "inherit" }}
                        onClick={()=>this.props.deleteProcedure(this.props.id)}>
                        <i className="icon-cross"></i>
                    </button>
                </div>
            </div>
        );
    }
}

export default Procedure;