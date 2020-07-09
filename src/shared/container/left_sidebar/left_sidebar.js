import React, { Component } from 'react';
import { BASE_URL, LOGIN_URL, RECEPTION_TODAYSPATIIENT, RECEPTION_VISITS } from '../../router_constants';
import { connect } from "react-redux";
import { Link, withRouter } from 'react-router-dom';
import { set_active_user,notify } from '../../../actions';
import '../../customs/Animations/animations.css';
import { LOGOUT_USER_REQUEST } from '../../rest_end_points';
import Axios from 'axios';
import './left_sidebar.css'

class Left_sidebar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            search_toggle: '',
            chat_toggle: '',
            reception_toggle: '',
            current_page: 'Home'
        }
    }
    componentDidMount(){
        // console.log('my user',this.props.active_user);
    }

    on_logout_button_click = () => {
        const payload = {
            token: localStorage.getItem('user')
        }
        Axios.post(LOGOUT_USER_REQUEST, payload).then(res => {
            if (res.data.status === true){
                localStorage.clear()
                // this.props.set_active_user(null)
                this.props.history.push(LOGIN_URL)
                
                this.props.notify('success', '', res.data.message)
            }
            else{
                this.props.notify('error', '', res.data.message)
            }
            
        })
        .catch(err => {
            this.props.notify('error','',err.toString())
        })

        
    }

    on_item_click = (e) => {
        switch(e.target.id){
            case 'search_link':
                if (this.state.search_toggle === '')
                    this.setState({search_toggle: 'nav-item-open'});
                else
                    this.setState({search_toggle: ''});
                break;
            case 'chat_link':
                if (this.state.chat_toggle === '')
                    this.setState({chat_toggle: 'nav-item-open'});
                else
                    this.setState({chat_toggle: ''});
                break;
            case 'reception_link':
                if (this.state.reception_toggle === '')
                    this.setState({reception_toggle: 'nav-item-open'});
                else
                    this.setState({reception_toggle: ''});
                break;
            default:
                break;
        }
    } 
    render() {
        const first_name_first_letter = this.props.active_user.first_name.charAt(0).toUpperCase()
        const first_name_rest = this.props.active_user.first_name.length > 1? this.props.active_user.first_name.substring(1):''
        const last_name_first_letter = this.props.active_user.last_name.charAt(0).toUpperCase()
        const last_name_rest = this.props.active_user.last_name.length > 1? this.props.active_user.last_name.substring(1):''
        return (
            <div className="sidebar sidebar-dark sidebar-main sidebar-fixed sidebar-expand-md" >

                <div className="sidebar-mobile-toggler text-center">
                    <Link to={BASE_URL} className="sidebar-mobile-main-toggle">
                        <i className="icon-arrow-left8"></i>
                    </Link>
                    Menu
                    <Link to={BASE_URL} className="sidebar-mobile-expand">
                        <i className="icon-screen-full"></i>
                        <i className="icon-screen-normal"></i>
                    </Link>
                </div>

                <div className="sidebar-content">
                    <div className="sidebar-user background_custom_left_side_bar d-flex align-items-center" style={{height: '25vh'}}>
                        <div className="card-body">
                            <div className="media d-flex align-items-center">
                                <div className="mr-3">
                                    {/* <Link to={BASE_URL}>
                                        <i className="icon-user"></i>
                                    </Link> */}
                                    <div className={`img-fluid rounded-circle text-teal-400 bg-light h3 d-flex justify-content-center align-items-center p-2`} 
                                        // src={NO_PICTURE} 
                                        style={{height: '50px', width: '50px'}}>
                                        {`${first_name_first_letter}${last_name_first_letter}`}
                                    </div>
                                </div>
                                

                                <div className="media-body ">
                                    
                                    <div className="media-title font-weight-semibold ">
                                        <span className="text-shadow">{`${first_name_first_letter}${first_name_rest} ${last_name_first_letter}${last_name_rest}`}</span>                                 
                                    </div>
                                    <div className="font-size-xs opacity-50 text-shadow">
                                        <i className="icon-pin font-size-sm"></i> &nbsp;Pakistan
                                    </div>
                                </div>
                                {/* settings button in left bar */}
                                {/* <div className="ml-3 align-self-center">
                                    <Link to={BASE_URL}  className="text-white"><i className="icon-cog3"></i></Link>
                                </div> */}
                            </div>
                        </div>
                    </div>




                    <div className="card card-sidebar-mobile">
                        <ul className="nav nav-sidebar">
                            <li className="nav-item-header">
                                <div className="text-uppercase font-size-xs line-height-xs">
                                    Main
                                </div>
                            </li>
                            <li className="nav-item">
                                <Link to={BASE_URL} className="nav-link">
                                    <i className="icon-home"></i>
                                    <span>Dashboard</span>
                                </Link>
                            </li>
                            <li className={`nav-item nav-item-submenu ${this.state.search_toggle}`}>
                                <Link className="nav-link" 
                                    to={'#'} 
                                    onClick={this.on_item_click}
                                    id="search_link">
                                    <i className="icon-search4"></i>
                                    <span className="">Search</span>
                                </Link>

                                <ul className="nav nav-group-sub" 
                                    data-submenu-title="Home"
                                    style={{display: this.state.search_toggle === ''? 'none':'block'}}>
                                    <li className="nav-item"><Link to={BASE_URL} className="nav-link disabled">Patients<span className="badge bg-transparent align-self-center ml-auto">Coming soon</span></Link></li>
                                    <li className="nav-item"><Link to={BASE_URL} className="nav-link disabled">Doctors<span className="badge bg-transparent align-self-center ml-auto">Coming soon</span></Link></li>
                                </ul>

                            </li>
                            <li className={`nav-item nav-item-submenu ${this.state.reception_toggle}`}>
                                <Link className="nav-link" 
                                    to={'#'} 
                                    onClick={this.on_item_click}
                                    id="reception_link">
                                    <i className="icon-user"></i>
                                    <span>Reception</span>
                                </Link>

                                <ul className="nav nav-group-sub" data-submenu-title="Reception"
                                    style={{display: this.state.reception_toggle === ''? 'none':'block'}}>
                                    <li className="nav-item"><Link to={RECEPTION_TODAYSPATIIENT} className="nav-link active">Today's Patients</Link></li>
                                    <li className="nav-item"><Link to={RECEPTION_VISITS} className="nav-link">All appointments</Link></li>
                                    <li className="nav-item"><Link to={BASE_URL} className="nav-link disabled">Emergency<span className="badge bg-transparent align-self-center ml-auto">Coming soon</span></Link></li>
                                    <li className="nav-item"><Link to={BASE_URL} className="nav-link disabled">Admissions<span className="badge bg-transparent align-self-center ml-auto">Coming soon</span></Link></li>
                                    <li className="nav-item"><Link to={BASE_URL} className="nav-link disabled">Requests<span className="badge bg-transparent align-self-center ml-auto">Coming soon</span></Link></li>
                                </ul>

                            </li>
                            <li className={`nav-item nav-item-submenu ${this.state.chat_toggle}`}>
                                <Link className="nav-link" 
                                    to={'#'} 
                                    onClick={this.on_item_click}
                                    id="chat_link">
                                    <i className="icon-envelop5"></i>
                                    <span className="">Chat</span>
                                </Link>

                                <ul className="nav nav-group-sub" 
                                    data-submenu-title="Home"
                                    style={{display: this.state.chat_toggle === ''? 'none':'block'}}>
                                    <li className="nav-item"><Link to={BASE_URL} className="nav-link disabled">Messages<span className="badge bg-transparent align-self-center ml-auto">Coming soon</span></Link></li>
                                    <li className="nav-item"><Link to={BASE_URL} className="nav-link disabled">Requests<span className="badge bg-transparent align-self-center ml-auto">Coming soon</span></Link></li>
                                </ul>

                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" onClick={this.on_logout_button_click} to={"#"}>
                                    <i className="icon-exit3"></i>
                                    <span>Logout</span>
                                </Link>
                            </li>
                        </ul>
                    </div>


                </div>


            </div >
        );
    }
}
function map_state_to_props(state) {
    return { 
        active_user: state.active_user,
        left_sidebar: state.left_sidebar
    }
}
export default connect(map_state_to_props,{set_active_user,notify})(withRouter(Left_sidebar));