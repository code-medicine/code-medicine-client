import React, { Component } from 'react';
import ProcedureItem from './procedure_item';
import Modal from "react-bootstrap4-modal";
import Inputfield from '../../../shared/customs/inputfield/inputfield';
import { connect } from 'react-redux';
import { notify } from '../../../actions';


class ProcedureModal extends Component {


    constructor(props) {
        super(props)
        this.state = {
            consultancy_fee_text_input: { value: "0", error: false },
            discount_text_input: { value: "0", error: false },
            total: 0,
            discount: 0,
            procedures_list: []
        }
    }

    componentDidMount() {
        // this.add_procedure({
        //     procedure_fee: 0,
        //     procedure_discount: 0,
        //     procedure_description: '',
        //     type: 'new'
        // })
    }

    add_procedure(item) {
        const temp = this.state.procedures_list;
        temp.push(item)
        this.setState({ procedures_list: temp }, () => {
            this.scrollToBottom()
        });
    };

    save_procedure = (key) => {
        const temp = this.state.procedures_list;
        temp[key].type = 'previous';
        // console.log('proc',temp,'key',key)
        this.setState({ procedures_list: temp })
    }

    delete_procedure = (key) => {
        const temp = this.state.procedures_list;
        if (key === -1)
            temp.pop();
        else{
            temp.splice(key,1);
        }
        this.setState({ procedures_list: [] }, () => {
            this.setState({ procedures_list: temp })
        })
    }

    add_procedure_click = () => {
        if ((this.state.procedures_list.filter((data) => { return data.type === 'new' })).length === 0) {
            this.add_procedure({
                procedure_fee: 0,
                procedure_discount: 0,
                procedure_description: '',
                type: 'new'
            })
        }
        else {
            this.props.notify('info','','There is an unsaved procedure. Please save it first')
        }
    }

    componentWillReceiveProps(new_props) {
        console.log('new props',new_props)
        if (new_props.prev_procedure_list.length > 0) {
            console.log('previous')
            const prev_list = new_props.prev_procedure_list
            const temp = [];
            for (let i = 0; i < prev_list.length; ++i) {
                temp.push({
                    id: new_props.prev_procedure_list[i].id,
                    procedure_fee: new_props.prev_procedure_list[i].fee,
                    procedure_discount: new_props.prev_procedure_list[i].discount,
                    procedure_description: new_props.prev_procedure_list[i].description,
                    type: 'previous'
                })
            }
            this.setState({
                procedures_list: temp
            })
        }
    }

    handle_change = (e) => {
        const that = this;
        this.setState({ [e.target.id]: { value: e.target.value, error: false } }, () => {
            that.handle_total_values()
        })
    }

    handle_total_values = () => {
        let procedure_total = 0;
        // for (let i = 0; i < this.state.procedureList.length;++i){
        //     procedure_total += this.state.procedureList[i].fee - this.state.procedureList[i].discount;
        // }

        const t_total = this.state.consultancy_fee_text_input.value.length > 0 ?
            parseInt(this.state.consultancy_fee_text_input.value) : 0;
        const t_discount = this.state.discount_text_input.value.length > 0 ?
            parseFloat(this.state.discount_text_input.value) : 0;
        this.setState({
            total: (t_total - t_discount) + procedure_total,
            discount: t_discount
        })
    }

    show_procedures = () => {
        return this.state.procedures_list.map((item, index) => {
            return <ProcedureItem 
                    key={index} 
                    appointment_id={this.props.appointment_id} 
                    data={item} 
                    index={index}
                    save_opp={this.save_procedure}
                    delete_opp={this.delete_procedure} />
        })
    }

    handle_close_modal = () => {
        this.setState({ procedures_list: [] })
        this.props.cancelProcedureModal()
    }

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
                        onClick={this.add_procedure_click}
                    >
                        <b><i className="icon-plus3" /></b>
                        Add
                    </button>
                </div>
                <div className="modal-body pt-1"  style={{ height: '65vh', overflowY: 'auto',overflowX: 'hidden' }}>
                    <div className="row" >
                        <div className="col-lg-3 col-6 px-3">
                            <Inputfield
                                id="consultancy_fee_text_input"
                                label_tag="Consultancy Fee"
                                icon_class="icon-cash3"
                                placeholder="Enter consultancy fee"
                                custom_classes=""
                                default_value={this.state.consultancy_fee_text_input.value}
                                error={this.state.consultancy_fee_text_input.error}
                                on_text_change_listener={this.handle_change}
                                size="form-control-sm"
                            />
                        </div>
                        <div className="col-lg-3 col-6 px-3">
                            <Inputfield
                                id="discount_text_input"
                                label_tag="Discount over total"
                                icon_class="icon-arrow-down132"
                                placeholder="Enter Total discount"
                                default_value={this.state.discount_text_input.value}
                                error={this.state.discount_text_input.error}
                                on_text_change_listener={this.handle_change}
                                size="form-control-sm"
                            />
                        </div>
                    </div>
                    <hr className="mt-0 mb-1" />
                    {/* 
                    
                    procedure modals
                    
                    */}
                    {
                        this.show_procedures()
                    }
                    
                    <div style={{ float: "left", clear: "both" }}
                        ref={(el) => { this.last_element = el; }}>
                    </div>
                </div>
                <div className="modal-footer border border-top pt-3">
                    <div className="mr-auto">
                        <span className="badge badge-light badge-striped badge-striped-left border-left-teal-400" >
                            <span className="h6 font-weight-bold mr-1">Total: {this.state.total}</span>
                        </span>
                        <span className="ml-2 badge badge-light badge-striped badge-striped-left border-left-teal-400">
                            <span className="h6 font-weight-bold mr-1">Discount: {this.state.discount}</span>
                        </span>
                    </div>
                    <button
                        type="button"
                        className="btn bg-dark btn-labeled btn-labeled-right pr-5 "
                        style={{ textTransform: "inherit" }}
                        onClick={this.handle_close_modal}
                    >
                        <b><i className="icon-cross" /></b>
                        Cancel
                    </button>
                    <button
                        disabled={this.state.procedures_list.length === 0}
                        type="button"
                        className="btn bg-teal-400 btn-labeled btn-labeled-right pr-5"
                        style={{ textTransform: "inherit" }}
                        onClick={this.handlerSubmit}
                    >
                        <b><i className="icon-checkmark2" /></b>
                        Done
                    </button>
                </div>

            </Modal>
        )
    }
}
export default connect(null,{notify})( ProcedureModal);