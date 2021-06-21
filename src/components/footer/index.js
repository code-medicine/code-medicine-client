import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Footer extends Component {
    render() {
        return (
            <footer className=" bg-dark p-2">
                <span>Developed by <Link to="/">code-medicine</Link></span>
            </footer>
        );
    }
}
export default Footer;