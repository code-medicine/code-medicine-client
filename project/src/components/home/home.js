import React, {Component} from 'react';
import Container from '../../shared/container/container';
import { LOGIN_URL } from '../../shared/router_constants';
import Axios from 'axios';
import { PROFILE_USER_REQUEST } from '../../shared/rest_end_points';
import { connect } from "react-redux";
import { notify } from '../../actions';

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
            Axios.get(`${PROFILE_USER_REQUEST}?tag=${localStorage.user_token}`).then(res => {
                if (!res.data['status']){
                    this.props.notify('default','',res.data['message'])
                    this.props.history.push(LOGIN_URL)
                }
                else{
                    this.props.notify('success','',res.data['message'])
                    console.log(res.data['payload']);
                    // -----------------todo: data received! do what ever with this data now!
                }
            })
        }
    }

    render(){
        return(
            <Container container_type={'home'}>
                <button className="btn btn-primary">Hello</button>
            </Container>
        );
    }
}
function map_state_to_props(notify) {
    return { notify }
}
export default connect(map_state_to_props, { notify })(Home);