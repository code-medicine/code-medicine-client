import React, { Component } from 'react';
import Container from '../../../shared/container/container';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { notify, set_active_page } from '../../../actions';
import { BASE_URL } from '../../../shared/router_constants';
import { ADMIN_CREATE_DOCTOR, ADMIN_DELETE_DOCTOR, ADMIN_UPDATE_DOCTOR, USERS_BASE_URL } from '../../../shared/rest_end_points';
import CustomTable from '../../../shared/customs/CustomTable';
import Axios from 'axios';
import { Ucfirst } from '../../../shared/functions';
import Button from '../../../elements/button';
import Modal from 'react-bootstrap4-modal';
import Inputfield from '../../../shared/customs/inputfield/inputfield';
import { BLOOD_GROUPS_OPTIONS, CITIES, COUTRIES, GENDER_OPTIONS } from '../../../shared/constant_data';
import { Popup } from "semantic-ui-react";
import Loading from '../../../shared/customs/loading/loading';
import IconButton from '../../../elements/icon-button';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css


const headCells = [
    { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
    { id: 'phone_number', numeric: false, disablePadding: false, label: 'Phone#' },
    { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
    { id: 'consultancy_fee', numeric: true, disablePadding: false, label: 'Consultancy' },
    { id: 'consultancy_percentage', numeric: false, disablePadding: false, label: 'Percentage' },
    { id: 'gender', numeric: false, disablePadding: false, label: 'Gender' },
    { id: 'actions', numeric: false, disablePadding: false, label: 'Actions' },
];

class SearchDoctors extends Component {

    constructor(props) {
        super(props);
        this.state = {

            loading: true,

            rows: [],
            addNewModalVisibility: false,
            addNewSpecialityModalVisibility: false,
            addNewDegreeModalVisibility: false,
            addNewScheduleModalVisibility: false,

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
            user_role: { value: 'Doctor', error: false },

            user_consultancy_fee: { value: '1500', error: false },
            user_consultancy_percentage: { value: '70', error: false },

            speciality_description: { value: '', error: false },
            degree_description: { value: '', error: false },

            user_specialities: [],

            user_degrees: [],
            user_schedule: [],

            mode: 'create',
            toUpdateDoctorId: ''
        }
    }

    componentDidMount() {
        const routes = [<Link to={BASE_URL} className="breadcrumb-item">
            <i className="icon-home2 mr-2"></i>
                            Search
                        </Link>, <span className="breadcrumb-item active">Doctors</span>]
        this.props.set_active_page(routes)
        this.load_doctors()
    }


    on_edit_doctor = (doctor) => {
        this.setState({
            mode: 'update',
            toUpdateDoctorId: doctor.doctor._id,
            addNewModalVisibility: true,

            user_first_name: { value: doctor.doctor.first_name, error: false },
            user_last_name: { value: doctor.doctor.last_name, error: false },
            user_phone_number: { value: doctor.doctor.phone_number, error: false },
            user_dob: { value: doctor.doctor.date_of_birth, error: false },
            user_cnic: { value: doctor.doctor.cnic, error: false },
            user_email: { value: doctor.doctor.email, error: false },

            user_country: { value: doctor.doctor.country, error: false },
            user_city: { value: doctor.doctor.city, error: false },
            user_address: { value: doctor.doctor.address, error: false },

            user_gender: { value: doctor.doctor.gender, error: false },
            user_blood_group: { value: doctor.doctor.blood_group, error: false },
            user_role: { value: 'Doctor', error: false },

            user_consultancy_fee: { value: doctor.details.consultancy_fee, error: false },
            user_consultancy_percentage: { value: doctor.details.consultancy_percentage, error: false },

            user_specialities: doctor.details.specialities,

            user_degrees: doctor.details.degrees,
            user_schedule: doctor.details.schedule,

        }, () => console.log('state', this.state));
    }

    on_delete_doctor = (id) => {
        confirmAlert({
            title: "Delete doctor confirmation",
            message: 'Are you sure to delete this doctor?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        Axios
                            .delete(`${ADMIN_DELETE_DOCTOR}?tag=${id}`)
                            .then(() => {
                                setTimeout(() => this.setState({ loading: true, rows: [] }, () => this.load_doctors()), 1000);
                                this.props.notify('info', '', 'Successfully deleted doctor');
                            })
                            .catch(err => {
                                console.log('error', err);
                                this.props.notify('error', '', err.toString())
                            })
                    }
                },
                {
                    label: 'No',
                    onClick: () => this.props.notify('info', '', 'Doctor not deleted')
                }
            ]
        })
        
    }

    load_doctors = () => {
        const query = `${USERS_BASE_URL}?role=Doctor`
        Axios.get(query).then(_doctors => {
            if (_doctors.data) {
                _doctors = _doctors.data.payload;
                console.log('doctors', _doctors);
                const temp = []
                for (let i = 0; i < _doctors.length; ++i) {
                    temp.push({
                        name: `Dr. ${Ucfirst(_doctors[i].doctor.first_name)} ${Ucfirst(_doctors[i].doctor.last_name)}`,
                        phone_number: _doctors[i].doctor.phone_number,
                        email: _doctors[i].doctor.email,
                        consultancy_fee: _doctors[i].details.consultancy_fee,
                        consultancy_percentage: `${_doctors[i].details.consultancy_percentage}% cut`,
                        gender: _doctors[i].doctor.gender === 'Male' ? <span className={`badge badge-primary`}>Male</span> : <span className={`badge bg-pink-400`}>Female</span>,
                        actions: <div className={`d-flex justify-content-center`}>
                            <IconButton 
                                icon="icon-pencil" className={`mx-1`} 
                                onClick={() => this.on_edit_doctor(_doctors[i])}/>
                            <IconButton 
                                color="red"
                                icon="icon-cross" 
                                onClick={() => this.on_delete_doctor(_doctors[i].doctor._id)} />
                        </div>
                    })
                    if (i === _doctors.length - 1) {
                        this.setState({ rows: temp, loading: false })
                    }
                }
                if (_doctors.length === 0) {
                    
                }
            }
            this.setState({ loading: false })
        })
        .catch(err => {
            this.props.notify('error', '', err.toString());
            this.setState({ loading: false })
        })
    }

    on_text_field_change = (e) => {
        this.setState({ [e.target.id]: { value: e.target.value, error: false } })
    }

    on_selected_changed = (e, actor) => {
        if (e !== null) {
            this.setState({ [e.id]: { value: e.label, error: false } })
        }
        else {
            this.setState({ [actor]: { value: e.label, error: false } })
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

    delete_item = (index, id) => {
        const temp = this.state[id];
        temp.splice(index, 1);
        this.setState({ [id]: temp })
    }

    toggle_modal = (identity) => {
        this.setState({ [identity]: !this.state[identity] })
    }

    add_item = (item, id) => {
        const temp = this.state[id];
        temp.push({ description: item });
        this.setState({
            [id]: temp,
            speciality_description: { value: '', error: false },
            degree_description: { value: '', error: false },
            addNewDegreeModalVisibility: false,
            addNewSpecialityModalVisibility: false,
        });
    }

    reset_state = () => {
        this.setState({
            addNewModalVisibility: false,
            addNewSpecialityModalVisibility: false,
            addNewDegreeModalVisibility: false,
            addNewScheduleModalVisibility: false,

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
            user_role: { value: 'Doctor', error: false },

            user_consultancy_fee: { value: '1500', error: false },
            user_consultancy_percentage: { value: '70', error: false },

            speciality_description: { value: '', error: false },
            degree_description: { value: '', error: false },

            user_specialities: [],

            user_degrees: [],
            user_schedule: [],

            mode: 'create',
            toUpdateDoctorId: ''
        })
    }

    on_submit = (e) => {
        e.preventDefault()
        console.log('this.state', this.state)
        const payload = {
            admin_id: this.props.active_user._id,
            doctor: {
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
            },
            doctor_details: {
                consultancy_fee: this.state.user_consultancy_fee.value,
                consultancy_percentage: this.state.user_consultancy_percentage.value,
                specialities: this.state.user_specialities,
                degrees: this.state.user_degrees,
                schedule: this.state.user_schedule,
            }
        }
        if (this.state.mode === 'create') {
            
            Axios
                .post(ADMIN_CREATE_DOCTOR, payload)
                .then(res => {
                    console.log('res', res)
                    this.setState({ loading: true, addNewModalVisibility: false }, () => this.load_doctors())
                })
                .catch(err => {
                    console.log('res', err)
                    this.props.notify('error','','Server not responding');
                })
        }
        else {
            payload.doctor_id = this.state.toUpdateDoctorId;
            Axios
                .put(ADMIN_UPDATE_DOCTOR, payload)
                .then(res => {
                    console.log('response', res)
                    this.props.notify('success','', 'Doctor successfully updated');
                    this.reset_state()
                    this.load_doctors()
                })
                .catch(err => {
                    console.log('err', err)
                    this.props.notify('error','', 'There was an error updating doctor');
                })

        }
    }

    delete_doctor = (id) => {
        console.log('delete doctor id', id);
    }


    render() {
        return (
            <Container container_type={'searchdoctors'}>
                <div className={`mb-2 d-flex justify-content-end`}>
                    <Button icon="icon-plus3" onClick={() => this.setState({ addNewModalVisibility: true })}>
                        Add a new doctor
                    </Button>
                </div>
                {
                    this.state.loading ? <Loading size={150} /> : (
                        this.state.rows.length === 0 ?
                            <div className="alert alert-info mt-2 w-100" >
                                <strong>Info!</strong> Not found.
                            </div> :
                            <CustomTable
                                rows={this.state.rows}
                                headCells={headCells}
                                heading={'Doctors'}
                            />)
                }
                <Modal visible={this.state.addNewModalVisibility} dialogClassName="modal-lg" onClickBackdrop={() => this.setState({ addNewModalVisibility: false })}>
                    <div className={`modal-header bg-teal-400`}>
                        <h5 className={`mb-0`}>{this.state.mode === 'create'? 'Add a new doctor': 'Update doctor'}</h5>
                    </div>
                    <div className={`modal-body`}>
                        <h5 className={`font-weight-bold`}>Basic Information</h5>
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
                                        error={this.state.user_first_name.error} />
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
                                        error={this.state.user_last_name.error} />
                                </div>
                            </div>
                            <div className="col-md-4 px-3">
                                <div className="form-group">
                                    <Inputfield
                                        id={`user_phone_number`}
                                        heading={'Phone number'}
                                        placeholder="Enter phone number"
                                        required
                                        type="text" pattern="\d*" maxlength="11"
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
                                        id={`user_dob`}
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
                                        id={`user_cnic`}
                                        heading={'CNIC'}
                                        icon_class={'icon-vcard'}
                                        input_type={'number'}
                                        placeholder="Enter CNIC"
                                        type="text" pattern="\d*" maxlength="13"
                                        onChange={this.on_text_field_change}
                                        value={this.state.user_cnic.value}
                                        error={this.state.user_cnic.error} />
                                </div>
                            </div>
                            <div className="col-md-4 px-3">
                                <div className="form-group">
                                    <Inputfield
                                        id={`user_email`}
                                        heading={'Email'}
                                        icon_class={'icon-envelop'}
                                        input_type={'email'}
                                        required
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
                                <h5 className={`font-weight-bold`}>Location</h5>
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
                                            id="user_country"
                                            isDisabled
                                            onChange={e => this.on_selected_changed(e, 'user_country')}
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
                                            id="user_city"
                                            onChange={e => this.on_selected_changed(e, 'user_city')}
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
                                            onChange={e => this.on_text_field_change(e)}
                                            placeholder="Enter address / area you live in the city"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 border-left">
                                <h5 className={`font-weight-bold`}>Specifications</h5>
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
                                    value={{ id: 'gender_selection', label: this.state.user_gender.value }}
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
                                    id="user_gender"
                                    onChange={e => this.on_selected_changed(e, 'user_gender')}
                                    value={{ id: 'blood_group_selection', label: this.state.user_blood_group.value }}
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
                        <hr />
                        <h5 className={`font-weight-bold`}>Pricing</h5>
                        <div className={`row`}>
                            <div className={`col-md-6`}>
                                <Inputfield
                                    id="user_consultancy_fee"
                                    heading="Consultancy fee"
                                    placeholder="Enter consultancy fee"
                                    required
                                    value={this.state.user_consultancy_fee.value}
                                    error={this.state.user_consultancy_fee.error}
                                    onChange={this.on_text_field_change}
                                />
                            </div>
                            <div className={`col-md-6`}>
                                <Inputfield
                                    id="user_consultancy_percentage"
                                    heading="Consultancy percentage"
                                    placeholder="Enter consultancy % shared with this doctor"
                                    required
                                    value={this.state.user_consultancy_percentage.value}
                                    error={this.state.user_consultancy_percentage.error}
                                    onChange={this.on_text_field_change}
                                />

                            </div>
                        </div>
                        <hr />
                        <div className={`d-flex justify-content-between`}>
                            <h5 className={`font-weight-bold`}>Specialities's</h5>
                            <Button icon="icon-plus3" color="black" onClick={() => this.toggle_modal('addNewSpecialityModalVisibility')}>Speciality</Button>
                        </div>
                        <div className={`row mt-2`}>
                            {
                                this.state.user_specialities.length === 0 ?
                                    <div className="alert alert-info mt-2 mb-0 w-100">
                                        <strong>Info!</strong> Not found.
                                    </div> :
                                    <div className={`table-responsive table-hover table-bordered`}>
                                        <table className={`table mb-0`}>
                                            <thead>
                                                <tr>
                                                    <th>Id</th>
                                                    <th>Description</th>
                                                    <th className={`text-center`}>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    this.state.user_specialities.map((item, i) => {
                                                        return (
                                                            <tr>
                                                                <td>{i + 1}</td>
                                                                <td>{item.description}</td>
                                                                <td className={`text-center`}>
                                                                    <IconButton color="red" icon="icon-cross" onClick={() => this.delete_item(i, 'user_specialities')}>
                                                                    </IconButton>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                            }
                        </div>

                        <hr />
                        <div className={`d-flex justify-content-between`}>
                            <h5 className={`font-weight-bold`}>Degree's</h5>
                            <Button icon="icon-plus3" color="black" onClick={() => this.toggle_modal('addNewDegreeModalVisibility')}>Degree</Button>
                        </div>
                        <div className={`row mt-2`}>
                            {
                                this.state.user_degrees.length === 0 ?
                                    <div className="alert alert-info mt-2 w-100" >
                                        <strong>Info!</strong> Not found.
                                    </div> :
                                    <div className={`table-responsive table-hover table-bordered`}>
                                        <table className={`table mb-0`}>
                                            <thead>
                                                <tr>
                                                    <th>Id</th>
                                                    <th>Description</th>
                                                    <th className={`text-center`}>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    this.state.user_degrees.map((item, i) => {
                                                        return (
                                                            <tr>
                                                                <td>{i + 1}</td>
                                                                <td>{item.description}</td>
                                                                <td className={`text-center`}>
                                                                    <IconButton color="red" icon="icon-cross" onClick={() => this.delete_item(i, 'user_degrees')}>
                                                                    </IconButton>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                            }
                        </div>
                        <hr />
                        <div className={`d-flex justify-content-between text-muted`}>
                            <h5 className={`font-weight-bold`}>Schedule</h5>
                            <span>Coming soon</span>
                            <Button icon="icon-plus3" color="black" disabled>Add schedule</Button>
                        </div>
                    </div>
                    <div className={`modal-footer`}>
                        <Button icon="icon-plus3" onClick={e => this.on_submit(e)}>{this.state.mode === 'create'? 'Create Doctor': 'Update doctor'}</Button>
                        <Button icon="icon-cross" color="red" onClick={e => this.reset_state()}>Cancel</Button>
                    </div>
                </Modal>
                {/* 
                * Speciality modal
                */}
                <Modal visible={this.state.addNewSpecialityModalVisibility} onClickBackdrop={() => this.toggle_modal('addNewSpecialityModalVisibility')}>
                    <div className={`modal-header bg-teal-400`}>
                        <h5 className={`mb-0`}>Add Speciality</h5>
                    </div>
                    <div className={`modal-body`}>
                        <Inputfield
                            id="speciality_description"
                            heading="Description"
                            placeholder="Enter description"
                            value={this.state.speciality_description.value}
                            error={this.state.speciality_description.error}
                            onChange={this.on_text_field_change}
                        />
                    </div>
                    <div className={`modal-footer`}>
                        <Button icon="icon-plus3" onClick={() => this.add_item(this.state.speciality_description.value, 'user_specialities')}>Add</Button>
                    </div>
                </Modal>
                {/* 
                * Degree modal
                */}
                <Modal visible={this.state.addNewDegreeModalVisibility} onClickBackdrop={() => this.toggle_modal('addNewDegreeModalVisibility')}>
                    <div className={`modal-header bg-teal-400`}>
                        <h5 className={`mb-0`}>Add Degree</h5>
                    </div>
                    <div className={`modal-body`}>
                        <Inputfield
                            id="degree_description"
                            heading="Description"
                            placeholder="Enter description"
                            value={this.state.degree_description.value}
                            error={this.state.degree_description.error}
                            onChange={this.on_text_field_change}
                        />
                    </div>
                    <div className={`modal-footer`}>
                        <Button icon="icon-plus3" onClick={() => this.add_item(this.state.degree_description.value, 'user_degrees')}>Add</Button>
                    </div>
                </Modal>
            </Container>
        )
    }
}
function map_state_to_props(state) {
    return {
        notify: state.notify,
        active_page: state.active_page,
        active_user: state.active_user,
    }
}
export default connect(map_state_to_props, { notify, set_active_page })(SearchDoctors);