import React from 'react'



function IconButton(props) {
    let color = 'bg-teal-400 border-teal-400 text-teal-400';
    let btn_type = 'btn-outline';
    let size = "btn-lg";

    switch(props.variant) {
        case 'outlined':
            btn_type = 'btn-outline'
            break;
        case 'filled':
            btn_type = ''
            break;
        default: 
            btn_type = 'btn-outline'
            break;
    }
    switch(props.color) {
        case 'red':
            color = btn_type === 'btn-outline'? 'bg-danger border-danger text-danger': 'btn-danger';
            break;
        case 'black':
            color = btn_type === 'btn-outline'? 'bg-dark border-dark text-dark' : 'btn-dark';
            break;
        case 'gray':
            color = btn_type === 'btn-outline'? 'bg-secondary border-secondary text-secondary' : 'btn-secondary';
            break;
        default:
            color = btn_type === 'btn-outline'? 'bg-teal-400 border-teal-400 text-teal-400' : 'bg-teal-400 text-white';
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

    const className = `btn ${btn_type} ${size} ${color} btn-icon ${props.className}`

    // console.log('className', className)
    return (
        <button {...props} className={className}>
            <i className={props.icon}></i>
        </button>
    )
}
export default IconButton;