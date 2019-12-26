import React, { Component } from 'react';

class Register extends Component {
    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-4"></div>
                    <div className="col-4">
                        <div className="card mt-5">
                            <h5 className="card-header info-color white-text text-center py-4">
                                <strong>Register</strong>
                            </h5>
                            <div className="card-body px-lg-5 pt-0">
                                <form className="text-center" style={{ color: "#757575", action: "#!" }}>
                                    <div className="form-row">
                                        <div className="col">
                                            <div className="md-form">
                                                <input type="text" id="materialRegisterFormFirstName" className="form-control" />
                                                <label for="materialRegisterFormFirstName">First name</label>
                                            </div>
                                        </div>
                                        <div className="col">

                                            <div className="md-form">
                                                <input type="email" id="materialRegisterFormLastName" className="form-control" />
                                                <label for="materialRegisterFormLastName">Last name</label>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="md-form mt-0">
                                        <input type="email" id="materialRegisterFormEmail" className="form-control" />
                                        <label for="materialRegisterFormEmail">E-mail</label>
                                    </div>


                                    <div className="md-form">
                                        <input type="password" id="materialRegisterFormPassword" className="form-control" aria-describedby="materialRegisterFormPasswordHelpBlock" />
                                        <label for="materialRegisterFormPassword">Password</label>
                                        <small id="materialRegisterFormPasswordHelpBlock" className="form-text text-muted mb-4">
                                            At least 8 characters and atleast 1 digit and special character
                                </small>
                                    </div>


                                    <div className="md-form">
                                        <input type="password" id="materialRegisterFormPhone" className="form-control" aria-describedby="materialRegisterFormPhoneHelpBlock" />
                                        <label for="materialRegisterFormPhone">Phone number</label>
                                        <small id="materialRegisterFormPhoneHelpBlock" className="form-text text-muted mb-4">
                                            For two step authentication
                                </small>
                                    </div>


                                    <div className="form-check">
                                        <input type="checkbox" className="form-check-input" id="materialRegisterFormNewsletter" />
                                        <label className="form-check-label" for="materialRegisterFormNewsletter">Agree to the terms and conditions</label>
                                    </div>


                                    <button className="btn btn-outline-info btn-rounded btn-block my-4 waves-effect z-depth-0" type="submit">Sign up</button>

                                    <hr />


                                    <p>By clicking <em>Sign up</em> you agree to our
                                        <a href="" target="_blank"> terms of service</a>
                                    </p>


                                </form>


                            </div>
                        </div>
                    </div>
                    <div className="col-4"></div>
                </div>
            </div>
        );
    }
}
export default Register;