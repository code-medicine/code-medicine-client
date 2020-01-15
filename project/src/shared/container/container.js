import React, { Component,Fragment } from 'react';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import Left_sidebar from '../left_sidebar/left_sidebar';
import Page_header from '../page_header/page_header';
import { connect } from "react-redux";


class Container extends Component {
    constructor(props){
        super(props);
            this.state = {
                type: this.props.container_type
            };
    }
    render() {
        var header = ''
        var footer = ''
        var left_sidebar = ''
        var page_header = ''

        if (this.state.type === 'login'){
            header = false
            footer = false
            left_sidebar = false
            page_header = false
        }
        else if (this.state.type === 'register'){
            header = false
            footer = false
            left_sidebar = false
            page_header = false
        }
        else if (this.state.type === 'home'){
            header = true
            footer = true
            left_sidebar = true
            page_header = true
        }
        return (
            <div className={`virtual-body navbar-top ${this.props.left_sidebar? 'sidebar-xs':''}`}>
                {header? <Header /> : ''}
                <div className="page-content">

                    {left_sidebar? <Left_sidebar /> : ''}

                    <div className="content-wrapper">
                        
                        {page_header? <Page_header /> : ''}

                        <div className="content">
                            {
                                this.props.children
                            }
                        </div>
                        {footer? <Footer /> : ''}
                    </div>
                </div>
            </div>
        );
    }
}
function map_state_to_props(state) {
    return { 
        left_sidebar: state.left_sidebar
     }
}
export default connect(map_state_to_props)(Container);