import React, {Component} from 'react';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';

class Container extends Component {
    render(){
        return(
            <div>
                {this.props.header? <Header/>: ''}
                {
                    this.props.children
                }
                {this.props.header? <Footer/>: ''}
            </div>
        );
    }
}
export default Container;