import React, { Component } from 'react';
import { BLOOD_GROUPS_OPTIONS, ROLES_OPTIONS, GENDER_OPTIONS } from '../constant_data';
import { REGISTER_USER_REQUEST, REGISTER_USER_REQUEST_BY_ADMIN } from '../rest_end_points';
import Axios from 'axios';
import Loading from '../customs/loading/loading';
import DateTimePicker from 'react-datetime';
import Select from 'react-select'
import { connect } from "react-redux";
import { notify } from '../../actions';
import Inputfield from '../customs/inputfield/inputfield';
// import NO_PICTURE from '../../resources/images/placeholder.jpg';
import Modal from 'react-bootstrap4-modal';
// import { Link } from 'react-router-dom';

class NewUserModal extends Component {
        
    constructor(props){
        super(props);
        this.state = {
            loading_status: false,

            user_first_name: { value: '', error: false },
            user_last_name: { value: '', error: false },
            user_email: { value: '', error: false },
            user_gender: { value: '', error: false },
            user_dob: { value: '', error: false },
            user_blood_group: { value: '', error: false },
            user_role: { value: 'Patient', error: false },
            user_phone_number: { value: '', error: false },
            user_cnic: { value: '', error: false },
        }
    }

    on_text_field_change = (e) => {
        switch (e.target.id) {
            case 'user_first_name_text_input':
                this.setState({ user_first_name: { value: e.target.value, error: false } })
                break;
            case 'user_last_name_text_input':
                this.setState({ user_last_name: { value: e.target.value, error: false } })
                break;
            case 'user_cnic_text_input':
                if (e.target.value.length <= 13)
                    this.setState({ user_cnic: { value: e.target.value, error: false } })
                break;
            case 'user_phone_number_text_input':
                if (e.target.value.length <= 11)
                    this.setState({ user_phone_number: { value: e.target.value, error: false } })
                break;
            case 'user_email_text_input':
                this.setState({ user_email: { value: e.target.value, error: false } })
                break;
            case 'user_address_text_input':
                this.setState({ user_address: { value: e.target.value, error: false } })
                break;
            default:
                break;
        }
    }

    on_selected_changed = (e, actor) => {
        if (e !== null) {
            switch (e.id) {
                case 'blood_group_selection':
                    this.setState({ user_blood_group: { value: e.label, error: false } })
                    break;
                case 'gender_selection':
                    this.setState({ user_gender: { value: e.label, error: false } })
                    break;
                default:
                    break;
            }
        }
        else {
            switch (actor) {
                case 'blood_group_selection':
                    this.setState({ user_blood_group: { value: '', error: false } })
                    break;
                case 'gender_selection':
                    this.setState({ user_gender: { value: '', error: false } })
                    break;
                default:
                    break;
            }
        }
    }
    on_user_date_of_birth_change = (e) => {
        if (e === '')
            this.setState({ user_dob: { value: '', error: false } })
        else {
            var configured_date = null;
            try {
                configured_date = e.format('ll');
            }
            catch (err) {
                configured_date = ''
            }
            finally {
                this.setState({ user_dob: { value: configured_date, error: false } })
            }
        }
    }

    check_input = (input,required = true,only_alpha=false,only_numbers=false) => {
        const alphabets = /^[A-Za-z]+$/;
        const numbers = /^[0-9]+$/;
        if (required  && input === ''){
            return true;
        }
        if (only_alpha && input !== '' && !input.match(alphabets)){
            return true;
        }
        if (only_numbers && input !== '' && !input.match(numbers)){
            return true;
        }
        return false;
    }
    check_hard_constraints = (input,include="",length_check="default",val=-1) => {
        if (!input.includes(include)) {
            return true;
        }
        switch(length_check){
            case 'eq':
                if (input.length !== val){
                    return true
                }
                break;
            case 'min':
                if (input.length < val){
                    return true
                }
                break;
            case 'max':
                if (input.length > val){
                    return true
                }
                break;
            default:
                break
        }
        return false;
    }

