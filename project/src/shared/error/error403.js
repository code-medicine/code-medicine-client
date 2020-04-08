import React, {Component} from 'react';

class Error403 extends Component {
    render(){
        return(
            <div className="text-center">
                <h1 className="error-title">403</h1>
                <h5>Oops, an error has occurred. Forbidden!</h5>
            </div>
        );
    }
}
export default Error403;