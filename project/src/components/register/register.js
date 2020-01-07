import React, { Component } from 'react';
import Loader from 'react-loader-spinner';
import Axios from 'axios';
import { REGISTER_USER_REQUEST } from '../../shared/rest_end_points';
import { connect } from "react-redux";
import { notify } from '../../actions'
import 'react-toastify/dist/ReactToastify.css';
import { LOGIN_URL } from '../../shared/router_constants';
import Container from '../../shared/container/container';
import './register.css'

class Register extends Component {
    constructor(props) {
        super(props)
        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            role: '',
            phone: '',
            cnic: '',
            loading_status: false,
        }
    }
    on_text_field_change = (e) => {
        switch (e.target.id) {
            case 'materialRegisterFormFirstName':
                this.setState({ first_name: e.target.value });
                break;
            case 'materialRegisterFormLastName':
                this.setState({ last_name: e.target.value });
                break;
            case 'materialRegisterFormEmail':
                this.setState({ email: e.target.value });
                break;
            case 'materialRegisterFormPassword':
                this.setState({ password: e.target.value });
                break;
            case 'materialRegisterFormPhone':
                this.setState({ phone: e.target.value });
                break;
            case 'materialRegisterFormCNIC':
                this.setState({ cnic: e.target.value });
                break;
            default:
                break;
        }
    }
    on_role_select = (e) => {
        switch (e.target.id) {
            case 'patientButton':
                this.setState({ role: 'patient' })
                this.props.notify('default', '', 'You are signing up as patient')
                break;
            case 'adminButton':
                this.setState({ role: 'admin' })
                this.props.notify('info', '', 'Admin signup will require verification')
                break;
            case 'doctorButton':
                this.setState({ role: 'doctor' })
                this.props.notify('info', '', 'Doctor signup will require verification')
                break;
            default:
                break;
        }
    }
    __check_soft_constraints = (data) => {
        var status = true;
        var alphabets = /^[A-Za-z]+$/;
        var numbers = /^[0-9]+$/;
        if (data.first_name === ''){
            this.props.notify('error','','First Name is required!');
            status = false;
        }
        else{
            if (!data.first_name.match(alphabets)){
                this.props.notify('error','',"First Name can only have alphabets!");
                status = false;
            }
        }
        if (data.last_name === ''){
            this.props.notify('error','','Last Name is required!');
            status = false;
        }
        else{
            if (!data.last_name.match(alphabets)){
                this.props.notify('error','',"Last Name can only have alphabets!");
                status = false;
            }
        }
        if (data.email === ''){
            this.props.notify('error','','Email is required!');
            status = false;
        }
        if (data.password === ''){
            this.props.notify('error','','Please specify a password to secure your account!')
            status = false
        }
        if (data.cnic === ''){
            this.props.notify('error','','Please specify your CNIC!');
            status = false;
        }
        if (data.phone_number === ''){
            this.props.notify('error','','Please specify your phone number!');
            status = false;
        }
        else{
            if (!data.phone_number.match(numbers)){
                this.props.notify('error','','Phone number is invalid!');
                status = false;
            }
        }
        if (data.role === ''){
            this.props.notify('error','','Please select one of the roles!');
        }
        return status; // all clear. no false condition :)
    }
    __check_hard_constraints = (data) => {
        var status = true;
        if (!data.email.includes('@')){
            this.props.notify('error','',data.email + ' Invalid email!');
            status = false;
        }
        if (data.password.length < 8){
            this.props.notify('error','','Password must have atleast 8 characters!');
            status = false
        }
        if (data.phone_number.length < 11){
            this.props.notify('error','','Invalid Phone number!');
            status = false
        }
        if (data.cnic.length < 13) {
            this.props.notify('error','','Invalid CNIC number!');
            status = false
        }
        return status;
    }
    on_submit = () => {
        const data = {
            first_name: this.state.first_name.trim(),
            last_name: this.state.last_name.trim(),
            email: this.state.email.trim(),
            password: this.state.password.trim(),
            phone_number: this.state.phone.trim(),
            cnic: this.state.cnic.trim(),
            role: this.state.role.trim()
        }
        if (this.__check_soft_constraints(data) && this.__check_hard_constraints(data)){
            return
            this.setState({ loading_status: true })
            Axios.post(`${REGISTER_USER_REQUEST}`, data).then(res => {
                if (res.data['status']) {
                    setTimeout(() => {
                        this.props.notify('success', '', res.data['message'])
                        this.setState({ loading_status: false })
                    }, 5000)
                }
                else {
                    this.props.notify('error', '', res.data['message'])
                    setTimeout(() => {
                        this.setState({ loading_status: false })
                        this.props.history.push(LOGIN_URL)
                    }, 3000)
                }
            }).catch(err => {
                this.props.notify('error', '', err.data['message'])
                setTimeout(() => {
                    this.setState({ loading_status: false })
                }, 3000)
            })
        }
        else{
            this.props.notify('info','','Registartion unsuccessfull!');
        }
    }
    render() {
        const role_selection_button_classes = "btn-rounded btn-block my-2 waves-effect z-depth-0"
        var status = ''
        if (this.state.loading_status) {
            status = <div className="mt-5">
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
        }
        else {
            status = <div className="container-fluid">
                <div className="row">
                    <div className="col-md-2 col-lg-3 col-sm-0"></div>
                    <div className="col-md-8 col-lg-6 col-sm-12">
                        <div className="card mt-5">
                            <h5 className="card-header info-color white-text text-center py-4">
                                <strong>Register</strong>
                            </h5>
                            <div className="card-body px-lg-5 pt-0">
                                <form className="text-center" style={{ color: "#757575"}}>
                                    <div className="form-row">
                                        <div className="col">
                                            <div className="md-form">
                                                <input 
                                                    type="text" 
                                                    id="materialRegisterFormFirstName" 
                                                    onChange={this.on_text_field_change} 
                                                    className="form-control" 
                                                    value={this.state.first_name}/>
                                                <label for="materialRegisterFormFirstName">First name</label>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="md-form">
                                                <input 
                                                    type="text" 
                                                    id="materialRegisterFormLastName" 
                                                    onChange={this.on_text_field_change} 
                                                    className="form-control" 
                                                    value={this.state.last_name}/>
                                                <label for="materialRegisterFormLastName">Last name</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md-form mt-0">
                                        <input 
                                            type="email" 
                                            id="materialRegisterFormEmail" 
                                            onChange={this.on_text_field_change} 
                                            className="form-control"
                                            value={this.state.email} />
                                        <label for="materialRegisterFormEmail">E-mail</label>
                                    </div>

                                    <div className="md-form">
                                        <input 
                                            type="password" 
                                            id="materialRegisterFormPassword" 
                                            onChange={this.on_text_field_change} 
                                            className="form-control" 
                                            aria-describedby="materialRegisterFormPasswordHelpBlock"
                                            value={this.state.password} />
                                        <label for="materialRegisterFormPassword">Password</label>
                                        <small id="materialRegisterFormPasswordHelpBlock" className="form-text text-muted mb-4">
                                            Atleast 8 characters with 1 special character
                                        </small>
                                    </div>

                                    <div className="md-form">
                                        <input 
                                            type="number" 
                                            id="materialRegisterFormPhone" 
                                            onChange={this.on_text_field_change} 
                                            className="form-control" 
                                            aria-describedby="materialRegisterFormPhoneHelpBlock" 
                                            value={this.state.phone_number}/>
                                        <label for="materialRegisterFormPhone">Phone number</label>
                                        <small id="materialRegisterFormPhoneHelpBlock" className="form-text text-muted mb-4">
                                            Your active phone number
                                        </small>
                                    </div>

                                    <div className="md-form">
                                        <input 
                                            type="number" 
                                            id="materialRegisterFormCNIC" 
                                            onChange={this.on_text_field_change} 
                                            className="form-control" 
                                            aria-describedby="materialRegisterFormPhoneCNICBlock"
                                            value={this.state.cnic} />
                                        <label for="materialRegisterFormCNIC">CNIC</label>
                                        <small id="materialRegisterFormCNICHelpBlock" className="form-text text-muted mb-4">
                                            Your information is secured with us.
                                        </small>
                                    </div>

                                    <div className="border border-info pb-3 mb-2">
                                        <small className="form-text text-muted">
                                            Pick one role from these options
                                        </small>
                                        <div className="row mx-1">
                                            <div className="col-lg-4 col-md-4 col-sm-12">
                                                <button className={`btn btn-outline-${this.state.role === 'patient' ? 'danger' : 'info'} ${role_selection_button_classes}`}
                                                    onClick={this.on_role_select}
                                                    id="patientButton"
                                                    type="button">Patient</button>
                                            </div>
                                            <div className="col-lg-4 col-md-4 col-sm-12">
                                                <button className={`btn btn-outline-${this.state.role === 'doctor' ? 'danger' : 'info'} ${role_selection_button_classes}`}
                                                    onClick={this.on_role_select}
                                                    id="doctorButton"
                                                    type="button">Doctor</button>
                                            </div>
                                            <div className="col-lg-4 col-md-4 col-sm-12">
                                                <button className={`btn btn-outline-${this.state.role === 'admin' ? 'danger' : 'info'} ${role_selection_button_classes}`}
                                                    onClick={this.on_role_select}
                                                    id="adminButton"
                                                    type="button">Admin</button>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" className="form-check-input" id="materialRegisterFormNewsletter" />
                                        <label className="form-check-label" for="materialRegisterFormNewsletter">Agree to the terms and conditions</label>
                                    </div>


                                    <button className="btn btn-outline-info btn-rounded btn-block my-4 waves-effect z-depth-0"
                                        onClick={this.on_submit}
                                        type="button">Sign up</button>

                                    <hr />


                                    <p>By clicking <em>Sign up</em> you agree to our
                                    <a href="/login" target="_blank"> terms of service</a>
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8 col-lg-3 col-sm-0"></div>
                </div>

            </div>
        }
        return (
            <Container header={false} footer={false}>
                {
                    status
                }
            </Container>
        );
    }
}
function map_state_to_props(notify) {
    return { notify }
}
export default connect(map_state_to_props, { notify })(Register);