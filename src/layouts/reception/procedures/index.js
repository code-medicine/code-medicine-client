import { IconButton } from 'components'
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import Select, { components } from 'react-select'
import { Popup } from 'semantic-ui-react';
import { PATIENT_VISIT_STATUSES } from 'utils/constant_data';
import { convert_object_array_to_string, Ucfirst } from 'utils/functions';
import DateTimePicker from 'react-datetime';
import moment from 'moment'
import CreateProcedure from './create-procedure';
import CreateProcedureList from './create-procedure-list';
import { GetProcedures } from 'services/queries';
import { Link } from 'react-router-dom';
import TodaysPatientRowLoading from '../todays_patient/todays_patient_row_loading';

const Menu = props => {
    return (
        <components.Menu {...props} >
            <div className={`bg-light text-teal-400`} style={{ width: '400px' }}>
                {props.children}
            </div>
        </components.Menu>
    );
};

class Procedures extends Component {

    constructor(props) {
        super(props);
        this.state = {
            doctors: [],
            patients: [],
            search_date: { value: moment(new Date()).format('ll') },
            create_procedure_modal_visibility: { visibility: false, data: null, type: 0 },//0 for create, 1 for update
            create_procedure_list_modal_visibility: { visibility: false, data: null, type: 0 },//0 for create, 1 for update
            procedures: [],
            procedures_copy: [],
            loading: true,

            doctors_input: { value: '', label: '', error: false },
            patients_input: { value: '', label: '', error: false },
            status_selection: { value: '', label: '', error: false },
        }
    }

    populate_doctors = (props) => {
        const temp_users = []
        for (let i = 0; i < props.doctors.length; ++i) {
            const t_user = props.doctors[i]

            temp_users.push({
                id: `doctor_selection`,
                value: t_user.doctor._id,
                label: `Dr. ${Ucfirst(t_user.doctor.first_name)} ${Ucfirst(t_user.doctor.last_name)} | ${convert_object_array_to_string(t_user.details.specialities, 'description')}`
            })
            if (i === props.doctors.length - 1) {
                this.setState({ doctors: temp_users });
            }
        }
    }

    componentWillReceiveProps(new_props) {
        this.populate_doctors(new_props);
    }

    componentDidMount() {
        if (this.props.doctors) {
            this.populate_doctors(this.props);
        }
        if (localStorage.getItem('Gh65$p3a008#3B')){
            this.setState({ search_date: { value: localStorage.getItem('Gh65$p3a008#3B') } }, () => this.load_procedures())
        }
        else {
            this.load_procedures()
        }
    }

    load_procedures = () => {
        !this.state.loading && this.setState({ loading: true })
        GetProcedures(this.state.search_date.value).then(_procedures => {
            console.log('procedures', _procedures.data)
            this.setState({ procedures: _procedures.data.payload, loading: false })
        }).catch(err => console.log('error', err))
    }

    todays_date_change = (e) => {
        if (e === '') {
            this.setState({ search_date: { value: '' } })
        }
        else {
            var configured_date = null;
            try {
                configured_date = e.format('ll');
                localStorage.setItem('Gh65$p3a008#3B', configured_date)
            }
            catch (err) {
                configured_date = ''
            }
            finally {
                this.setState({ search_date: { value: configured_date } }, () => this.load_procedures())
            }
        }
    }

    filter_records = () => {
        // this.state.procedures.find(item => item.)
        return this.state.procedures.filter(item => 
            (this.state.doctors_input.value === "" ? true : item.doctor_id === this.state.doctors_input.value) &&
            (this.state.patients_input.value === "" ? true : item.patient_id === this.state.patients_input.value) &&
            (this.state.status_selection.label === "" ? true : item.procedure_status === this.state.status_selection.label))
    }

    onSelectChange = (e, id) => {
        console.log('e', e, id)
        this.setState({ [id]: { value: e ? e.value : '', label: e ? e.label : '', error: false } });
    }


