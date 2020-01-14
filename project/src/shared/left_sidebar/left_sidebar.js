import React, { Component } from 'react';
import { BASE_URL } from '../router_constants';

class Left_sidebar extends Component {
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
                                    <div className="media-title font-weight-semibold">Farrukh Shahid</div>
                                    <div className="font-size-xs opacity-50">
                                        <i className="icon-pin font-size-sm"></i> &nbsp;Santa Ana, CA
                                    </div>
                                </div>

                                <div className="ml-3 align-self-center">
                                    <a href="#" className="text-white"><i className="icon-cog3"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>




                    <div className="card card-sidebar-mobile">
                        
                    </div>


                </div>


            </div >
        );
    }
}
export default Left_sidebar;