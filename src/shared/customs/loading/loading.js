import React from 'react'
import Loader from "react-loader-spinner";

function Loading(props) {
    const custom = props.custom
    return (
        props.custom? <Loader type="Rings" color={custom.color} height={props.size} width={props.size} timeout={custom.timeout} />:
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