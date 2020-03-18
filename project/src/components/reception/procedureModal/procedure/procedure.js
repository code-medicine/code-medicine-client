import React, { Component, Fragment } from 'react';
import Inputfield from "../../../../shared/inputfield/inputfield";


class Procedure extends Component {
    render() {

        return (
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
                        onClick={()=>this.props.deleteProcedure(this.props.id)}
                    >
                        <b><i className="icon-cross"></i></b>
                    </button>
                </div>
            </div>
        );
    }
}

export default Procedure;