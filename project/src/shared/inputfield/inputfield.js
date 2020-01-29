import React, {Component} from 'react';

class Inputfield extends Component {

    render(){
        return(
            <div className={'form-group form-group-float mb-1'}>
                <label className={`form-group-float-label animate ${this.props.label_visibility ? 'is-visible' : ''}`}>{this.props.label_tag}</label>
                <div className="input-group">
                    <span className="input-group-prepend">
                        <span className="input-group-text">
                            <i className={`${this.props.icon} text-muted`}></i>
                        </span>
                    </span>
                    <input type={this.props.input_type}
                        className="form-control"
                        placeholder={this.props.label_tag}
                        id={this.props.id}
                        onChange={this.props.on_text_change_listener}
                        value={this.props.default_value} />
                </div>
            </div>
        );
    }
}
export default Inputfield;