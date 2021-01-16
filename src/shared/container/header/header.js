import React, { Component, Fragment } from 'react';
import { LOGIN_URL, PROFILE } from '../../router_constants';
// import Logo_light from './logo_main.png';
// import IAMC from './IAMC.png';
import IAMC_detail from "./iffatanwarmedicalcomplex.png";
import { connect } from "react-redux";
import { left_sidebar_controls, set_active_user } from '../../../actions';
import { Link, withRouter } from 'react-router-dom';
import Axios from 'axios';
import { LOGOUT_USER_REQUEST } from '../../rest_end_points';
// import NOPICTURE from '../../resources/images/placeholder.jpg'
import ReactDOM from 'react-dom';

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showDropDown: false,
            collapseMenu: false,
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

    // on_logout_button_click = () => {
    //     localStorage.clear()
    //     this.props.set_active_user({})
    //     this.props.history.push(LOGIN_URL)
    // }

    on_logout_button_click = () => {

        Axios.post(LOGOUT_USER_REQUEST, {
            token: localStorage.getItem('user')
        }, {
            headers: { 'code-medicine': localStorage.getItem('user') }
        }).then(res => {
            if (res.data.status === true) {
                localStorage.clear()
                this.props.set_active_user({})
                this.props.history.push(LOGIN_URL)

                this.props.notify('success', '', res.data.message)
            }
            else {
                this.props.notify('error', '', res.data.message)
            }

        })
            .catch(err => {
                this.props.notify('error', '', err)
            })


    }

    on_click_drop_down = () => {
        this.setState({ showDropDown: !this.state.showDropDown })
    }

    on_click_collapse_menu = () => {
        this.setState({ collapseMenu: !this.state.collapseMenu })
    }

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside, true);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, true);
    }

    handleClickOutside = event => {
        const domNode = ReactDOM.findDOMNode(this);

        if (!domNode || !domNode.contains(event.target)) {
            this.setState({ showDropDown: false });
        }
    }

    render() {
        return (

            <div className="navbar navbar-expand-md navbar-dark fixed-top">
                <div className="navbar-brand">
                    <Link onClick={this.on_sidebar_control_button_click} to={"#"}
                        className="d-inline py-3 text-white">
                        <i className="icon-paragraph-justify2"></i>
                    </Link>
                </div>

                <div className="d-md-none">
                    <button
                        className={`btn bg-teal-400 btn-labeled-left rounded-round`}
                        onClick={() => this.on_click_drop_down()}
                    >
                        <i className={`icon-reading`} />
                    </button>
                    <div
                        className={`dropdown-menu dropdown-menu-right ${this.state.showDropDown ? 'show' : ''}`}
                        x-placement="bottom-end"
                        style={{ position: 'absolute', willChange: 'transform', top: '0px', right: '0px', transform: 'translate3d(-38px, 36px, 0px)' }}
                    >
                        <Link to={PROFILE} className="dropdown-item"><i className="icon-user-plus"></i> My profile</Link>
                        <div className="dropdown-divider"></div>
                        <Link onClick={() => this.on_logout_button_click()} to={"#"} className="dropdown-item"><i className="icon-switch2"></i> Logout</Link>
                    </div>
                </div>

                <div className={`collapse navbar-collapse d-none d-md-none d-lg-flex justify-content-between align-items-center ${this.state.collapseMenu ? '' : 'show'}`} id="navbar-mobile">
                    <p className={`mb-0`}>
                        {
                            this.props.active_page !== null ? this.props.active_page.map((item, i) => {
                                return <Fragment key={i}>{item}</Fragment>
                            }) : ''
                        }
                    </p>
                    <div className={`text-white`}>
                        <Link to={"#"} onClick={() => alert("Please mail us on codemedicine29@gmail.com")} className="breadcrumb-elements-item mr-2">
                            <i className="icon-comment-discussion mr-2"></i>
                            Support
                        </Link>
                        <button
                            className={`btn bg-teal-400 btn-labeled btn-labeled-left rounded-round dropdown-toggle pl-5`}
                            onClick={() => this.on_click_drop_down()}
                        >
                            <b>
                                <i className={`icon-reading`} />
                            </b>
                            {this.props.active_user.first_name}
                        </button>
                    </div>

                    <div
                        className={`dropdown-menu dropdown-menu-right ${this.state.showDropDown ? 'show' : ''}`}
                        x-placement="bottom-end"
                        style={{ position: 'absolute', willChange: 'transform', top: '0px', right: '0px', transform: 'translate3d(-38px, 36px, 0px)' }}
                    >
                        <Link to={PROFILE} className="dropdown-item"><i className="icon-user-plus"></i> My profile</Link>
                        <div className="dropdown-divider"></div>
                        <Link onClick={() => this.on_logout_button_click()} to={"#"} className="dropdown-item"><i className="icon-switch2"></i> Logout</Link>
                    </div>
                </div>
            </div>
        );
    }
}
function map_state_to_props(state) {
    return {
        left_sidebar: state.left_sidebar,
        active_user: state.active_user,
        active_page: state.active_page

    }
}
export default connect(map_state_to_props, { left_sidebar_controls, set_active_user })(withRouter(Header));