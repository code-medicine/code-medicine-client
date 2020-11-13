import React, { Component } from 'react';
import { BLOOD_GROUPS_OPTIONS, GENDER_OPTIONS, CITIES, COUTRIES } from '../constant_data';
import { ADMIN_CREATE_PATIENT } from '../rest_end_points';
import Axios from 'axios';
import Loading from '../customs/loading/loading';
// import DateTimePicker from 'react-datetime';
import Select from 'react-select'
import { connect } from "react-redux";
import { notify } from '../../actions';
import Inputfield from '../customs/inputfield/inputfield';
// import NO_PICTURE from '../../resources/images/placeholder.jpg';
import Modal from 'react-bootstrap4-modal';
// import { Link } from 'react-router-dom';

class NewUserModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading_status: false,

            user_first_name: { value: '', error: false },
            user_last_name: { value: '', error: false },
            user_phone_number: { value: '', error: false },
            user_dob: { value: '', error: false },
            user_cnic: { value: '', error: false },
            user_email: { value: '', error: false },

            user_country: { value: 'Pakistan', error: false },
            user_city: { value: 'Lahore', error: false },
            user_address: { value: '', error: false },

            user_gender: { value: 'Male', error: false },
            user_blood_group: { value: 'Unknown', error: false },
            user_role: { value: 'Patient', error: false },
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
                case 'country_selection':
                    this.setState({ user_country: { value: e.label, error: false } })
                    break;
                case 'city_selection':
                    this.setState({ user_city: { value: e.label, error: false } })
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
                case 'country_selection':
                    this.setState({ user_country: { value: '', error: false } })
                    break;
                case 'city_selection':
                    this.setState({ user_city: { value: '', error: false } })
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

    check_input = (input, required = true, only_alpha = false, only_numbers = false) => {
        const alphabets = /^[A-Za-z]+$/;
        const numbers = /^[0-9]+$/;
        if (required && input === '') {
            return true;
        }
        if (only_alpha && input !== '' && !input.match(alphabets)) {
            return true;
        }
        if (only_numbers && input !== '' && !input.match(numbers)) {
            return true;
        }
        return false;
    }
    check_hard_constraints = (input, include = "", length_check = "default", val = -1) => {
        if (!input.includes(include)) { return true; }
        switch (length_check) {
            case 'eq':
                if (input.length !== val) { return true }
                break;
            case 'min':
                if (input.length < val) { return true }
                break;
            case 'max':
                if (input.length > val) { return true }
                break;
            default:
                break
        }
        return false;
    }

    on_submit = async () => {
        await this.setState({ loading_status: true })
        let error = false
        /** firstname */
        if (this.check_input(this.state.user_first_name.value, true, true, false)) {
            this.setState({ user_first_name: { value: this.state.user_first_name.value, error: true } })
            error = true
        }
        /** lastname */
        if (this.check_input(this.state.user_last_name.value, true, true)) {
            this.setState({ user_last_name: { value: this.state.user_last_name.value, error: true } })
            error = true
        }
        /** phone number */
        if (this.check_input(this.state.user_phone_number.value, true, false, true) && this.check_hard_constraints(this.state.user_phone_number.value, "", "eq", 11)) {
            this.setState({ user_phone_number: { value: this.state.user_phone_number.value, error: true } })
            error = true
        }
        // if (this.check_input(this.state.user_dob.value)) {
        //     this.setState({ user_dob: { value: this.state.user_dob.value, error: true } })
        //     error = true
        // }
        /** cnic */
        if (this.check_input(this.state.user_cnic.value, false, false, true) && this.check_hard_constraints(this.state.user_cnic.value, "", "eq", 13)) {
            this.setState({ user_cnic: { value: this.state.user_cnic.value, error: true } })
            error = true
        }
        /** email */
        if (this.check_input(this.state.user_email.value, false, false, false) && this.check_hard_constraints(this.state.user_email.value, "@")) {
            this.setState({ user_email: { value: this.state.user_email.value, error: true } })
            error = true
        }
        /** country */
        if (this.check_input(this.state.user_country.value, true, true)) {
            this.setState({ user_country: { value: this.state.user_country.value, error: true } })
            error = true
        }
        /** city */
        if (this.check_input(this.state.user_city.value, true, true)) {
            this.setState({ user_city: { value: this.state.user_city.value, error: true } })
            error = true
        }
        /** address */
        if (this.check_input(this.state.user_address.value, true)) {
            this.setState({ user_address: { value: this.state.user_address.value, error: true } })
            error = true
        }
        /** gender */
        if (this.check_input(this.state.user_gender.value, true)) {
            this.setState({ user_gender: { value: this.state.user_gender.value, error: true } })
            error = true
        }
        /** blood group */
        if (this.check_input(this.state.user_blood_group.value, true)) {
            this.setState({ user_blood_group: { value: this.state.user_blood_group.value, error: true } })
            error = true
        }

        if (error === true) {
            this.props.notify('error', '', 'Invalid inputs')
            this.setState({ loading_status: false })
            return
        }
        const data = {
            admin_id: this.props.active_user._id,
            patient: {
                first_name: this.state.user_first_name.value.trim(),
                last_name: this.state.user_last_name.value.trim(),
                phone_number: this.state.user_phone_number.value.trim(),
                date_of_birth: this.state.user_dob.value,
                cnic: this.state.user_cnic.value.trim(),
                email: this.state.user_email.value.trim(),
                country: this.state.user_country.value,
                city: this.state.user_city.value,
                address: this.state.user_address.value.trim(),
                gender: this.state.user_gender.value.trim(),
                blood_group: this.state.user_blood_group.value.trim(),
                role: this.state.user_role.value.trim(),
            }
        }
        Axios.post(ADMIN_CREATE_PATIENT, data).then(response => {
            this.props.notify('success', '', response.data['message']);
            this.setState({ loading_status: false }, () => {
                this.close_modal()
            })
        }).catch(err => {
            this.props.notify('error', '', 'No connection!' + err.toString())
            this.setState({ loading_status: false })
        })
    }

    close_modal = () => {
        this.props.close()
        this.props.call_back()

    }

    render() {
        const add_user_modal_body = <div className="modal-body">
            <div className={`row`}>
                <div className={`col-md-4 px-3`}>
                    <div className="form-group">
                        <Inputfield
                            id={`user_first_name_text_input`}
                            heading={'First name'}
                            placeholder="Enter first name"
                            required
                            onChange={this.on_text_field_change}
                            value={this.state.user_first_name.value}
                            error={this.state.user_first_name.error} />
                    </div>
                </div>
                <div className="col-md-4 px-3">
                    <div className="form-group">
                        <Inputfield
                            id={`user_last_name_text_input`}
                            heading={'Last name'}
                            placeholder="Enter last name"
                            required
                            onChange={this.on_text_field_change}
                            value={this.state.user_last_name.value}
                            error={this.state.user_last_name.error} />
                    </div>
                </div>
                <div className="col-md-4 px-3">
                    <div className="form-group">
                        <Inputfield
                            id={`user_phone_number_text_input`}
                            heading={'Phone number'}
                            placeholder="Enter phone number"
                            required
                            onChange={this.on_text_field_change}
                            value={this.state.user_phone_number.value}
                            error={this.state.user_phone_number.error} />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-4 px-3">
                    <div className="form-group">
                        <Inputfield
                            id={`user_dob_text_input`}
                            heading={'Date of birth'}
                            icon_class={'icon-calendar3'}
                            placeholder="Date of birth"
                            input_type={'text'}
                            field_type="date-time"
                            date_format={'ll'}
                            time_format={false}
                            onChange={this.on_user_date_of_birth_change}
                            value={this.state.user_dob.value}
                            error={this.state.user_dob.error}
                        />
                    </div>
                </div>
                <div className="col-md-4 px-3">
                    <div className="form-group">
                        <Inputfield
                            id={`user_cnic_text_input`}
                            heading={'CNIC'}
                            icon_class={'icon-vcard'}
                            input_type={'number'}
                            placeholder="Enter CNIC"
                            onChange={this.on_text_field_change}
                            value={this.state.user_cnic.value}
                            error={this.state.user_cnic.error} />
                    </div>
                </div>
                <div className="col-md-4 px-3">
                    <div className="form-group">
                        <Inputfield
                            id={`user_email_text_input`}
                            heading={'Enter email'}
                            icon_class={'icon-envelop'}
                            input_type={'email'}
                            placeholder="Enter email"
                            onChange={this.on_text_field_change}
                            value={this.state.user_email.value}
                            error={this.state.user_email.error} />
                    </div>
                </div>
            </div>
            <hr />
            <div className="row">
                <div className="col-md-8">
                    <div className="row">
                        <div className="col-md-6">
                            <Inputfield 
                                heading={'Country'}
                                field_type="select"
                                required
                                isClearable
                                menuPlacement="auto"
                                options={COUTRIES}
                                classNamePrefix={`form-control`}
                                placeholder="Select Country"
                                id="country_selection"
                                isDisabled
                                onChange={e => this.on_selected_changed(e, 'country_selection')}
                                value={{ id: 'country_selection', label: this.state.user_country.value }}
                                defaultValue={{ id: 'country_selection', label: 'Pakistan' }}
                                styles={{
                                    container: base => ({
                                        ...base,
                                        backgroundColor: this.state.user_country.error ? '#FF0000' : '',
                                        padding: 1,
                                        borderRadius: 5
                                    }),
                                }}
                            />
                        </div>
                        <div className="col-md-6">
                            <Inputfield 
                                heading={'City'}
                                field_type="select"
                                required
                                isClearable
                                menuPlacement="auto"
                                options={CITIES}
                                classNamePrefix={`form-control`}
                                placeholder="Select City"
                                id="city_selection"
                                onChange={e => this.on_selected_changed(e, 'city_selection')}
                                value={{ id: 'city_selection', label: this.state.user_city.value }}
                                defaultValue={{ id: 'city_selection', label: 'Lahore' }}
                                styles={{
                                    container: base => ({
                                        ...base,
                                        backgroundColor: this.state.user_city.error ? '#FF0000' : '',
                                        padding: 1,
                                        borderRadius: 5
                                    }),
                                }}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <Inputfield 
                                heading="Address/Area"
                                required
                                className="form-control form-control-lg"
                                id="user_address_text_input"
                                value={this.state.user_address.value}
                                onChange={e => this.on_text_field_change(e)}
                                placeholder="Enter address / area you live in the city"
                                />
                        </div>
                    </div>
                </div>
                <div className="col-md-4 border-left">
                    <Inputfield 
                        heading="Gender"
                        field_type="select"
                        required
                        isClearable
                        menuPlacement="auto"
                        options={GENDER_OPTIONS}
                        classNamePrefix={`form-control`}
                        placeholder="Select Gender"
                        id="gender_selection"
                        onChange={e => this.on_selected_changed(e, 'gender_selection')}
                        // value={this.state.user_gender.value}
                        defaultValue={{ id: 'gender_selection', label: 'Male' }}
                        styles={{
                            container: base => ({
                                ...base,
                                backgroundColor: this.state.user_gender.error ? '#FF0000' : '',
                                padding: 1,
                                borderRadius: 5
                            }),
                        }}
                        />
                    <Inputfield 
                        heading="Blood group"
                        field_type="select"
                        required
                        isClearable
                        menuPlacement="auto"
                        options={BLOOD_GROUPS_OPTIONS}
                        className={`Select-option`}
                        classNamePrefix={`form-control`}
                        placeholder="Select blood group"
                        id="blood_group_selection"
                        onChange={e => this.on_selected_changed(e, 'blood_group_selection')}
                        defaultValue={{ id: 'blood_group_selection', label: 'Unknown' }}
                        styles={{
                            container: base => ({
                                ...base,
                                backgroundColor: this.state.user_gender.error ? '#FF0000' : '',
                                padding: 1,
                                borderRadius: 5
                            }),
                        }}
                    />
                </div>
            </div>
        </div>
        return (
            <Modal
                visible={this.props.visibility}
                onClickBackdrop={this.close_modal}
                fade={true}
                dialogClassName={`modal-dialog-centered modal-lg`}>

                <div className="modal-header bg-teal-400">
                    <h5 className="modal-title">New Patient</h5>
                </div>

                {this.state.loading_status ? <Loading /> : add_user_modal_body}

                <div className="modal-footer">
                    <span className="float-left"><span className="text-danger">*</span> Are required fields</span>

                    <button
                        type="button"
                        className="btn bg-danger btn-labeled btn-labeled-right pr-5"
                        style={{ textTransform: "inherit" }}
                        onClick={this.close_modal}>
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
function map_state_to_props(state) {
    return {
        active_user: state.active_user
    }
}
export default connect(map_state_to_props, { notify })(NewUserModal)