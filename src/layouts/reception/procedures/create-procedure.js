import { Button, IconButton, InputField } from 'components';
import React, { Component } from 'react';
import Modal from 'react-bootstrap4-modal';
import TimeKeeper from 'react-timekeeper';
import { Popup } from 'semantic-ui-react';
import DateTimePicker from 'react-datetime';
import moment from 'moment';
import { connect } from 'react-redux';
import { convert_object_array_to_string, Ucfirst } from 'utils/functions';
import { ProcedureCreate, UserSearchByCredentials } from 'services/queries';
import Notify from 'notify';

class CreateProcedure extends Component {

    constructor(props) {
        super(props);
        this.state = {
            date_input: { value: moment().format('ll'), error: false },
            procedure_type_input: { value: '', error: false },
            patient_input: { value: '', error: false },
            doctor_input: { value: '', error: false },
            reference_input: { value: '', error: false },
            fee_input: { value: '', error: false },
            discount_input: { value: '', error: false },
            dr_share_input: { value: '', error: false },
            comments_input: { value: '', error: false },
            time_input: { value: moment().format('LT'), error: false },

            loading: false,
            doctors: [],
            patients: [],
            procedures_list: [],
            pateints_options_loading: false,
        }
        this.search_patient_trigger_timmer = null;
    }

    populate_doctors = (doctors) => {
        const temp_users = []
        for (let i = 0; i < doctors.length; ++i) {
            const t_user = doctors[i]

            temp_users.push({
                id: 'doctor_selection',
                value: t_user.doctor._id,
                label: `Dr. ${Ucfirst(t_user.doctor.first_name)} ${Ucfirst(t_user.doctor.last_name)} | ${convert_object_array_to_string(t_user.details.specialities, 'description')}`
            })
            if (i === doctors.length - 1) {
                this.setState({ doctors: temp_users });
            }
        }
    }

    populate_procedures_list = (procedures_list) => {
        const temp = []
        for (let i = 0; i < procedures_list.length; ++i) {
            const t = procedures_list[i]

            temp.push({
                id: 'procedure_selection',
                value: t._id,
                label: `${Ucfirst(t.name)} | ${Ucfirst(t.department)} `
            })
            if (i === procedures_list.length - 1) {
                this.setState({ procedures_list: temp });
            }
        }
    }

    componentWillReceiveProps(new_props) {
        // console.log('cwrp', new_props)
        if (new_props.doctors)
            this.populate_doctors(new_props.doctors);
        if (new_props.procedures_list)
            this.populate_procedures_list(new_props.procedures_list);
    }

    componentDidMount() {
        if (this.props.doctors) {
            this.populate_doctors(this.props.doctors);
        }
        if (this.props.procedures_list) {
            this.populate_procedures_list(this.props.procedures_list);
        }
    }


    onCreateProcedure = (e) => {
        e.preventDefault();
        this.setState({ loading: true }, () => {
            try {
                const operate_time = `${moment(this.state.date_input.value).format('YYYY-MM-DD')}T${moment(this.state.time_input.value, ["h:mm A"]).format("HH:mm:ss")}Z`
                const payload = {
                    patient_id: this.state.patient_input.value.trim(),
                    doctor_id: this.state.doctor_input.value.trim(),
                    appointment_id: null,
                    procedures_list_id: this.state.procedure_type_input.value.trim(),
                    reference: this.state.reference_input.value.trim(),
                    fee: this.state.fee_input.value,
                    discount: this.state.discount_input.value.trim(),
                    dr_share: this.state.dr_share_input.value.trim(),
                    description: this.state.comments_input.value.trim(),
                    time_stamp: {
                        operate: operate_time,
                        report: operate_time,
                    }
                }
                console.log('payload', payload)
                ProcedureCreate(payload).then(_res => {
                    Notify('success', '', _res.data.message);
                    this.setState({ loading: false });
                }).catch(error => {
                    Notify('error', '', error.toString());
                    this.setState({ loading: false });
                })
            } catch (e) {
                // console.log('error', e)
                Notify('info', '', e.toString());
                this.setState({ loading: false });
            }

        })
    }

    onTextChange = (e) => {
        this.setState({ [e.target.id]: { value: e.target.value, error: false } });
    }

    onSelectChange = (e, id) => {
        console.log('e', e, id)
        if (id === 'procedure_type_input' && e){
            const respective_item = this.props.procedures_list.find(item => item._id === e.value);
            this.setState({ [id]: { value: e.value, error: false }, fee_input: { value: respective_item.operation_charges, error: false } });
        }
        else {
            this.setState({ [id]: { value: e ? e.value : '', error: false } });
        }
    }

