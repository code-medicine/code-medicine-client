import React, {Component} from 'react';

class Error404 extends Component {
    render(){
        return(
            <div className="text-center">
                <h1 className="error-title">404</h1>
                <h5>Oops, an error has occurred. Page not found!</h5>
            </div>
        );
    }
}
export default Error404;