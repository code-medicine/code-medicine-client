import React, { Component } from 'react';
import Container from '../../../shared/container/container'
import Select from 'react-select'

class Todayspatient extends Component { 

    constructor(props){
        super(props);
        this.state = {
            data: [
                'hello','','asd','asd','asdasdsa'
            ],
            totalRecords: 4
        }
    }


    componentDidMount(){
        // $('.table-togglable').footable();
    }

    renderDataInRows = () => {
        return (this.state.data.map((booking, i) => {
            return (
                <tr key={i}>
                    <td>
                        User info
                    </td>
                    <td>
                        time
                    </td>
                    <td>
                        visit info
                    </td>
                    <td>
                        Actions
                    </td>
                </tr>
            )
        }))
    }

    render() {
        var table = <div className="alert alert-info" style={{marginBottom: '0px'}}>
                        <strong>Info!</strong> No Data Found.
                    </div>;
        if (this.state.data != null){
			if(this.state.totalRecords > 0){
				table = <table className="table table-togglable table-hover table-bordered">
                            <tbody>
                                {this.renderDataInRows(this.state.filter_data)}
                            </tbody>
                        </table>
			}
		}
        return (
            <Container container_type="todayspatient">
                <div className="card">
                    <div className="card-body py-1">
                        <div className="row">
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label className="font-weight-semibold">Providers</label>
                                    <Select
                                        // options={this.state.search_options}
                                        placeholder="Select Providers"
                                        // value={this.state.selectedOption}
                                        // onChange={this.handleSelectChange}
                                        // onClick={()=>this.get}
                                    />
                                </div>
                            </div>
                            <div className={`col-md-3`}>
                                <div className="form-group">
                                    <label className="font-weight-semibold">Location</label>
                                    <Select
                                        // options={this.state.search_options}
                                        placeholder="Select Location"
                                        // value={this.state.selectedOption}
                                        // onChange={this.handleSelectChange}
                                        // onClick={()=>this.get}
                                    />
                                </div>

                                
                            </div>
                            <div className={`col-md-3`}>
                                    
                                <div className="form-group">
                                    <label className="font-weight-semibold">Status</label>
                                    <Select
                                        // options={this.state.search_options}
                                        placeholder="Select Status"
                                        // value={this.state.selectedOption}
                                        // onChange={this.handleSelectChange}
                                        // onClick={()=>this.get}
                                    />
                                </div>
                            </div>
                            <div className={`col-md-3`}>
                                <div className="text-center">
                                    <h6 className="m-0 font-weight-semibold">Actions</h6>

                                    <button type="button" className="btn btn-warning btn-icon" title="Search"><i className="icon-search4"></i></button>
                                    <button type="button" className="btn bg-danger btn-icon" title="Walkin patient"><i className="icon-plus22"></i></button>
                                    <button type="button" className="btn bg-teal-400 btn-icon" title="New Appointment"><i className="icon-stack-plus"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body">
                        {table}
                    </div>
                </div>
            </Container>
        )
    }
}
export default Todayspatient