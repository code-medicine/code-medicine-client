import React, {Component} from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { BASE_URL, LOGIN_URL, REGISTER_URL } from '../shared/router_constants';
import Home from './home/home';
import Login from './login/login';
import Register from './register/register';

class Init extends Component {
    render(){
        return(
            <BrowserRouter >
                <Route exact path={BASE_URL} component={Home} />
                <Route exact path={LOGIN_URL} component={Login} />
                <Route exact path={REGISTER_URL} component={Register} />
            </BrowserRouter>
        );
    }
}
export default Init;