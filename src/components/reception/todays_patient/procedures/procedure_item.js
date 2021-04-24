import React, { Component } from 'react';
import Axios from 'axios';
import { PROCEDURES_CREATE, PROCEDURES_DELETE, PROCEDURES_UPDATE } from '../../../../shared/rest_end_points';
import Loading from '../../../../shared/customs/loading/loading';
import { connect } from 'react-redux';
import { notify } from '../../../../actions';
import { ProcedureCreate, ProcedureDelete, ProcedureUpdate } from '../../../../shared/queries';

class ProcedureItem extends Component {

    constructor(props) {
        super(props)
        this.state = {
            description_text_input: { value: this.props.data.procedure_description, error: false },
            charges_text_input: { value: this.props.data.procedure_fee, error: false },
            discount_text_input: { value: this.props.data.procedure_discount, error: false },
            dr_share_text_input: { value: this.props.data.procedure_dr_share, error: false },

            prev_description: this.props.data.procedure_description,
            prev_fee: this.props.data.procedure_fee,
            prev_discount: this.props.data.procedure_discount,
            prev_dr_share: this.props.data.procedure_dr_share,

            edited: false,
            save_click_loading: false,
        }
    }

    handle_change = (e) => {
        this.setState({ [e.target.id]: { value: e.target.value, error: false } }, () => {
            if (this.state.description_text_input.value !== this.state.prev_description ||
                parseInt(this.state.charges_text_input.value) !== this.state.prev_fee ||
                parseInt(this.state.discount_text_input.value) !== this.state.prev_discount ||
                parseInt(this.state.dr_share_text_input.value) !== this.state.prev_dr_share) {
                /**
                 * If data loaded is edited
                 */
                this.setState({ edited: true })
            }
            else {
                this.setState({ edited: false })
            }
        })
    }

    on_save_click = () => {
        /**
         * create request for procedures
         * fee
         * discount
         * description
         */
        this.setState({ save_click_loading: true })
        if (this.props.data.type === 'new') {
            const payload = {
                appointment_id: this.props.appointment_id,
                // doctor_id: 
                fee: parseInt(this.state.charges_text_input.value),
                discount: parseInt(this.state.discount_text_input.value),
                dr_share: parseInt(this.state.dr_share_text_input.value),
                description: this.state.description_text_input.value,                
            }
            // console.log('payload', payload)
            // return ;
            ProcedureCreate(payload).then(res => {
                this.setState({ save_click_loading: false, edited: false })
                this.props.notify('success', '', res.data.message)
                this.props.save_opp(this.props.index, {
                    id: res.data.payload._id, // this.props.data.id,
                    fee: res.data.payload.fee, // parseInt(this.state.charges_text_input.value), 
                    discount: res.data.payload.discount, // parseInt(this.state.discount_text_input.value),
                    dr_share: res.data.payload.dr_share, // parseInt(this.state.dr_share_text_input.value),
                    description: res.data.payload.description, // this.state.description_text_input.value 
                })
                // console.log('error');
                // this.setState({ save_click_loading: false, edited: false })
                // this.props.notify('error', '', res.data.message)
            }).catch(err => {
                console.log('error', err)
                this.setState({ save_click_loading: false, edited: false })
                this.props.notify('error', '', 'Network error')
            })
        }
        else if (this.props.data.type === 'previous') {
            const payload = {
                appointment_id: this.props.appointment_id,
                procedure_id: this.props.data.id,
                fee: parseInt(this.state.charges_text_input.value),
                discount: parseInt(this.state.discount_text_input.value),
                dr_share: parseInt(this.state.dr_share_text_input.value),
                description: this.state.description_text_input.value
            }
            ProcedureUpdate(payload).then(res => {
                console.log('success');
                this.setState({ save_click_loading: false, edited: false })
                this.props.notify('success', '', res.data.message)
                this.props.save_opp(this.props.index, {
                    id: this.props.data.id,
                    fee: parseInt(this.state.charges_text_input.value),
                    discount: parseInt(this.state.discount_text_input.value),
                    dr_share: parseInt(this.state.dr_share_text_input.value),
                    description: this.state.description_text_input.value
                })

                // console.log('error');
                // this.setState({ save_click_loading: false, edited: false })
                // this.props.notify('error', '', res.data.message)
            }).catch(err => {
                console.log('error', err)
                this.setState({ save_click_loading: false, edited: false })
                this.props.notify('error', '', 'Network error')
            })
        }
    }

    on_delete_click = () => {
        /**
         * delete request for procedures
         * appointment id
         * procedure id
         */
        if (this.props.data.type !== 'new') {
            this.props.delete_opp(this.props.index)
            ProcedureDelete(this.props.data.id).then(res => {
                this.setState({ save_click_loading: false, edited: false });
                this.props.notify('success', '', res.data.message);
            }).catch(err => {
                console.log('error', err)
                this.setState({ save_click_loading: false, edited: false })
                this.props.notify('error', '', 'Network error' + err.toString())
            })
        }
        else {
            this.props.delete_opp(-1)
        }
    }

