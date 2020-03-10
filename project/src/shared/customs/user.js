import React, { Component } from 'react';
import NO_PICTURE from '../../resources/images/placeholder.jpg'
import moment from 'moment';
import { classNameColors } from '../constant_data';

class User extends Component {
    
    calculate_age = (dob1) => {
        var today = new Date();
        var birthDate = new Date(dob1);  // create a date object directly from `dob1` argument
        var age_now = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age_now--;
        }
        return age_now;
    }

    componentDidMount(){
        
    }
    render(){
        const date_of_birth = new Date(this.props.dob)

        

        let patient_name = this.props.name
        return(
            <div className="media">
                <div className="mr-3">
                    <div className={`img-fluid rounded-circle text-white ${this.props.thumbnail_color} h3 d-flex justify-content-center align-items-center`} 
                        // src={NO_PICTURE} 
                        style={{width: 42, height: 42 }}>{patient_name.charAt(0)}</div>
                </div>
                <div className="media-body">
                    <h6 className="mb-0 font-weight-bold">{this.props.name} {this.props.gender === 'Male'? 
                                            <span className="badge badge-primary">
                                                Male
                                            </span>:
                                            <span className="badge bg-pink-400">
                                                Female
                                            </span>}</h6>
                    <div className="row">
                        <div className="col-md-12 col-sm-12">
                            <div className="row">
                                <div className="col-sm-12 col-lg-4">
                                    <span className="">
                                        <i className="icon-person"></i> {this.calculate_age(this.props.dob)} years old 
                                    </span>
                                </div>
                                <div className={`col-sm-12 col-lg-4`}>
                                    <span><i className="icon-calendar3"></i> {moment(date_of_birth.toString()).format('MMM Do YY')}</span>
                                </div>
                                <div className={`col-sm-12 col-lg-4`}>
                                    <span><i className="icon-phone-wave"></i> {this.props.phone}</span>
                                </div>
                            </div>            
                        </div>
                        {/* <div className="col-md-12 col-sm-4">
                            <div className="row">
                                <div className="col-sm-12">
                                    <span><i className="icon-calendar3"></i> {moment(date_of_birth.toString()).format('MMM Do YY')}</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12 col-sm-4">
                            <div className="row">
                                <div className="col-sm-12">
                                    <span><i className="icon-phone-wave"></i> {this.props.phone}</span>
                                </div>
                            </div>
                        </div> */}
                    </div>    
                </div>
            </div>
        )
    }
}
export default User