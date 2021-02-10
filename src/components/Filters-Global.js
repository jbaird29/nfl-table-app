import React, {useState} from "react";
import {Form, Select} from 'antd';
const { Option } = Select;


export default function GlobalFilters(props) {

    return (
        <>
            <Form.Item name={['where', 'inside_20']} label="Inside 20?">
                <Select>
                    <Option value="either">Either</Option>
                    <Option value="1">Inside</Option>
                    <Option value="0">Outside</Option>
                </Select>
            </Form.Item>
        </>
    )
}