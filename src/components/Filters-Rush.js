import React, {useState} from "react";
import {Form, InputNumber} from 'antd';


export default function RushFilters(props) {

    return (
        <>
            <Form.Item name={['having', 'sum_att_rush']} label="Minimum Rush Attempts">
                <InputNumber min={0} />
            </Form.Item>
        </>
    )
}