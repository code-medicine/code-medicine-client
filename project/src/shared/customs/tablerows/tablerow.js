import React, { Component, Fragment } from 'react';
import { Collapse } from 'reactstrap'
<<<<<<< HEAD:project/src/shared/customs/tablerows/tablerow.js
// import moment from 'moment';
=======
>>>>>>> 58d3ed518c70525ebb34bfbe6cfc2ae8ad541b25:project/src/components/reception/tablerow.js
import { Link } from 'react-router-dom';



class TableRow extends Component {

    constructor(props) {
        super(props);
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
        return Object.keys(this.state.row_data).map((str,i) => {
            return <td key={i} >{this.state.row_data[str]}</td>
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
                <tr>
                    <td onClick={this.toggle_row}>
                        <Link className="" to="#" onClick={this.toggle_row}>
                            <i className={this.state.toggle_icon}></i>
                        </Link>
                    </td>
                    {
                        this.render_read_only_cols()
                    }
                    {/* <td >
                        
                        <div className="d-flex flex-row">
                            <button className="btn btn-outline btn-sm bg-secondary border-secondary text-secondary btn-icon "
                                    onClick={()=>this.props.openModal(this.props.visit_id)}>
                                <i className="icon-plus2" />
                            </button>
                            <button className="btn btn-outline btn-sm bg-primary border-primary text-primary-800 btn-icon ml-1">
                                <i className="icon-pencil3" />
                            </button>
                            <button className="btn btn-outline btn-sm bg-danger border-danger text-danger btn-icon ml-1">
                                <i className="icon-cross3" />
                            </button>
                        </div>
                    </td> */}
                </tr>
                <tr className="">
                    <td colSpan={`${this.state.col_span}`} className={`${this.state.toggle? '':'py-0'}`}>
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
export default TableRow