import React, { Component } from 'react';
import { BASE_URL, PROFILE, LOGIN_URL } from '../../shared/router_constants';
import Logo_light from './logo_light_iffat_anwar.png';
// import Logo_dark from './logo_dark.png';
import { connect } from "react-redux";
import { left_sidebar_controls, set_active_user} from '../../actions';
import { Link, withRouter } from 'react-router-dom';
import NOPICTURE from '../../resources/images/placeholder.jpg'


class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    on_sidebar_control_button_click = () => {
        if (this.props.left_sidebar === true) {
            this.props.left_sidebar_controls(false)
        }
        else {
            this.props.left_sidebar_controls(true)
        }
    }

    on_logout_button_click = () => {
        localStorage.clear()
        this.props.set_active_user({})
        this.props.history.push(LOGIN_URL)
    }

    render() {
        return (

            <div className="navbar navbar-expand-md navbar-dark fixed-top">
                <div className="navbar-brand">
                    <Link to={BASE_URL} className="d-inline-block">
                        <img src={Logo_light} alt="" />
                        {/* <span className="text-white">Iffat Anwar</span> */}
                    </Link>
                </div>

                <div className="d-md-none">
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar-mobile">
                        <i className="icon-tree5"></i>
                    </button>
                    <button className="navbar-toggler sidebar-mobile-main-toggle" onClick={this.on_sidebar_control_button_click} type="button">
                        <i className="icon-paragraph-justify3"></i>
                    </button>
                </div>

                <div className="collapse navbar-collapse" id="navbar-mobile">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link onClick={this.on_sidebar_control_button_click} to={"#"}
                                className="navbar-nav-link sidebar-control sidebar-main-toggle d-none d-md-block">
                                <i className="icon-transmission"></i>
                            </Link>
                        </li>

                        {/* <li className="nav-item dropdown">
                            <Link to={BASE_URL} className="navbar-nav-link dropdown-toggle caret-0" data-toggle="dropdown">
                                <i className="icon-git-compare"></i>
                                <span className="d-md-none ml-2">Git updates</span>
                                <span className="badge badge-pill bg-warning-400 ml-auto ml-md-0">9</span>
                            </Link>

                            <div className="dropdown-menu dropdown-content wmin-md-350">
                                <div className="dropdown-content-header">
                                    <span className="font-weight-semibold">Git updates</span>
                                    <Link to={BASE_URL} className="text-default"><i className="icon-sync"></i></Link>
                                </div>

                                <div className="dropdown-content-body dropdown-scrollable">
                                    <ul className="media-list">
                                        <li className="media">
                                            <div className="mr-3">
                                                <Link to={BASE_URL} className="btn bg-transparent border-primary text-primary rounded-round border-2 btn-icon"><i className="icon-git-pull-request"></i></Link>
                                            </div>

                                            <div className="media-body">
                                                Drop the IE <Link to={BASE_URL}>specific hacks</Link> for temporal inputs
										<div className="text-muted font-size-sm">4 minutes ago</div>
                                            </div>
                                        </li>

                                        <li className="media">
                                            <div className="mr-3">
                                                <Link to={BASE_URL} className="btn bg-transparent border-warning text-warning rounded-round border-2 btn-icon"><i className="icon-git-commit"></i></Link>
                                            </div>

                                            <div className="media-body">
                                                Add full font overrides for popovers and tooltips
										<div className="text-muted font-size-sm">36 minutes ago</div>
                                            </div>
                                        </li>

                                        <li className="media">
                                            <div className="mr-3">
                                                <Link to={BASE_URL} className="btn bg-transparent border-info text-info rounded-round border-2 btn-icon"><i className="icon-git-branch"></i></Link>
                                            </div>

                                            <div className="media-body">
                                                <Link to={BASE_URL}>Chris Arney</Link> created a new <span className="font-weight-semibold">Design</span> branch
										<div className="text-muted font-size-sm">2 hours ago</div>
                                            </div>
                                        </li>

                                        <li className="media">
                                            <div className="mr-3">
                                                <Link to={BASE_URL} className="btn bg-transparent border-success text-success rounded-round border-2 btn-icon"><i className="icon-git-merge"></i></Link>
                                            </div>

                                            <div className="media-body">
                                                <Link to={BASE_URL}>Eugene Kopyov</Link> merged <span className="font-weight-semibold">Master</span> and <span className="font-weight-semibold">Dev</span> branches
										<div className="text-muted font-size-sm">Dec 18, 18:36</div>
                                            </div>
                                        </li>

                                        <li className="media">
                                            <div className="mr-3">
                                                <Link to={BASE_URL} className="btn bg-transparent border-primary text-primary rounded-round border-2 btn-icon"><i className="icon-git-pull-request"></i></Link>
                                            </div>

                                            <div className="media-body">
                                                Have Carousel ignore keyboard events
										        <div className="text-muted font-size-sm">Dec 12, 05:46</div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                <div className="dropdown-content-footer bg-light">
                                    <Link to={BASE_URL} className="text-grey mr-auto">All updates</Link>
                                    <div>
                                        <Link to={BASE_URL} className="text-grey" data-popup="tooltip" title="Mark all as read"><i className="icon-radio-unchecked"></i></Link>
                                        <Link to={BASE_URL} className="text-grey ml-2" data-popup="tooltip" title="Bug tracker"><i className="icon-bug2"></i></Link>
                                    </div>
                                </div>
                            </div>
                        </li> */}
                    </ul>

                    <span className="navbar-text ml-md-3 mr-md-auto">
                        <span className="badge bg-transparent"></span>
                    </span>

                    <ul className="navbar-nav">
                        <li className="nav-item dropdown dropdown-user">
                            <Link to={`#`} className="navbar-nav-link dropdown-toggle" data-toggle="dropdown">
                                <img src={NOPICTURE} className="rounded-circle" alt="" />
                                <span>{this.props.active_user['first_name']}</span>
                            </Link>

                            <div className="dropdown-menu dropdown-menu-right">
                                <Link to={PROFILE} className="dropdown-item"><i className="icon-user-plus"></i> My profile</Link>
                                <Link to={`#`} className="dropdown-item"><i className="icon-comment-discussion"></i> Messages <span className="badge badge-pill bg-blue ml-auto">58</span></Link>
                                <div className="dropdown-divider"></div>
                                <Link onClick={this.on_logout_button_click} to={LOGIN_URL} className="dropdown-item"><i className="icon-switch2"></i> Logout</Link>
                            </div>
                        </li>
                    </ul>
                </div>
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
export default connect(map_state_to_props, { left_sidebar_controls, set_active_user })(withRouter(Header));