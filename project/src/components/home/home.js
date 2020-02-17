import React, {Component} from 'react';
import Container from '../../shared/container/container';
import { LOGIN_URL } from '../../shared/router_constants';
import Axios from 'axios';
import { PROFILE_USER_REQUEST } from '../../shared/rest_end_points';
import { connect } from "react-redux";
import { notify, set_active_user } from '../../actions';


class Home extends Component {
    constructor(props){
        super(props);
        this.state = {

        }
    }

    componentDidMount(){
        if (!localStorage.user){
            this.props.history.push(LOGIN_URL)
        }
        else {
            Axios.get(`${PROFILE_USER_REQUEST}?tag=${localStorage.user}`).then(res => {
                if (!res.data['status']){
                    this.props.notify('default','',res.data['message'])
                    this.props.history.push(LOGIN_URL)
                }
                else{
                    // this.props.notify('success','',res.data['message'])
                    // console.log(res.data['payload']);
                    // -----------------todo: data received! do what ever with this data now!
                    this.props.set_active_user(res.data['payload'])
                    this.props.notify('success','','Welcome back ' + res.data['payload'].first_name)
                }
            }).catch(err => {
                // call for server not responding
                // todo make a page witth not responding message
                // todo ask redux to save the connection status
                // todo ask redux to tell if connection is there or not.
                // if not show the message
                this.props.history.push(LOGIN_URL)
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
function map_state_to_props(state) {
    return { 
        notify: state.notify,
        active_user: state.active_user
    }
}
export default connect(map_state_to_props, { notify, set_active_user })(Home);