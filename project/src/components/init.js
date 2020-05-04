import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import {
    BASE_URL,
    LOGIN_URL,
    REGISTER_URL,
    PROFILE,
    RECEPTION_TODAYSPATIIENT,
    RECEPTION_VISITS,
    FORGOT_PASSWORD
} from '../shared/router_constants';
import ProtectedRoute from '../shared/protected_routes';
import { ToastContainer } from 'react-toastify';

import Home from './home/home';
import Login from './sigin_signup/login/login';
import Register from './sigin_signup/register/register';
import Profile from './profile/profile';
import Todayspatient from './reception/todays_patient/todays_patient';
import Visits from './reception/visits/visits';
import ForgotPassword from './sigin_signup/forgot_password/forgot_password';

class Init extends Component {
    render() {
        return (
            <BrowserRouter >
                <Switch>
                    <Route exact path={LOGIN_URL} component={Login} />
                    <Route exact path={REGISTER_URL} component={Register} />
                    <Route exact path={FORGOT_PASSWORD} component={ForgotPassword} />
                    <ProtectedRoute exact path={BASE_URL} component={Home} />
                    <ProtectedRoute exact path={PROFILE} component={Profile} />
                    <ProtectedRoute exact path={RECEPTION_TODAYSPATIIENT} component={Todayspatient} />
                    <ProtectedRoute exact path={RECEPTION_VISITS} component={Visits} />
                </Switch>
                <ToastContainer hideProgressBar />
            </BrowserRouter>
        );
    }
}
export default Init;