    populate_patients = (str) => {
        clearTimeout(this.search_patient_trigger_timmer);
        if (str.length >= 2) {
            this.setState({ pateints_options_loading: true }, () => {
                this.search_patient_trigger_timmer = setTimeout(() => {
                    UserSearchByCredentials(str, 'Patient').then(_res => {
                        console.log('response ', _res.data);
                        const temp = []
                        if (_res.data.payload.users.length > 0){
                            for (let i = 0; i < _res.data.payload.users.length; ++i) {
                                const t = _res.data.payload.users[i]
        
                                temp.push({
                                    id: 'patient_selection',
                                    value: t._id,
                                    label: `${t.mrn} | ${Ucfirst(t.first_name)} ${Ucfirst(t.last_name)} `
                                })
                                if (i === _res.data.payload.users.length - 1) {
                                    this.setState({ patients: temp, pateints_options_loading: false });
                                }
                            }
                        }
                        else {
                            this.setState({ patients: [], pateints_options_loading: false });
                        }
                    })
                }, 1000)
                
            })
        }
        else {
            this.setState({ patients: [], pateints_options_loading: false });
        }
    }

    procedureDateInputChange = (e) => {
        if (e === '') {
            this.setState({ date_input: { value: '', error: true } })
        }
        else {
            var configured_date = null;
            try {
                configured_date = e.format('ll');
                // this.props.clear_todays_appointments()
                // this.props.load_todays_appointments(configured_date)
                localStorage.setItem('Gh65$p3a008#2G', configured_date)
            }
            catch (err) {
                configured_date = ''
            }
            finally {
                this.setState({ date_input: { value: configured_date, error: configured_date === '' ? true : false } })
            }
        }
    }

