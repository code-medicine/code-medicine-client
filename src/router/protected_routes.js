import React, { Component } from 'react';
import { LOGIN_URL } from './constants';
import { connect } from 'react-redux';
import Axios from 'axios';
import { USERS_SEARCH_BY_TOKEN } from '../services/rest_end_points';
import { set_active_user } from '../redux/actions';
import { Route, Redirect } from 'react-router-dom';
import _ from 'lodash'
import Skeletons from '../components/Skeletons';

class ProtectedRoutes extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        // this.authorize_token(localStorage.getItem('user'))
    }

    authorize_token = (token) => {
        if (_.isEmpty(this.props.active_user)){
            if (token !== null){
                Axios.get(`${USERS_SEARCH_BY_TOKEN}?tag=${token}`).then(res => {
                    this.props.set_active_user(res.data['payload'])
                }).catch(err => {
                    console.log(err)
                    localStorage.clear()
                    localStorage.setItem('cached-path', this.props.path)
                    this.props.set_active_user({})
                })
            }
            else {
                localStorage.setItem('cached-path', this.props.path)
            }
        }
    }

    check_for_token = () => {
        return localStorage.getItem('user') ? true : false;
    }

    render() {
        const { component: Component, ...props } = this.props
        console.log('path', this.props.path)
        let __html = <Skeletons />//<div className="d-flex align-items-center justify-content-center" style={{height: '90vh'}}><Loading size={150}/></div>;

        /* if user is logged in */
        if (this.check_for_token()) {
            console.log('token received')
            /* first fetch the user details from server */
            if (!_.isEmpty(this.props.active_user)) {
                __html = <Route {...props} render={props => <Component {...props} />} />
            }
        }
        else {
            console.log('invalid token');
            __html = <Redirect to={LOGIN_URL} />
        }
        return __html;
    }
}
function mapStateToProps(state){
    return {
        active_user: state.active_user
    }
}
export default connect(mapStateToProps, {set_active_user})(ProtectedRoutes)