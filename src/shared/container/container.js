import React, {Component} from 'react';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';

class Container extends Component {
    render(){
        return(
            <div>
                <Header/>
                {
                    this.props.children
                }
                <Footer/>
            </div>
        );
    }
}
export default Container;