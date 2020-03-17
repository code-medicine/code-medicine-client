import React, { Component, Fragment } from 'react';
import { Collapse } from 'reactstrap'
import moment from 'moment';
import { Link } from 'react-router-dom';



class TableRow extends Component {

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
        this.setState({col_span: Object.keys(this.state.row_data).length + 1})
    }

    render_read_only_cols = () => {
        return Object.keys(this.state.row_data).map((str,i) => {
            return <td key={i}>{this.state.row_data[str]}</td>
        })
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
    render(){
        return(
            <Fragment>
                <tr >
                    <td onClick={this.toggle_row}>
                        <Link className="" onClick={this.toggle_row}>
                            <i className={this.state.toggle_icon}></i>
                        </Link>
                    </td>
                    {
                        this.render_read_only_cols()
                    }
                </tr>
                <tr >
                    <td colSpan={`${this.state.col_span}`} className="p-0">
                        <Collapse isOpen={this.state.toggle} >
                            <div className={`card m-0 `}>
                                <div className={`card-header alpha-${this.state.hidden_header_color} border-${this.state.hidden_header_color} d-flex justify-content-between header-elements-inline`}>
                                    {
                                        this.render_hidden_header_elements()
                                    }
                                </div>
                                <div className={`card-body`}>
                                    {
                                        this.render_hidden_elements()
                                    }
                                    {/* <div className={`card card-body border-left-${this.state.hidden_header_color} mb-0`}> */}
                                        <div className={``}>

                                            <button
                                                type="button"
                                                className="btn bg-teal-400 btn-labeled btn-labeled-right pr-5 float-right"
                                                style={{ textTransform: "inherit" }}
                                                >
                                                <b><i className="icon-plus3"></i></b>
                                                Add Payment
                                            </button>
                                            <button
                                                type="button"
                                                className="btn bg-dark btn-labeled btn-labeled-right pr-5 float-right mr-2"
                                                style={{ textTransform: "inherit" }}
                                                onClick={this.toggle_row}>
                                                <b><i className="icon-cross"></i></b>
                                                Close
                                            </button>       
                                        </div>
                                    {/* </div> */}
                                </div>
                            </div>
                        </Collapse>
                    </td>
                </tr>
            </Fragment>
        )
    }
}
export default TableRow