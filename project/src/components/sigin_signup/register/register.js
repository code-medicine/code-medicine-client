import React, { Component } from 'react';
import Loader from 'react-loader-spinner';
import Axios from 'axios';
import { REGISTER_USER_REQUEST } from '../../../shared/rest_end_points';
import { connect } from "react-redux";
import { notify } from '../../../actions'
import 'react-toastify/dist/ReactToastify.css';
import { LOGIN_URL } from '../../../shared/router_constants';
import Container from '../../../shared/container/container';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import './register.css'
// import Modal from 'react-bootstrap4-modal';
import DateTimePicker from 'react-datetime'
import { withRouter } from 'react-router-dom';
import Inputfield from '../../../shared/customs/inputfield/inputfield';
import { BLOOD_GROUPS_OPTIONS, GENDER_OPTIONS, ROLES_OPTIONS } from '../../../shared/constant_data';
// import ScrollArea from 'react-scrollbar'


class Register extends Component {
    constructor(props) {
        super(props)
        this.state = {
            first_name: { value: '', error: false },
            last_name: { value: '', error: false },
            email: { value: '', error: false },
            password: { value: '', error: false },
            verify_password: { value: '', error: false },
            gender: { value: '', error: false },
            dob: { value: '', error: false },
            blood_group: { value: '', error: false },
            role: { value: '', error: false },
            phone_number: { value: '', error: false },
            cnic: { value: '', error: false },
            address: { value: '', error: false },
            loading_status: false,
            role_select_modal_visibility: false,

            current_page: 0,
        }
    }
    on_text_field_change = (e) => {
        switch (e.target.id) {
            case 'first_name_text_input':
                this.setState({ first_name: { value: e.target.value, error: false } })
                break;
            case 'last_name_text_input':
                this.setState({ last_name: { value: e.target.value, error: false } })
                break;
            case 'cnic_text_input':
                if (e.target.value.length <= 13)
                    this.setState({ cnic: { value: e.target.value, error: false } })
                break;
            case 'phone_number_text_input':
                if (e.target.value.length <= 11)
                    this.setState({ phone_number: { value: e.target.value, error: false } })
                break;
            case 'email_text_input':
                this.setState({ email: { value: e.target.value, error: false } })
                break;
            case 'password_text_input':
                this.setState({ password: { value: e.target.value, error: false } })
                break;
            case 'verify_password_text_input':
                this.setState({ verify_password: { value: e.target.value, error: false } })
                break;
            case 'address_text_input':
                this.setState({ address: { value: e.target.value, error: false } })
                break;
            default:
                break;
        }
    }

    on_date_of_birth_change = (e) => {

        if (e === '')
            this.setState({ dob: { value: '', error: false } })
        else {
            var configured_date = null;
            try {
                configured_date = e.format('ll');
            }
            catch (err) {
                configured_date = ''
            }
            finally {
                this.setState({ dob: { value: configured_date } })
            }
        }
    }
    on_selected_changed = (e) => {
        switch (e.id) {
            case 'blood_group_selection':
                this.setState({ blood_group: { value: e.label, error: false } })
                break;
            case 'gender_selection':
                this.setState({ gender: { value: e.label, error: false } })
                break;
            case 'role_selection':
                this.setState({ role: { value: e.label, error: false } })
                break;
            default:
                break;
        }
    }

