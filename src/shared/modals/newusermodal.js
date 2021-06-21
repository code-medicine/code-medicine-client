import React, { Component } from 'react';
import { BLOOD_GROUPS_OPTIONS, GENDER_OPTIONS, CITIES, COUTRIES } from '../../utils/constant_data';
import { ADMIN_CREATE_PATIENT } from '../../services/rest_end_points';
import Axios from 'axios';
import Loading from '../../components/loading';
import Inputfield from '../../components/inputfield';
// import NO_PICTURE from '../../resources/images/placeholder.jpg';
import Modal from 'react-bootstrap4-modal';
// import { Link } from 'react-router-dom';
import moment from 'moment'
import notify from 'notify'

class NewUserModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading_status: false,

            user_first_name: { value: '', error: false },
            user_last_name: { value: '', error: false },
            user_phone_number: { value: '', error: false },
            user_dob: { value: '', error: false },
            user_age: { value: '', error: false },
            
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
        if (e.target.id === 'user_age') {
            const dob = e.target.value === '' ? '' : moment(moment().subtract(parseInt(e.target.value), 'years').calendar()).format('ll');
            this.setState({ user_age: { value: e.target.value, error: false }, user_dob: { value: dob, error: false } });
        } 
        else {
            this.setState({ [e.target.id]: { value: e.target.value, error: false }})
        }
    }
    
    on_selected_changed = (e, actor) => {
        if (e !== null) {
            this.setState({ [e.id]: { value: e.label, error: false } })
        }
        else {
            this.setState({ [actor]: { value: '', error: false } })
        }
    }
    
    on_user_date_of_birth_change = (e) => {
        if (e === '')
            this.setState({ user_dob: { value: '', error: false } })
        else {
            let configured_date = null;
            let configured_age = null;
            try {
                configured_date = e.format('ll');
                configured_age = e.fromNow();
                if (configured_age.includes('years')){
                    configured_age = configured_age.split(' ');
                    configured_age = configured_age[0];
                }
                else {
                    configured_age = "0"
                }
            }
            catch (err) {
                configured_date = ''
                configured_age = ''
            }
            finally {
                this.setState({ 
                    user_dob: { value: configured_date, error: false }, 
                    user_age: { value: configured_age, error: false } 
                })
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

    on_submit = (e) => {
        e.preventDefault();
        this.setState({ loading_status: true })
        // let error = false
        // /** firstname */
        // if (this.check_input(this.state.user_first_name.value, true, true, false)) {
        //     this.setState({ user_first_name: { value: this.state.user_first_name.value, error: true } })
        //     error = true
        // }
        // /** lastname */
        // if (this.check_input(this.state.user_last_name.value, true, true)) {
        //     this.setState({ user_last_name: { value: this.state.user_last_name.value, error: true } })
        //     error = true
        // }
        // /** phone number */
        // if (this.check_input(this.state.user_phone_number.value, true, false, true) && this.check_hard_constraints(this.state.user_phone_number.value, "", "eq", 11)) {
        //     this.setState({ user_phone_number: { value: this.state.user_phone_number.value, error: true } })
        //     error = true
        // }
        // // if (this.check_input(this.state.user_dob.value)) {
        // //     this.setState({ user_dob: { value: this.state.user_dob.value, error: true } })
        // //     error = true
        // // }
        // /** cnic */
        // if (this.check_input(this.state.user_cnic.value, false, false, true) && this.check_hard_constraints(this.state.user_cnic.value, "", "eq", 13)) {
        //     this.setState({ user_cnic: { value: this.state.user_cnic.value, error: true } })
        //     error = true
        // }
        // /** email */
        // if (this.check_input(this.state.user_email.value, false, false, false) && this.check_hard_constraints(this.state.user_email.value, "@")) {
        //     this.setState({ user_email: { value: this.state.user_email.value, error: true } })
        //     error = true
        // }
        // /** country */
        // if (this.check_input(this.state.user_country.value, true, true)) {
        //     this.setState({ user_country: { value: this.state.user_country.value, error: true } })
        //     error = true
        // }
        // /** city */
        // if (this.check_input(this.state.user_city.value, true, true)) {
        //     this.setState({ user_city: { value: this.state.user_city.value, serror: true } })
        //     error = true
        // }
        // /** address */
        // if (this.check_input(this.state.user_address.value, true)) {
        //     this.setState({ user_address: { value: this.state.user_address.value, error: true } })
        //     error = true
        // }
        // /** gender */
        // if (this.check_input(this.state.user_gender.value, true)) {
        //     this.setState({ user_gender: { value: this.state.user_gender.value, error: true } })
        //     error = true
        // }
        // /** blood group */
        // if (this.check_input(this.state.user_blood_group.value, true)) {
        //     this.setState({ user_blood_group: { value: this.state.user_blood_group.value, error: true } })
        //     error = true
        // }

        // if (error === true) {
        //     notify('error', '', 'Invalid inputs')
        //     this.setState({ loading_status: false })
        //     return
        // }
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
        // console.log('submit data', data)
        Axios.post(ADMIN_CREATE_PATIENT, data).then(response => {
            notify('success', '', response.data['message']);
            this.setState({ loading_status: false }, () => {
                this.close_modal()
            })
        }).catch(err => {
            this.setState({ loading_status: false })
            if (err.response) {
                if (err.response.status === 400){
                    notify('error', '', err.response.data.error.message)
                }
                else if (err.response.status === 422){
                    notify('error', '', err.response.data.error[0])
                }
            }
            else if (err.request) {
                console.log('request error', err);
            }
            else {
                console.log('error', err)
            }
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
                            id={`user_first_name`}
                            heading={'First name'}
                            placeholder="Enter first name"
                            required
                            onChange={this.on_text_field_change}
                            value={this.state.user_first_name.value}
                            // error={this.state.user_first_name.error} 
                            />
                    </div>
                </div>
                <div className="col-md-4 px-3">
                    <div className="form-group">
                        <Inputfield
                            id={`user_last_name`}
                            heading={'Last name'}
                            placeholder="Enter last name"
                            required
                            onChange={this.on_text_field_change}
                            value={this.state.user_last_name.value}
                            error={this.state.user_last_name.error} 
                            />
                    </div>
                </div>
                <div className="col-md-4 px-3">
                    <div className="form-group">
                        <Inputfield
                            id={`user_phone_number`}
                            heading={'Phone number'}
                            placeholder="Enter phone number"
                            required
                            maxLength="13"
                            onChange={this.on_text_field_change}
                            value={this.state.user_phone_number.value}
                            error={this.state.user_phone_number.error} 
                            />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-3 px-3">
                    <div className="form-group">
                        <Inputfield
                            id={`user_age`}
                            heading={'Age'}
                            icon_class={'icon-vcard'}
                            type={'number'}
                            required
                            maxLength="2"
                            placeholder="Enter Age"
                            onChange={this.on_text_field_change}
                            value={this.state.user_age.value}
                            error={this.state.user_age.error}
                        />
                    </div>
                </div>
                <div className="col-md-3 px-3">
                    <div className="form-group">
                        <Inputfield
                            id={`user_dob`}
                            heading={'Date of birth'}
                            icon_class={'icon-calendar3'}
                            placeholder="Enter Date of birth"
                            type={'text'}
                            field_type="date-time"
                            date_format={'ll'}
                            time_format={false}
                            onChange={this.on_user_date_of_birth_change}
                            value={this.state.user_dob.value}
                            error={this.state.user_dob.error}
                        />
                    </div>
                </div>
                <div className="col-md-3 px-3">
                    <div className="form-group">
                        <Inputfield
                            id={`user_cnic`}
                            heading={'CNIC'}
                            icon_class={'icon-vcard'}
                            type={'number'}
                            maxLength="13"
                            placeholder="Enter CNIC"
                            onChange={this.on_text_field_change}
                            value={this.state.user_cnic.value}
                            error={this.state.user_cnic.error} 
                            />
                    </div>
                </div>
                <div className="col-md-3 px-3">
                    <div className="form-group">
                        <Inputfield
                            id={`user_email`}
                            heading={'Enter email'}
                            icon_class={'icon-envelop'}
                            type={'email'}
                            placeholder="Enter email"
                            onChange={this.on_text_field_change}
                            value={this.state.user_email.value}
                            error={this.state.user_email.error} 
                            />
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
                                className="form-control form-control-lg"
                                id="user_address"
                                value={this.state.user_address.value}
                                error={this.state.user_address.error}
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
                <form onSubmit={this.on_submit}>
                    <div className="modal-header bg-teal-400">
                        <h5 className="modal-title">New Patient</h5>
                    </div>

                    {this.state.loading_status ? <Loading /> : add_user_modal_body}

                    <div className="modal-footer">
                        <span className="float-left"><span className="text-danger">*</span> Are required fields</span>
                        
                        <button
                            type="button"
                            className="btn bg-teal-400 btn-labeled btn-labeled-right pr-5"
                            style={{ textTransform: "inherit" }}
                            type="submit"
                            disabled={this.state.loading_status}>
                            <b><i className="icon-plus3"></i></b>
                            Add
                        </button>

                        <button
                            type="button"
                            className="btn bg-danger btn-labeled btn-labeled-right pr-5"
                            style={{ textTransform: "inherit" }}
                            onClick={this.close_modal}>
                            <b><i className="icon-cross"></i></b>
                            Cancel
                        </button>

                        
                    </div>
                </form>
            </Modal>
        )
    }
}
export default NewUserModal