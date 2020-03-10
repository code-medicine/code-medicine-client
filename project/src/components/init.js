import React, {Component,Suspense, lazy} from 'react';
import { BrowserRouter, Route,Switch } from 'react-router-dom';
import { BASE_URL, 
        LOGIN_URL, 
        REGISTER_URL, 
        PROFILE, 
        RECEPTION_TODAYSPATIIENT, 
        RECEPTION_VISITS } from '../shared/router_constants';

import { ToastContainer } from 'react-toastify';
import Loader from 'react-loader-spinner';

import Home from './home/home';
import Login from './login/login';

const Register = lazy(() => import('./register/register'));
const Profile = lazy(() => import('./profile/profile'));
const Todayspatient = lazy(() => import('./reception/todayspatient/todayspatient'));
const Visits = lazy(() => import('./reception/visits/visits'));

class Init extends Component {
    render(){
        return(
            <BrowserRouter >
                <Suspense fallback={<Loader type="Rings" color="#00BFFF" height={700} width={200} style={{display:'flex',justifyContent: 'center'}}
                />}>
                    <Switch>
                        <Route exact path={BASE_URL} component={Home} />
                        <Route exact path={LOGIN_URL} component={Login} />
                        <Route exact path={REGISTER_URL} component={Register} />
                        <Route exact path={PROFILE} component={Profile} />
                        <Route exact path={RECEPTION_TODAYSPATIIENT} component={Todayspatient} />
                        <Route exact path={RECEPTION_VISITS} component={Visits} />
                    </Switch>
                </Suspense>
                <ToastContainer hideProgressBar />
            </BrowserRouter>
        );
    }
}
export default Init;
