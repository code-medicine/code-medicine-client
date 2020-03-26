import React, { Component } from 'react';
import Container from '../../shared/container/container';
import { Link, withRouter } from 'react-router-dom';
import NO_PICTURE from '../../resources/images/placeholder.jpg'
import { connect } from "react-redux";
import Axios from 'axios';
import { PROFILE_USER_REQUEST, PROFILE_UPDATE_USER_REQUEST } from '../../shared/rest_end_points';
import { LOGIN_URL, BASE_URL } from '../../shared/router_constants';
import { set_active_user, notify } from '../../actions'
import Inputfield from '../../shared/customs/inputfield/inputfield';
import '../../shared/customs/Animations/animations.css';
import DateTimePicker from 'react-datetime'
import moment from 'moment';
import Select, { components } from 'react-select';
import { BLOOD_GROUPS_OPTIONS, GENDER_OPTIONS, ROLES_OPTIONS } from '../../shared/constant_data';
import Loading from '../../shared/customs/loading/loading';



class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: { value: '' },
            last_name: { value: '' },
            email: { value: '' },
            gender: { value: '' },
            date_of_birth: { value: '' },
            register_date: { value: '' },
            blood_group: { value: '' },
            role: { value: '' },
            phone_number: { value: '' },
            cnic: { value: '' },
            address: { value: '' },

            loading_status: false,
            previous_payload: null,
        };
    }
    componentDidMount() {
        if (localStorage.user) {
            this.setState({ loading_status: true }, () => {
                Axios.get(`${PROFILE_USER_REQUEST}?tag=${localStorage.user}`).then(res => {
                    if (!res.data['status']) {
                        this.props.history.push(LOGIN_URL)
                    }
                    else {
                        this.props.set_active_user(res.data['payload'])
                        this.setState({
                            first_name: { value: res.data.payload.first_name },
                            last_name: { value: res.data.payload.last_name },
                            email: { value: res.data.payload.email },
                            cnic: { value: res.data.payload.cnic },
                            phone_number: { value: res.data.payload.phone_number },
                            address: { value: res.data.payload.address },
                            date_of_birth: { value: moment(res.data.payload.date_of_birth).format('ll') },
                            register_date: { value: moment(res.data.payload.register_date).format('lll') },
                            blood_group: { value: res.data.payload.blood_group },
                            gender: { value: res.data.payload.gender },
                            role: { value: res.data.payload.role },

                            loading_status: false

                        })
                    }
                })
            })

        }
        else {
            this.props.history.push(LOGIN_URL)
        }
    }

    request_update = (data) => {
        console.log(data)
        this.setState({ loading_status: true }, () => {
            Axios.put(PROFILE_UPDATE_USER_REQUEST, data, { headers: { 'code-medicine': localStorage.getItem('user') } }).then(res => {
                if (res.data.status === true) {
                    this.setState({ loading_status: false })
                    this.props.notify('success', '', 'Profile updated!')
                } else {
                    this.setState({ loading_status: false })

                    this.props.notify('error', '', 'There was a problem updating you profile!')
                }
            }).
                catch(err => {
                    console.log('request error', err)
                    this.setState({ loading_status: false })
                    this.props.notify('error', '', err.toString())
                })
        })

    }

    on_click_update = () => {
        const payload = {
            first_name: this.state.first_name.value,
            last_name: this.state.last_name.value,
            email: this.state.email.value,
            gender: this.state.gender.value,
            date_of_birth: this.state.date_of_birth.value,
            register_date: this.state.register_date.value,
            blood_group: this.state.blood_group.value,
            role: this.state.role.value,
            phone_number: this.state.phone_number.value,
            cnic: this.state.cnic.value,
            address: this.state.address.value,
        }
        this.request_update(payload)
    }

    deepCompare() {
        var i, l, leftChain, rightChain;

        function compare2Objects(x, y) {
            var p;

            // remember that NaN === NaN returns false
            // and isNaN(undefined) returns true
            if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
                return true;
            }

            // Compare primitives and functions.     
            // Check if both arguments link to the same object.
            // Especially useful on the step where we compare prototypes
            if (x === y) {
                return true;
            }

            // Works in case when functions are created in constructor.
            // Comparing dates is a common scenario. Another built-ins?
            // We can even handle functions passed across iframes
            if ((typeof x === 'function' && typeof y === 'function') ||
                (x instanceof Date && y instanceof Date) ||
                (x instanceof RegExp && y instanceof RegExp) ||
                (x instanceof String && y instanceof String) ||
                (x instanceof Number && y instanceof Number)) {
                return x.toString() === y.toString();
            }

            // At last checking prototypes as good as we can
            if (!(x instanceof Object && y instanceof Object)) {
                return false;
            }

            if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
                return false;
            }

            if (x.constructor !== y.constructor) {
                return false;
            }

            if (x.prototype !== y.prototype) {
                return false;
            }

            // Check for infinitive linking loops
            if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
                return false;
            }

            // Quick checking of one object being a subset of another.
            // todo: cache the structure of arguments[0] for performance
            for (p in y) {
                if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                    return false;
                }
                else if (typeof y[p] !== typeof x[p]) {
                    return false;
                }
            }

            for (p in x) {
                if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                    return false;
                }
                else if (typeof y[p] !== typeof x[p]) {
                    return false;
                }

                switch (typeof (x[p])) {
                    case 'object':
                    case 'function':

                        leftChain.push(x);
                        rightChain.push(y);

                        if (!compare2Objects(x[p], y[p])) {
                            return false;
                        }

                        leftChain.pop();
                        rightChain.pop();
                        break;

                    default:
                        if (x[p] !== y[p]) {
                            return false;
                        }
                        break;
                }
            }

            return true;
        }

        if (arguments.length < 1) {
            return true; //Die silently? Don't know how to handle such case, please help...
            // throw "Need two or more arguments to compare";
        }

        for (i = 1, l = arguments.length; i < l; i++) {

            leftChain = []; //Todo: this can be cached
            rightChain = [];

            if (!compare2Objects(arguments[0], arguments[i])) {
                return false;
            }
        }

        return true;
    }

    on_text_changed = (e) => {
        console.log('updated', e.target.id)

        switch (e.target.id) {
            case 'first_name_text_input':
                this.setState({ first_name: { value: e.target.value } });
                break;
            case 'last_name_text_input':
                this.setState({ last_name: { value: e.target.value } });
                break;
            case 'cnic_text_input':
                this.setState({ cnic: { value: e.target.value } });
                break;
            case 'phone_number_text_input':
                this.setState({ phone_number: { value: e.target.value } });
                break;
            case 'address_text_input':
                this.setState({ address: { value: e.target.value } });
                break;
            case 'email_text_input':
                this.setState({ email: { value: e.target.value } });
                break;
            default:
                break;
        }
        // const current_payload = {
        //     first_name: this.state.first_name,
        //     last_name: this.state.last_name,
        //     email: this.state.email,
        //     gender: this.state.gender,
        //     date_of_birth: this.state.date_of_birth,
        //     register_date: this.state.register_date,
        //     blood_group: this.state.blood_group,
        //     role: this.state.role,
        //     phone_number: this.state.phone_number,
        //     cnic: this.state.cnic,
        //     address: this.state.address,
        // }
        // if (Object.toJSON(current_payload) !== Object.toJSON(this.state.previous_payload)){
        //     this.setState({ data_changed: true })
        // }
    }
    on_selected_changed = (e, actor) => {
        if (e !== null) {
            switch (e.id) {
                case 'blood_group_selection':
                    this.setState({ blood_group: { value: e.label } })
                    break;
                case 'gender_selection':
                    this.setState({ gender: { value: e.label } })
                    break;
                case 'role_selection':
                    this.setState({ gender: { value: e.label } })
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
                case 'role_selection':
                    this.setState({ gender: { value: '' } })
                    break;
                default:
                    break;
            }
        }
    }
    render() {
        const selection_value_container = ({ children, ...props }) => (
            <components.ValueContainer {...props}>
                <div className={`input-group `}>

                    <div className="ml-2 my-0">
                        {
                            children
                        }
                    </div>
                </div>
            </components.ValueContainer>)
        const view = <div className="container-fluid">
            <div className="row">
                <div className={`col-lg-2 col-sm-12 d-flex justify-content-center`}>
                    <div className="card-img-actions d-inline-block mb-3">
                        <img className="img-fluid rounded-circle" src={NO_PICTURE} style={{ width: 100, height: 100 }} alt="" />
                        <div className="card-img-actions-overlay card-img rounded-circle">
                            <Link to={"#"} className="btn btn-outline bg-white text-white border-white border-2 btn-icon rounded-round">
                                <i className="icon-plus3"></i>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-sm-12 px-3">
                    <Inputfield
                        id="first_name_text_input"
                        label_tag="First Name"
                        placeholder="First name"
                        icon_class="icon-user"
                        default_value={this.state.first_name.value}
                        on_text_change_listener={this.on_text_changed}
                    />
                </div>
                <div className="col-lg-3 col-sm-12 px-3">
                    <Inputfield
                        id="last_name_text_input"
                        label_tag="Last Name"
                        placeholder="Last name"
                        icon_class="icon-user"
                        type="email"
                        default_value={this.state.last_name.value}
                        on_text_change_listener={this.on_text_changed}
                    />
                </div>
                <div className={`col-lg-4 col-sm-12 px-3`}>
                    <Inputfield
                        id="email_text_input"
                        label_tag="Email"
                        placeholder="Email"
                        icon_class="icon-envelop4"
                        default_value={this.state.email.value}
                        on_text_change_listener={this.on_text_changed}
                        disabled={true}
                    />
                </div>

            </div>
            <div className="row">
                <div className="col-lg-3 col-sm-12 px-3">

                    <Inputfield
                        id="phone_number_text_input"
                        label_tag="Phone number"
                        placeholder="Phone number"
                        icon_class="icon-phone2"
                        default_value={this.state.phone_number.value}
                        on_text_change_listener={this.on_text_changed}
                    />
                </div>
                <div className="col-lg-3 col-sm-12 px-3">
                    <Inputfield
                        id="cnic_text_input"
                        label_tag="CNIC"
                        placeholder="CNIC"
                        icon_class="icon-vcard"
                        default_value={this.state.cnic.value}
                        on_text_change_listener={this.on_text_changed}
                    />
                </div>
                <div className="col-lg-6 col-sm-12">
                    <div className={`row `}>
                        <div className={`col-lg-4`}>
                            <div className={``}>
                                <label className="col-form-label-lg">Blood Group</label>
                                <Select
                                    isClearable
                                    components={{ ValueContainer: selection_value_container }}
                                    name="color"
                                    options={BLOOD_GROUPS_OPTIONS}
                                    placeholder={'Blood Group'}
                                    menuPosition="auto"
                                    id="blood_group_selection"
                                    onChange={this.on_selected_changed}
                                    value={[{ id: 'blood_group_selection', label: this.state.blood_group.value }]}//this.state.blood_group}]}
                                />

                            </div>
                        </div>
                        <div className={`col-lg-4`}>
                            <div className={``}>
                                <label className="col-form-label-lg">Gender</label>
                                <Select
                                    isClearable
                                    components={{ ValueContainer: selection_value_container }}
                                    name="color"
                                    options={GENDER_OPTIONS}
                                    placeholder={'Gender'}
                                    menuPosition="auto"
                                    id="gender_selection"
                                    onChange={this.on_selected_changed}
                                    value={[{ id: 'gender_selection', label: this.state.gender.value }]}
                                />

                            </div>
                        </div>
                        <div className={`col-lg-4`}>
                            <div className={``}>
                                <label className="col-form-label-lg">Role</label>
                                <Select
                                    isClearable
                                    components={{ ValueContainer: selection_value_container }}
                                    name="color"
                                    options={ROLES_OPTIONS}
                                    placeholder={'Role'}
                                    menuPosition="auto"
                                    id="role_selection"
                                    onChange={this.on_selected_changed}
                                    value={[{ id: 'role_selection', label: this.state.role.value }]}
                                />

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-6 col-sm-12 px-3">
                    <Inputfield
                        id="address_text_input"
                        label_tag="Address"
                        placeholder="Address"
                        icon_class="icon-home"
                        field_type="text-area"
                        default_value={this.state.address.value}
                        on_text_change_listener={this.on_text_changed}
                    />
                </div>

                <div className="col-lg-3 col-sm-12 px-3">
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
                                value={this.state.date_of_birth.value}
                                disabled
                            />
                        </div>
                    </div>
                </div>

                <div className="col-lg-3 col-sm-12 px-3">
                    <div className={`form-group row`}>
                        <label className={`col-form-label-lg `}>Register Date</label>
                        <div className="input-group">
                            <span className="input-group-prepend">
                                <span className="input-group-text">
                                    <i className="icon-calendar3 text-muted"></i>
                                </span>
                            </span>
                            <DateTimePicker id="user_dob_text_input"
                                className="clock_datatime_picker form-control form-control-lg"
                                inputProps={{ placeholder: 'Register Date', className: 'border-0 w-100', disabled: true }}
                                input={true}
                                dateFormat={'lll'}
                                timeFormat={false}
                                closeOnSelect={true}
                                value={this.state.register_date.value}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className={`row`}>
                <div className={`col-12`}>
                    <button className={`btn bg-teal-400 btn-labeled btn-labeled-right pr-5 float-right`}
                        onClick={this.on_click_update}>
                        <b><i className={`icon-floppy-disk`}></i></b>
                    Save
                </button>
                    <button
                        className={`btn bg-dark btn-labeled btn-labeled-right pr-5 float-right mr-2`}
                        onClick={() => this.props.history.push(BASE_URL)}
                    >

                        <b><i className={`icon-cross`}></i></b>
                    Leave
                </button>
                </div>
            </div>
        </div>
        return (
            <Container container_type="home">
                <div className="card border-top-info">
                    <div className="card-body">
                        {this.state.loading_status ? <Loading size={150} /> : view}
                    </div>
                </div>
            </Container>
        );
    }
}
function map_state_to_props(state) {
    return {
        active_user: state.active_user,
        notify: state.notify
    }
}
export default connect(map_state_to_props, { set_active_user, notify })(withRouter(Profile));