    render() {
        return (
            <Modal visible={this.props.visibility} dialogClassName="modal-lg" onClickBackdrop={() => this.props.handleClose()}>
                <form method="post" onSubmit={this.onCreateProcedure}>
                    <div className={`modal-header bg-teal-400`}>
                        <h5>Create New Procedure</h5>
                        <div className={`w-25`}>
                            <DateTimePicker id="date_input"
                                onChange={(e) => this.procedureDateInputChange(e)}
                                className="clock_datatime_picker text-teal-400"
                                inputProps={{
                                    placeholder: 'Select Date',
                                    width: '100%',
                                    className: `form-control ${this.state.date_input.error ? 'border-danger' : ''}`,
                                    disabled: this.state.loading
                                }}
                                
                                input={true}
                                dateFormat={'ll'}
                                timeFormat={false}
                                closeOnSelect={true}
                                value={this.state.date_input.value}

                            />

                        </div>
                    </div>
                    <div className={`modal-body`}>
                        <div className={`container-fluid`}>

                            <div className={`row`}>
                                <div className={`col-lg-8`}>
                                    <div className={`row`}>
                                        <div className={`col-lg-12`}>
                                            <InputField
                                                heading="What procedure to do?"
                                                field_type="select"
                                                required
                                                isClearable
                                                menuPlacement="auto"
                                                options={this.state.procedures_list}
                                                className={`Select-option`}
                                                classNamePrefix={`form-control`}
                                                placeholder="Search for procedure"
                                                id="procedure_type_input"
                                                isDisabled={this.state.loading}
                                                onChange={e => this.onSelectChange(e, 'procedure_type_input')}
                                                // value={{ id: 'blood_group_selection', label: this.state.user_blood_group.value }}
                                                // defaultValue={{ id: 'blood_group_selection', label: 'Unknown' }}
                                                styles={{
                                                    container: base => ({
                                                        ...base,
                                                        backgroundColor: this.state.procedure_type_input.error ? '#FF0000' : '',
                                                        padding: 1,
                                                        borderRadius: 5
                                                    }),
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className={`row`}>
                                        <div className={`col-lg-10`}>
                                            <InputField
                                                heading="Select Patient"
                                                field_type="select"
                                                required
                                                isClearable
                                                menuPlacement="auto"
                                                isLoading={this.state.pateints_options_loading}
                                                options={this.state.patients}
                                                noOptionsMessage={(e) => "Type to Search"}
                                                className={`Select-option`}
                                                classNamePrefix={`form-control`}
                                                placeholder="Search Patients"
                                                isDisabled={this.state.loading}
                                                onChange={e => this.onSelectChange(e, 'patient_input')}
                                                onInputChange={e => this.populate_patients(e)}
                                                // value={{ id: 'blood_group_selection', label: this.state.user_blood_group.value }}
                                                // defaultValue={{ id: 'blood_group_selection', label: 'Unknown' }}
                                                styles={{
                                                    container: base => ({
                                                        ...base,
                                                        backgroundColor: this.state.patient_input.error ? '#FF0000' : '',
                                                        padding: 1,
                                                        borderRadius: 5
                                                    }),
                                                }}
                                            />
                                        </div>
                                        <div className={`col-md-2 d-flex align-items-end`}>
                                            <Popup
                                                trigger={
                                                    <IconButton
                                                        icon="icon-plus3"
                                                        size="lg"
                                                        className={`btn-block`}
                                                        color="gray"
                                                        variant="filled"
                                                        onClick={() => console.log('call the new user modal')}
                                                    />
                                                }
                                                flowing
                                                // hoverable
                                                content={
                                                    <div className={`card card-body bg-dark text-white shadow ml-1 py-1 mt-4`}>
                                                        Add new Patient
                                                </div>
                                                }
                                                position='top center'
                                                style={{ zIndex: 15000 }}
                                            />
                                        </div>
                                    </div>
                                    <div className={`row`}>
                                        <div className={`col-lg-8`}>
                                            <InputField
                                                heading="Select doctor"
                                                field_type="select"
                                                required
                                                isClearable
                                                menuPlacement="auto"
                                                options={this.state.doctors}
                                                className={`Select-option`}
                                                classNamePrefix={`form-control`}
                                                placeholder="Search Doctor"
                                                id="doctor_input"
                                                isDisabled={this.state.loading}
                                                onChange={e => this.onSelectChange(e, 'doctor_input')}
                                                // value={{ id: 'blood_group_selection', label: this.state.user_blood_group.value }}
                                                // defaultValue={{ id: 'blood_group_selection', label: 'Unknown' }}
                                                styles={{
                                                    container: base => ({
                                                        ...base,
                                                        backgroundColor: this.state.doctor_input.error ? '#FF0000' : '',
                                                        padding: 1,
                                                        borderRadius: 5
                                                    }),
                                                }}
                                            />
                                        </div>
                                        <div className={`col-lg-4`}>
                                            <InputField
                                                id="reference_input"
                                                heading="Refered by"
                                                className="form-control"
                                                value={this.state.reference_input.value}
                                                onChange={e => this.onTextChange(e)}
                                                placeholder="Reference of a doctor"
                                                disabled={this.state.loading}
                                            />

                                        </div>
                                    </div>
                                    <div className={`row`}>
                                        <div className={`col-lg-4`}>
                                            <InputField
                                                id="fee_input"
                                                heading="Fee"
                                                className="form-control"
                                                required
                                                value={this.state.fee_input.value}
                                                onChange={e => this.onTextChange(e)}
                                                placeholder="Enter Fee"
                                                disabled={this.state.loading}
                                            />
                                        </div>
                                        <div className={`col-lg-4`}>
                                            <InputField
                                                id="discount_input"
                                                heading="Discount"
                                                className="form-control"
                                                value={this.state.discount_input.value}
                                                onChange={e => this.onTextChange(e)}
                                                placeholder="Enter Discount"
                                                disabled={this.state.loading}
                                            />
                                        </div>
                                        <div className={`col-lg-4`}>
                                            <InputField
                                                id="dr_share_input"
                                                heading="Dr. share (%)"
                                                className="form-control"
                                                min="0"
                                                max="100"
                                                type="number"
                                                required
                                                value={this.state.dr_share_input.value}
                                                onChange={e => this.onTextChange(e)}
                                                placeholder="Enter Doctor share"
                                                disabled={this.state.loading}
                                            />
                                        </div>
                                    </div>
                                    <div className={`row`}>
                                        <div className={`col-lg-12`}>
                                            <InputField
                                                id="comments_input"
                                                heading="Comments if any"
                                                placeholder="Write specific description if need to be addressed"
                                                icon_class="icon-home"
                                                field_type="text-area"
                                                value={this.state.comments_input.value}
                                                onChange={e => this.onTextChange(e)}
                                                error={this.state.comments_input.error}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className={`col-lg-4`}>
                                    <label>Specify the time of procedure</label>
                                    <TimeKeeper
                                        time={this.state.time_input.value}
                                        onChange={(new_time) => this.setState({ time_input: { value: new_time.formatted12, error: false } })}
                                        // onDoneClick={() => console.log('time set')}
                                        coarseMinutes={5}
                                        forceCoarseMinutes
                                    />
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className={`modal-footer`}>
                        <div className="mr-auto d-flex">
                            <span className="badge badge-light badge-striped badge-striped-left border-left-teal-400" >
                                <span className="h6 font-weight-bold mr-1">Total: {(parseInt(this.state.fee_input.value) || 0) - (parseInt(this.state.discount_input.value) || 0)}</span>
                            </span>
                            <span className="ml-2 badge badge-light badge-striped badge-striped-left border-left-teal-400">
                                <span className="h6 font-weight-bold mr-1">Discount: {parseInt(this.state.discount_input.value) || 0}</span>
                            </span>
                            <span className="ml-2 badge badge-light badge-striped badge-striped-left border-left-teal-400">
                                <span className="h6 font-weight-bold mr-1">Dr. Share: {(((parseInt(this.state.fee_input.value) || 0) - (parseInt(this.state.discount_input.value) || 0)) * (parseInt(this.state.dr_share_input.value) || 0)) / 100}</span>
                            </span>
                        </div>
                        <Button icon="icon-plus3" type="submit">
                            Create
                        </Button>
                        <Button icon="icon-cross" color="red" onClick={() => this.props.handleClose()}>
                            Cancel
                    </Button>
                    </div>
                </form>
            </Modal>
        )
    }
}
function map_state_to_props(state) {
    return {
        doctors: state.doctors.payload,
        procedures_list: state.proceduresList.payload,
    }
}
export default connect(map_state_to_props)(CreateProcedure);