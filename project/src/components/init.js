import React, {Component} from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { BASE_URL, LOGIN_URL, REGISTER_URL, PROFILE } from '../shared/router_constants';
import Home from './home/home';
import Login from './login/login';
import Register from './register/register';
import Profile from './profile/profile';
import { ToastContainer } from 'react-toastify';

class Init extends Component {

    

    render(){
        return(
            
                <BrowserRouter >
                    <Route exact path={BASE_URL} component={Home} />
                    <Route exact path={LOGIN_URL} component={Login} />
                    <Route exact path={REGISTER_URL} component={Register} />
                    <Route exact path={PROFILE} component={Profile} />
                    <ToastContainer />
                </BrowserRouter>
        );
    }
}
export default Init;