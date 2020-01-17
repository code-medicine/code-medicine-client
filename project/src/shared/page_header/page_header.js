import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { BASE_URL } from '../router_constants'

class Page_header extends Component {
    render() {
        return (
            <div className="page-header page-header-light">
                <div className="page-header-content header-elements-md-inline">
                    <div className="page-title d-flex">
                        <h4>
                            <i className="icon-arrow-left52 mr-2"></i> 
                            <span className="font-weight-semibold">Home</span> - Dashboard
                        </h4>
                        <Link to={BASE_URL} className="header-elements-toggle text-default d-md-none">
                            <i className="icon-more"></i>
                        </Link>
                    </div>

                    <div className="header-elements d-none">
                        <div className="d-flex justify-content-center">
                            <Link to={BASE_URL} className="btn btn-link btn-float text-default">
                                <i className="icon-bars-alt text-primary"></i>
                                <span>Statistics</span>
                            </Link>
                            <Link to={BASE_URL} className="btn btn-link btn-float text-default">
                                <i className="icon-calculator text-primary"></i> 
                                <span>Invoices</span>
                            </Link>
                            <Link to={BASE_URL} className="btn btn-link btn-float text-default">
                                <i className="icon-calendar5 text-primary"></i> 
                                <span>Schedule</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="breadcrumb-line breadcrumb-line-light header-elements-md-inline">
                    <div className="d-flex">
                        <div className="breadcrumb">
                            <Link to="index.html" className="breadcrumb-item">
                                <i className="icon-home2 mr-2"></i> 
                                Home
                            </Link>
                            <span className="breadcrumb-item active">Dashboard</span>
                        </div>

                        <Link to={BASE_URL} className="header-elements-toggle text-default d-md-none">
                            <i className="icon-more"></i>
                        </Link>
                    </div>

                    <div className="header-elements d-none">
                        <div className="breadcrumb justify-content-center">
                            <Link to={BASE_URL} className="breadcrumb-elements-item">
                                <i className="icon-comment-discussion mr-2"></i>
                                Support
                            </Link>

                            <div className="breadcrumb-elements-item dropdown p-0">
                                <Link to={BASE_URL} className="breadcrumb-elements-item dropdown-toggle" data-toggle="dropdown">
                                    <i className="icon-gear mr-2"></i>
                                    Settings
                                </Link>

                                <div className="dropdown-menu dropdown-menu-right">
                                    <Link to={BASE_URL} className="dropdown-item">
                                        <i className="icon-user-lock"></i> 
                                        Account security
                                    </Link>
                                    <Link to={BASE_URL} className="dropdown-item">
                                        <i className="icon-statistics"></i> 
                                        Analytics
                                    </Link>
                                    <Link to={BASE_URL} className="dropdown-item">
                                        <i className="icon-accessibility"></i> 
                                        Accessibility
                                    </Link>
                                    <div className="dropdown-divider"></div>
                                    <Link to={BASE_URL} className="dropdown-item">
                                        <i className="icon-gear"></i> 
                                        All settings
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default withRouter(Page_header);