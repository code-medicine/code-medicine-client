import React, { Component, Fragment } from 'react';
import { Collapse } from 'reactstrap'
// import moment from 'moment';
import { Link } from 'react-router-dom';
import { Popup } from "semantic-ui-react";

class TodaysPatientRow extends Component {
    constructor(props) {
        super(props)
        this.state = {
            toggle: false,
            toggle_icon: 'icon-eye-plus',
            row_data: this.props.row_data,
            hidden_data: this.props.hidden_data,
            hidden_header_elements: this.props.hidden_header_elements,
            hidden_header_color: this.props.hidden_header_color,
            col_span: ''
        }
    }
    toggle_row = () => {
        if (this.state.toggle)
            this.setState({toggle: false, toggle_icon: 'icon-eye-plus'})
        else
            this.setState({toggle: true, toggle_icon: 'icon-eye-minus'})
    }
    componentDidMount(){
        // this.setState({row_data: this.props.data})
        this.setState({col_span: this.props.columns})
    }

    render_read_only_cols = () => {
        return <div>{this.state.row_data}</div>
    }
    render_hidden_elements = () => {
        return this.state.hidden_data.map((str,i) => {
            return <div key={i} className="">{str}</div>
        })
    }
    render_hidden_header_elements = () => {
        return this.state.hidden_header_elements.map((str,i) => {
            return <Fragment key={i}>{str}</Fragment>
        })
    }
    render () {
        const popup_style = {
            borderRadius: 0,
            opacity: 0.7,
            padding: '2em',
          }
        return (
            <Fragment>
                <tr >
                    {/* <td onClick={this.toggle_row} >
                        <div  >
                            <Link className="" to="#" onClick={this.toggle_row}>
                                <i className={this.state.toggle_icon}></i>
                            </Link>
                        </div>
                        
                    </td> */}
                    <td colSpan={this.state.col_span}>
                        {
                            this.render_read_only_cols()
                        }
                    </td>
                    <td>
                        <div className={``}>
                            <Fragment>
                            <Popup
                                trigger={
                                    <button className="btn btn-outline btn-sm bg-teal-400 border-teal-400 text-teal-400 secondary btn-icon "
                                            onClick={this.props.openModal}>
                                        <i className="icon-plus2"></i>
                                    </button>}
                                content={<div className={`card card-body bg-teal-400 text-teal-white shadow mr-2 mt-3 py-1`}>View or add procedures</div>}
                                flowing
                                hoverable
                                // style={popup_style}
                                position='left center'
                                // inverted={false}
                            />
                            </Fragment>
                        </div>

                        <div className={`mt-1`}>
                            <Popup
                                trigger={
                                    <button className={`btn btn-outline btn-sm bg-teal-400 border-teal-400 text-teal-400 btn-icon`}>
                                        <i className={`icon-file-text2`}></i>
                                    </button>}
                                content={<div className={`card card-body bg-teal-400 text-white shadow mr-2 mt-3 py-1`}>Generate Invoice</div>}
                                flowing
                                hoverable
                                // style={popup_style}
                                position='left center'
                                // inverted={false}
                            />
                        </div>

                        <div className={`mt-1`}>
                            
                            <Popup
                                trigger={
                                    <button className={`btn btn-outline btn-sm bg-dark border-dark text-dark btn-icon`}
                                            onClick={this.toggle_row}>
                                        <i className={this.state.toggle_icon}></i>
                                    </button>}
                                flowing
                                hoverable
                                content={<div className={`card card-body bg-dark text-white shadow mr-2 mt-3 py-1`}>Show more details</div>}
                                position='left center'
                            />
                        </div>
                        
                    </td>
                    {/* <td >
                        
                        <div className="d-flex flex-row">
                            <button className="btn btn-outline btn-sm bg-secondary border-secondary text-secondary btn-icon "
                                    onClick={this.props.openModal}>
                                <i className="icon-plus2"></i>
                            </button>
                            <button className="btn btn-outline btn-sm bg-primary border-primary text-primary-800 btn-icon ml-1">
                                <i className="icon-pencil3"></i>
                            </button>
                            <button className="btn btn-outline btn-sm bg-danger border-danger text-danger btn-icon ml-1">
                                <i className="icon-cross3"></i>
                            </button>
                        </div>
                    </td> */}
                </tr>
                <tr className="">
                    <td colSpan={`${this.state.col_span + 1}`} className={`${this.state.toggle? '':'py-0'}`}>
                        <Collapse isOpen={this.state.toggle} >
                            <div className="float-right">
                                <Link onClick={this.toggle_row} to="#" className="btn btn-sm btn-outline bg-teal-400 text-teal-400">
                                    <i className="icon-cross3 icon-2x"></i>
                                </Link>
                            </div>
                            {
                                this.render_hidden_elements()
                            }
                        </Collapse>
                    </td>
                </tr>
            </Fragment>
        )
    }
}
export default TodaysPatientRow