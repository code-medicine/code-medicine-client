import React, { Component } from 'react';
import Loader from "react-loader-spinner";

class Loading extends Component {

    render(){
        return(
            <div className="d-flex justify-content-center">
                <Loader
                    type="Rings"
                    color="#00BFFF"
                    height={150}
                    width={150}
                    timeout={120000} //60 secs
                />
            </div>
        )
    }
}
export default Loading