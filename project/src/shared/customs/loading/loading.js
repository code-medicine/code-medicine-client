import React from 'react'
import Loader from "react-loader-spinner";

function Loading(props) {
    return (
        <div className="d-flex justify-content-center">
            <Loader
                type="Rings"
                color="#00BFFF"
                height={props.size}
                width={props.size}
                timeout={120000} //120 secs
            />
        </div>
    )
}
export default Loading;