import React, {Component} from 'react';
import Container from '../../shared/container/container';
import { LOGIN_URL } from '../../shared/router_constants';
import Axios from 'axios';

class Home extends Component {
    constructor(props){
        super(props);
        this.state = {

        }
    }

    componentWillMount(){
        if (!localStorage.user_token){
            this.props.history.push(LOGIN_URL)
        }
        else{
            // Axios.get()
        }
    }

    render(){
        return(
            <Container header={true} footer={true}>
                <button className="btn btn-primary">Hello</button>
            </Container>
        );
    }
}
export default Home;