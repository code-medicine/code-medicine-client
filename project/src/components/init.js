import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import {
    BASE_URL,
    LOGIN_URL,
    REGISTER_URL,
    PROFILE,
    RECEPTION_TODAYSPATIIENT,
    RECEPTION_VISITS
} from '../shared/router_constants';
import { ToastContainer } from 'react-toastify';

import Home from './home/home';
import Login from './sigin_signup/login/login';
import Register from './sigin_signup/register/register';
import Profile from './profile/profile';
import Todayspatient from './reception/todayspatient/todayspatient';
import Visits from './reception/visits/visits';
import ProtectedRoute from '../shared/protected_routes';

class Init extends Component {
    render() {
        return (
            <BrowserRouter >
                <Route path={LOGIN_URL} component={Login} />
                <ProtectedRoute exact path={BASE_URL} component={Home} />
                <ProtectedRoute exact path={REGISTER_URL} component={Register} />
                <ProtectedRoute exact path={PROFILE} component={Profile} />
                <ProtectedRoute exact path={RECEPTION_TODAYSPATIIENT} component={Todayspatient} />
                <ProtectedRoute exact path={RECEPTION_VISITS} component={Visits} />
                <ToastContainer hideProgressBar />
            </BrowserRouter>
        );
    }
}
export default Init;