    render() {
        console.log('procedure item props', this.props)
        const save_button_classes = `btn btn-outline btn-sm bg-teal-400 border-teal-400 text-teal-400 secondary btn-icon mx-1 ${this.state.save_click_loading ? 'p-0' : ''}`;
        const update_button_classes = `btn btn-outline-dark btn-sm secondary btn-icon mx-1 ${this.state.save_click_loading ? 'p-0' : ''}`;
        const delete_button_classes = `btn btn-outline btn-sm bg-danger border-danger text-danger secondary btn-icon`;
        return (
            <tr>
                <td className="p-0" style={{ width: '50%' }}>
                    <input
                        id={`description_text_input`}
                        placeholder="Enter Reason"
                        disabled={this.state.save_click_loading}
                        input_type={'text'}
                        className="form-control form-control-lg"
                        onChange={e => this.handle_change(e)}
                        defaultValue={this.state.description_text_input.value}
                        style={{ border: 0 }}
                    // error={this.state.description_text_input.error}
                    />
                </td>
                <td className="p-0" style={{ width: '10%' }}>
                    <input
                        id={`charges_text_input`}
                        placeholder="Charges"
                        input_type={'text'}
                        disabled={this.state.save_click_loading}
                        className="form-control form-control-lg"
                        onChange={e => this.handle_change(e)}
                        defaultValue={this.state.charges_text_input.value}
                        style={{ border: 0 }}
                    // error={this.state.charges_text_input.error}`
                    />
                </td>
                <td className="p-0" style={{ width: '10%' }}>
                    <input
                        id={`discount_text_input`}
                        placeholder="Discount"
                        disabled={this.state.save_click_loading}
                        className="form-control form-control-lg"
                        onChange={e => this.handle_change(e)}
                        defaultValue={this.state.discount_text_input.value}
                        style={{ border: 0 }}
                    // error={this.state.discount_text_input.error}
                    />
                </td>
                <td className="p-0" style={{ width: '10%' }}>
                    <input
                        id={`dr_share_text_input`}
                        placeholder="Dr Share %"
                        disabled={this.state.save_click_loading}
                        className="form-control form-control-lg"
                        onChange={e => this.handle_change(e)}
                        defaultValue={this.state.dr_share_text_input.value}
                        style={{ border: 0 }}
                    // error={this.state.discount_text_input.error}
                    />
                </td>
                <td className="d-flex align-items-end justify-content-center border-0" style={{ padding: '3px' }}>
                    <button className={delete_button_classes}
                        onClick={this.on_delete_click}>
                        <i className="icon-cross" onClick={this.on_delete_click} />
                    </button>
                    {this.state.edited ?
                        <button className={this.props.data.type === 'new' ? save_button_classes : update_button_classes}
                            onClick={this.on_save_click}>
                            {this.state.save_click_loading ? <Loading size="30" /> : <i className="icon-floppy-disk" />}
                        </button> : ''}
                </td>
            </tr>
            // <div className="row">
            //     <div className={`col-lg-7 col-md-4 col-12 px-3`}>
            //         <Inputfield
            //             id={`description_text_input`}
            //             label_tag={'Procedure Reason'}
            //             icon_class={'icon-file-plus'}
            //             placeholder="Enter Reason"
            //             disabled={this.state.save_click_loading}
            //             input_type={'text'}
            //             custom_classes="mb-1"
            //             field_type=""
            //             size="form-control-sm"
            //             on_text_change_listener={this.handle_change}
            //             default_value={this.state.description_text_input.value}
            //             error={this.state.description_text_input.error}
            //         />
            //     </div>

            //     <div className={`col-lg-2 col-md-3 col-6 px-3`}>
            //         <Inputfield
            //             id={`charges_text_input`}
            //             label_tag={'Charges'}
            //             icon_class={'icon-cash3'}
            //             placeholder="Charges"
            //             input_type={'text'}
            //             disabled={this.state.save_click_loading}
            //             custom_classes="mb-1"
            //             field_type=""
            //             size="form-control-sm"
            //             on_text_change_listener={this.handle_change}
            //             default_value={this.state.charges_text_input.value}
            //             error={this.state.charges_text_input.error}
            //         />
            //     </div>

            //     <div className={`col-lg-2 col-md-3 col-6 px-3`}>
            //         <Inputfield
            //             id={`discount_text_input`}
            //             label_tag={'Discount'}
            //             icon_class={'icon-arrow-down132'}
            //             placeholder="Discount"
            //             input_type={'text'}
            //             disabled={this.state.save_click_loading}
            //             custom_classes="mb-1"
            //             field_type=""
            //             size="form-control-sm"
            //             on_text_change_listener={this.handle_change}
            //             default_value={this.state.discount_text_input.value}
            //             error={this.state.discount_text_input.error}
            //         />
            //     </div>

            //     <div className="col-lg-1 col-md-2 col-12 pl-0 d-flex align-items-end justify-content-center">
            //         <button className="btn btn-outline btn-sm bg-danger border-danger text-danger secondary btn-icon mb-1"
            //             onClick={this.on_delete_click}>
            //             <i className="icon-cross" />
            //         </button>
            //         {this.state.edited? 
            //             <button className={this.props.data.type === 'new'? save_button_classes: update_button_classes}
            //                 onClick={this.on_save_click}>
            //             {this.state.save_click_loading? <Loading size="30" />:<i className="icon-floppy-disk" />}
            //         </button>:''}
            //     </div>

            // </div>
        )
    }
}
export default connect(null, { notify })(ProcedureItem)