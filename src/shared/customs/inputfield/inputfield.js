import React, {Component} from 'react';
import Select, { components } from 'react-select'
import DateTimePicker from 'react-datetime';


class Inputfield extends Component {

    constructor(props) {
        super(props)
        this.state = {
            options: this.props.options,
            error: this.props.error,
        }
    }

    render(){
        const _id = this.props.id
        const _label = this.props.label_tag
        const _input_type = this.props.input_type
        const _placeholder = this.props.placeholder
        const _icon = this.props.icon_class 
        const _on_change = this.props.on_text_change_listener
        const _value = this.props.default_value
        const _field_type = this.props.field_type
        const _custom_classes = this.props.custom_classes
        const _disabled = this.props.disabled
        const _size = this.props.size? this.props.size:'form-control-lg'

        const input_label = <label className="col-form-label mb-0 pb-1">{_label}{this.props.required? <span className="text-danger"> * </span>:''}</label>
        
        const input_field_type = <input 
                                    type={_input_type} 
                                    className={`form-control ${_size} ${this.props.error? 'border-danger':''}`} 
                                    id={_id}
                                    placeholder={_placeholder}
                                    onChange={_on_change}
                                    value={_value}
                                    disabled={_disabled}></input>
        
        const text_area_field_type = <textarea
                                        rows={"3"}
                                        cols={"3"}
                                        className={`form-control form-control-lg ${this.props.error? 'border-danger':''}`}
                                        id={_id}
                                        placeholder={_placeholder}
                                        onChange={_on_change}
                                        value={_value} />

        const selection_value_container = ({ children, ...props }) => (
                                            <components.ValueContainer {...props}>
                                                <div className={`input-group `}>
                                                    <span className="input-group-prepend">
                                                        <span className="input-group-text border-top-0 border-bottom-0 border-left-0">
                                                            <i className={_icon}/>
                                                        </span>
                                                    </span>
                                                    <div className="ml-2 my-1">
                                                        {
                                                            children
                                                        }
                                                    </div>
                                                </div>
                                            </components.ValueContainer>
                                        );
        const select_field_type = <Select
                                        isClearable
                                        components={{ ValueContainer : selection_value_container }}
                                        name="color"
                                        options={this.state.options}
                                        placeholder={_placeholder}
                                        menuPosition="auto"
                                        id={_id}
                                        onInputChange={_on_change}
                                        onChange={this.props.on_selected_change}
                                        className={_custom_classes}
                                    />
        const _date_format = this.props.date_format;
        const _time_format = this.props.time_format; 
        const date_time_field_type = <DateTimePicker id={_id}
                                        onChange={_on_change}
                                        className={`clock_datatime_picker form-control form-control-lg ${this.props.error? 'border-danger':''}`}
                                        inputProps={{ placeholder: _placeholder, className: 'border-0 w-100' }}
                                        input={!_disabled}
                                        dateFormat={_date_format}
                                        timeFormat={_time_format}
                                        closeOnSelect={true}
                                        value={_value}
                                    />
        let render_field = ''

        if (_field_type === 'text-area'){
            render_field = text_area_field_type
        }
        else if (_field_type === 'date-time'){
            render_field = date_time_field_type
        }
        else if (_field_type === 'select'){
            render_field = select_field_type
        }
        else if (_field_type === 'custom'){
            render_field = this.props.custom_field
        }
        else{
            render_field = input_field_type
        }

        

        return(
            <div className={`form-group row ${_custom_classes} mb-1`}>
                {input_label}
                <div className={`input-group`}>
                    <span className="input-group-prepend">
                        <span className={`input-group-text ${this.props.error? 'alpha-danger text-danger border-danger':''}`}><i className={_icon}/></span>
                    </span>
                    {render_field}
                </div>
            </div>
        );
    }
}
export default Inputfield;