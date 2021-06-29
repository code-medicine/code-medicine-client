import React from 'react'



function Button(props) {
    let color = 'bg-teal-400';
    switch(props.color) {
        case 'default':
            color = 'bg-teal-400';
            break;
        case 'red':
            color = 'bg-danger';
            break;
        case 'black':
            color = 'bg-dark';
            break;
        case 'gray':
            color = 'bg-secondary';
            break;
        default:
            break;
    }
    return (
        <button
            {...props}
            className={`btn ${color} btn-labeled btn-labeled-right pr-5 ${props.fuklWidth? 'btn-block': ''} ${props.className}`}
            style={{ textTransform: "inherit" }}
            >
            <b><i className={props.icon}></i></b>
            {
                props.children
            }
        </button>
    )
}
export default Button;