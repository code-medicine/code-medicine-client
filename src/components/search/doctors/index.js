import React, { Component } from 'react';
import Container from '../../../shared/container/container';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { notify, set_active_page } from '../../../actions';
import { BASE_URL } from '../../../shared/router_constants';
import { USERS_BASE_URL } from '../../../shared/rest_end_points';
import {Icon } from 'semantic-ui-react';
import CustomTable from '../../../shared/customs/CustomTable';
import Axios from 'axios';
import moment from 'moment'


const headCells = [
    { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
    { id: 'phone_number', numeric: false, disablePadding: false, label: 'Phone#' },
    { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
    { id: 'email_confirmation', numeric: false, disablePadding: false, label: 'Confirmation' },
    { id: 'date_of_birth', numeric: false, disablePadding: false, label: 'DOB' },
    { id: 'gender', numeric: false, disablePadding: false, label: 'Gender' },
];

class SearchDoctors extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rows: []
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

    load_doctors = () => {
        const query = `${USERS_BASE_URL}?role=Doctor`
        Axios.get(query).then(_doctors => {
            console.log('doctors', _doctors)
            if (_doctors.data) {
                _doctors = _doctors.data.payload;
                const temp = []
                for (let i = 0; i < _doctors.length; ++i) {
                    temp.push({
                        name: { value: `Dr. ${_doctors[i].first_name} ${_doctors[i].last_name}`, show_status: false },
                        phone_number: { value: _doctors[i].phone_number, show_status: false },
                        email: { value: _doctors[i].email, show_status: false },
                        email_confirmation: { value: _doctors[i].email_confirmation? <i className={`icon-check2 bg-success`}/>:<i className={`icon-cross2 bg-danger`}/>, show_status: true },
                        date_of_birth: { value: _doctors[i].date_of_birth ? moment(_doctors[i].date_of_birth).format('ll') : <i className={`icon-dash`} />, show_status: false },
                        gender: { value: _doctors[i].gender === 'Male'? <span className={`badge badge-primary`}>Male</span>:<span className={`badge bg-pink-400`}>Female</span>, show_status: false }
                    })
                    if (i === _doctors.length - 1) {
                        this.setState({ rows: temp })
                    }
                }
            }
        })
    }

    render() {
        return (
            <Container container_type={'searchdoctors'}>
                {
                    this.state.rows.length ? <CustomTable
                        rows={this.state.rows}
                        headCells={headCells}
                        heading={'Doctors'}
                    /> : ''
                }

            </Container>
        )
    }
}
function map_state_to_props(state) {
    return {
        notify: state.notify,
        active_page: state.active_page,
    }
}
export default connect(map_state_to_props, { notify, set_active_page })(SearchDoctors);