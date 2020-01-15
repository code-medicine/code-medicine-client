import React, { Component } from 'react';
import { BASE_URL, PROFILE } from '../router_constants';
import { connect } from "react-redux";


class Left_sidebar extends Component {

    componentDidMount(){
        console.log(this.props.active_user);
    }

    on_button_click = (e) => {
        switch(e.target.id){
            case 'dashboard_button':
                this.props.history.push(BASE_URL);
                break;
            case 'profile_button':
                this.props.history.push(PROFILE);
                break;
            default:
                break;
        }
    }
    render() {
        return (
            < div className="sidebar sidebar-dark sidebar-main sidebar-fixed sidebar-expand-md" >


                <div className="sidebar-mobile-toggler text-center">
                    <a href="#" className="sidebar-mobile-main-toggle">
                        <i className="icon-arrow-left8"></i>
                    </a>
                    Menu
                    <a href="#" className="sidebar-mobile-expand">
                        <i className="icon-screen-full"></i>
                        <i className="icon-screen-normal"></i>
                    </a>
                </div>

                <div className="sidebar-content">
                    <div className="sidebar-user">
                        <div className="card-body">
                            <div className="media">
                                <div className="mr-3">
                                    <a href={BASE_URL}>
                                        <i className="icon-user"></i>
                                    </a>
                                </div>

                                <div className="media-body">
                                    <div className="media-title font-weight-semibold">
                                        {this.props.active_user['first_name']} {this.props.active_user['last_name']}                                 
                                    </div>
                                    <div className="font-size-xs opacity-50">
                                        <i className="icon-pin font-size-sm"></i> &nbsp;Islamabad, Pakistan
                                    </div>
                                </div>

                                <div className="ml-3 align-self-center">
                                    <a href="#" className="text-white"><i className="icon-cog3"></i></a>
                                </div>
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
                                <button className="btn btn-dark btn-block nav-link" id="dashboard_button" onClick={this.on_button_click}>Dashboard</button>
                            </li>
                            <li className="nav-item">
                                <button className="btn btn-dark btn-block nav-link" id="profile_button" onClick={this.on_button_click}>Profile</button>
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
        active_user: state.active_user
    }
}
export default connect(map_state_to_props)(Left_sidebar);