    check_input = (input,required = true,only_alpha=false,only_numbers=false) => {
        const alphabets = /^[A-Za-z]+$/;
        const numbers = /^[0-9]+$/;
        if (required  && input === ''){
            return true;
        }
        if (only_alpha && !input.match(alphabets)){
            return true;
        }
        if (only_numbers && !input.match(numbers)){
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

    on_submit = async (e) => {
        this.setState({ loading_status: true })
            
        let error = false
        if(this.check_input(this.state.first_name.value,true,true,false)){
            this.setState({ current_page: 0, first_name: { value: this.state.first_name.value, error: true}})
            error = true;
        }
        if(this.check_input(this.state.last_name.value,true,true,false)){
            this.setState({ current_page: 0, last_name: { value: this.state.last_name.value, error: true}})
            error = true;
        }
        if(this.check_input(this.state.email.value,true,false,false) || this.check_hard_constraints(this.state.email.value,"@")){
            this.setState({ current_page: 0, email: { value: this.state.email.value, error: true}})
            error = true;
        }
        if(this.check_input(this.state.phone_number.value,true,false,true) || this.check_hard_constraints(this.state.phone_number.value,"","eq",11)){
            this.setState({ current_page: 0, phone_number: { value: this.state.phone_number.value, error: true}})
            error = true;
        }
        if(this.check_input(this.state.password.value,true,false,false) || this.check_hard_constraints(this.state.password.value,"","min",8)){
            this.setState({ current_page: 1, password: { value: this.state.password.value, error: true}})
            error = true;
        }
        if (this.state.password.value !== this.state.verify_password.value){
            this.setState({ 
                password: { value: this.state.password.value, error: true },
                verify_password: { value: this.state.verify_password.value, error: true },
                current_page: 1, 
            })
            error = true;
        }
        if(this.check_input(this.state.cnic.value,true,false,true) || this.check_hard_constraints(this.state.cnic.value,"","eq",13)){
            this.setState({ current_page: 2, cnic: { value: this.state.cnic.value, error: true}})
            error = true;
        }
        if(this.check_input(this.state.dob.value,true,false,false)){
            this.setState({ current_page: 2, dob: { value: this.state.dob.value, error: true}})
            error = true;
        }
        if(this.check_input(this.state.address.value,true,false,false)){
            this.setState({ current_page: 2, address: { value: this.state.address.value, error: true}})
            error = true;
        }
        if(this.check_input(this.state.role.value,true,true,false)){
            this.setState({ current_page: 3, role: { value: this.state.role.value, error: true}})
            error = true;
        }
        if(this.check_input(this.state.gender.value,true,true,false)){
            this.setState({ current_page: 3, gender: { value: this.state.gender.value, error: true}})
            error = true;
        }
        if(this.check_input(this.state.blood_group.value,true,false,false)){
            this.setState({ current_page: 3, blood_group: { value: this.state.blood_group.value, error: true}})
            error = true;
        }
        if (error === true){
            this.props.notify('error','','Invalid info')
            this.setState({ loading_status: false })
            return
        }
        const data = {
            first_name: this.state.first_name.value.trim(),
            last_name: this.state.last_name.value.trim(),
            email: this.state.email.value.trim(),
            password: this.state.password.value.trim(),
            verify_password: this.state.verify_password.value.trim(),
            phone_number: this.state.phone_number.value.trim(),
            cnic: this.state.cnic.value.trim(),
            role: this.state.role.value.trim(),
            dob: this.state.dob.value,
            gender: this.state.gender.value.trim(),
            blood_group: this.state.blood_group.value.trim(),
            address: this.state.address.value.trim()
        }
        const response = await Axios.post(`${REGISTER_USER_REQUEST}`, data);
        try {
            if (response.data['status']) {
                this.props.notify('success', '', response.data['message']);
                this.props.history.push(LOGIN_URL);
            }
            else {
                this.props.notify('error', '', response.data['message'])
                this.setState({ loading_status: false })
            }
        }
        catch (err) {
            this.props.notify('error', '', 'We are sorry for invonvenience. Server is not responding! please try again later')
            this.setState({ loading_status: false })
        }
    }

    
    next_button_click = (e) => {
        e.preventDefault()
        if (this.state.current_page < 3){
            this.setState({current_page: this.state.current_page + 1})
        }
        else if (this.state.current_page === 3){
            this.on_submit()
        } 
    }
    back_button_click = (e) => {
        if (this.state.current_page >= 0)
            this.setState({current_page: this.state.current_page - 1})
    }

    render() {
        const loader = <div className="mt-3">
                            <div className="d-flex justify-content-center ">
                                <Loader
                                    type="Rings"
                                    color="#00BFFF"
                                    height={150}
                                    width={150}
                                    timeout={60000} //60 secs
                                />
                            </div>
                            <div className="d-flex justify-content-center">
                                <p>Loading...</p>
                            </div>
                        </div>
        let to_render_page = loader
        if (this.state.loading_status) {
            to_render_page = loader
        }
        else {

            const name_and_email_and_phone = <div className={``}>
                    <Inputfield
                            id={'email_text_input'}
                            label_tag={'Email'}
                            placeholder={"someone@hello.com"}
                            icon_class={'icon-envelop'}
                            input_type={'email'}
                            on_text_change_listener={this.on_text_field_change}
                            default_value={this.state.email.value}
                            error={this.state.email.error}
                        />
                    <Inputfield
                            id={`first_name_text_input`}
                            label_tag={'First name'}
                            placeholder="Enter your first name"
                            icon_class={'icon-user-check'}
                            input_type={'text'}
                            on_text_change_listener={this.on_text_field_change}
                            default_value={this.state.first_name.value}
                            error={this.state.first_name.error}
                        />
                    <Inputfield
                            id={`last_name_text_input`}
                            label_tag={'Last name'}
                            placeholder="Enter your last name"
                            icon_class={'icon-user-check'}
                            input_type={'text'}
                            on_text_change_listener={this.on_text_field_change}
                            default_value={this.state.last_name.value}
                            error={this.state.last_name.error}
                        />
                    <Inputfield
                            id={`phone_number_text_input`}
                            label_tag={'Phone Number'}
                            placeholder="Enter your phone number"
                            icon_class={'icon-phone2'}
                            input_type={'number'}
                            on_text_change_listener={this.on_text_field_change}
                            default_value={this.state.phone_number.value}
                            error={this.state.phone_number.error}
                        />
                </div>      
            const password_and_verification = <div className={``}>
                        <Inputfield
                                id={`password_text_input`}
                                label_tag={'Password'}
                                placeholder="Enter password"
                                icon_class={'icon-user-lock'}
                                input_type={'password'}
                                on_text_change_listener={this.on_text_field_change}
                                default_value={this.state.password.value}
                                error={this.state.password.error}
                            />
                        <Inputfield
                                id={`verify_password_text_input`}
                                label_tag={'Verify Password'}
                                placeholder="Re-enter password"
                                icon_class={'icon-user-lock'}
                                input_type={'password'}
                                on_text_change_listener={this.on_text_field_change}
                                default_value={this.state.verify_password.value}
                                error={this.state.verify_password.error}
                            />
                </div>
            const date_of_birth_and_cnic_address = <div className={``}>
                    <Inputfield 
                        id={`cnic_text_input`}
                        label_tag={'CNIC'}
                        placeholder="Enter your cnic"
                        icon_class={'icon-vcard'}
                        input_type={'text'}
                        on_text_change_listener={this.on_text_field_change}
                        default_value={this.state.cnic.value}
                        error={this.state.cnic.error}
                        />
                    {/* <div className="form-group row">
                        <label className="col-form-label-lg">Date of birth</label>
                        <div className={`input-group`}>
                            <span className="input-group-prepend">
                                <span className="input-group-text"><i className={'icon-calendar3'}/></span>
                            </span>
                            <DateTimePicker id="dob_text_input"
                                onChange={this.on_date_of_birth_change}
                                className="clock_datatime_picker form-control form-control-lg "
                                inputProps={{ placeholder: 'Select your date of birth', width: '100%', className: 'border-0' }}
                                input={true}
                                dateFormat={'ll'}
                                timeFormat={false}
                                closeOnSelect={true}
                                value={this.state.dob.value}
                            />
                        </div>
                    </div> */}
                    <Inputfield 
                        id={`dob_text_input`}
                        label_tag={'Date of birth'}
                        icon_class={'icon-calendar3'}
                        placeholder="Date of birth"
                        input_type={'text'}
                        field_type="date-time"
                        date_format={'ll'}
                        time_format={false}
                        on_text_change_listener={this.on_date_of_birth_change}
                        default_value={this.state.dob.value}
                        error={this.state.dob.error}
                        />
                    <Inputfield
                        id={`address_text_input`}
                        label_tag={'What is your current address'}
                        placeholder="Enter your address"
                        icon_class={'icon-home'}
                        input_type={'text'}
                        on_text_change_listener={this.on_text_field_change}
                        default_value={this.state.address.value}
                        error={this.state.address.error}
                        field_type={'text-area'}
                    />
                    
                </div>
            const role_gender_and_blood_group = <div className={``}>
                <div className="form-group row">
                    <label className="col-form-label-lg">What is your blood group</label>
                    <div className={`input-group`}>
                        <span className="input-group-prepend">
                            <span className="input-group-text"><i className={'icon-droplet'}/></span>
                        </span>
                        <Select
                            className="w-75"
                            options={BLOOD_GROUPS_OPTIONS}
                            classNamePrefix={``}
                            components={makeAnimated()}
                            placeholder="Select blood group"
                            id="blood_group_selection"
                            onChange={this.on_selected_changed}
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <label className="col-form-label-lg">Specify your gender</label>
                    <div className={`input-group`}>
                        <span className="input-group-prepend">
                            <span className="input-group-text"><i className={'icon-man-woman'}/></span>
                        </span>

                        <Select
                            className="w-75"
                            options={GENDER_OPTIONS}
                            components={makeAnimated()}
                            classNamePrefix={``}
                            placeholder="Select gender"
                            id="gender_selection"
                            onChange={this.on_selected_changed}
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <label className="col-form-label-lg">How you want to go into this</label>
                    <div className={`input-group`}>
                        <span className="input-group-prepend">
                            <span className="input-group-text"><i className={'icon-user-tie'}/></span>
                        </span>
                            
                        <Select
                            className="w-75"
                            options={ROLES_OPTIONS}
                            classNamePrefix={``}
                            placeholder="Select role"
                            id="role_selection"
                            onChange={this.on_selected_changed}
                        />
                    </div>
                </div>
            </div>
            
            if (this.state.current_page === 0){
                to_render_page = name_and_email_and_phone
            }
            else if (this.state.current_page === 1){
                to_render_page = password_and_verification
            }
            else if (this.state.current_page === 2){
                to_render_page = date_of_birth_and_cnic_address
            }
            else{
                to_render_page = role_gender_and_blood_group
            }

        }
        return (
            <Container container_type={'register'}>
                <div className={`container-fluid`}>
                    <div className={`row`}>
                        <div className={`col-lg-4 col-md-6 p-0`} >
                            <form method="post" action={this.next_button_click}>
                                <div className={`card m-0 `} style={{height: '100vh'}}>
                                    <div className={`card-header text-center h4 font-weight-light`}>
                                        <span>Sign up</span>
                                        <hr/>
                                    </div>

                                    <div className={`card-body px-5`}>                   
                                        {to_render_page}
                                    </div>

                                    <div className={`row card-footer`}>
                                        
                                        
                                        <div className="col-4">
                                            <button  
                                                id="back_button"
                                                type="button"
                                                className="btn btn-block bg-teal-400 btn-labeled btn-labeled-left pl-5 mr-2"                                        
                                                style={{ textTransform: "inherit", display: this.state.current_page === 0? 'none': 'inline'}}
                                                onClick={this.back_button_click}>
                                                <b><i className="icon-arrow-left13"/></b>
                                                Back
                                            </button>
                                        </div>
                                        <div className="col-4">
                                            <button
                                                type="button"
                                                className="btn btn-block bg-danger btn-labeled btn-labeled-right pr-5 mr-2"
                                                style={{ textTransform: "inherit" }}
                                                onClick={() => this.props.history.push(LOGIN_URL)}>
                                                <b><i className="icon-cross"></i></b>
                                                Cancel
                                            </button>
                                        </div>
                                        <div className={`col-4`}>
                                            <button
                                                type="submit"
                                                className={`btn btn-block bg-teal-400 btn-labeled btn-labeled-right pr-5`}
                                                id="next_button"
                                                onClick={this.next_button_click}>
                                                {
                                                    this.state.current_page === 3? <b><i className="icon-plus3"></i></b>:
                                                            <b><i className="icon-arrow-right14"></i></b>
                                                }
                                                {
                                                    this.state.current_page === 3? "Register":'Next'
                                                }
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className={`col-lg-8 col-md-6 d-none d-lg-block d-xl-block d-md-block background_custom`} style={{height:'100vh'}}>
                                            
                        </div>
                    </div>
                </div>
            </Container>
        );
    }
}
function map_state_to_props(notify) {
    return { notify }
}
export default connect(map_state_to_props, { notify })(withRouter(Register));