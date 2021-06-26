import React, { Component } from 'react';
import Modal from 'react-bootstrap4-modal';
import { InputField, Button } from 'components'
import { connect } from 'react-redux';
import { convert_object_array_to_string, Ucfirst } from 'utils/functions';
import { CreateNewProcedureItem } from 'services/queries';
import Notify from 'notify';

class CreateProcedureList extends Component {


    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            doctors: [],

            name_input: { value: '', error: false },
            department_input: { value: '', error: false },
            description_input: { value: '', error: false },
            operation_risk_input: { value: '', error: false },
            operation_efficacy_input: { value: '', error: false },
            operation_alternative_input: { value: '', error: false },
            operation_time_input: { value: '', error: false },
            operation_doctors_input: { value: [], error: false },
            operation_charges_input: { value: '', error: false },

        }
    }

    populate_doctors = (props) => {
        const temp_users = []
        for (let i = 0; i < props.doctors.length; ++i) {
            const t_user = props.doctors[i]

            temp_users.push({
                id: 'doctor_selection',
                value: t_user.doctor._id,
                label: `Dr. ${Ucfirst(t_user.doctor.first_name)} ${Ucfirst(t_user.doctor.last_name)} | ${convert_object_array_to_string(t_user.details.specialities, 'description')}`
            })
            if (i === props.doctors.length - 1) {
                this.setState({ doctors: temp_users });
            }
        }
    }

    componentWillReceiveProps(new_props) {
        // console.log('cwrp', new_props)
        this.populate_doctors(new_props);
    }

    componentDidMount() {
        if (this.props.doctors) {
            this.populate_doctors(this.props);
        }
    }

    onTextChange = (e) => {
        this.setState({ [e.target.id]: { value: e.target.value, error: false } });
    }

    onDoctorsSelectChange = (e) => {
        console.log('select', e)
        this.setState({ operation_doctors_input: { value: e, error: false } })
    }

    onCreateProcedureList = (e) => {
        e.preventDefault();
        console.log('state', this.state)
        /**
         *  -department_input: {value: "hahahah", error: false}
            -description_input: {value: "hahahaha", error: false}
            doctors: (8) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
            loading: false
            -name_input: {value: "hahaha", error: false}
            -operation_alternative_input: {value: "none", error: false}
            -operation_charges_input: {value: "123", error: false}
            -operation_doctors_input:
                error: false
                value: Array(2)
                    0: {id: "doctor_selection", value: "6005efaeec7d8958bdac3b58", label: "Dr. Ashvin Patel | "}
                    1: {id: "doctor_selection", value: "6005e6c0ec7d8958bdac3b3b", label: "Dr. Farrukh Shahid | "}
                length: 2
                __proto__: Array(0)
                __proto__: Object
            -operation_efficacy_input: {value: "none", error: false}
            -operation_risk_input: {value: "none", error: false}
            -operation_time_input: {value: "56", error: false}
         */
        try {
            const payload = {
                name: this.state.name_input.value.trim(),
                department: this.state.department_input.value.trim(),
                description: this.state.description_input.value.trim(),
                operation_alternative: this.state.operation_alternative_input.value.trim(),
                operation_charges: this.state.operation_charges_input.value.trim(),
                operation_doctors: this.state.operation_doctors_input.value.map(item => item.value),
                operation_efficacy: this.state.operation_efficacy_input.value.trim(),
                operation_risk: this.state.operation_risk_input.value.trim(),
                operation_time: parseInt(this.state.operation_time_input.value.trim())
            }
            console.log('payload', payload);
            CreateNewProcedureItem(payload).then(_res => {
                console.log('response', _res.data)
                Notify('success', '', _res.data.message);
            }).catch(err => {
                console.log('error', err)
                Notify('error', '', err.toString());
            })
        }
        catch (err) {
            console.log('error', err);
            Notify('error', '', err.toString());
        }
    }




    render() {
        return (
            <Modal visible={this.props.visibility} dialogClassName="modal-lg" onClickBackdrop={() => this.props.handleClose()}>
                <form method="post" onSubmit={this.onCreateProcedureList}>
                    <div className={`modal-header bg-teal-400`}>
                        <h5>Add New Procedure To List</h5>
                    </div>
                    <div className={`modal-body`}>
                        <div className={`container-fluid`}>
                            <div className={`row`}>
                                <div className={`col-lg-6`}>
                                    <InputField
                                        id="name_input"
                                        heading="Procedure name"
                                        className="form-control"
                                        required
                                        value={this.state.name_input.value}
                                        onChange={e => this.onTextChange(e)}
                                        placeholder="Enter name of the procedure"
                                        disabled={this.state.loading}
                                    />
                                </div>
                                <div className={`col-lg-6`}>
                                    <InputField
                                        id="department_input"
                                        heading="Department Name"
                                        className="form-control"
                                        required
                                        value={this.state.department_input.value}
                                        onChange={e => this.onTextChange(e)}
                                        placeholder="Enter name of the department"
                                        disabled={this.state.loading}
                                    />
                                </div>
                            </div>
                            <div className={`row`}>
                                <div className={`col-lg-12`}>
                                    <InputField
                                        id="description_input"
                                        heading="Description"
                                        className="form-control"
                                        required
                                        value={this.state.description_input.value}
                                        onChange={e => this.onTextChange(e)}
                                        placeholder="Enter description of procedure"
                                        disabled={this.state.loading}
                                    />
                                </div>
                            </div>
                            <div className={`row`}>
                                <div className={`col-lg-3`}>
                                    <InputField
                                        id="operation_charges_input"
                                        heading="Fee"
                                        className="form-control"
                                        required
                                        value={this.state.operation_charges_input.value}
                                        onChange={e => this.onTextChange(e)}
                                        placeholder="Enter default fee"
                                        helper="Only for default value"
                                        disabled={this.state.loading}
                                    />
                                </div>
                                <div className={`col-lg-3`}>
                                    <InputField
                                        id="operation_time_input"
                                        heading="Operation time (minutes)"
                                        className="form-control"
                                        required
                                        value={this.state.operation_time_input.value}
                                        helper="Number of minutes"
                                        onChange={e => this.onTextChange(e)}
                                        placeholder="Enter Time of operation in minutes"
                                        disabled={this.state.loading}
                                    />
                                </div>
                                <div className={`col-lg-6`}>
                                    <InputField
                                        heading="Select doctor"
                                        field_type="select"
                                        required
                                        isClearable
                                        closeMenuOnSelect={false}
                                        menuPlacement="auto"
                                        options={this.state.doctors}
                                        className={`Select-option`}
                                        classNamePrefix={`form-control`}
                                        placeholder="Select doctors for this procedure"
                                        id="doctor_input"
                                        isMulti
                                        isDisabled={this.state.loading}
                                        onChange={_doctors => this.setState({ operation_doctors_input: { value: _doctors, error: false } })}
                                        // value={{ id: 'blood_group_selection', label: this.state.user_blood_group.value }}
                                        // defaultValue={{ id: 'blood_group_selection', label: 'Unknown' }}
                                        styles={{
                                            container: base => ({
                                                ...base,
                                                backgroundColor: this.state.operation_doctors_input.error ? '#FF0000' : '',
                                                padding: 1,
                                                borderRadius: 5
                                            }),
                                        }}
                                    />
                                </div>
                            </div>
                            <div className={`row`}>
                                <div className={`col-lg-12`}>
                                    <InputField
                                        id="operation_risk_input"
                                        heading="Operation Risk"
                                        className="form-control"
                                        required
                                        value={this.state.operation_risk_input.value}
                                        onChange={e => this.onTextChange(e)}
                                        placeholder="Enter the risk involved in the procedure (none if not)"
                                        disabled={this.state.loading}
                                    />
                                </div>
                            </div>
                            <div className={`row`}>
                                <div className={`col-lg-12`}>
                                    <InputField
                                        id="operation_efficacy_input"
                                        heading="Efficacy"
                                        className="form-control"
                                        required
                                        value={this.state.operation_efficacy_input.value}
                                        onChange={e => this.onTextChange(e)}
                                        placeholder="Enter the effictiveness of the procedure"
                                        disabled={this.state.loading}
                                    />
                                </div>
                            </div>
                            <div className={`row`}>
                                <div className={`col-lg-12`}>
                                    <InputField
                                        id="operation_alternative_input"
                                        heading="Alternative"
                                        className="form-control"
                                        required
                                        value={this.state.operation_alternative_input.value}
                                        onChange={e => this.onTextChange(e)}
                                        placeholder="Enter the alternative of this procedure (none if not)"
                                        disabled={this.state.loading}
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className={`modal-footer`}>
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
        doctors: state.doctors.payload
    }
}
export default connect(map_state_to_props)(CreateProcedureList);