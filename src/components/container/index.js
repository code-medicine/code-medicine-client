import React, { Component } from 'react';
import Header from '../header';
import Footer from '../footer';
import Leftsidebar from '../left_sidebar';
import Pageheader from '../page_header';
import { connect } from "react-redux";
// import Axios from 'axios';
// import { PROFILE_USER_REQUEST } from '../rest_end_points';
// import { LOGIN_URL } from '../router_constants';
import { withRouter } from 'react-router-dom';
import { set_active_user, fetch_doctors, fetch_procedures_list } from '../../redux/actions';
import './container.css'
import 'styles/animations/animations.css'
import { UsersSearchByToken } from 'services/queries';
import Skeletons from 'components/Skeletons';
// import BACKGROUND from '../../resources/images/background_image.jpg'


class Container extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            authenticated: false,
            loading: true,
        }
    }

    componentDidMount(){
        // console.log('location container', window.location.pathname)
        const token = localStorage.getItem('user');
        if (token) {
            UsersSearchByToken(token).then(res => {
                this.props.set_active_user(res.data.payload);
                this.props.fetch_doctors();
                this.props.fetch_procedures_list();
                this.setState({ loading: false, authenticated: true });
            }).catch(err => {
                console.log(err)
                localStorage.clear()
                localStorage.setItem('cached-path', window.location.pathname)
                this.props.set_active_user({})
                this.setState({ loading: false });
            })
        }
        else {
            this.setState({ loading: false, authenticated: false })
        }
    }
    render() {
        
        console.log('container type', this.props.container_type, 'authenticated', this.state.authenticated)
        if (this.state.loading){
            return (
                <Skeletons />
            )
        }
        return (
            this.props.container_type ? 
            
                <div className={`virtual-body navbar-top ${this.props.left_sidebar ? (window.innerWidth >= 500 ? 'sidebar-xs' : 'sidebar-mobile-main') : ''}`}
                // style={{backgroundImage: `url(${BACKGROUND})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition:'center'}}
                >
                    <Header />
                    <div className="page-content">

                        <Leftsidebar />

                        <div className="content-wrapper">

                            {/* {page_header? <Pageheader /> : ''} */}

                            <div className={`content`}>
                                {
                                    this.props.children
                                }
                            </div>
                            <Footer />
                        </div>
                    </div>
                </div> :

                <div className={`virtual-body d-flex justify-content-center align-items-center background_custom`}>
                {
                    this.props.children
                }
            </div>
        );
    }
}
function map_state_to_props(state) {
    return { 
        left_sidebar: state.left_sidebar,
        active_user: state.active_user
    }
}
export default connect(map_state_to_props, { 
    set_active_user, 
    fetch_doctors,
    fetch_procedures_list,     
})(withRouter( Container));