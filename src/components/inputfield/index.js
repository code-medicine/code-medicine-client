import React, { Component } from 'react';
import Select from 'react-select'
import DateTimePicker from 'react-datetime';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { Typography } from '@material-ui/core';


class Inputfield extends Component {

    render() {

        const received_props = this.props;

        const _field_type = received_props.field_type;
        const input_field_type = <input 
            {...received_props} 
            className={`form-control ${received_props.error ? 'border-danger' : ''} ${received_props.className}`} 
            error={received_props.error? "true": "false"}
            />

        const text_area_field_type = <textarea 
            rows={"3"} 
            cols={"3"} 
            {...received_props} 
            className={`form-control ${received_props.error ? 'border-danger' : ''} ${received_props.className}`} 
            />

        const select_field_type = <Select {...received_props} />
        const date_time_field_type = <DateTimePicker 
            {...received_props} 
            className={`clock_datatime_picker form-control ${received_props.error ? 'border-danger' : ''} ${received_props.className}`} 
            inputProps={{ 
                placeholder: received_props.placeholder, 
                className: 'border-0 w-100', 
                ...received_props.inputProps 
            }} 
            />
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
            render_field = received_props.custom_field
        }
        else {
            render_field = input_field_type
        }


        const parent_classes = received_props.parent_classes;
        const inner_classes = received_props.inner_classes;
        return (
            <div className={`${parent_classes} mb-0`}>
                {
                    received_props.loading? 
                    <SkeletonTheme color="#ffffff" highlightColor="#f2f2f2">
                        <Skeleton className="" count={1} height={15} width={80} />
                    </SkeletonTheme> : 
                    (received_props.heading ? <Typography variant="caption">
                        {received_props.heading}{received_props.required ? <span className="text-danger"> * </span> : ''}
                    </Typography> : '')
                }
                <div className={inner_classes}>
                    {
                        received_props.loading? 
                        <SkeletonTheme color="#ffffff" highlightColor="#f2f2f2">
                            <Skeleton className="mb-1" count={1} height={40} />
                        </SkeletonTheme> : render_field
                    }
                    {
                        received_props.helper? <span className={`form-text text-muted mt-0`}>{received_props.helper}</span>: '' 
                    }
                </div>
            </div>
        );
    }
}
export default Inputfield;