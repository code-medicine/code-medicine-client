import React, { Component } from 'react';
import Select from 'react-select'
import DateTimePicker from 'react-datetime';


class Inputfield extends Component {

    render() {
        const _field_type = this.props.field_type;
        const input_field_type = <input {...this.props} className={`form-control ${this.props.error ? 'border-danger' : ''} ${this.props.className}`} />

        const text_area_field_type = <textarea rows={"3"} cols={"3"} {...this.props} className={`form-control ${this.props.error ? 'border-danger' : ''} ${this.props.className}`} />

        const select_field_type = <Select {...this.props} />
        const date_time_field_type = <DateTimePicker {...this.props} className={`clock_datatime_picker form-control ${this.props.error ? 'border-danger' : ''} ${this.props.className}`} inputProps={{ placeholder: this.props.placeholder, className: 'border-0 w-100', ...this.props.inputProps }} />
        let render_field = ''

        if (_field_type === 'text-area') {
            render_field = text_area_field_type
        }
        else if (_field_type === 'date-time') {
            render_field = date_time_field_type
        }
        else if (_field_type === 'select') {
            render_field = select_field_type
        }
        else if (_field_type === 'custom') {
            render_field = this.props.custom_field
        }
        else {
            render_field = input_field_type
        }


        const parent_classes = this.props.parent_classes;
        const inner_classes = this.props.inner_classes;
        return (
            <div className={`form-group ${parent_classes}`}>
                {this.props.heading ? <label className="col-form-label mb-0 pb-1">
                    {this.props.heading}{this.props.required ? <span className="text-danger"> * </span> : ''}
                </label> : ''
                }
                <div className={inner_classes}>
                    {render_field}
                </div>
            </div>
        );
    }
}
export default Inputfield;