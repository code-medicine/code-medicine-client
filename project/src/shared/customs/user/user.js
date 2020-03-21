import React, { Component } from 'react';
// import NO_PICTURE from '../../resources/images/placeholder.jpg'
import moment from 'moment';
// import { classNameColors } from '../constant_data';

class User extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            data: this.props.data,
            size: this.props.size,

            text_size: '',
            icon_size: '',
            button_size: '',
            heading_size: '',

        }
    }

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
        switch(this.state.size){
            case 'large':
                this.setState({
                    text_size: 'h3',
                    icon_size: 'icon-2x',
                    button_size: 'btn-lg',
                    heading_size: 'h1 font-weight-bold'
                })
                break;
            default:
                break
        }
    }
    render(){

        const store = this.state.data
        const name = store['first_name'] + ' ' + store['last_name']
        const gender = store['gender']
        const date_of_birth = store['date_of_birth']
        const email = store['email']
        const phone = store['phone_number']

        const icon = this.state.icon_size
        const text = this.state.text_size
        return(
            <div className="media">
                <div className="mr-3">
                    <div className={`img-fluid rounded-circle text-white bg-teal-400 h3 d-flex justify-content-center align-items-center p-2`} 
                        style={{height: '50px', width: '50px'}}// src={NO_PICTURE} 
                        >
                        {store['first_name'].charAt(0) + store['last_name'].charAt(0)}
                    </div>
                </div>
                <div className="media-body">
                    <h5 className={`mb-0 ${this.state.heading_size}`}>{name} {gender === 'Male'? 
                                            <span className="badge badge-primary">
                                                <small>Male</small>
                                            </span>:
                                            <span className="badge bg-pink-400">
                                               <small>Female</small>
                                            </span>}</h5>
                    <div className="row mt-1">
                        <div className="col">
                            <span className={`${text}`}><i className={`icon-person ${icon}`}></i> {this.calculate_age(date_of_birth)} years old</span>
                        </div>
                        <div className="col">
                        <span className={`mt-1 ${text}`}><i className={`icon-calendar3 mr-2 ${icon}`}></i> {moment(new Date(date_of_birth).toString()).format('MMM Do YY')}</span>
                        </div>
                    </div>
                    <div className="row mt-1">
                        <div className="col">  
                            <span className={`mt-1 ${text}`}><i className={`icon-phone-wave mr-2 ${icon}`}></i> {phone}</span>
                        </div>
                        <div className="col">
                            <span className={`mt-1 ${text}`}><i className={`icon-envelop5 mr-2 ${icon}`}></i> {email}</span>
                        </div>
                    </div>    
                </div>
            </div>
        )
    }
}
export default User