import React from 'react'



function IconButton(props) {
    let color = 'bg-teal-400 border-teal-400 text-teal-400';
    switch(props.color) {
        case 'default':
            color = 'bg-teal-400 border-teal-400 text-teal-400';
            break;
        case 'red':
            color = 'bg-danger border-danger text-danger';
            break;
        case 'black':
            color = 'bg-dark border-dark text-dark';
            break;
        case 'gray':
            color = 'bg-secondary border-secondary text-secondary';
            break;
    }
    return (
        <button {...props} className={`btn btn-outline btn-sm ${color} btn-icon ${props.className}`}>
            <i className={props.icon}></i>
        </button>
    )
}
export default IconButton;