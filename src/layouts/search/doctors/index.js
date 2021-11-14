import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { set_active_page } from '../../../redux/actions';
import { BASE_URL } from '../../../router/constants';
import CustomTable from '../../../shared/customs/CustomTable';
import { Ucfirst } from '../../../utils/functions';
import Button from '../../../components/button';
import Modal from 'react-bootstrap4-modal';
import Inputfield from '../../../components/inputfield';
import { BLOOD_GROUPS_OPTIONS, CITIES, COUTRIES, GENDER_OPTIONS } from '../../../utils/constant_data';
import Loading from '../../../components/loading';
import IconButton from '../../../components/icon-button';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import notify from 'notify'
import { AdminCreateDoctor, AdminDeleteDoctor, AdminUpdateDoctor, GetAllUsers } from 'services/queries';


const headCells = [
    { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
    { id: 'phone', numeric: false, disablePadding: false, label: 'Phone#' },
    { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
    { id: 'consultancy_fee', numeric: true, disablePadding: false, label: 'Consultancy' },
    { id: 'consultancy_percentage', numeric: false, disablePadding: false, label: 'Percentage' },
    { id: 'gender', numeric: false, disablePadding: false, label: 'Gender' },
    { id: 'active', numeric: false, disablePadding: false, label: 'Active' },
    { id: 'actions', numeric: false, disablePadding: false, label: 'Actions' },
];

class SearchDoctors extends Component {

    constructor(props) {
        super(props);
        this.state = {

            loading: true,
            addNewDoctorModalLoading: false,

            rows: [],
            addNewModalVisibility: false,
            addNewSpecialityModalVisibility: false,
            addNewDegreeModalVisibility: false,
            addNewScheduleModalVisibility: false,

            user_first_name: { value: '', error: false },
            user_last_name: { value: '', error: false },
            user_phone: { value: '', error: false },
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
            user_is_active: { value: true, error: false },

            speciality_description: { value: '', error: false },
            degree_description: { value: '', error: false },

            user_specialities: [],
            user_degrees: [],
            user_schedule: [],

            mode: 'create',
            toUpdateDoctorId: '',

            counts: {
                total: 0,
                active: 0,
                deactive: 0,
            }
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
        console.log('doctor edit', doctor)
        this.setState({
            mode: 'update',
            toUpdateDoctorId: doctor._id,
            addNewModalVisibility: true,

            user_first_name: { value: doctor.first_name, error: false },
            user_last_name: { value: doctor.last_name, error: false },
            user_phone: { value: doctor.phone, error: false },
            user_dob: { value: doctor.date_of_birth, error: false },
            user_cnic: { value: doctor.cnic, error: false },
            user_email: { value: doctor.email, error: false },

            user_country: { value: doctor.country, error: false },
            user_city: { value: doctor.city, error: false },
            user_address: { value: doctor.address, error: false },

            user_gender: { value: doctor.gender, error: false },
            user_blood_group: { value: doctor.blood_group, error: false },
            user_role: { value: 'Doctor', error: false },

            user_consultancy_fee: { value: doctor.consultancy_fee, error: false },
            user_consultancy_percentage: { value: doctor.consultancy_percentage, error: false },
            user_is_active: { value: doctor.is_active, error: false },

            user_specialities: doctor.specialities,

            user_degrees: doctor.degrees,
            user_schedule: doctor.schedule,

        }, () => console.log('state', this.state));
    }

    on_delete_doctor = (id) => {
        confirmAlert({
            title: "Deactivate doctor",
            message: 'Are you sure you want to deactivate this doctor?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        AdminDeleteDoctor(id).then(() => {
                                // this.setState({ loading: true }, () => {
                                    this.reset_state()
                                    this.load_doctors()
                                    
                                // })
                                notify('success', '', 'Successfully deleted doctor');
                            })
                            .catch(err => {
                                console.log('error', err);
                                notify('error', '', err.toString())
                            })
                    }
                },
                {
                    label: 'No',
                    onClick: () => console.log('no selected')//notify('info', '', 'Doctor not deleted')
                }
            ]
        })
        
    }

    load_doctors = () => {
        GetAllUsers('Doctor', 'all').then(_doctors => {
            if (_doctors.data) {
                _doctors = _doctors.data.payload.users;
                console.log('doctors', _doctors);
                const counts = {
                    total: 0,
                    active: 0,
                    deactive: 0,
                }
                const temp = []
                for (let i = 0; i < _doctors.length; ++i) {
                    temp.push({
                        name: `Dr. ${Ucfirst(_doctors[i].first_name)} ${Ucfirst(_doctors[i].last_name)}`,
                        phone: _doctors[i].phone,
                        email: _doctors[i].email,
                        consultancy_fee: _doctors[i].consultancy_fee,
                        consultancy_percentage: `${_doctors[i].consultancy_percentage}% cut`,
                        gender: _doctors[i].gender === 'Male' ? <span className={`badge badge-primary`}>Male</span> : <span className={`badge bg-pink-400`}>Female</span>,
                        active: _doctors[i].is_active,
                        actions: <div className={`d-flex`}>
                            <IconButton 
                                icon="icon-pencil" className={`mx-1`} 
                                onClick={() => this.on_edit_doctor(_doctors[i])}/>
                            {
                                _doctors[i].is_active ? <IconButton
                                    color="red"
                                    icon="icon-cross"
                                    onClick={() => this.on_delete_doctor(_doctors[i]._id)} /> : ''
                            }
                        </div>
                    })
                    counts.total += 1;
                    if (_doctors[i].is_active) {
                        counts.active += 1;
                    }
                    else {
                        counts.deactive += 1;
                    }
                    if (i === _doctors.length - 1) {
                        this.setState({ rows: temp, loading: false, counts: counts });
                    }
                }
                if (_doctors.length === 0) {
                    this.setState({ rows: temp, loading: false });
                }
            }
            this.setState({ loading: false })
        })
        .catch(err => {
            notify('error', '', err.toString());
            this.setState({ loading: false })
        })
    }

    on_text_field_change = (e) => {
        this.setState({ [e.target.id]: { value: e.target.value, error: false } })
    }

    on_selected_changed = (e, actor) => {
        this.setState({ [actor]: { value: e !== null ? e.label : '', error: false } })
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

    on_checkbox_change = (e) => {
        this.setState({ [e.target.id]: { value: !e.target.checked, error: false }})
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
            user_phone: { value: '', error: false },
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
            first_name: this.state.user_first_name.value.trim(),
            last_name: this.state.user_last_name.value.trim(),
            phone: this.state.user_phone.value,
            date_of_birth: this.state.user_dob.value,
            cnic: this.state.user_cnic.value,
            email: this.state.user_email.value.trim(),
            country: this.state.user_country.value,
            city: this.state.user_city.value,
            address: this.state.user_address.value.trim(),
            gender: this.state.user_gender.value,
            blood_group: this.state.user_blood_group.value,
            role: this.state.user_role.value.trim(),
            consultancy_fee: this.state.user_consultancy_fee.value,
            consultancy_percentage: this.state.user_consultancy_percentage.value,
            specialities: this.state.user_specialities,
            degrees: this.state.user_degrees,
            schedule: this.state.user_schedule,
        }
        if (this.state.mode === 'create') {
            this.setState({ addNewDoctorModalLoading: true });
            AdminCreateDoctor(payload).then(res => {
                    console.log('res', res)
                    this.setState({ loading: true, addNewModalVisibility: false, addNewDoctorModalLoading: false }, () => this.load_doctors())
                })
                .catch(err => {
                    console.log('res', err)
                    if (err.response){
                        notify('error', '', err.response.data.message);
                    }
                    else {
                        notify('error', '', err.toString());
                    }
                    
                    this.setState({ addNewDoctorModalLoading: false })
                })
        }
        else {
            payload.is_active = this.state.user_is_active.value;
            AdminUpdateDoctor(this.state.toUpdateDoctorId, payload).then(res => {
                    console.log('response', res)
                    notify('success','', 'Doctor successfully updated');
                    this.setState({ addNewModalVisibility: false, addNewDoctorModalLoading: false }, () => {
                        this.reset_state()
                        this.load_doctors()    
                    })
                })
                .catch(err => {
                    console.log('err', err)
                    notify('error','', 'There was an error updating doctor');
                    this.setState({ addNewModalVisibility: false, addNewDoctorModalLoading: false })
                })

        }
    }

    delete_doctor = (id) => {
        console.log('delete doctor id', id);
    }


    render() {
        return (
            <Fragment>
                <div className={`mb-2 d-flex justify-content-between`}>
                    <div className={`d-flex justify-content-between w-100`}>
                        
                        <div className="card w-100 border-left-3 border-top-0 border-bottom-0 border-right-0 border-info mr-2 px-3" >
                            <div className="card-body d-flex justify-content-around align-items-center py-1">
                                <div className="">
                                    {
                                        this.state.loading ?
                                            <Loading size={55} custom={{ color: '#5bc0de' }} /> :
                                            <h1 className="font-weight-bold text-center values-text mb-0 text-info">
                                                {this.state.counts.total}
                                            </h1>
                                    }
                                    <h5 className={`text-dark`}>Total</h5>
                                </div>
                                <i className="fa fa-stethoscope fa-5x text-info"></i>
                            </div>
                        </div>
                        <div className="card w-100 border-left-3 border-top-0 border-bottom-0 border-right-0 border-success mr-2 px-3" >
                            <div className="card-body d-flex justify-content-around align-items-center py-1">
                                <div className="">
                                    {
                                        this.state.loading ?
                                            <Loading size={55} custom={{ color: '#5bc0de' }} /> :
                                            <h1 className="font-weight-bold text-center values-text mb-0 text-success">
                                                {this.state.counts.active}
                                            </h1>
                                    }
                                    <h5 className={`text-dark`}>Active</h5>
                                </div>
                                <i className="fa fa-check fa-5x text-success"></i>
                            </div>
                        </div>
                        <div className="card w-100 border-left-3 border-top-0 border-bottom-0 border-right-0 border-danger mr-2 px-3" >
                            <div className="card-body d-flex justify-content-around align-items-center py-1">
                                <div className="">
                                    {
                                        this.state.loading ?
                                            <Loading size={55} custom={{ color: '#5bc0de' }} /> :
                                            <h1 className="font-weight-bold text-center values-text mb-0 text-danger">
                                                {this.state.counts.deactive}
                                            </h1>
                                    }
                                    <h5 className={`text-dark`}>Deactive</h5>
                                </div>
                                <i className="fa fa-times fa-5x text-danger"></i>
                            </div>
                        </div>
                    </div>
                    <div className={`d-flex align-items-end mb-3`}>
                        <Button icon="icon-plus3" onClick={() => this.setState({ addNewModalVisibility: true })}>
                            Add a new doctor
                        </Button>
                    </div>
                </div>
                {
                    this.state.loading ? <>
                        {/* <SkeletonTheme color="#000" highlightColor="#f2f2f2">
                            <Skeleton className="my-1" count={1} height={40}/>
                        </SkeletonTheme> */}
                        <SkeletonTheme color="#ffffff" highlightColor="#f2f2f2">
                            <Skeleton className="my-1" count={12} height={45}/>
                        </SkeletonTheme>
                    </>: (
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
                                        error={this.state.user_first_name.error}
                                        disabled={this.state.addNewDoctorModalLoading} />
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
                                        disabled={this.state.addNewDoctorModalLoading} />
                                </div>
                            </div>
                            <div className="col-md-4 px-3">
                                <div className="form-group">
                                    <Inputfield
                                        id={`user_phone`}
                                        heading={'Phone number'}
                                        placeholder="Enter phone number"
                                        required
                                        type="text" pattern="\d*" maxlength="11"
                                        onChange={this.on_text_field_change}
                                        value={this.state.user_phone.value}
                                        error={this.state.user_phone.error}
                                        disabled={this.state.addNewDoctorModalLoading} />
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
                                        error={this.state.user_email.error}
                                        disabled={this.state.addNewDoctorModalLoading} />
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
                                            // value={{ id: 'country_selection', label: this.state.user_country.value }}
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
                                            isDisabled={this.state.addNewDoctorModalLoading}
                                            onChange={e => this.on_selected_changed(e, 'user_city')}
                                            // value={{ id: 'city_selection', label: this.state.user_city.value }}
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
                                            disabled={this.state.addNewDoctorModalLoading}
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
                                    id="user_gender"
                                    isDisabled={this.state.addNewDoctorModalLoading}
                                    onChange={e => this.on_selected_changed(e, 'user_gender')}
                                    // value={{ id: 'gender_selection', label: this.state.user_gender.value }}
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
                                    isDisabled={this.state.addNewDoctorModalLoading}
                                    onChange={e => this.on_selected_changed(e, 'user_blood_group')}
                                    // value={{ id: 'blood_group_selection', label: this.state.user_blood_group.value }}
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
                                    disabled={this.state.addNewDoctorModalLoading}
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
                                    disabled={this.state.addNewDoctorModalLoading}
                                />

                            </div>
                        </div>
                        <hr />
                        <div className={`d-flex justify-content-between`}>
                            <h5 className={`font-weight-bold`}>Specialities's</h5>
                            <Button icon="icon-plus3" color="black" disabled={this.state.addNewDoctorModalLoading} onClick={() => this.toggle_modal('addNewSpecialityModalVisibility')}>Speciality</Button>
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
                            <Button icon="icon-plus3" color="black" disabled={this.state.addNewDoctorModalLoading} onClick={() => this.toggle_modal('addNewDegreeModalVisibility')}>Degree</Button>
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
                        <hr />
                        <div className={``}>
                            <h5 className={`font-weight-bold`}>Status</h5>
                            <div className={`d-flex`}>

                                <div className="form-check mr-2">
                                    <label className="form-check-label">
                                        <div className="uniform-checker">
                                            <span className={this.state.user_is_active.value ? 'checked' : ''}>
                                                <input type="checkbox"
                                                    name="is_active"
                                                    id="user_is_active"
                                                    // defaultChecked={this.state.user_is_active.value}
                                                    checked={this.state.user_is_active.value}
                                                    onChange={() => this.setState({ user_is_active: { value: true, error: false } })}
                                                    className="form-input-styled" />
                                            </span>
                                        </div>
                                    Is Active
                                </label>
                                </div>
                                <div className="form-check mb-0">
                                    <label className="form-check-label">
                                        <div className="uniform-checker">
                                            <span className={this.state.user_is_active.value ? '' : 'checked'}>
                                                <input type="checkbox"
                                                    name="is_active"
                                                    id="user_is_active"
                                                    // defaultChecked={!this.state.user_is_active.value}
                                                    checked={!this.state.user_is_active.value}
                                                    onChange={() => this.setState({ user_is_active: { value: false, error: false } })}
                                                    className="form-input-styled" />
                                            </span>
                                        </div>
                                    Is Deactivated
                                </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`modal-footer`}>
                        <Button icon="icon-plus3" disabled={this.state.addNewDoctorModalLoading} onClick={e => this.on_submit(e)}>{this.state.mode === 'create'? 'Create Doctor': 'Update doctor'}</Button>
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
            </Fragment>
        )
    }
}
function map_state_to_props(state) {
    return {
        active_page: state.active_page,
        active_user: state.active_user,
    }
}
export default connect(map_state_to_props, { set_active_page })(SearchDoctors);