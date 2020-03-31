import React, { Component } from 'react';
import { BLOOD_GROUPS_OPTIONS, ROLES_OPTIONS, GENDER_OPTIONS } from '../constant_data';
import { REGISTER_USER_REQUEST } from '../rest_end_points';
import Axios from 'axios';
import Loading from '../customs/loading/loading';
import DateTimePicker from 'react-datetime';
import Select from 'react-select'
import { connect } from "react-redux";
import { notify } from '../../actions';
import Inputfield from '../customs/inputfield/inputfield';
import NO_PICTURE from '../../resources/images/placeholder.jpg';
import Modal from 'react-bootstrap4-modal';
import { Link } from 'react-router-dom';

class NewUserModal extends Component {
        
    constructor(props){
        super(props);
        this.state = {
            loading_status: false,

            user_first_name: { value: '' },
            user_last_name: { value: '' },
            user_email: { value: '' },
            user_gender: { value: '' },
            user_dob: { value: '' },
            user_blood_group: { value: '' },
            user_role: { value: 'Patient' },
            user_phone_number: { value: '' },
            user_cnic: { value: '' },
            user_address: { value: '' },
        }
    }

    on_text_field_change = (e) => {
        switch (e.target.id) {
            case 'user_first_name_text_input':
                this.setState({ user_first_name: { value: e.target.value } })
                break;
            case 'user_last_name_text_input':
                this.setState({ user_last_name: { value: e.target.value } })
                break;
            case 'user_cnic_text_input':
                this.setState({ user_cnic: { value: e.target.value } })
                break;
            case 'user_phone_number_text_input':
                this.setState({ user_phone_number: { value: e.target.value } })
                break;
            case 'user_email_text_input':
                this.setState({ user_email: { value: e.target.value } })
                break;
            case 'user_address_text_input':
                this.setState({ user_address: { value: e.target.value } })
                break;
            default:
                break;
        }
    }

    on_selected_changed = (e, actor) => {
        if (e !== null) {
            switch (e.id) {
                case 'blood_group_selection':
                    this.setState({ user_blood_group: { value: e.label } })
                    break;
                case 'gender_selection':
                    this.setState({ user_gender: { value: e.label } })
                    break;
                default:
                    break;
            }
        }
        else {
            switch (actor) {
                case 'blood_group_selection':
                    this.setState({ user_blood_group: { value: '' } })
                    break;
                case 'gender_selection':
                    this.setState({ user_gender: { value: '' } })
                    break;
                default:
                    break;
            }
        }
    }
    on_user_date_of_birth_change = (e) => {
        if (e === '')
            this.setState({ user_dob: { value: '' } })
        else {
            var configured_date = null;
            try {
                configured_date = e.format('ll');
            }
            catch (err) {
                configured_date = ''
            }
            finally {
                this.setState({ user_dob: { value: configured_date } })
            }
        }
    }

    on_submit = async () => {
        const data = {
            first_name: this.state.user_first_name.value.trim(),
            last_name: this.state.user_last_name.value.trim(),
            email: this.state.user_email.value.trim(),
            password: 'default',
            phone_number: this.state.user_phone_number.value.trim(),
            cnic: this.state.user_cnic.value.trim(),
            role: this.state.user_role.value.trim(),
            dob: this.state.user_dob.value,
            gender: this.state.user_gender.value.trim(),
            blood_group: this.state.user_blood_group.value.trim(),
            address: this.state.user_address.value.trim()
        }
        this.setState({ loading_status: true })

        var response = await Axios.post(`${REGISTER_USER_REQUEST}`, data);

        try {
            if (response.data['status']) {
                this.props.notify('success', '', response.data['message']);
                this.setState({ loading_status: false })
            }
            else {
                this.props.notify('error', '', response.data['message'])
                this.setState({ loading_status: false })
            }
        }
        catch (err) {
            this.props.notify('error', '', 'We are sorry for invonvenience. Server is not responding! please try again later')
        }
    }

