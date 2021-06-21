import { Button, IconButton } from 'components'
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
            search_date: { value: moment(new Date()).format('ll') },
            create_procedure_modal_visibility: false,
            create_procedure_list_modal_visibility: false,

        }
    }

    populate_doctors = (props) => {
        const temp_users = []
        for (let i = 0; i < props.doctors.length; ++i) {
            const t_user = props.doctors[i]

            temp_users.push({
                id: `doctor_selection`,
                reference: t_user.doctor._id,
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
    }

    todays_date_change = (e) => {
        if (e === '') {
            this.setState({ search_date: { value: '' } })
        }
        else {
            var configured_date = null;
            try {
                configured_date = e.format('ll');
                // this.props.clear_todays_appointments()
                // this.props.load_todays_appointments(configured_date)
                localStorage.setItem('Gh65$p3a008#3B', configured_date)
            }
            catch (err) {
                configured_date = ''
            }
            finally {
                this.setState({ search_date: { value: configured_date } })
            }
        }
    }

    render() {
        console.log('doctors', this.props.doctors, 'state', this.state.doctors)
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
                                        id="doctor_selection"
                                        isClearable
                                        components={{ Menu }}
                                        menuPlacement="auto"
                                        options={this.state.doctors}
                                        classNamePrefix={`form-control`}
                                        placeholder="Search Doctor"
                                    // onInputChange={e => this.populate_doctors(e)}
                                    // onChange={e => this.on_selected_changed(e, "doctor_selection")}
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
                                    // onChange={e => this.on_selected_changed(e, "patient_selection")}
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
                                        // onChange={e => this.on_selected_changed(e, "status_selection")}
                                        onClick={() => console.log('visit status')}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2 d-flex justify-content-center align-items-end mb-2 pb-2">

                        <Popup
                            trigger={
                                <IconButton
                                    icon="icon-filter4"
                                    variant="filled"
                                    color="black"
                                    size="lg"
                                    className={`mx-1`}
                                // onClick={this.set_filters}
                                />
                            }
                            content={
                                <div className={`card card-body bg-dark text-white shadow mb-1 py-1`}>
                                    Filter records
                                    </div>
                            }
                            flowing
                            // hoverable
                            position='top center'
                        />

                        <Popup
                            trigger={
                                <IconButton
                                    icon="icon-add-to-list"
                                    variant="filled"
                                    size="lg"
                                    className={`mx-1`}
                                    onClick={() => this.setState({ create_procedure_list_modal_visibility: true })}
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
                                    onClick={() => this.setState({ create_procedure_modal_visibility: true })}
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
                <div className={``}>

                </div>
            </div>
            {
                this.state.create_procedure_modal_visibility && 
                    <CreateProcedure 
                        visibility={this.state.create_procedure_modal_visibility}
                        handleClose={() => this.setState({ create_procedure_modal_visibility: false })}
                    />
            }
            {
                this.state.create_procedure_list_modal_visibility &&
                <CreateProcedureList
                    visibility={this.state.create_procedure_list_modal_visibility}
                    handleClose={() => this.setState({ create_procedure_list_modal_visibility: false })}
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