    on_submit = async () => {
        this.setState({ loading_status: true })
        let error = false
        if (this.check_input(this.state.user_first_name.value,true,true,false)){
            this.setState({ user_first_name: { value: this.state.user_first_name.value, error: true }})
            error = true
            // this.props.notify('error','','First name is required')
        }
        if (this.check_input(this.state.user_last_name.value,true,true)){
            this.setState({ user_last_name: { value: this.state.user_last_name.value, error: true }})
            error = true
            // this.props.notify('error','','Last name is required')
        }
        if (this.check_input(this.state.user_email.value,false,false,false) && 
                this.check_hard_constraints(this.state.user_email.value,"@")){
            this.setState({ user_email: { value: this.state.user_email.value, error: true }})
            error = true
            // this.props.notify('error','','Email is required')
        }
        if (this.check_input(this.state.user_phone_number.value,true,false,true) && 
                this.check_hard_constraints(this.state.user_phone_number.value,"","eq",11)){
            this.setState({ user_phone_number: { value: this.state.user_phone_number.value, error: true }})
            error = true 
        }
        if (this.check_input(this.state.user_cnic.value,false,false,true) && 
                this.check_hard_constraints(this.state.user_cnic.value,"","eq",13)){
            this.setState({ user_cnic: { value: this.state.user_cnic.value, error: true }})
            error = true
        }
        if (this.check_input(this.state.user_dob.value,true)){
            this.setState({ user_dob: { value: this.state.user_dob.value, error: true }})
            error = true
        }
        if (this.check_input(this.state.user_gender.value,true)){
            this.setState({ user_gender: { value: this.state.user_gender.value, error: true }})
            error = true
        }
        if (this.check_input(this.state.user_blood_group.value,true)){
            this.setState({ user_blood_group: { value: this.state.user_blood_group.value, error: true }})
            error = true
        }

        if (error === true){
            this.props.notify('error','','Invalid inputs')
            this.setState({ loading_status: false })
            return
        }
        const data = {
            first_name: this.state.user_first_name.value.trim(),
            last_name: this.state.user_last_name.value.trim(),
            phone_number: this.state.user_phone_number.value.trim(),
            cnic: this.state.user_cnic.value.trim(),
            role: this.state.user_role.value.trim(),
            dob: this.state.user_dob.value,
            gender: this.state.user_gender.value.trim(),
            blood_group: this.state.user_blood_group.value.trim(),
        }

        var response = await Axios.post(`${REGISTER_USER_REQUEST_BY_ADMIN}`, { 
            admin_id: this.props.active_user._id, 
            patient: data 
        }, { 
            headers: { 'code-medicine': localStorage.getItem('user') } 
        });

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
            this.props.notify('error', '', 'No connection! Please try again later')
            this.setState({ loading_status: false })
        }
    }

    close_modal = () => {
        this.props.close()
        this.props.call_back()
        
    }

    render() {
        {/* <Register/> */ }
        const add_user_modal_body = <div className="modal-body">
            <div className={`row`}>
                <div className={`col-md-8`}>
                    <div className={`row`}>
                        <div className={`col-md-6 px-3`}>
                            <Inputfield
                                id={`user_first_name_text_input`}

                                label_tag={'First name'}
                                icon_class={'icon-user-check'}
                                input_type={'text'}
                                placeholder="Enter first name"
                                on_text_change_listener={this.on_text_field_change}
                                default_value={this.state.user_first_name.value}
                                error={this.state.user_first_name.error} />
                        </div>
                        <div className={`col-md-6 px-3`}>
                            <Inputfield
                                id={`user_last_name_text_input`}

                                label_tag={'Last name'}
                                icon_class={'icon-user-check'}
                                input_type={'text'}
                                placeholder="Enter last name"
                                on_text_change_listener={this.on_text_field_change}
                                default_value={this.state.user_last_name.value}
                                error={this.state.user_last_name.error} />
                        </div>
                    </div>
                    <div className={`row`}>
                        <div className={`col-md-6 px-3`}>
                            <Inputfield
                                id={`user_phone_number_text_input`}

                                label_tag={'Phone number'}
                                icon_class={'icon-phone2'}
                                input_type={'number'}
                                placeholder="Enter phone number"
                                on_text_change_listener={this.on_text_field_change}
                                default_value={this.state.user_phone_number.value}
                                error={this.state.user_phone_number.error} />
                        </div>
                        <div className={`col-md-6  px-3`}>
                            <Inputfield 
                                id={`user_dob_text_input`}
                                label_tag={'Date of birth'}
                                icon_class={'icon-calendar3'}
                                placeholder="Date of birth"
                                input_type={'text'}
                                field_type="date-time"
                                date_format={'ll'}
                                time_format={false}
                                on_text_change_listener={this.on_user_date_of_birth_change}
                                default_value={this.state.user_dob.value}
                                error={this.state.user_dob.error}
                                />
                        </div>
                        
                    </div>
                    <div className={`row`}>
                        <div className={`col-md-6 px-3`}>
                            <Inputfield
                                id={`user_cnic_text_input`}

                                label_tag={'CNIC'}
                                icon_class={'icon-vcard'}
                                input_type={'number'}
                                placeholder="Enter CNIC"
                                on_text_change_listener={this.on_text_field_change}
                                default_value={this.state.user_cnic.value}
                                error={this.state.user_cnic.error} />
                        </div>
                        <div className={`col-md-6 px-3`}>
                            <Inputfield
                                id={`user_email_text_input`}

                                label_tag={'Enter email'}
                                icon_class={'icon-envelop'}
                                input_type={'email'}
                                placeholder="Enter email"
                                on_text_change_listener={this.on_text_field_change}
                                default_value={this.state.user_email.value}
                                error={this.state.user_email.error} />
                        </div>
                    </div>
                </div>
                <div className="col-md-4 border border-secondary border-top-0 border-bottom-0 border-right-0 d-flex align-items-center">
                    <div className={`row`}>
                        <div className={`col-12`}>
                            <div className="form-group form-group-feedback form-group-feedback-right">
                                <Select
                                    isClearable
                                    menuPlacement="auto"
                                    options={GENDER_OPTIONS}
                                    classNamePrefix={`form-control`}
                                    placeholder="Select Gender"
                                    id="gender_selection"
                                    onChange={e => this.on_selected_changed(e, 'gender_selection')}
                                    // value={this.state.user_gender.value}
                                    styles={{
                                        container: base => ({
                                        ...base,
                                        backgroundColor: this.state.user_gender.error? '#FF0000':'',
                                        padding: 1,
                                        borderRadius: 5
                                        }),
                                    }}
                                />
                            </div>
                        </div>
                        <div className={`col-12`}>
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
                                    styles={{
                                        container: base => ({
                                        ...base,
                                        backgroundColor: this.state.user_gender.error? '#FF0000':'',
                                        padding: 1,
                                        borderRadius: 5
                                        }),
                                    }}
                                />
                            </div>
                            <hr />
                        </div>
                        <div className={`col-12`} style={{display: 'none'}}>
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
                            </div>
                        </div>
                        <div className="col-12">
                        
                            <button
                                type="button"
                                className="btn bg-teal-400 btn-labeled btn-block btn-labeled-right pr-5"
                                style={{ textTransform: "inherit" }}
                                onClick={this.on_submit}>
                                <b><i className="icon-plus3"></i></b>
                                Add
                            </button>
                        </div>
                        <div className="col-12 mt-3">
                            
                            <button
                                type="button"
                                className="btn bg-danger btn-labeled btn-block btn-labeled-right pr-5"
                                style={{ textTransform: "inherit" }}
                                onClick={this.close_modal}>
                                <b><i className="icon-cross"></i></b>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
                {/* <div className={`col-md-3`}>
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
                </div> */}
            </div>
            
        </div>
        return(
            <Modal
                visible={this.props.visibility}
                onClickBackdrop={this.close_modal}
                fade={true}
                dialogClassName={`modal-dialog-centered modal-lg`}>

                <div className="modal-header bg-teal-400">
                    <h5 className="modal-title">New Patient</h5>
                </div>

                {this.state.loading_status ? <Loading /> : add_user_modal_body}
                
            </Modal>
        )
    }
}
function map_state_to_props(state) {
    return { 
        active_user: state.active_user 
    }
}
export default connect(map_state_to_props, { notify })(NewUserModal)