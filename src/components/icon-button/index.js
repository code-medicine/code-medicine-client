import React from 'react'



function IconButton(props) {
    let color = 'bg-teal-400 border-teal-400 text-teal-400';
    let variant = 'btn-outlined';
    let size = "btn-lg";

    switch(props.variant) {
        case 'outlined':
            variant = 'btn-outlined'
            break;
        case 'filled':
            variant = ''
            break;
        default: 
            variant = 'btn-outlined'
            break;
    }
    switch(props.color) {
        case 'red':
            color = variant === 'btn-outlined'? 'bg-danger border-danger text-danger': 'btn-danger';
            break;
        case 'black':
            color = variant === 'btn-outlined'? 'bg-dark border-dark text-dark' : 'btn-dark';
            break;
        case 'gray':
            color = variant === 'btn-outlined'? 'bg-secondary border-secondary text-secondary' : 'btn-secondary';
            break;
        default:
            color = variant === 'btn-outlined'? 'bg-teal-400 border-teal-400 text-teal-400' : 'bg-teal-400 text-white';
            break;
    }
    switch(props.size) {
        case 'md':
            size = 'btn-md'
            break;
        case 'sm':
            size = 'btn-sm'
            break;
        case 'lg':
            size = 'btn-lg';
            break;
        default: 
            size = 'btn-sm'
            break;
    }

    const className = `btn ${variant} ${size} ${color} btn-icon ${props.className}`

    // console.log('className', className)
    return (
        <button {...props} className={className}>
            <i className={props.icon}></i>
        </button>
    )
}
export default IconButton;