    render() {
        // console.log('doctors', this.props.doctors, 'state', this.state.doctors)
        const records = this.filter_records();
        return (
            <Fragment>
                <div className={`container-fluid`}>
                    <div className="row">
                        <div className="col-md-10">
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="font-weight-semibold">Doctors</label>
                                        <Select
                                            isClearable
                                            components={{ Menu }}
                                            menuPlacement="auto"
                                            options={this.state.doctors}
                                            classNamePrefix={`form-control`}
                                            placeholder="Search Doctor"
                                            onChange={e => this.onSelectChange(e, "doctors_input")}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="font-weight-semibold">Patients</label>
                                        <Select
                                            id="patient_selection"
                                            isClearable
                                            components={{ Menu }}
                                            menuPlacement="auto"
                                            options={[]}
                                            classNamePrefix={`form-control`}
                                            placeholder="Search Patient"
                                        // onInputChange={e => this.populate_patient(e)}
                                            onChange={e => this.onSelectChange(e, "patients_input")}
                                        />
                                    </div>
                                </div>

                                <div className={`col-md-4`}>

                                    <div className="form-group">
                                        <label className="font-weight-semibold">Status</label>
                                        <Select
                                            isClearable
                                            options={PATIENT_VISIT_STATUSES}
                                            placeholder="Status"
                                            onChange={e => this.onSelectChange(e, "status_selection")}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-2 d-flex justify-content-center align-items-end mb-2 pb-2">


                            <Popup
                                trigger={
                                    <IconButton
                                        icon="icon-add-to-list"
                                        variant="filled"
                                        color="black"
                                        size="lg"
                                        className={`mx-1`}
                                        onClick={() => this.setState({ create_procedure_list_modal_visibility: { visibility: true, data: null, type: 0 } })}
                                    />
                                }
                                content={
                                    <div className={`card card-body bg-teal-400 text-white shadow mb-1 py-1`}>
                                        New Procedure Item
                                    </div>
                                }
                                flowing
                                // hoverable
                                position='top center'
                            />

                            <Popup
                                trigger={
                                    <IconButton
                                        icon="icon-plus3"
                                        variant="filled"
                                        size="lg"
                                        className={`mx-1`}
                                        onClick={() => this.setState({ create_procedure_modal_visibility: { visibility: true, data: null, type: 0 } })}
                                    />
                                }
                                content={
                                    <div className={`card card-body bg-teal-400 text-white shadow mb-1 py-1`}>
                                        New Procedure
                                </div>
                                }
                                flowing
                                // hoverable
                                position='top center'
                            />

                        </div>
                    </div>


                    <div className="table-header-background shadow-sw">
                        <div className="row">
                            <div className="col-lg-6 col-md-6 col-12 d-flex align-items-center">
                                <span className="text-white">Procedure list for date</span>
                                <span className="badge badge-secondary ml-2 d-none d-lg-block">
                                    {this.state.search_date.value}
                                </span>
                            </div>
                            <div className="col-lg-3 d-none d-lg-block col-0"></div>
                            <div className="col-lg-3 col-md-6 col-12 d-flex">
                                <DateTimePicker id="dob_text_input"
                                    onChange={this.todays_date_change}
                                    className="clock_datatime_picker "
                                    inputProps={{
                                        placeholder: 'Select Date',
                                        width: '100%',
                                        className: `form-control bg-teal-400 border-teal-400`
                                    }}
                                    input={true}
                                    dateFormat={'ll'}
                                    timeFormat={false}
                                    closeOnSelect={true}
                                    value={this.state.search_date.value}

                                    onClick={() => console.log('date select', this.state.search_date.value)}
                                />
                                <button className="btn bg-teal-400 border-teal-400 text-teal-400 btn-sm ml-2" onClick={() => {
                                    // this.props.clear_todays_appointments()
                                    // this.props.load_todays_appointments(localStorage.getItem('Gh65$p3a008#2C'))
                                }}>
                                    <i className="icon-search4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={`table-responsive mt-2 card mb-0 pb-0`}>
                        <table className={`table table-hover mb-0`}>
                            <tbody>
                                {
                                    this.state.loading ?
                                        <div className={``}>
                                            <div className={``}><TodaysPatientRowLoading /></div>
                                            <div className={``}><TodaysPatientRowLoading /></div>
                                        </div> :
                                        records.length === 0 ?
                                            <div className="alert alert-info mb-0">
                                                <strong>Info!</strong> No Procedures found.
                                            </div> :
                                            records.map((item, i) => {
                                                return (
                                                    <tr key={i}>
                                                        <td>
                                                            <div className={`container-fluid`} >
                                                                <div className={`row`}>
                                                                    <div className={`col-lg-3 col-md-6 col-sm-6 mt-0 text-teal-400 border-left-2 border-left-teal-400 btn-block d-flex align-items-center justify-content-center text-center`}>
                                                                        <div className={`btn btn-outline bg-teal-400 text-teal-400 btn-block jackInTheBox animated`}>
                                                                            <span className={`rounded-circle text-white bg-teal-400 h3 p-2`}>{item.patient.first_name.charAt(0).toUpperCase()}{item.patient.last_name.charAt(0).toUpperCase()}</span>
                                                                            <h4 className={`mt-2`}>{Ucfirst(item.patient.first_name)} {Ucfirst(item.patient.last_name)}</h4>
                                                                            <span><i className="icon-phone-wave mr-1"></i> {item.patient.phone_number}</span>
                                                                        </div>
                                                                    </div>

                                                                    <div className={`col-lg-2 col-md-6 col-sm-6 mt-0 text-teal-400 border-left-2 border-bottom-sm-2 border-left-teal-400 border-right-teal-400 border-right-2 btn-block d-flex align-items-center justify-content-center text-center`}>
                                                                        <div className={`h-100 d-flex flex-column justify-content-center jackInTheBox animated text-teal-400 btn-block text-center`}>
                                                                            <h1>{moment(item.time_stamp.operate, "YYYY-MM-DDThh:mm:ss").format('hh:mm a')}</h1>
                                                                            <p>{moment(item.time_stamp.operate).fromNow()}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className={`col-lg-7 col-md-12 col-sm-12 mt-sm-2`}>
                                                                        <div className={`font-weight-bold`}>{item.procedure_type.name.toUpperCase()} | {item.procedure_type.department.toUpperCase()}</div>
                                                                        <div className={``}>
                                                                            {item.appointment_id ? <Link className={`text-teal-400`}>Appointment </Link> : 'Appointment '}
                                                                                with<Link className="text-teal-400 font-weight-bold ml-1" to={"#"}>
                                                                                Dr. {Ucfirst(item.doctor.first_name)} {Ucfirst(item.doctor.last_name)}
                                                                                <i className="icon-user-tie ml-1"></i>
                                                                            </Link>
                                                                            <span className={`badge badge-${'waiting' === 'checked out' ? 'primary' : 'danger'} float-right`}>
                                                                                {item.procedure_status}
                                                                            </span>
                                                                        </div>
                                                                        <div className={`row`}>
                                                                            <div className={`col-lg-12`}>
                                                                                <span className={`font-weight-bold`}>Report Time: </span>{moment(item.time_stamp.report).format('LLL')}
                                                                            </div>
                                                                        </div>
                                                                        <div className={`row`}>
                                                                            <div className={`col-lg-12`}>
                                                                                <span className={`font-weight-bold`}>Fee:</span> Rs {item.fee}/-  <span className={`font-weight-bold`}>Discount:</span> Rs {item.discount || 0}/- {item.discount_purpose && item.discount_purpose !== "" ? `(${item.discount_purpose})` : '(standard)'}
                                                                            </div>
                                                                        </div>
                                                                        <div className={`row`}>
                                                                            <div className={`col-lg-12`}>
                                                                                <IconButton
                                                                                    icon="icon-pencil"
                                                                                    color="default"
                                                                                    size="sm"
                                                                                    onClick={() => this.setState({
                                                                                        create_procedure_modal_visibility: {
                                                                                            visibility: true,
                                                                                            data: item,
                                                                                            type: 1
                                                                                        }
                                                                                    })}
                                                                                    />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
                {
                    this.state.create_procedure_modal_visibility.visibility &&
                    <CreateProcedure
                        visibility={this.state.create_procedure_modal_visibility.visibility}
                        handleClose={(load_procedures) => {
                                this.setState({ create_procedure_modal_visibility: { visibility: false, data: null, type: 0 } })
                                if (load_procedures) this.load_procedures();
                            }
                        }
                        data={this.state.create_procedure_modal_visibility.data}
                    />
                }
                {
                    this.state.create_procedure_list_modal_visibility.visibility &&
                    <CreateProcedureList
                        visibility={this.state.create_procedure_list_modal_visibility.visibility}
                        handleClose={() => this.setState({ create_procedure_list_modal_visibility: { visibility: false, data: null, type: 0 } })}
                    />
                }
            </Fragment>
        )
    }
}
function map_state_to_props(state) {
    return {
        doctors: state.doctors.payload,
    }
}
export default connect(map_state_to_props)(Procedures);