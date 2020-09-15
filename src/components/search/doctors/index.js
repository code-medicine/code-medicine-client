import React, { Component } from 'react';
import Container from '../../../shared/container/container';
import { connect }from 'react-redux';
import { Link } from 'react-router-dom';
import { notify, set_active_page } from '../../../actions';
import { BASE_URL } from '../../../shared/router_constants';
import { USERS_BASE_URL } from '../../../shared/rest_end_points';
import MaterialTable from '../../../shared/customs/MaterialTable';
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


const rows = [
    {first_name:'Cupcake', last_name: '305', phone_number: 3.7, email: 67, email_confirmation: 4.3},
    {first_name:'Donut', last_name: '452', phone_number: 25.0,email: 51, email_confirmation: 4.9},
    {first_name:'Eclair', last_name: '262', phone_number: 16.0,email: 24, email_confirmation: 6.0},
  ];

class SearchDoctors extends Component {
    
    constructor(props){
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
            console.log('doctors',_doctors)
            if (_doctors.data){
                _doctors = _doctors.data.payload;
                const temp = []
                for (let i=0;i<_doctors.length; ++i){
                    temp.push({
                        name: `Dr. ${_doctors[i].first_name} ${_doctors[i].last_name}`,
                        phone_number: _doctors[i].phone_number,
                        email: _doctors[i].email,
                        email_confirmation: _doctors[i].email_confirmation,
                        date_of_birth: _doctors[i].date_of_birth? moment(_doctors[i].date_of_birth).format('ll'):'',
                        gender: _doctors[i].gender
                    })
                    if (i === _doctors.length - 1){
                        this.setState({ rows: temp })
                    }
                }
            }
        })
    }

    // async render_users(string, role) {

    //     const query = `${USERS_BASE_URL}?search=${string}&role=${role}`
    //     try {
    //         const res_users = await this.request({}, query, 'get')
    //         let temp_users = []
    //         for (var i = 0; i < res_users.data.payload['count']; ++i) {
    //             const t_user = res_users.data.payload['users'][i]
    //             temp_users.push({
    //                 id: `${role.toLowerCase()}_selection`,
    //                 reference: t_user._id,
    //                 label: `${t_user.first_name} ${t_user.last_name} | ${t_user.phone_number} | ${t_user.email}`
    //             })
    //         }
    //         if (role === 'Patient') {
    //             this.setState({ patients: temp_users })
    //         }
    //         else if (role === 'Doctor') {
    //             this.setState({ doctors: temp_users })
    //         }
    //     }
    //     catch (error) {
    //         console.error('error', error);
    //     }
    // }

    render() {
        return(
            <Container container_type={'searchdoctors'}>
                <MaterialTable
                    rows={this.state.rows}
                    headCells={headCells}
                    heading={'Doctors'}
                    />

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