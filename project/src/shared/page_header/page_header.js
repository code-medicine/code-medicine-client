import React, { Component } from 'react';

class Page_header extends Component {
    render() {
        return (
            <div className="page-header page-header-light">
                <div className="page-header-content header-elements-md-inline">
                    <div className="page-title d-flex">
                        <h4><i className="icon-arrow-left52 mr-2"></i> <span className="font-weight-semibold">Home</span> - Dashboard</h4>
                        <a href="#" className="header-elements-toggle text-default d-md-none"><i className="icon-more"></i></a>
                    </div>

                    <div className="header-elements d-none">
                        <div className="d-flex justify-content-center">
                            <a href="#" className="btn btn-link btn-float text-default"><i className="icon-bars-alt text-primary"></i><span>Statistics</span></a>
                            <a href="#" className="btn btn-link btn-float text-default"><i className="icon-calculator text-primary"></i> <span>Invoices</span></a>
                            <a href="#" className="btn btn-link btn-float text-default"><i className="icon-calendar5 text-primary"></i> <span>Schedule</span></a>
                        </div>
                    </div>
                </div>

                <div className="breadcrumb-line breadcrumb-line-light header-elements-md-inline">
                    <div className="d-flex">
                        <div className="breadcrumb">
                            <a href="index.html" className="breadcrumb-item"><i className="icon-home2 mr-2"></i> Home</a>
                            <span className="breadcrumb-item active">Dashboard</span>
                        </div>

                        <a href="#" className="header-elements-toggle text-default d-md-none"><i className="icon-more"></i></a>
                    </div>

                    <div className="header-elements d-none">
                        <div className="breadcrumb justify-content-center">
                            <a href="#" className="breadcrumb-elements-item">
                                <i className="icon-comment-discussion mr-2"></i>
                                Support
							            </a>

                            <div className="breadcrumb-elements-item dropdown p-0">
                                <a href="#" className="breadcrumb-elements-item dropdown-toggle" data-toggle="dropdown">
                                    <i className="icon-gear mr-2"></i>
                                    Settings
								            </a>

                                <div className="dropdown-menu dropdown-menu-right">
                                    <a href="#" className="dropdown-item"><i className="icon-user-lock"></i> Account security</a>
                                    <a href="#" className="dropdown-item"><i className="icon-statistics"></i> Analytics</a>
                                    <a href="#" className="dropdown-item"><i className="icon-accessibility"></i> Accessibility</a>
                                    <div className="dropdown-divider"></div>
                                    <a href="#" className="dropdown-item"><i className="icon-gear"></i> All settings</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Page_header;