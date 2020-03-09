import React, { Component, Fragment } from 'react';
import { Collapse } from 'reactstrap'
import moment from 'moment';



class TableRow extends Component {

    constructor(props) {
        super(props)
        this.state = {
            toggle: false,
            row_data: this.props.row_data,
            hidden_data: this.props.hidden_data,
        }
    }
    toggle_row = () => {
        this.setState({toggle: !this.state.toggle})
    }
    componentDidMount(){
        // this.setState({row_data: this.props.data})
    }

    render_read_only_cols = () => {
        return Object.keys(this.state.row_data).map((str,i) => {
            return <td key={i}>{this.state.row_data[str]}</td>
        })
    }
    render_hidden_items = () => {
        return this.state.hidden_data.map((str,i) => {
            return <div key={i} className="p-2">{str}</div>
        })
    }
    render(){
        return(
            <Fragment>
                <tr onClick={this.toggle_row}>
                    {
                        this.render_read_only_cols()
                    }
                    <td><button className="btn btn-outline-primary btn-sm">payment</button></td>
                </tr>
                <tr>
                    <td colSpan="6" className="p-0">
                        <Collapse isOpen={this.state.toggle}>
                            <div className="d-flex justify-content-arround">
                            {
                                this.render_hidden_items()
                            }
                            </div>
                        </Collapse>
                    </td>
                </tr>
            </Fragment>
        )
    }
}
export default TableRow