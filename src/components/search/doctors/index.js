import React, { Component } from 'react';
import Container from '../../../shared/container/container';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { notify, set_active_page } from '../../../actions';
import { BASE_URL } from '../../../shared/router_constants';
import { USERS_BASE_URL } from '../../../shared/rest_end_points';
import CustomTable from '../../../shared/customs/CustomTable';
import Axios from 'axios';
import { Ucfirst } from '../../../shared/functions';


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
                        name: `Dr. ${Ucfirst(_doctors[i].first_name)} ${Ucfirst(_doctors[i].last_name)}`,
                        phone_number: _doctors[i].phone_number,
                        email: _doctors[i].email,
                        email_confirmation: _doctors[i].email_confirmation,
                        date_of_birth: _doctors[i].date_of_birth,
                        gender: _doctors[i].gender === 'Male' ? <span className={`badge badge-primary`}>Male</span> : <span className={`badge bg-pink-400`}>Female</span>
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