    render() {
        {/* <Register/> */ }
        const add_user_modal_body = <div className="modal-body">
            <div className={`row`}>
                <div className={`col-md-9 `}>
                    <div className={`row`}>
                        <div className={`col-md-6 px-3`}>
                            <Inputfield
                                id={`user_first_name_text_input`}

                                label_tag={'First name'}
                                icon_class={'icon-user-check'}
                                input_type={'text'}
                                placeholder="Enter first name"
                                on_text_change_listener={this.on_text_field_change}
                                default_value={this.state.user_first_name.value} />
                        </div>
                        <div className={`col-md-6 px-3`}>
                            <Inputfield
                                id={`user_last_name_text_input`}

                                label_tag={'Last name'}
                                icon_class={'icon-user-check'}
                                input_type={'text'}
                                placeholder="Enter last name"
                                on_text_change_listener={this.on_text_field_change}
                                default_value={this.state.user_last_name.value} />
                        </div>
                    </div>
                    <div className={`row`}>
                        <div className={`col-md-4 px-3`}>
                            <Inputfield
                                id={`user_phone_number_text_input`}

                                label_tag={'Phone number'}
                                icon_class={'icon-user-check'}
                                input_type={'number'}
                                placeholder="Enter phone number"
                                on_text_change_listener={this.on_text_field_change}
                                default_value={this.state.user_phone_number.value} />
                        </div>
                        <div className={`col-md-4 px-3`}>
                            <Inputfield
                                id={`user_cnic_text_input`}

                                label_tag={'CNIC'}
                                icon_class={'icon-user-check'}
                                input_type={'number'}
                                placeholder="Enter CNIC"
                                on_text_change_listener={this.on_text_field_change}
                                default_value={this.state.user_cnic.value} />
                        </div>
                        <div className={`col-md-4 px-3`}>
                            <Inputfield
                                id={`user_email_text_input`}

                                label_tag={'Enter email'}
                                icon_class={'icon-user-check'}
                                input_type={'email'}
                                placeholder="Enter email"
                                on_text_change_listener={this.on_text_field_change}
                                default_value={this.state.user_email.value} />
                        </div>
                    </div>
                </div>
                <div className={`col-md-3`}>
                    <div className={`d-flex justify-content-center`}>
                        <div className="card-img-actions d-inline-block mb-3">
                            <img className="img-fluid rounded-circle" src={NO_PICTURE} style={{ width: 130, height: 130 }} alt="" />
                            <div className="card-img-actions-overlay card-img rounded-circle">
                                <Link to={"#"} className="btn btn-outline bg-white text-white border-white border-2 btn-icon rounded-round">
                                    <i className="icon-plus3"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`row`}>
                <div className={`col-md-8  px-3`}>
                    <Inputfield
                        id={`user_address_text_input`}

                        label_tag={'New patient address'}
                        icon_class={'icon-user-check'}
                        placeholder="Enter address"
                        input_type={'text'}
                        field_type="text-area"
                        on_text_change_listener={this.on_text_field_change}
                        default_value={this.state.user_address.value} />
                </div>
                <div className={`col-md-4  px-3`}>
                    <div className={`form-group row`}>
                        <label className={`col-form-label-lg `}>Date of birth</label>
                        <div className="input-group">
                            <span className="input-group-prepend">
                                <span className="input-group-text">
                                    <i className="icon-calendar3 text-muted"></i>
                                </span>
                            </span>
                            <DateTimePicker id="user_dob_text_input"
                                onChange={this.on_user_date_of_birth_change}
                                className="clock_datatime_picker form-control form-control-lg"
                                inputProps={{ placeholder: 'Date of birth', className: 'border-0 w-100' }}
                                input={true}
                                dateFormat={'ll'}
                                timeFormat={false}
                                closeOnSelect={true}
                                value={this.state.user_dob.value}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <hr />
            <div className={`row`}>
                <div className={`col-md-3`}>
                    <div className="form-group form-group-feedback form-group-feedback-right">
                        <Select
                            isClearable
                            menuPlacement="auto"
                            options={GENDER_OPTIONS}
                            classNamePrefix={`form-control`}
                            placeholder="Select Gender"
                            id="gender_selection"
                            onChange={e => this.on_selected_changed(e, 'gender_selection')}
                        />
                        <div className="form-control-feedback">
                            <i className="icon-user-check text-muted"></i>
                        </div>
                    </div>
                </div>
                <div className={`col-md-3`}>
                    <div className="form-group form-group-feedback form-group-feedback-right">
                        <Select
                            isClearable
                            menuPlacement="auto"
                            options={BLOOD_GROUPS_OPTIONS}
                            className={`Select-option`}
                            classNamePrefix={`form-control`}
                            placeholder="Select blood group"
                            id="blood_group_selection"
                            onChange={e => this.on_selected_changed(e, 'blood_group_selection')}
                        />
                        <div className="form-control-feedback">
                            <i className="icon-user-check text-muted"></i>
                        </div>
                    </div>
                </div>
                <div className={`col-md-3`}>
                    <div className="form-group form-group-feedback form-group-feedback-right">
                        <Select
                            isClearable
                            menuPlacement="auto"
                            options={ROLES_OPTIONS}
                            className={`Select-option`}
                            classNamePrefix={`form-control`}
                            placeholder="Select roles"
                            id="role_selection"
                            value={[{ id: 'role_selection', label: 'Patient' }]}
                            isDisabled
                        />
                        <div className="form-control-feedback">
                            <i className="icon-user-check text-muted"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        return(
            <Modal
                visible={this.props.visibility}
                onClickBackdrop={this.props.close}
                fade={true}
                dialogClassName={`modal-dialog-centered modal-lg`}>

                <div className="modal-header bg-teal-400">
                    <h5 className="modal-title">New Patient</h5>
                </div>

                {this.state.loading_status ? <Loading /> : add_user_modal_body}
                <div className="modal-footer">
                    <button
                        type="button"
                        className="btn bg-danger btn-labeled btn-labeled-right pr-5"
                        style={{ textTransform: "inherit" }}
                        onClick={this.props.close}>
                        <b><i className="icon-cross"></i></b>
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="btn bg-teal-400 btn-labeled btn-labeled-right pr-5"
                        style={{ textTransform: "inherit" }}
                        onClick={this.on_submit}>
                        <b><i className="icon-plus3"></i></b>
                        Add
                    </button>
                </div>
            </Modal>
        )
    }
}
function map_state_to_props(notify) {
    return { notify }
}
export default connect(map_state_to_props, { notify })(NewUserModal)