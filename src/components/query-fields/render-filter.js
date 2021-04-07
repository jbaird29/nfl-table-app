import {Form, Slider, Select, InputNumber, } from 'antd';

// this takes a filter object (from metadata) with formProps and ui.props and returns the JSX
export function renderFilterObject(filter, name, key) { return (
    <Form.Item {...filter.formProps} name={name} key={key} >
        {filter.ui.type === 'select' ? <Select {...filter.ui.props} /> : 
        filter.ui.type === 'slider' ? <Slider {...filter.ui.props} /> : 
        filter.ui.type === 'inputNumber' ? <InputNumber {...filter.ui.props} /> : null
        }
    </Form.Item>
)}