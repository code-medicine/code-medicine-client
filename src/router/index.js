import React, { useState, useEffect } from 'react';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import * as RC from 'router/constants';
import ProtectedRoute from 'router/protected_routes';
import { ToastContainer } from 'react-toastify';
import * as LAYOUTS from 'layouts';
import Container from 'components/container';

const LoginRoute = ({ component: Component, ...rest }) => {
    return (
        <Route
            {...rest}
            render={props => !localStorage.getItem('user') ?
                <Component {...props} /> :
                <Redirect to={{ pathname: RC.BASE_URL, state: { from: props.location } }} />
            }
        />
    );
}

const NO_CONTAINER_PATHS = [
    RC.LOGIN_URL,
    RC.REGISTER_URL,
    RC.FORGOT_PASSWORD,
]

function RouterX() {
    const location = useLocation();
    const [state_container, set_state_container] = useState(false);

    useEffect(() => {
        if (NO_CONTAINER_PATHS.includes(location.pathname)) {
            set_state_container(false);
        }
        else {
            if (localStorage.getItem('user')){
                set_state_container(true);
            }
            else {
                set_state_container(false);
            }
        }

    }, [location])
    return (
        <Container container_type={state_container}>
            <Switch>
                <LoginRoute exact path={RC.LOGIN_URL} component={LAYOUTS.Login} />
                <Route exact path={RC.REGISTER_URL} component={LAYOUTS.Register} />
                <Route exact path={RC.FORGOT_PASSWORD} component={LAYOUTS.ForgotPassword} />
                <ProtectedRoute exact path={RC.BASE_URL} component={LAYOUTS.Home} />
                <ProtectedRoute exact path={RC.PROFILE} component={LAYOUTS.Profile} />
                <ProtectedRoute exact path={RC.RECEPTION_TODAYSPATIIENT} component={LAYOUTS.TodaysPatient} />
                <ProtectedRoute exact path={RC.RECEPTION_VISITS} component={LAYOUTS.AllAppointments} />
                <ProtectedRoute exact path={RC.RECEPTION_PROCEDURES} component={LAYOUTS.Procedures} />
                <ProtectedRoute exact path={RC.SEARCH_DOCTORS} component={LAYOUTS.Doctors} />
                <ProtectedRoute exact path={RC.PAYMENTS} component={LAYOUTS.Payments} />
                <ProtectedRoute exact path={RC.SETTINGS} component={LAYOUTS.Settings} />
            </Switch>
            <ToastContainer hideProgressBar />
        </Container>
    );
}
export default RouterX;